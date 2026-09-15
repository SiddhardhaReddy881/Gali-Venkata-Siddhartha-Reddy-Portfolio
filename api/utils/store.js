// Vercel KV / Upstash Redis Persistent Storage Adapter with Local File Fallback
import fs from 'fs';
import path from 'path';

const LOCAL_STORE_PATH = path.join(process.cwd(), 'scratch', 'request_store.json');

function getLocalStore() {
  try {
    if (fs.existsSync(LOCAL_STORE_PATH)) {
      const data = fs.readFileSync(LOCAL_STORE_PATH, 'utf8');
      return JSON.parse(data || '{}');
    }
  } catch (e) {}
  return {};
}

function saveLocalStore(store) {
  try {
    const dir = path.dirname(LOCAL_STORE_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(LOCAL_STORE_PATH, JSON.stringify(store, null, 2), 'utf8');
  } catch (e) {}
}

export async function saveRequestRecord(record) {
  const kvUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const kvToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

  if (kvUrl && kvToken) {
    try {
      await fetch(`${kvUrl}/set/request:${record.requestId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${kvToken}` },
        body: JSON.stringify(record)
      });
      // Also index by email for fast lookup
      await fetch(`${kvUrl}/set/email:${record.email}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${kvToken}` },
        body: record.requestId
      });
    } catch (err) {
      console.warn('Vercel KV save error:', err);
    }
  }

  // Local fallback persistence
  const store = getLocalStore();
  store[record.requestId] = record;
  store[`email:${record.email}`] = record.requestId;
  saveLocalStore(store);
}

export async function getRequestRecord(requestId) {
  const kvUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const kvToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

  if (kvUrl && kvToken) {
    try {
      const res = await fetch(`${kvUrl}/get/request:${requestId}`, {
        headers: { Authorization: `Bearer ${kvToken}` }
      });
      const data = await res.json();
      if (data && data.result) {
        return typeof data.result === 'string' ? JSON.parse(data.result) : data.result;
      }
    } catch (err) {
      console.warn('Vercel KV read error:', err);
    }
  }

  // Local fallback lookup
  const store = getLocalStore();
  return store[requestId] || null;
}

export async function updateRequestStatus(requestId, status, additionalData = {}) {
  const record = await getRequestRecord(requestId);
  if (!record) return null;

  const updated = {
    ...record,
    status,
    ...additionalData
  };

  await saveRequestRecord(updated);
  return updated;
}
