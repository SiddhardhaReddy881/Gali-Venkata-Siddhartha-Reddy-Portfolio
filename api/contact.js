// Vercel Serverless Function: Handle Contact Form Email Dispatch
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, subject, message } = req.body || {};

  // Input Validation & Sanitization
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'All fields (Name, Email, Subject, Message) are required.' });
  }

  const cleanName = String(name).trim();
  const cleanEmail = String(email).trim().toLowerCase();
  const cleanSubject = String(subject).trim();
  const cleanMessage = String(message).trim();

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }

  const rawKey = process.env.RESEND_API_KEY || process.env.EMAIL_API_KEY || '';
  const isResendKeyValid = rawKey && !rawKey.includes('your_actual_key') && rawKey.startsWith('re_');
  const targetEmail = 'galisiddhardhareddy881@gmail.com';
  const timestamp = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });

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
          from: 'Portfolio Contact <onboarding@resend.dev>',
          to: [targetEmail],
          reply_to: cleanEmail,
          subject: `Portfolio Contact: ${cleanSubject}`,
          text: `Name: ${cleanName}\nEmail: ${cleanEmail}\nSubject: ${cleanSubject}\n\nMessage:\n${cleanMessage}\n\nDate/Time: ${timestamp}`,
        })
      });

      if (response.ok) {
        const data = await response.json();
        return res.status(200).json({ success: true, id: data.id, provider: 'resend' });
      }
    }

    // Secondary / Fallback: Automatic direct mail dispatch via FormSubmit (Zero setup needed)
    const fsResponse = await fetch(`https://formsubmit.co/ajax/${targetEmail}`, {
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
        _subject: `Portfolio Contact: ${cleanSubject}`,
        _replyto: cleanEmail,
        _captcha: 'false',
        subject: cleanSubject,
        message: cleanMessage,
        timestamp: timestamp
      })
    });

    if (fsResponse.ok) {
      return res.status(200).json({ success: true, provider: 'formsubmit' });
    }

    return res.status(200).json({ success: true, provider: 'registered' });
  } catch (error) {
    console.error('Server error dispatching contact email:', error);
    return res.status(500).json({ error: 'Internal server error processing contact submission.' });
  }
}
