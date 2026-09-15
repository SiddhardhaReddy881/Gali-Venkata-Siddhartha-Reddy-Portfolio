// Vercel Serverless Function: Check Resume Access Request Status (Step 3/4/5 Frontend Polling)
import { verifySignedToken, createSignedToken } from './utils/auth.js';
import { getRequestRecord } from './utils/store.js';

export default async function handler(req, res) {
  const token = req.query.token || req.body?.token;

  const payload = verifySignedToken(token);
  if (!payload || payload.type !== 'REQUEST_STATUS_CHECK') {
    return res.status(403).json({ error: 'Invalid or expired request status token.' });
  }

  const record = await getRequestRecord(payload.requestId);
  if (!record) {
    return res.status(404).json({ error: 'Request record not found.' });
  }

  if (record.status === 'APPROVED') {
    const accessExp = record.accessExpiresAt || (Date.now() + 7 * 24 * 60 * 60 * 1000);
    const visitorAccessToken = createSignedToken({
      requestId: record.requestId,
      email: record.email,
      type: 'APPROVED_ACCESS',
      exp: accessExp
    });

    return res.status(200).json({
      status: 'APPROVED',
      accessUrl: `/api/get-resume?token=${encodeURIComponent(visitorAccessToken)}`
    });
  }

  if (record.status === 'REJECTED') {
    return res.status(200).json({ status: 'REJECTED' });
  }

  return res.status(200).json({ status: 'PENDING' });
}
