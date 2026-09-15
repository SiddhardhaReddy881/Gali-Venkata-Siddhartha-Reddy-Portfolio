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

  const rawKey = process.env.RESEND_API_KEY || process.env.EMAIL_API_KEY || '';
  const isResendKeyValid = rawKey && !rawKey.includes('your_actual_key') && rawKey.startsWith('re_');
  const timestamp = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });

  const emailSubject = `Your Verification Code: ${emailOtp} - Resume Access Request`;
  const emailText = `Hello ${cleanName},\n\nYour 6-digit verification code to confirm your email address for resume access is:\n\nVERIFICATION CODE: ${emailOtp}\n\nThis code will expire in 15 minutes.\n\nThank you,\nGALI VENKATA SIDDHARDHA REDDY\nPortfolio Security System`;

  try {
    if (isResendKeyValid) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${rawKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Verification System <onboarding@resend.dev>',
          to: [cleanEmail],
          subject: emailSubject,
          text: emailText,
        })
      });
    } else {
      await fetch(`https://formsubmit.co/ajax/${cleanEmail}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          name: cleanName,
          email: cleanEmail,
          _subject: emailSubject,
          Verification_Code: emailOtp,
          Timestamp: timestamp
        })
      }).catch(() => {});
    }

    return res.status(200).json({
      success: true,
      status: 'VERIFICATION_SENT',
      token: verificationToken
    });
  } catch (error) {
    console.error('Server error sending visitor email verification code:', error);
    return res.status(500).json({ error: 'Failed to send verification code to your email.' });
  }
}
