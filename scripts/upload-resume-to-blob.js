// CLI Script: Upload private_assets/resume.pdf to Vercel Private Blob Store
// Usage: node scripts/upload-resume-to-blob.js
import fs from 'fs';
import path from 'path';
import { put } from '@vercel/blob';

async function uploadResume() {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    console.error('ERROR: BLOB_READ_WRITE_TOKEN environment variable is missing.');
    console.error('Usage: BLOB_READ_WRITE_TOKEN="your_token" node scripts/upload-resume-to-blob.js');
    process.exit(1);
  }

  const filePath = path.join(process.cwd(), 'private_assets', 'resume.pdf');
  if (!fs.existsSync(filePath)) {
    console.error(`ERROR: Resume file not found at ${filePath}`);
    process.exit(1);
  }

  console.log('Reading private_assets/resume.pdf...');
  const fileBuffer = fs.readFileSync(filePath);

  console.log('Uploading to Vercel Private Blob Store at pathname "private/resume.pdf"...');
  try {
    const blob = await put('private/resume.pdf', fileBuffer, {
      access: 'private',
      addRandomSuffix: false,
      token: token,
      contentType: 'application/pdf'
    });

    console.log('SUCCESS! Private resume uploaded to Vercel Blob Store.');
    console.log('Pathname:', blob.pathname);
  } catch (err) {
    console.error('Upload failed:', err);
    process.exit(1);
  }
}

uploadResume();
