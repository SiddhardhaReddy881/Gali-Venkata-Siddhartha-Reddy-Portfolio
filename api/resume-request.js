// Vercel Serverless Function: Handle Resume Access Request
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, purpose, otp } = req.body || {};

  if (!name || !email) {
    return res.status(400).json({ error: 'Full Name and Email Address are required.' });
  }

  const cleanName = String(name).trim();
  const cleanEmail = String(email).trim().toLowerCase();
  const cleanPurpose = purpose ? String(purpose).trim() : 'N/A';

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }

  const rawKey = process.env.RESEND_API_KEY || process.env.EMAIL_API_KEY || '';
  const isResendKeyValid = rawKey && !rawKey.includes('your_actual_key') && rawKey.startsWith('re_');
  const ownerEmail = 'galisiddhardhareddy881@gmail.com';
  const dynamicOtp = otp || Math.floor(100000 + Math.random() * 900000).toString();
  const timestamp = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });

  const emailSubject = `New Resume Access Request from ${cleanName} [OTP: ${dynamicOtp}]`;
  const emailText = `NEW RESUME ACCESS REQUEST\n=================================\nApplicant Name: ${cleanName}\nApplicant Email: ${cleanEmail}\nRequest Type: Resume Access\nStatus: PENDING APPROVAL\nDate/Time: ${timestamp}\nOrganization/Purpose: ${cleanPurpose}\n\n=================================\nDYNAMIC VERIFICATION OTP: ${dynamicOtp}\n=================================\nTo approve access for this applicant, enter OTP: ${dynamicOtp} in your portfolio verification dialog.`;

  try {
    if (isResendKeyValid) {
      // Primary: Dispatch via Resend API
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${rawKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Resume Access System <onboarding@resend.dev>',
          to: [ownerEmail],
          reply_to: cleanEmail,
          subject: emailSubject,
          text: emailText,
        })
      });

      if (response.ok) {
        const data = await response.json();
        return res.status(200).json({ success: true, id: data.id, status: 'PENDING', provider: 'resend', otp: dynamicOtp });
      }
    }

    // Secondary / Fallback: Automatic direct mail dispatch via FormSubmit
    const fsResponse = await fetch(`https://formsubmit.co/ajax/${ownerEmail}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Referer': 'https://portfolio-app.vercel.app/',
        'Origin': 'https://portfolio-app.vercel.app'
      },
      body: JSON.stringify({
        name: cleanName,
        email: cleanEmail,
        _subject: emailSubject,
        _replyto: cleanEmail,
        _captcha: 'false',
        Request: 'Resume Access',
        Status: 'PENDING APPROVAL',
        Verification_OTP_Code: dynamicOtp,
        Purpose: cleanPurpose,
        Timestamp: timestamp
      })
    });

    if (fsResponse.ok) {
      return res.status(200).json({ success: true, status: 'PENDING', provider: 'formsubmit', otp: dynamicOtp });
    }

    return res.status(200).json({ success: true, status: 'PENDING', provider: 'registered', otp: dynamicOtp });
  } catch (error) {
    console.error('Server error processing resume access request:', error);
    return res.status(500).json({ error: 'Internal server error processing resume access request.' });
  }
}
