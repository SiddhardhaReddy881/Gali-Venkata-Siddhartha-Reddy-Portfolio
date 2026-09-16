// Vercel Serverless Function: Visitor Email Verification Request (Step 1)
import { createSignedToken } from './utils/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, purpose } = req.body || {};

  if (!name || !email) {
    return res.status(400).json({ error: 'Full Name and Email Address are required.' });
  }

  const cleanName = String(name).trim();
  const cleanEmail = String(email).trim().toLowerCase();
  const cleanPurpose = purpose ? String(purpose).trim() : 'N/A';

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }

  const [username, domain] = cleanEmail.split('@');
  const blockedDomains = [
    'hi.com', 'hello.com', 'test.com', 'example.com', 'fake.com',
    'temp.com', 'asdf.com', '123.com', 'xyz.com', 'abc.com',
    'mailinator.com', 'yopmail.com', 'guerrillamail.com', 'tempmail.com', 'dispostable.com'
  ];

  if (blockedDomains.includes(domain) || domain.startsWith('test') || domain.startsWith('temp')) {
    return res.status(400).json({ error: 'Temporary or disposable email domains are not allowed.' });
  }

  // Generate 6-digit Visitor Verification OTP valid for 15 minutes
  const emailOtp = Math.floor(100000 + Math.random() * 900000).toString();
  const exp = Date.now() + 15 * 60 * 1000;

  const verificationToken = createSignedToken({
    name: cleanName,
    email: cleanEmail,
    purpose: cleanPurpose,
    otp: emailOtp,
    type: 'EMAIL_VERIFY',
    exp
  });

  const brevoApiKey = (
    process.env.BREVO_API_KEY ||
    process.env.BREVO_KEY ||
    process.env.BREVO_API_TOKEN ||
    ''
  ).trim().replace(/^["']|["']$/g, '');

  const brevoFromEmail = (
    process.env.BREVO_FROM_EMAIL ||
    process.env.BREVO_SENDER_EMAIL ||
    process.env.MAILERSEND_FROM_EMAIL ||
    ''
  ).trim().replace(/^["']|["']$/g, '');

  const brevoFromName = (
    process.env.BREVO_FROM_NAME ||
    process.env.BREVO_SENDER_NAME ||
    'Resume Verification'
  ).trim().replace(/^["']|["']$/g, '');

  if (!brevoApiKey) {
    console.error('Brevo API Error: BREVO_API_KEY is missing or empty on server environment.');
    return res.status(500).json({ error: 'Email service key (BREVO_API_KEY) is not configured on the server.' });
  }

  if (!brevoFromEmail) {
    console.error('Brevo API Error: BREVO_FROM_EMAIL is missing or empty on server environment.');
    return res.status(500).json({ error: 'Email sender address (BREVO_FROM_EMAIL) is not configured on the server.' });
  }

  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 20px; border: 1px solid #38bdf8; border-radius: 12px; background: #0f172a; color: #ffffff;">
      <h2 style="color: #00f0ff; margin-top: 0;">Resume Access Verification Code</h2>
      <p style="color: #cbd5e1;">Hello ${cleanName},</p>
      <p style="color: #cbd5e1;">Please use the following 6-digit verification code to confirm your email address and request access to the resume:</p>
      <div style="margin: 24px 0; padding: 16px; background: #1e293b; border-radius: 8px; border-left: 4px solid #00f0ff; text-align: center;">
        <span style="font-family: monospace; font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #00f0ff;">${emailOtp}</span>
      </div>
      <p style="color: #94a3b8; font-size: 13px;">This code is valid for 15 minutes. If you did not request resume access, you can safely ignore this email.</p>
      <hr style="border: 0; border-top: 1px solid #334155; margin: 20px 0;" />
      <p style="color: #64748b; font-size: 12px; margin: 0;">GALI VENKATA SIDDHARDHA REDDY — Portfolio Security System</p>
    </div>
  `;

  try {
    const brevoRes = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': brevoApiKey,
        'api_key': brevoApiKey,
        'accept': 'application/json',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: {
          name: brevoFromName,
          email: brevoFromEmail
        },
        to: [
          {
            email: cleanEmail,
            name: cleanName
          }
        ],
        subject: 'Resume Access Verification Code',
        htmlContent: emailHtml
      })
    });

    const resData = await brevoRes.json().catch(() => ({}));

    if (!brevoRes.ok) {
      console.error('Brevo API error sending OTP:', brevoRes.status, resData);

      let userError = 'Failed to send verification email. Please check your recipient email address or try again later.';
      if (brevoRes.status === 401 || brevoRes.status === 403 || resData.code === 'key_not_found') {
        userError = 'Email provider authentication failed. Please verify BREVO_API_KEY on the server environment.';
      }

      return res.status(brevoRes.status || 500).json({
        error: userError
      });
    }

    return res.status(200).json({
      success: true,
      status: 'VERIFICATION_SENT',
      token: verificationToken
    });
  } catch (error) {
    console.error('Server error sending visitor email verification code via Brevo:', error);
    return res.status(500).json({ error: 'Failed to send verification code to your email.' });
  }
}

