// POST /api/admin/login — staff panel login
const { adminPassword, checkPassword, createToken } = require('../../lib/auth');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, message: 'Method not allowed.' });
  }
  if (!adminPassword()) {
    return res.status(503).json({ ok: false, message: 'Staff login is not set up. Add ADMIN_PASSWORD in Vercel → Settings → Environment Variables.' });
  }
  // Small delay slows down password guessing.
  await new Promise((r) => setTimeout(r, 400));
  if (!checkPassword(req.body && req.body.password)) {
    return res.status(401).json({ ok: false, message: 'Incorrect password.' });
  }
  return res.status(200).json({ ok: true, token: createToken() });
};
