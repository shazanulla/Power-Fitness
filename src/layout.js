// Shared page shell: <head>, header, footer, mobile bottom bar and reusable blocks.
const { esc, icon, fmt12, DAYS_SHORT, stars, initials } = require('./util');

const NAV = [
  { href: '/', label: 'Home', key: 'home' },
  { href: '/about', label: 'About', key: 'about' },
  { href: '/programs', label: 'Programs', key: 'programs' },
  { href: '/classes', label: 'Classes', key: 'classes' },
  { href: '/trainers', label: 'Trainers', key: 'trainers' },
  { href: '/membership', label: 'Membership', key: 'membership' },
  { href: '/reviews', label: 'Reviews', key: 'reviews' },
  { href: '/contact', label: 'Contact', key: 'contact' },
];

const BOTTOM_NAV = [
  { href: '/', label: 'Home', key: 'home', icon: 'home' },
  { href: '/classes', label: 'Classes', key: 'classes', icon: 'calendar' },
  { href: '/join', label: 'Free Trial', key: 'join', icon: 'bolt', cta: true },
  { href: '/membership', label: 'Plans', key: 'membership', icon: 'tag' },
  { href: '/trainers', label: 'Coaches', key: 'trainers', icon: 'user' },
];

function logo(cls = '') {
  return `<a href="/" class="logo ${cls}" aria-label="POWER FITNESS home">
    <img src="/images/logo-120.webp" srcset="/images/logo-120.webp 1x, /images/logo-240.webp 2x" width="235" height="120" alt="POWER FITNESS" />
  </a>`;
}

// Data the browser scripts need (kept small).
function clientData(site) {
  return {
    timezone: site.gym.timezone,
    timings: site.timings,
    phone: site.contact.phone,
    whatsapp: site.contact.whatsapp,
    classes: site.classes,
    trainers: site.trainers.map((t) => ({ id: t.id, name: t.name })),
    plans: site.plans.map((p) => ({ id: p.id, name: p.name, price: p.price })),
    programs: site.programs.map((p) => ({ id: p.id, title: p.title })),
  };
}

function header(site, active) {
  return `
  <div class="announce">
    <div class="container announce__inner">
      ${icon('bolt')}<span>${esc(site.gym.announcement)}</span>
      <a href="/join">Book now ${icon('arrow')}</a>
    </div>
  </div>
  <header class="header" id="header">
    <div class="container header__inner">
      ${logo('header__logo')}
      <nav class="nav" id="nav" aria-label="Main">
        <ul class="nav__list">
          ${NAV.map((n) => `<li><a href="${n.href}"${n.key === active ? ' class="is-active" aria-current="page"' : ''}>${n.label}</a></li>`).join('')}
        </ul>
        <div class="nav__extra">
          <a href="/tools"${active === 'tools' ? ' aria-current="page"' : ''}>Fitness Tools</a>
          <a href="/faq"${active === 'faq' ? ' aria-current="page"' : ''}>FAQ</a>
          <a href="tel:${site.contact.phone.replace(/[^\d+]/g, '')}">${icon('phone')} ${esc(site.contact.phone)}</a>
        </div>
      </nav>
      <a href="/join" class="btn btn--red header__cta"><span>Free Trial</span></a>
      <button class="nav-toggle" id="navToggle" aria-label="Open menu" aria-expanded="false" aria-controls="nav">
        <span></span><span></span><span></span>
      </button>
    </div>
  </header>`;
}

function footer(site) {
  const c = site.contact;
  const groups = [];
  site.timings.forEach((t) => {
    const hours = t.open && t.close ? `${fmt12(t.open)} – ${fmt12(t.close)}` : 'Closed';
    const last = groups[groups.length - 1];
    if (last && last.hours === hours) last.to = t.day;
    else groups.push({ from: t.day, to: t.day, hours });
  });
  return `
  <footer class="footer">
    <div class="footer__punch" aria-hidden="true">
      <div class="footer__punchTrack">
        ${Array.from({ length: 4 }, () => `<span>${esc(site.gym.punchline)}</span><span class="is-red">${icon('bolt')}</span>`).join('')}
      </div>
    </div>
    <div class="container footer__grid">
      <div class="footer__brand">
        ${logo('footer__logo')}
        <p>${esc(site.gym.tagline)}</p>
        <div class="social">
          ${Object.entries(c.social || {}).map(([name, url]) => `<a href="${esc(url)}" target="_blank" rel="noopener" aria-label="${esc(name)}">${icon(name)}</a>`).join('')}
        </div>
      </div>
      <div>
        <h2 class="footer__title">Explore</h2>
        <ul class="footer__links">
          ${NAV.slice(1).map((n) => `<li><a href="${n.href}">${n.label}</a></li>`).join('')}
          <li><a href="/tools">Fitness Tools</a></li>
          <li><a href="/faq">FAQ</a></li>
          <li><a href="/join">Book Free Trial</a></li>
        </ul>
      </div>
      <div>
        <h2 class="footer__title">Opening hours</h2>
        <ul class="footer__hours">
          ${groups.map((g) => `<li><span>${DAYS_SHORT[g.from]}${g.from !== g.to ? ' – ' + DAYS_SHORT[g.to] : ''}</span><span>${g.hours}</span></li>`).join('')}
        </ul>
        <p class="footer__note">${esc(site.timingsNote)}</p>
      </div>
      <div>
        <h2 class="footer__title">Visit us</h2>
        <ul class="footer__contact">
          <li>${icon('pin')}<span>${esc(c.address)}</span></li>
          <li>${icon('phone')}<a href="tel:${c.phone.replace(/[^\d+]/g, '')}">${esc(c.phone)}</a></li>
          <li>${icon('mail')}<a href="mailto:${esc(c.email)}">${esc(c.email)}</a></li>
        </ul>
      </div>
    </div>
    <div class="container footer__bottom">
      <span>© <span data-year>${new Date().getFullYear()}</span> POWER FITNESS. All rights reserved.</span>
      <a href="/admin">Staff login</a>
    </div>
  </footer>`;
}

