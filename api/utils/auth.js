import crypto from 'crypto';

const TOKEN_SECRET = process.env.RESUME_TOKEN_SECRET || 'gali_cyber_portfolio_secure_jwt_token_secret_2026';

export function createSignedToken(payload) {
  const data = JSON.stringify(payload);
  const base64Data = Buffer.from(data).toString('base64url');
  const signature = crypto
    .createHmac('sha256', TOKEN_SECRET)
    .update(base64Data)
    .digest('base64url');
  return `${base64Data}.${signature}`;
}

export function verifySignedToken(signedToken) {
  if (!signedToken || typeof signedToken !== 'string') return null;
  const parts = signedToken.split('.');
  if (parts.length !== 2) return null;

  const [base64Data, signature] = parts;
  const expectedSignature = crypto
    .createHmac('sha256', TOKEN_SECRET)
    .update(base64Data)
    .digest('base64url');

  if (signature !== expectedSignature) return null;

  try {
    const jsonStr = Buffer.from(base64Data, 'base64url').toString('utf8');
    const payload = JSON.parse(jsonStr);

    if (payload.exp && Date.now() > payload.exp) {
      return null; // Expired
    }
    return payload;
  } catch (err) {
    return null;
  }
}
