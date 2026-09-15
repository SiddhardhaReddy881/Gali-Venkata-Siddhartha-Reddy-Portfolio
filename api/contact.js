// Vercel Serverless Function: Handle Contact Form Email Dispatch via Resend
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, subject, message } = req.body || {};

  // Input Validation
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'All fields (Name, Email, Subject, Message) are required.' });
  }

  const cleanName = String(name).trim();
  const cleanEmail = String(email).trim().toLowerCase();
  const cleanSubject = String(subject).trim();
  const cleanMessage = String(message).trim();

  if (!cleanName || !cleanSubject || !cleanMessage) {
    return res.status(400).json({ error: 'All fields must contain valid text.' });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }

  const rawKey = process.env.RESEND_API_KEY || process.env.EMAIL_API_KEY || '';
  const isResendKeyValid = rawKey && !rawKey.includes('your_actual_key') && rawKey.startsWith('re_');

  if (!isResendKeyValid) {
    console.error('Contact API Error: RESEND_API_KEY is missing or invalid.');
    return res.status(500).json({ error: 'Server email service key is not configured.' });
  }

  const targetEmail = process.env.OWNER_EMAIL || 'galisiddhardhareddy881@gmail.com';
  const timestamp = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });

  const emailSubject = `Portfolio Contact: ${cleanSubject}`;
  const emailText = `NEW PORTFOLIO CONTACT INQUIRY\n=================================\nVisitor Name: ${cleanName}\nVisitor Email: ${cleanEmail}\nSubject: ${cleanSubject}\nSubmission Date: ${timestamp}\n\n=================================\nMessage:\n${cleanMessage}\n`;

  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 20px; border: 1px solid #38bdf8; border-radius: 12px; background: #0f172a; color: #ffffff;">
      <h2 style="color: #00f0ff; margin-top: 0;">Portfolio Contact Inquiry</h2>
      <p style="color: #cbd5e1;">You have received a new contact message from your portfolio website.</p>
      
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0; color: #e2e8f0;">
        <tr><td style="padding: 8px 0; font-weight: bold; width: 130px;">Visitor Name:</td><td>${cleanName}</td></tr>
        <tr><td style="padding: 8px 0; font-weight: bold;">Visitor Email:</td><td><a href="mailto:${cleanEmail}" style="color: #38bdf8;">${cleanEmail}</a></td></tr>
        <tr><td style="padding: 8px 0; font-weight: bold;">Subject:</td><td>${cleanSubject}</td></tr>
        <tr><td style="padding: 8px 0; font-weight: bold;">Timestamp:</td><td>${timestamp}</td></tr>
      </table>

      <div style="margin-top: 20px; padding: 16px; background: #1e293b; border-radius: 8px; border-left: 4px solid #00f0ff; color: #f8fafc;">
        <strong>Message:</strong><br/><br/>${cleanMessage.replace(/</g, '&lt;').replace(/>/g, '&gt;')}
      </div>

      <p style="color: #94a3b8; font-size: 12px; margin-top: 20px; text-align: center;">Clicking 'Reply' in your email client will reply directly to ${cleanEmail}.</p>
    </div>
  `;

  try {
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
        subject: emailSubject,
        html: emailHtml,
        text: emailText,
      })
    });

    const resData = await response.json().catch(() => ({}));

    if (!response.ok) {
      console.error('Resend contact email error:', response.status, resData);
      return res.status(response.status || 500).json({
        error: resData.message || 'Failed to send message via email provider.'
      });
    }

    return res.status(200).json({ success: true, id: resData.id, provider: 'resend' });
  } catch (error) {
    console.error('Server error dispatching contact email:', error);
    return res.status(500).json({ error: 'Internal server error processing contact submission.' });
  }
}
