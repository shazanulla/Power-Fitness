// Sends each website form submission (lead) to the gym by email, using Resend (resend.com).
// Set RESEND_API_KEY in Vercel. Optional NOTIFY_FROM, e.g. "POWER FITNESS <leads@yourdomain.com>",
// once a domain is verified in Resend. The recipient is "notify.email" in data/site.json
// (or NOTIFY_EMAIL). Without the key, nothing is sent.

const site = require('../data/site.json');

const TIMEOUT_MS = 8000;
const TYPE_LABEL = { trial: 'Free trial booking', class: 'Class booking', enquiry: 'Contact message' };

const recipient = () => process.env.NOTIFY_EMAIL || (site.notify && site.notify.email) || site.contact.email;

const nameOf = (list, id, key = 'name') => ((site[list] || []).find((x) => x.id === id) || {})[key] || id;

function fmtDate(iso) {
  return new Date(iso + 'T00:00:00Z').toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
}
function fmtTime(hhmm) {
  const [h, m] = hhmm.split(':').map(Number);
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`;
}

// The details of a submission as [label, value] rows, in reading order.
function rows(r) {
  return [
    ['Name', r.name],
    ['Mobile', r.phone],
    ['Email', r.email],
    ['Class', r.className],
    ['Date', r.date && fmtDate(r.date)],
    ['Time', r.time && fmtTime(r.time)],
    ['Goal', r.program && nameOf('programs', r.program, 'title')],
    ['Plan', r.plan && nameOf('plans', r.plan)],
    ['Coach', r.trainer && nameOf('trainers', r.trainer)],
    ['Age', r.age],
    ['Gender', r.gender],
    ['Message', r.message],
  ].filter(([, v]) => v);
}

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

async function sendEmail(r) {
  const label = TYPE_LABEL[r.type] || 'Website enquiry';
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:560px">
      <h2 style="margin:0 0 4px;color:#E10600">${esc(label)}</h2>
      <p style="margin:0 0 16px;color:#555">Received from the POWER FITNESS website</p>
      <table style="border-collapse:collapse;width:100%">
        ${rows(r).map(([k, v]) => `<tr><td style="padding:8px;border-bottom:1px solid #eee;color:#777;width:110px">${esc(k)}</td><td style="padding:8px;border-bottom:1px solid #eee"><strong>${esc(v)}</strong></td></tr>`).join('')}
      </table>
      <p style="margin-top:16px"><a href="https://wa.me/${esc(r.phone.replace(/\D/g, '').replace(/^(\d{10})$/, '91$1'))}">Reply on WhatsApp</a> · <a href="tel:${esc(r.phone.replace(/[^\d+]/g, ''))}">Call ${esc(r.phone)}</a></p>
    </div>`;
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.NOTIFY_FROM || 'POWER FITNESS <onboarding@resend.dev>',
      to: [recipient()],
      subject: `${label}: ${r.name}`,
      html,
      text: rows(r).map(([k, v]) => `${k}: ${v}`).join('\n'),
      ...(r.email ? { reply_to: r.email } : {}),
    }),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${(await res.text().catch(() => '')).slice(0, 200)}`);
}

// Emails the lead. Returns whether it was attempted and delivered.
async function notify(record) {
  if (!process.env.RESEND_API_KEY) return { attempted: 0, delivered: 0 };
  try {
    await sendEmail(record);
    return { attempted: 1, delivered: 1 };
  } catch (err) {
    console.error('[notify] email failed:', err.message);
    return { attempted: 1, delivered: 0 };
  }
}

module.exports = { notify, rows };
