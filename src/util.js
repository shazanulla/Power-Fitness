// Small helpers shared by the page templates.

const esc = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const icon = (name, cls = '') => `<svg class="ico${cls ? ' ' + cls : ''}" aria-hidden="true"><use href="#i-${name}"/></svg>`;

const rupees = (n) => '₹' + Number(n).toLocaleString('en-IN');

function fmt12(hhmm) {
  const [h, m] = hhmm.split(':').map(Number);
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`;
}

const DAYS_SHORT = { Monday: 'Mon', Tuesday: 'Tue', Wednesday: 'Wed', Thursday: 'Thu', Friday: 'Fri', Saturday: 'Sat', Sunday: 'Sun' };

const stars = (n) =>
  `<span class="stars" role="img" aria-label="${n} out of 5 stars">${[1, 2, 3, 4, 5]
    .map((i) => icon('star', i <= n ? 'is-on' : ''))
    .join('')}</span>`;

const initials = (name) => name.split(/\s+/).map((p) => p[0]).slice(0, 2).join('').toUpperCase();

const intensity = (n, max = 3) =>
  `<span class="intensity" title="Intensity ${n} of ${max}" aria-label="Intensity ${n} of ${max}">${Array.from({ length: max }, (_, i) =>
    icon('flame', i < n ? 'is-on' : '')).join('')}</span>`;

module.exports = { esc, icon, rupees, fmt12, DAYS_SHORT, stars, initials, intensity };
