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

        if (req.url && req.url.startsWith('/api/')) {
          const urlObj = new URL(req.url, `http://${req.headers.host || 'localhost:5173'}`);
          const pathname = urlObj.pathname;

          let body = {};
          if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
            const rawBody = await new Promise((resolve) => {
              let b = '';
              req.on('data', chunk => b += chunk);
              req.on('end', () => resolve(b));
            });
            try { body = JSON.parse(rawBody || '{}'); } catch (e) {}
          }

          const query = Object.fromEntries(urlObj.searchParams.entries());

          const vercelRes = {
            statusCode: 200,
            headers: {},
            setHeader(name, val) { this.headers[name.toLowerCase()] = val; res.setHeader(name, val); },
            status(code) { this.statusCode = code; res.statusCode = code; return this; },
            json(obj) {
              res.statusCode = this.statusCode;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(obj));
            },
            send(content) {
              res.statusCode = this.statusCode;
              if (typeof content === 'object' && !Buffer.isBuffer(content)) {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(content));
              } else {
                res.end(content);
              }
            }
          };

          const mockReq = {
            method: req.method,
            headers: req.headers,
            url: req.url,
            body,
            query
          };

          try {
            if (pathname === '/api/contact') {
              const module = await import('./api/contact.js');
              return await module.default(mockReq, vercelRes);
            }
            if (pathname === '/api/resume-request') {
              const module = await import('./api/resume-request.js');
              return await module.default(mockReq, vercelRes);
            }
            if (pathname === '/api/verify-email') {
              const module = await import('./api/verify-email.js');
              return await module.default(mockReq, vercelRes);
            }
            if (pathname === '/api/resume-approve') {
              const module = await import('./api/resume-approve.js');
              return await module.default(mockReq, vercelRes);
            }
            if (pathname === '/api/resume-reject') {
              const module = await import('./api/resume-reject.js');
              return await module.default(mockReq, vercelRes);
            }
            if (pathname === '/api/resume-status') {
              const module = await import('./api/resume-status.js');
              return await module.default(mockReq, vercelRes);
            }
            if (pathname === '/api/get-resume') {
              const module = await import('./api/get-resume.js');
              return await module.default(mockReq, vercelRes);
            }
            if (pathname === '/api/admin-upload-resume') {
              const module = await import('./api/admin-upload-resume.js');
              return await module.default(mockReq, vercelRes);
            }
          } catch (err) {
            console.error('Dev server handler error:', err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Internal server error.' }));
            return;
          }
        }

        next();
      });
    }
  };

  return {
    plugins: [react(), tailwindcss(), apiDevPlugin],
  };
});
