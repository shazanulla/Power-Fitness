// Staff panel API
//   GET    /api/admin/enquiries          list all
//   PATCH  /api/admin/enquiries?id=...   update status / notes
//   DELETE /api/admin/enquiries?id=...   delete
const { isAuthorized } = require('../../lib/auth');
const { getStore } = require('../../lib/store');
const { clean } = require('../../lib/validate');

const STATUSES = ['new', 'contacted', 'joined', 'not-interested'];

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (!isAuthorized(req)) return res.status(401).json({ ok: false, message: 'Please log in again.' });

  try {
    const store = getStore();
    const id = req.query && req.query.id;

    if (req.method === 'GET') {
      return res.status(200).json({ ok: true, enquiries: await store.list() });
    }

    if (req.method === 'PATCH') {
      const body = req.body || {};
      const patch = { updatedAt: new Date().toISOString() };
      if (body.status !== undefined) {
        if (!STATUSES.includes(body.status)) return res.status(400).json({ ok: false, message: 'Invalid status.' });
        patch.status = body.status;
      }
      if (body.notes !== undefined) patch.notes = clean(body.notes, 1000);
      const item = id && (await store.update(id, patch));
      if (!item) return res.status(404).json({ ok: false, message: 'Enquiry not found.' });
      return res.status(200).json({ ok: true, enquiry: item });
    }

    if (req.method === 'DELETE') {
      const removed = id && (await store.remove(id));
      if (!removed) return res.status(404).json({ ok: false, message: 'Enquiry not found.' });
      return res.status(200).json({ ok: true });
    }

    res.setHeader('Allow', 'GET, PATCH, DELETE');
    return res.status(405).json({ ok: false, message: 'Method not allowed.' });
  } catch (err) {
    console.error('[admin] error:', err.message);
    return res.status(503).json({ ok: false, message: err.message });
  }
};
