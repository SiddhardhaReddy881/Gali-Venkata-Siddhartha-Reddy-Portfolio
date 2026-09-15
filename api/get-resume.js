// Vercel Serverless Function: Secure Protected Resume Download Endpoint
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  const { pin, token } = req.query || {};

  const validPins = ['881', '2026', 'SIDDHARTHA', 'GALI881', 'ACCESS'];
  const cleanInput = String(pin || token || '').trim().toUpperCase();

  // Enforce Access Permission Check
  if (!cleanInput || !validPins.includes(cleanInput)) {
    return res.status(403).json({
      error: 'Access Denied. Owner permission or valid authorization code required to view this document.'
    });
  }

  try {
    const filePath = path.join(process.cwd(), 'src', 'assets', 'resume.pdf');
    const fileBuffer = fs.readFileSync(filePath);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="Gali_Venkata_Siddhartha_Reddy_Resume.pdf"');
    return res.status(200).send(fileBuffer);
  } catch (err) {
    console.error('Error serving protected resume file:', err);
    return res.status(500).json({ error: 'Failed to retrieve protected resume file.' });
  }
}
