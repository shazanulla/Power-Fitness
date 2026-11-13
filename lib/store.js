// Storage for enquiries and bookings.
//
// - On Vercel: uses Upstash Redis (add it from Vercel → Storage → Upstash Redis).
//   Vercel then sets KV_REST_API_URL / KV_REST_API_TOKEN (or UPSTASH_REDIS_REST_URL /
//   UPSTASH_REDIS_REST_TOKEN) automatically.
// - Locally: falls back to data/enquiries.json so no setup is needed.

const fs = require('fs');
const path = require('path');

const REDIS_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const HASH_KEY = 'pf:enquiries';
const FILE = path.join(__dirname, '..', 'data', 'enquiries.json');

class StorageNotConfigured extends Error {}

async function redis(command) {
  const res = await fetch(REDIS_URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${REDIS_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(command),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || json.error) throw new Error(`Redis error: ${json.error || res.status}`);
  return json.result;
}

const redisStore = {
  async list() {
    const flat = (await redis(['HGETALL', HASH_KEY])) || [];
    const items = [];
    for (let i = 1; i < flat.length; i += 2) items.push(JSON.parse(flat[i]));
    return items.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },
  async add(record) {
    await redis(['HSET', HASH_KEY, record.id, JSON.stringify(record)]);
    return record;
  },
  async get(id) {
    const raw = await redis(['HGET', HASH_KEY, id]);
    return raw ? JSON.parse(raw) : null;
  },
  async update(id, patch) {
    const item = await this.get(id);
    if (!item) return null;
    Object.assign(item, patch);
    await redis(['HSET', HASH_KEY, id, JSON.stringify(item)]);
    return item;
  },
  async remove(id) {
    return (await redis(['HDEL', HASH_KEY, id])) > 0;
  },
};

function readFile() {
  try {
    return JSON.parse(fs.readFileSync(FILE, 'utf8'));
  } catch {
    return [];
  }
}
function writeFile(items) {
  fs.writeFileSync(FILE + '.tmp', JSON.stringify(items, null, 2));
  fs.renameSync(FILE + '.tmp', FILE);
}

const fileStore = {
  async list() {
    return readFile();
  },
  async add(record) {
    const items = readFile();
    items.unshift(record);
    writeFile(items);
    return record;
  },
  async update(id, patch) {
    const items = readFile();
    const item = items.find((e) => e.id === id);
    if (!item) return null;
    Object.assign(item, patch);
    writeFile(items);
    return item;
  },
  async remove(id) {
    const items = readFile();
    const next = items.filter((e) => e.id !== id);
    if (next.length === items.length) return false;
    writeFile(next);
    return true;
  },
};

function getStore() {
  if (REDIS_URL && REDIS_TOKEN) return redisStore;
  // Vercel's file system is read-only, so a database is required there.
  if (process.env.VERCEL) {
    throw new StorageNotConfigured('Storage is not set up. Connect Upstash Redis to this project in Vercel → Storage.');
  }
  return fileStore;
}

module.exports = { getStore, StorageNotConfigured };
