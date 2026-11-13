// POST /api/enquiries — website forms (enquiry, free trial, class booking)
const crypto = require('crypto');
const { getStore, StorageNotConfigured } = require('../lib/store');
const { validateSubmission } = require('../lib/validate');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, message: 'Method not allowed.' });
  }

  const body = req.body && typeof req.body === 'object' ? req.body : {};

  // Honeypot field: real visitors never fill it in.
  if (body.website) return res.status(200).json({ ok: true });

  const { data, errors } = validateSubmission(body);
  if (Object.keys(errors).length) return res.status(400).json({ ok: false, errors });

  const record = { id: crypto.randomUUID(), ...data, status: 'new', notes: '', createdAt: new Date().toISOString() };

  try {
    await getStore().add(record);
  } catch (err) {
    console.error('[enquiries] save failed:', err.message);
    const message = err instanceof StorageNotConfigured
      ? 'Online booking is not available right now. Please call or WhatsApp us.'
      : 'Something went wrong while saving. Please try again or call us.';
    return res.status(503).json({ ok: false, message });
  }

  console.log(`[${record.type}] ${record.name} (${record.phone})`);
  return res.status(201).json({ ok: true, id: record.id });
};
