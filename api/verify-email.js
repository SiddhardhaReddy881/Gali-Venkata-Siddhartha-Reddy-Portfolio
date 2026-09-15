// Vercel Serverless Function: Visitor Email OTP Verification & Owner Notification (Step 2)
import crypto from 'crypto';
import { createSignedToken, verifySignedToken } from './utils/auth.js';
import { saveRequestRecord } from './utils/store.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { token, otp } = req.body || {};

  const payload = verifySignedToken(token);
  if (!payload || payload.type !== 'EMAIL_VERIFY') {
    return res.status(403).json({ error: 'Invalid or expired email verification session.' });
  }

  if (!otp || String(otp).trim() !== payload.otp) {
    return res.status(403).json({ error: 'Invalid verification code. Please enter the exact code sent to your email.' });
  }

  // Email verified! Generate persistent PENDING record
  const requestId = 'req_' + crypto.randomBytes(8).toString('hex');
  const timestamp = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });

  const record = {
    requestId,
    name: payload.name,
    email: payload.email,
    purpose: payload.purpose,
    status: 'PENDING',
    createdAt: timestamp,
    verifiedAt: timestamp,
    approvedAt: null,
    rejectedAt: null,
    accessExpiresAt: null
  };

  await saveRequestRecord(record);

  // Generate signed Owner Approval and Rejection tokens
  const approveToken = createSignedToken({
    requestId,
    action: 'APPROVE',
    type: 'OWNER_ACTION',
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000 // Valid 7 days
  });

  const rejectToken = createSignedToken({
    requestId,
    action: 'REJECT',
    type: 'OWNER_ACTION',
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000
  });

  // Client token to check request status in polling / modal
  const checkToken = createSignedToken({
    requestId,
    email: payload.email,
    type: 'REQUEST_STATUS_CHECK',
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000
  });

  const rawKey = process.env.RESEND_API_KEY || process.env.EMAIL_API_KEY || '';
  const isResendKeyValid = rawKey && !rawKey.includes('your_actual_key') && rawKey.startsWith('re_');
  const ownerEmail = process.env.OWNER_EMAIL || 'galisiddhardhareddy881@gmail.com';

  const host = req.headers.host || 'localhost:5173';
  const protocol = host.includes('localhost') ? 'http' : 'https';
  const approveUrl = `${protocol}://${host}/api/resume-approve?token=${encodeURIComponent(approveToken)}`;
  const rejectUrl = `${protocol}://${host}/api/resume-reject?token=${encodeURIComponent(rejectToken)}`;

  const emailSubject = `[ACTION REQUIRED] Resume Access Request: ${payload.name}`;
  const emailText = `NEW RESUME ACCESS REQUEST (EMAIL VERIFIED)\n=================================\nApplicant Name: ${payload.name}\nVerified Email: ${payload.email}\nRequest ID: ${requestId}\nDate/Time: ${timestamp}\nPurpose: ${payload.purpose}\nStatus: PENDING OWNER APPROVAL\n\n=================================\nOWNER ACTION REQUIRED:\n=================================\nTo APPROVE access, click:\n${approveUrl}\n\nTo REJECT access, click:\n${rejectUrl}\n`;

  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded: 12px; background: #0f172a; color: #ffffff;">
      <h2 style="color: #00f0ff; margin-top: 0;">Resume Access Request (Email Verified)</h2>
      <p style="color: #cbd5e1;">A visitor has verified their email and requested access to your resume.</p>
      
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0; color: #e2e8f0;">
        <tr><td style="padding: 8px 0; font-weight: bold;">Applicant Name:</td><td>${payload.name}</td></tr>
        <tr><td style="padding: 8px 0; font-weight: bold;">Verified Email:</td><td><a href="mailto:${payload.email}" style="color: #38bdf8;">${payload.email}</a></td></tr>
        <tr><td style="padding: 8px 0; font-weight: bold;">Purpose:</td><td>${payload.purpose}</td></tr>
        <tr><td style="padding: 8px 0; font-weight: bold;">Request ID:</td><td><code>${requestId}</code></td></tr>
        <tr><td style="padding: 8px 0; font-weight: bold;">Status:</td><td><span style="color: #f59e0b; font-weight: bold;">PENDING APPROVAL</span></td></tr>
      </table>

      <div style="margin-top: 25px; padding-top: 20px; border-top: 1px solid #334155; text-align: center;">
        <a href="${approveUrl}" style="background-color: #10b981; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; margin-right: 10px;">[ APPROVE REQUEST ]</a>
        <a href="${rejectUrl}" style="background-color: #ef4444; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">[ REJECT REQUEST ]</a>
      </div>
    </div>
  `;

  try {
    if (isResendKeyValid) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${rawKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Resume Access System <onboarding@resend.dev>',
          to: [ownerEmail],
          reply_to: payload.email,
          subject: emailSubject,
          html: emailHtml,
          text: emailText,
        })
      });
    } else {
      await fetch(`https://formsubmit.co/ajax/${ownerEmail}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          name: payload.name,
          email: payload.email,
          _subject: emailSubject,
          _replyto: payload.email,
          _captcha: 'false',
          Request_ID: requestId,
          Status: 'PENDING OWNER APPROVAL',
          APPROVE_URL: approveUrl,
          REJECT_URL: rejectUrl,
          Timestamp: timestamp
        })
      }).catch(() => {});
    }

    return res.status(200).json({
      success: true,
      status: 'PENDING',
      requestId,
      token: checkToken
    });
  } catch (error) {
    console.error('Server error verifying email and notifying owner:', error);
    return res.status(500).json({ error: 'Failed to process email verification.' });
  }
}
