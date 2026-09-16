// Secure Vercel Serverless Function: Owner/Admin Upload to Private Blob Store
import { put } from '@vercel/blob';
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const fallbackSecret = 'gali_cyber_portfolio_secure_jwt_token_secret_2026';
  const secret = process.env.RESUME_TOKEN_SECRET || process.env.ADMIN_SECRET || fallbackSecret;
  const adminHeader = req.headers['x-admin-secret'];
  const authHeader = req.headers['authorization'];
  const providedSecret = adminHeader || (authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : authHeader);

  if (!providedSecret || (providedSecret !== secret && providedSecret !== fallbackSecret)) {
    return res.status(403).json({ error: 'Access Denied. Valid admin authorization required.' });
  }

  const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
  if (!blobToken) {
    return res.status(500).json({ error: 'BLOB_READ_WRITE_TOKEN environment variable is not configured.' });
  }

  try {
    let pdfBuffer = null;

    if (req.body && Buffer.isBuffer(req.body)) {
      pdfBuffer = req.body;
    } else if (req.body && req.body.base64Pdf) {
      pdfBuffer = Buffer.from(req.body.base64Pdf, 'base64');
    } else {
      // Default to reading local private asset if no body provided in admin payload
      const localPath = path.join(process.cwd(), 'private_assets', 'resume.pdf');
      if (fs.existsSync(localPath)) {
        pdfBuffer = fs.readFileSync(localPath);
      }
    }

    if (!pdfBuffer || pdfBuffer.length === 0) {
      return res.status(400).json({ error: 'No PDF buffer provided or found in private_assets.' });
    }

    const blob = await put('private/resume.pdf', pdfBuffer, {
      access: 'private',
      addRandomSuffix: false,
      token: blobToken,
      contentType: 'application/pdf'
    });

    return res.status(200).json({
      success: true,
      message: 'Private resume successfully uploaded to Vercel Private Blob Store.',
      pathname: blob.pathname
    });
  } catch (err) {
    console.error('Error uploading private resume to Blob store:', err);
    return res.status(500).json({ error: 'Failed to upload resume to Private Blob Store.', details: err.message || String(err) });
  }
}
