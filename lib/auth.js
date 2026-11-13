// Staff panel login. Stateless signed tokens, so it works on serverless hosting.
const crypto = require('crypto');

const SESSION_MS = 12 * 60 * 60 * 1000;

function adminPassword() {
  if (process.env.ADMIN_PASSWORD) return process.env.ADMIN_PASSWORD;
  // Only allow the default password when running locally.
  return process.env.VERCEL ? null : 'powerfitness';
}

const secret = () => crypto.createHash('sha256').update(`pf-admin:${adminPassword()}:${process.env.SESSION_SECRET || ''}`).digest();
const sign = (payload) => crypto.createHmac('sha256', secret()).update(payload).digest('base64url');

function safeEqual(a, b) {
  const x = Buffer.from(String(a));
  const y = Buffer.from(String(b));
  return x.length === y.length && crypto.timingSafeEqual(x, y);
}

function checkPassword(given) {
  const expected = adminPassword();
  return Boolean(expected) && safeEqual(given || '', expected);
}

function createToken() {
  const payload = Buffer.from(JSON.stringify({ exp: Date.now() + SESSION_MS })).toString('base64url');
  return `${payload}.${sign(payload)}`;
}

function verifyToken(token) {
  if (!adminPassword() || typeof token !== 'string') return false;
  const [payload, sig] = token.split('.');
  if (!payload || !sig || !safeEqual(sig, sign(payload))) return false;
  try {
    return JSON.parse(Buffer.from(payload, 'base64url').toString()).exp > Date.now();
  } catch {
    return false;
  }
}

function isAuthorized(req) {
  const header = req.headers.authorization || '';
  return verifyToken(header.replace(/^Bearer\s+/i, ''));
}

module.exports = { adminPassword, checkPassword, createToken, isAuthorized };
