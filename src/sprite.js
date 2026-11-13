// SVG icon sprite, included once per page. Use with icon('name').
const S = 'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';

const icons = {
  bolt: `<path fill="currentColor" d="M13.5 2 4 14h7l-1.5 8L20 9.5h-7z"/>`,
  arrow: `<path ${S} d="M5 12h14M13 6l6 6-6 6"/>`,
  chev: `<path ${S} d="m9 6 6 6-6 6"/>`,
  phone: `<path ${S} d="M5 3h3l2 5-2.5 1.5a11 11 0 0 0 7 7L16 14l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2z"/>`,
  mail: `<rect ${S} x="3" y="5" width="18" height="14" rx="2"/><path ${S} d="m3 7 9 6 9-6"/>`,
  pin: `<path ${S} d="M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12z"/><circle ${S} cx="12" cy="9" r="2.5"/>`,
  quote: `<path fill="currentColor" d="M3 21v-7.5C3 8.3 5.7 4.6 10.5 3l1 2.2C8.8 6.4 7.6 8.6 7.5 11H11v10H3zm10 0v-7.5C13 8.3 15.7 4.6 20.5 3l1 2.2c-2.7 1.2-3.9 3.4-4 5.8H21v10h-8z"/>`,
  whatsapp: `<path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.7.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.2-.3-.2-.5-.3z"/>`,
  home: `<path ${S} d="M3 11 12 4l9 7"/><path ${S} d="M5 10v10h5v-6h4v6h5V10"/>`,
  calendar: `<rect ${S} x="3" y="5" width="18" height="16" rx="2"/><path ${S} d="M3 10h18M8 3v4M16 3v4"/>`,
  tag: `<path ${S} d="M3 12V4a1 1 0 0 1 1-1h8l9 9-9 9z"/><circle fill="currentColor" cx="8" cy="8" r="1.6"/>`,
  user: `<circle ${S} cx="12" cy="8" r="4"/><path ${S} d="M4 21a8 8 0 0 1 16 0"/>`,
  users: `<circle ${S} cx="9" cy="8" r="3.5"/><path ${S} d="M2 20a7 7 0 0 1 14 0M16 4.5a3.5 3.5 0 0 1 0 7M18 13.5a7 7 0 0 1 4 6.5"/>`,
  star: `<path fill="currentColor" d="m12 2.5 2.9 6 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.2 1.3-6.6-4.9-4.6 6.6-.8z"/>`,
  flame: `<path fill="currentColor" d="M12 2s5 4.6 5 10a5 5 0 0 1-10 0c0-2.2 1-3.8 2-5 0 2 1 3 2 3 0-3 1-6 1-8zm0 20a3 3 0 0 1-3-3c0-1.6 1.4-3 3-4.5 1.6 1.5 3 2.9 3 4.5a3 3 0 0 1-3 3z" opacity=".95"/>`,
  check: `<path fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" d="m5 12.5 4.5 4.5L19 7.5"/>`,
  x: `<path ${S} d="M6 6l12 12M18 6 6 18"/>`,
  clock: `<circle ${S} cx="12" cy="12" r="9"/><path ${S} d="M12 7v5l3 2"/>`,
  dumbbell: `<path ${S} d="M6.5 6.5v11M17.5 6.5v11M3.5 9v6M20.5 9v6M6.5 12h11"/>`,
  rack: `<path ${S} d="M5 21V3M19 21V3M5 9h14M2 21h20M8 9V7M16 9V7"/>`,
  machine: `<path ${S} d="M5 21V3h4v18M5 8h4M13 21v-6h6v6M16 15V5M12 5h8"/>`,
  heart: `<path ${S} d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/><path ${S} d="M7 12h3l1-2 2 4 1-2h3"/>`,
  apple: `<path ${S} d="M12 7c-2-1.5-7-1.5-7 4.5 0 4 3 9.5 5 9.5 1 0 1.3-.5 2-.5s1 .5 2 .5c2 0 5-5.5 5-9.5C19 5.5 14 5.5 12 7z"/><path ${S} d="M12 7c0-2 1-4 3-4"/>`,
  locker: `<rect ${S} x="4" y="3" width="16" height="18" rx="2"/><path ${S} d="M12 3v18M8 7h1M15 7h1M8 12v2M16 12v2"/>`,
  parking: `<rect ${S} x="3" y="3" width="18" height="18" rx="3"/><path ${S} d="M9 17V7h4a3 3 0 0 1 0 6H9"/>`,
  target: `<circle ${S} cx="12" cy="12" r="9"/><circle ${S} cx="12" cy="12" r="5"/><circle fill="currentColor" cx="12" cy="12" r="1.5"/>`,
  trophy: `<path ${S} d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0zM7 6H4a3 3 0 0 0 3 4M17 6h3a3 3 0 0 1-3 4"/>`,
  shield: `<path ${S} d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/><path ${S} d="m9 12 2 2 4-4"/>`,
  calc: `<rect ${S} x="5" y="2" width="14" height="20" rx="2"/><path ${S} d="M8 6h8M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15v3M8 18h4"/>`,
  help: `<circle ${S} cx="12" cy="12" r="9"/><path ${S} d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.7M12 17h.01"/>`,
  instagram: `<rect ${S} x="3" y="3" width="18" height="18" rx="5"/><circle ${S} cx="12" cy="12" r="4"/><circle fill="currentColor" cx="17.5" cy="6.5" r="1.2"/>`,
  facebook: `<path ${S} d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8z"/>`,
  youtube: `<rect ${S} x="2" y="5" width="20" height="14" rx="4"/><path fill="currentColor" d="m10 9 5 3-5 3z"/>`,
};

module.exports = `<svg width="0" height="0" style="position:absolute" aria-hidden="true">${Object.entries(icons)
  .map(([id, body]) => `<symbol id="i-${id}" viewBox="0 0 24 24">${body}</symbol>`)
  .join('')}</svg>`;
