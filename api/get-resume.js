// Vercel Serverless Function: Stream Protected Resume PDF Only Upon Verified APPROVED Request Status
import fs from 'fs';
import path from 'path';
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

  // Persistent storage double-check
  const record = await getRequestRecord(payload.requestId);
  if (!record || record.status !== 'APPROVED') {
    return res.status(403).json({
      error: 'Access Denied. Owner approval required. Request is not in APPROVED status.'
    });
  }

  // Access Granted! Stream private PDF file buffer
  try {
    const primaryPath = path.join(process.cwd(), 'private_assets', 'resume.pdf');
    const fallbackPath = path.join(process.cwd(), 'src', 'assets', 'resume.pdf');
    const filePath = fs.existsSync(primaryPath) ? primaryPath : fallbackPath;

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Protected document file not found.' });
    }

    const fileBuffer = fs.readFileSync(filePath);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="Gali_Venkata_Siddhardha_Reddy_Resume.pdf"');
    res.setHeader('Cache-Control', 'private, no-store, max-age=0');
    return res.status(200).send(fileBuffer);
  } catch (err) {
    console.error('Error serving protected resume file:', err);
    return res.status(500).json({ error: 'Failed to retrieve protected document.' });
  }
}