function bottomNav(active) {
  return `
  <nav class="bottom-nav" aria-label="Quick links">
    ${BOTTOM_NAV.map((n) => `<a href="${n.href}" class="${n.cta ? 'is-cta' : ''}${n.key === active ? ' is-active' : ''}"${n.key === active ? ' aria-current="page"' : ''}>${icon(n.icon)}<span>${n.label}</span></a>`).join('')}
  </nav>`;
}

// ---------- reusable blocks ----------

function pageHero({ kicker, title, sub, word, crumb }) {
  return `
  <section class="page-hero">
    <span class="page-hero__word" aria-hidden="true">${esc(word || title)}</span>
    <img class="page-hero__stroke page-hero__stroke--grey" src="/images/fx/stroke-grey.webp" alt="" aria-hidden="true" />
    <img class="page-hero__stroke page-hero__stroke--red" src="/images/fx/stroke-slash.webp" alt="" aria-hidden="true" />
    <div class="container page-hero__inner">
      <nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a>${icon('chev')}<span aria-current="page">${esc(crumb || title)}</span></nav>
      ${kicker ? `<p class="kicker">${esc(kicker)}</p>` : ''}
      <h1 class="page-hero__title">${title}</h1>
      ${sub ? `<p class="page-hero__sub">${sub}</p>` : ''}
    </div>
  </section>`;
}

function sectionHead({ kicker, title, sub, align = 'left', link }) {
  return `
  <header class="sec-head sec-head--${align}">
    <div>
      ${kicker ? `<p class="kicker">${esc(kicker)}</p>` : ''}
      <h2 class="sec-title">${title}</h2>
      ${sub ? `<p class="sec-sub">${sub}</p>` : ''}
    </div>
    ${link ? `<a class="link-arrow" href="${link.href}">${esc(link.label)} ${icon('arrow')}</a>` : ''}
  </header>`;
}

function quoteBand(quote) {
  return `
  <section class="quote-band">
    <div class="container">
      ${icon('quote', 'quote-band__mark')}
      <blockquote>
        <p>${esc(quote.text)}</p>
        <footer>${esc(quote.by)}</footer>
      </blockquote>
    </div>
  </section>`;
}

// Coaches in display order, founder in the centre (see teamOrder in site.json).
function team(site) {
  const byId = Object.fromEntries(site.trainers.map((t) => [t.id, t]));
  const order = (site.teamOrder || site.trainers.map((t) => t.id)).filter((id) => byId[id]);
  return order.map((id) => {
    const t = byId[id];
    const [title, focus] = t.role.split(/\s*·\s*/);
    return { ...t, first: t.name.replace(/^Coach\s+/i, ''), shortTitle: t.title || title, focusArea: focus || '' };
  });
}
const isLead = (t) => /founder/i.test(t.shortTitle);

// Home banner: overlapping line-up of the whole team.
function teamLineup(site) {
  const list = team(site);
  return `
      <div class="lineup" aria-label="Our coaching team">
        ${list.map((t, i) => `
        <a class="lineup__card lineup__card--${i - Math.floor(list.length / 2)}${isLead(t) ? ' is-lead' : ''}" href="/trainers#${esc(t.id)}">
          <img src="${esc(t.photoSmall)}" alt="${esc(t.name)}, ${esc(t.shortTitle)}" width="480" height="640" style="object-position:${esc(t.focus)}"${isLead(t) ? ' fetchpriority="high"' : ''} />
          ${isLead(t) ? '<span class="lineup__badge">Founder</span>' : ''}
          <span class="lineup__name"><strong>${esc(t.first)}</strong><small>${esc(t.shortTitle)}</small></span>
        </a>`).join('')}
      </div>`;
}

