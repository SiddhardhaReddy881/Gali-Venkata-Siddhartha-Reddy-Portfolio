// Vercel Serverless Function: Stream Protected Resume PDF from Vercel Private Blob Store
import fs from 'fs';
import path from 'path';
import { get } from '@vercel/blob';
import { verifySignedToken } from './utils/auth.js';
import { getRequestRecord } from './utils/store.js';

export default async function handler(req, res) {
  const token = req.query.token || req.body?.token;

  const payload = verifySignedToken(token);

  if (!payload || payload.type !== 'APPROVED_ACCESS') {
    return res.status(403).json({
      error: 'Access Denied. Valid approved access token required.'
    });
  }

  // Persistent storage status check
  const record = await getRequestRecord(payload.requestId);
  if (!record || record.status !== 'APPROVED') {
    return res.status(403).json({
      error: 'Access Denied. Owner approval required. Request is not in APPROVED status.'
    });
  }

  const blobToken = process.env.BLOB_READ_WRITE_TOKEN;

  // Access Granted! Retrieve from Vercel Private Blob Store
  try {
    if (blobToken) {
      const result = await get('private/resume.pdf', {
        access: 'private',
        token: blobToken
      }).catch((err) => {
        console.warn('Vercel Blob get error:', err.message);
        return null;
      });

      if (result && result.stream) {
        const arrayBuffer = await new Response(result.stream).arrayBuffer();
        const fileBuffer = Buffer.from(arrayBuffer);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename="Gali_Venkata_Siddhardha_Reddy_Resume.pdf"');
        res.setHeader('Cache-Control', 'private, no-store, max-age=0');
        return res.status(200).send(fileBuffer);
      }
    }

    // Local development fallback if BLOB_READ_WRITE_TOKEN is not set or blob not yet uploaded
    const localPath = path.join(process.cwd(), 'private_assets', 'resume.pdf');
    if (fs.existsSync(localPath)) {
      const fileBuffer = fs.readFileSync(localPath);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'inline; filename="Gali_Venkata_Siddhardha_Reddy_Resume.pdf"');
      res.setHeader('Cache-Control', 'private, no-store, max-age=0');
      return res.status(200).send(fileBuffer);
    }

    return res.status(404).json({ error: 'Protected resume document file not found in Blob store.' });
  } catch (err) {
    console.error('Error retrieving protected resume file:', err);
    return res.status(500).json({ error: 'Failed to retrieve protected document.' });
  }
}
