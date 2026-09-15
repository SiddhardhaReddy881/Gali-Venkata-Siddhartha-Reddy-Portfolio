// Vercel Serverless Function: Owner Direct Request Approval Endpoint
import { verifySignedToken, createSignedToken } from './utils/auth.js';
import { getRequestRecord, updateRequestStatus } from './utils/store.js';

export default async function handler(req, res) {
  const token = req.query.token || req.body?.token;

  const payload = verifySignedToken(token);
  if (!payload || payload.type !== 'OWNER_ACTION' || payload.action !== 'APPROVE') {
    res.setHeader('Content-Type', 'text/html');
    return res.status(403).send(`
      <div style="font-family: Arial; padding: 40px; text-align: center; background: #0f172a; color: #ef4444;">
        <h2>Action Denied</h2>
        <p>Invalid or expired approval token.</p>
      </div>
    `);
  }

  const record = await getRequestRecord(payload.requestId);
  if (!record) {
    res.setHeader('Content-Type', 'text/html');
    return res.status(404).send(`
      <div style="font-family: Arial; padding: 40px; text-align: center; background: #0f172a; color: #ef4444;">
        <h2>Request Not Found</h2>
        <p>The specified resume request record could not be found.</p>
      </div>
    `);
  }

  if (record.status === 'REJECTED') {
    res.setHeader('Content-Type', 'text/html');
    return res.status(400).send(`
      <div style="font-family: Arial; padding: 40px; text-align: center; background: #0f172a; color: #f59e0b;">
        <h2>Request Already Rejected</h2>
        <p>This request for <strong>${record.email}</strong> was previously rejected.</p>
      </div>
    `);
  }

  const timestamp = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
  const accessExp = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days access

  await updateRequestStatus(payload.requestId, 'APPROVED', {
    approvedAt: timestamp,
    accessExpiresAt: accessExp
  });

  // Generate visitor access token
  const visitorAccessToken = createSignedToken({
    requestId: payload.requestId,
    email: record.email,
    type: 'APPROVED_ACCESS',
    exp: accessExp
  });

  const host = req.headers.host || 'localhost:5173';
  const protocol = host.includes('localhost') ? 'http' : 'https';
  const resumeAccessUrl = `${protocol}://${host}/api/get-resume?token=${encodeURIComponent(visitorAccessToken)}`;

  // Email Visitor with Approval & Secure Resume Access Link
  const rawKey = process.env.RESEND_API_KEY || process.env.EMAIL_API_KEY || '';
  const isResendKeyValid = rawKey && !rawKey.includes('your_actual_key') && rawKey.startsWith('re_');

  const emailSubject = `[APPROVED] Your Resume Access Request Has Been Approved`;
  const emailText = `Hello ${record.name},\n\nYour resume access request has been APPROVED by GALI VENKATA SIDDHARDHA REDDY.\n\nYou can view and download the resume using your secure access link below:\n\n${resumeAccessUrl}\n\nNote: This link will expire in 7 days.`;

  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 20px; border: 1px solid #10b981; border-radius: 12px; background: #0f172a; color: #ffffff;">
      <h2 style="color: #10b981; margin-top: 0;">Resume Access Request Approved!</h2>
      <p style="color: #cbd5e1;">Hello <strong>${record.name}</strong>,</p>
      <p style="color: #cbd5e1;">Your request to view the resume of <strong>GALI VENKATA SIDDHARDHA REDDY</strong> has been approved.</p>
      
      <div style="margin: 30px 0; text-align: center;">
        <a href="${resumeAccessUrl}" style="background-color: #00f0ff; color: #050811; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">[ VIEW & DOWNLOAD RESUME ]</a>
      </div>

      <p style="color: #94a3b8; font-size: 12px; text-align: center;">This authorization link is valid for 7 days.</p>
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
          to: [record.email],
          subject: emailSubject,
          html: emailHtml,
          text: emailText,
        })
      });
    } else {
      await fetch(`https://formsubmit.co/ajax/${record.email}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          _subject: emailSubject,
          Status: 'APPROVED',
          RESUME_ACCESS_URL: resumeAccessUrl,
          Timestamp: timestamp
        })
      }).catch(() => {});
    }
  } catch (err) {
    console.error('Error sending approval email to visitor:', err);
  }

  res.setHeader('Content-Type', 'text/html');
  return res.status(200).send(`
    <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 40px auto; padding: 30px; border: 1px solid #10b981; border-radius: 12px; background: #0f172a; color: #ffffff; text-align: center;">
      <h2 style="color: #10b981;">✓ Request Approved Successfully</h2>
      <p style="color: #cbd5e1;">Resume access has been granted for <strong>${record.name}</strong> (<code>${record.email}</code>).</p>
      <p style="color: #94a3b8; font-size: 13px; margin-top: 20px;">An automated notification email with their secure download link has been sent to their inbox.</p>
    </div>
  `);
}