// Team row: everyone side by side, founder in the centre.
function teamRow(site) {
  return `
      <div class="team">
        ${team(site).map((t) => `
        <a class="team__card${isLead(t) ? ' team__card--lead' : ''}" href="/trainers#${esc(t.id)}">
          <span class="team__img"><img src="${esc(t.photoSmall)}" alt="${esc(t.name)}" loading="lazy" width="480" height="640" style="object-position:${esc(t.focus)}" /></span>
          ${isLead(t) ? '<span class="team__badge">Founder</span>' : ''}
          <span class="team__info">
            <span class="team__title">${esc(t.shortTitle)}</span>
            <strong class="team__name">${esc(t.first)}</strong>
            <span class="team__focus">${esc(t.focusArea)}</span>
          </span>
        </a>`).join('')}
      </div>`;
}

function perksStrip(site) {
  return `
  <section class="perks" aria-label="Why POWER FITNESS">
    <div class="container perks__grid">
      ${(site.gym.perks || []).map((p) => `
      <div class="perk">
        ${icon(p.icon, 'perk__icon')}
        <span><strong>${esc(p.title)}</strong><small>${esc(p.text)}</small></span>
      </div>`).join('')}
    </div>
  </section>`;
}

function ctaBand(site, { title = 'Your first workout is on us', text = 'Book a free trial, train with a coach and get a body assessment. No commitment.' } = {}) {
  return `
  <section class="cta-band">
    <img class="cta-band__stroke" src="/images/fx/stroke-slash.webp" alt="" aria-hidden="true" loading="lazy" />
    <div class="container cta-band__inner">
      <div>
        <p class="kicker">${esc(site.gym.punchline)}</p>
        <h2 class="cta-band__title">${esc(title)}</h2>
        <p>${esc(text)}</p>
      </div>
      <div class="cta-band__actions">
        <a href="/join" class="btn btn--red btn--lg"><span>Book Free Trial</span></a>
        <a href="https://wa.me/${site.contact.whatsapp}" target="_blank" rel="noopener" class="btn btn--outline btn--lg"><span>${icon('whatsapp')} WhatsApp us</span></a>
      </div>
    </div>
  </section>`;
}

function testimonialCard(t) {
  const date = new Date(t.date + 'T00:00:00Z').toLocaleDateString('en-IN', { month: 'short', year: 'numeric', timeZone: 'UTC' });
  return `
  <article class="review">
    <div class="review__top">
      ${stars(t.rating)}
      <time datetime="${esc(t.date)}">${date}</time>
    </div>
    <p class="review__text">${esc(t.text)}</p>
    <footer class="review__by">
      <span class="avatar" aria-hidden="true">${initials(t.name)}</span>
      <span><strong>${esc(t.name)}</strong><small>${esc(t.detail)}</small></span>
    </footer>
  </article>`;
}

function samplesNote(site) {
  return site.testimonialsAreSamples
    ? '<p class="sample-note">Sample reviews for layout. Replace them with real member reviews in data/site.json before going live.</p>'
    : '';
}

function shell({ site, page, body, assets, siteUrl }) {
  const title = page.key === 'home' ? `POWER FITNESS | ${site.gym.punchline}` : `${page.title} | POWER FITNESS`;
  const url = siteUrl ? siteUrl + (page.path === '/' ? '' : page.path) : '';
  const og = siteUrl ? `${siteUrl}/images/og-image.jpg` : '/images/og-image.jpg';
  return `<!doctype html>
<html lang="en-IN">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(page.description)}" />
  <meta name="theme-color" content="#2A2A2A" />
  ${url ? `<link rel="canonical" href="${url}" />` : ''}
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="POWER FITNESS" />
  <meta property="og:title" content="${esc(title)}" />
  <meta property="og:description" content="${esc(page.description)}" />
  <meta property="og:image" content="${og}" />
  ${url ? `<meta property="og:url" content="${url}" />` : ''}
  <meta name="twitter:card" content="summary_large_image" />
  <link rel="icon" href="/favicon.ico" sizes="any" />
  <link rel="icon" href="/images/favicon-32.png" type="image/png" sizes="32x32" />
  <link rel="apple-touch-icon" href="/images/apple-touch-icon.png" />
  <link rel="manifest" href="/site.webmanifest" />
  <link rel="preload" href="/fonts/oswald-latin-600-normal.woff2" as="font" type="font/woff2" crossorigin />
  <link rel="preload" href="/fonts/barlow-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin />
  <link rel="stylesheet" href="${assets.css}" />
  ${typeof page.head === 'function' ? page.head(site) : page.head || ''}
  <script>window.PF = ${JSON.stringify(clientData(site)).replace(/</g, '\\u003c')};</script>
  <script src="${assets.js}" defer></script>
</head>
<body data-page="${page.key}">
  <a class="skip-link" href="#main">Skip to content</a>
  ${header(site, page.key)}
  <main id="main">
${body}
  </main>
  ${footer(site)}
  ${bottomNav(page.key)}
  <a class="wa-float" href="https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent('Hi POWER FITNESS, I would like to know more about membership.')}" target="_blank" rel="noopener" aria-label="Chat with us on WhatsApp">${icon('whatsapp')}</a>
  ${require('./sprite')}
</body>
</html>
`;
}

module.exports = { shell, pageHero, sectionHead, quoteBand, ctaBand, perksStrip, teamLineup, teamRow, testimonialCard, samplesNote, logo };
