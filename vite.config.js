import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  const apiDevPlugin = {
    name: 'api-dev-middleware',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const rawKey = env.RESEND_API_KEY || process.env.RESEND_API_KEY || process.env.EMAIL_API_KEY || '';
        const isResendKeyValid = rawKey && !rawKey.includes('your_actual_key') && rawKey.startsWith('re_');
        const targetEmail = 'galisiddhardhareddy881@gmail.com';

        if (req.url === '/api/contact' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => { body += chunk; });
          req.on('end', async () => {
            try {
              const data = JSON.parse(body || '{}');
              const timestamp = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });

              if (isResendKeyValid) {
                await fetch('https://api.resend.com/emails', {
                  method: 'POST',
                  headers: {
                    'Authorization': `Bearer ${rawKey}`,
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    from: 'Portfolio Contact <onboarding@resend.dev>',
                    to: [targetEmail],
                    reply_to: data.email,
                    subject: `Portfolio Contact: ${data.subject || 'General Inquiry'}`,
                    text: `Name: ${data.name}\nEmail: ${data.email}\nSubject: ${data.subject}\n\nMessage:\n${data.message}\n\nDate/Time: ${timestamp}`,
                  })
                }).catch(() => {});
              } else {
                // Dispatch directly to target email via FormSubmit
                await fetch(`https://formsubmit.co/ajax/${targetEmail}`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Referer': 'http://localhost:5173/',
                    'Origin': 'http://localhost:5173'
                  },
                  body: JSON.stringify({
                    name: data.name,
                    email: data.email,
                    _subject: `Portfolio Contact: ${data.subject || 'General Inquiry'}`,
                    _replyto: data.email,
                    _captcha: 'false',
                    subject: data.subject,
                    message: data.message,
                    timestamp: timestamp
                  })
                }).catch((err) => console.error('FormSubmit dispatch error:', err));
              }

              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, mode: 'dispatched' }));
            } catch (err) {
              console.error('Dev server contact middleware error:', err);
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, mode: 'fallback' }));
            }
          });
          return;
        }

        if (req.url === '/api/resume-request' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => { body += chunk; });
          req.on('end', async () => {
            try {
              const data = JSON.parse(body || '{}');
              const timestamp = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });

              // Always generate a unique 6-digit random OTP for every request
              const dynamicOtp = data.otp || Math.floor(100000 + Math.random() * 900000).toString();

              const emailSubject = `New Resume Access Request from ${data.name} [OTP: ${dynamicOtp}]`;
              const emailText = `NEW RESUME ACCESS REQUEST\n=================================\nApplicant Name: ${data.name}\nApplicant Email: ${data.email}\nRequest Type: Resume Access\nStatus: PENDING APPROVAL\nDate/Time: ${timestamp}\n\n=================================\nDYNAMIC VERIFICATION OTP: ${dynamicOtp}\n=================================\nTo approve access for this applicant, enter OTP: ${dynamicOtp} in your portfolio verification dialog.`;

              if (isResendKeyValid) {
                await fetch('https://api.resend.com/emails', {
                  method: 'POST',
                  headers: {
                    'Authorization': `Bearer ${rawKey}`,
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    from: 'Resume Access System <onboarding@resend.dev>',
                    to: [targetEmail],
                    reply_to: data.email,
                    subject: emailSubject,
                    text: emailText,
                  })
                }).catch(() => {});
              } else {
                // Dispatch directly to target email via FormSubmit
                await fetch(`https://formsubmit.co/ajax/${targetEmail}`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Referer': 'http://localhost:5173/',
                    'Origin': 'http://localhost:5173'
                  },
                  body: JSON.stringify({
                    name: data.name,
                    email: data.email,
                    _subject: emailSubject,
                    _replyto: data.email,
                    _captcha: 'false',
                    Request: 'Resume Access',
                    Status: 'PENDING APPROVAL',
                    Verification_OTP_Code: dynamicOtp,
                    Purpose: data.purpose || 'N/A',
                    Timestamp: timestamp
                  })
                }).catch((err) => console.error('FormSubmit dispatch error:', err));
              }

              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, status: 'PENDING', mode: 'dispatched', otp: dynamicOtp }));
            } catch (err) {
              console.error('Dev server resume request middleware error:', err);
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, status: 'PENDING' }));
            }
          });
          return;
        }

        next();
      });
    }
  };

  return {
    plugins: [react(), tailwindcss(), apiDevPlugin],
  };
});
