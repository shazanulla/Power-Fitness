// POST /api/enquiries — website forms (enquiry, free trial, class booking)
// Each submission is saved for the staff panel (when storage is set up) and
// emailed to the gym (when Resend is set up, see lib/notify.js).
const crypto = require('crypto');
const { getStore, StorageNotConfigured } = require('../lib/store');
const { validateSubmission } = require('../lib/validate');
const { notify } = require('../lib/notify');

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

  let saved = false;
  try {
    await getStore().add(record);
    saved = true;
  } catch (err) {
    if (!(err instanceof StorageNotConfigured)) console.error('[enquiries] save failed:', err.message);
  }

  const sent = await notify(record);

  // The submission counts as received if it was saved or emailed.
  if (!saved && sent.delivered === 0) {
    return res.status(503).json({ ok: false, message: 'We could not send your form right now. Please call or WhatsApp us.' });
  }

  console.log(`[${record.type}] ${record.name} (${record.phone}) saved=${saved} notified=${sent.delivered}/${sent.attempted}`);
  return res.status(201).json({ ok: true, id: record.id });
};
