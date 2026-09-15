// Vercel Serverless Function: Owner Direct Request Rejection Endpoint
import { verifySignedToken } from './utils/auth.js';
import { getRequestRecord, updateRequestStatus } from './utils/store.js';

export default async function handler(req, res) {
  const token = req.query.token || req.body?.token;

  const payload = verifySignedToken(token);
  if (!payload || payload.type !== 'OWNER_ACTION' || payload.action !== 'REJECT') {
    res.setHeader('Content-Type', 'text/html');
    return res.status(403).send(`
      <div style="font-family: Arial; padding: 40px; text-align: center; background: #0f172a; color: #ef4444;">
        <h2>Action Denied</h2>
        <p>Invalid or expired rejection token.</p>
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

  if (record.status === 'APPROVED') {
    res.setHeader('Content-Type', 'text/html');
    return res.status(400).send(`
      <div style="font-family: Arial; padding: 40px; text-align: center; background: #0f172a; color: #f59e0b;">
        <h2>Request Already Approved</h2>
        <p>This request for <strong>${record.email}</strong> was previously approved.</p>
      </div>
    `);
  }

  const timestamp = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });

  await updateRequestStatus(payload.requestId, 'REJECTED', {
    rejectedAt: timestamp
  });

  // Email Visitor with Rejection Notice
  const rawKey = process.env.RESEND_API_KEY || process.env.EMAIL_API_KEY || '';
  const isResendKeyValid = rawKey && !rawKey.includes('your_actual_key') && rawKey.startsWith('re_');

  const emailSubject = `Resume Access Request Status Update`;
  const emailText = `Hello ${record.name},\n\nYour request to access the resume of GALI VENKATA SIDDHARDHA REDDY has been reviewed and was REJECTED by the document owner.\n\nThank you for your interest.`;

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
          Status: 'REJECTED',
          Timestamp: timestamp
        })
      }).catch(() => {});
    }
  } catch (err) {
    console.error('Error sending rejection email to visitor:', err);
  }

  res.setHeader('Content-Type', 'text/html');
  return res.status(200).send(`
    <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 40px auto; padding: 30px; border: 1px solid #ef4444; border-radius: 12px; background: #0f172a; color: #ffffff; text-align: center;">
      <h2 style="color: #ef4444;">✗ Request Rejected</h2>
      <p style="color: #cbd5e1;">Resume access request for <strong>${record.name}</strong> (<code>${record.email}</code>) has been REJECTED.</p>
      <p style="color: #94a3b8; font-size: 13px; margin-top: 20px;">The request status has been updated in storage, and no resume access has been granted.</p>
    </div>
  `);
}
