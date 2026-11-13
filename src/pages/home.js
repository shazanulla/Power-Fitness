const { esc, icon } = require('../util');
const { sectionHead, quoteBand, ctaBand, testimonialCard, samplesNote, perksStrip, teamLineup, teamRow } = require('../layout');

// Category cards. `art` picks the card's background graphic (see .cat--* in main.css).
// Every card starts in black & white and turns to colour on hover.
const EXPLORE = [
  { href: '/programs', icon: 'dumbbell', title: 'Programs', text: 'Strength, muscle gain, fat loss & HIIT', art: 'grey' },
  { href: '/classes', icon: 'calendar', title: 'Classes', text: 'HIIT, Zumba, strength & ladies batch', art: 'smoke' },
  { href: '/trainers', icon: 'users', title: 'Our Coaches', text: 'Founder Adithya and the full coaching team', art: 'team', wide: true },
  { href: '/membership', icon: 'tag', title: 'Membership', text: 'Plans from ₹1,000 a month', art: 'fluid' },
  { href: '/tools', icon: 'calc', title: 'Fitness Tools', text: 'BMI, calories & one-rep max', art: 'concrete' },
  { href: '/reviews', icon: 'star', title: 'Reviews', text: 'What our members say', art: 'slash' },
  { href: '/join', icon: 'bolt', title: 'Free Trial', text: 'Your first workout is on us', art: 'trial' },
];

module.exports = {
  key: 'home',
  path: '/',
  file: 'index.html',
  title: 'Home',
  description: 'POWER FITNESS gym — Jitna Raghda, Uthna Taghda. Strength training, weight training, cardio, group classes and certified coaches. Book your free trial today.',
  head(site) {
    const c = site.contact;
    const ld = {
      '@context': 'https://schema.org',
      '@type': 'ExerciseGym',
      name: site.gym.name,
      slogan: site.gym.punchline,
      description: site.gym.about,
      telephone: c.phone,
      email: c.email,
      image: '/images/og-image.jpg',
      priceRange: '₹₹',
      address: { '@type': 'PostalAddress', streetAddress: c.address, addressLocality: c.city, addressRegion: c.region, postalCode: c.postalCode || undefined, addressCountry: 'IN' },
      openingHoursSpecification: site.timings.map((t) => ({ '@type': 'OpeningHoursSpecification', dayOfWeek: t.day, opens: t.open, closes: t.close })),
    };
    return `<link rel="preload" as="image" href="/images/fx/smoke.webp" />
  <script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>`;
  },
  render(site) {
    const [punchA, punchB] = site.gym.punchline.split(/,\s*/);
    const side = site.gym.sideLine || [];
    return `
  <section class="hero">
    <div class="hero__fx" aria-hidden="true">
      <div class="hero__smoke"></div>
      <img class="hero__stroke hero__stroke--grey" src="/images/fx/stroke-grey.webp" alt="" />
      <img class="hero__stroke hero__stroke--red" src="/images/fx/stroke-slash.webp" alt="" />
      <img class="hero__stroke hero__stroke--thin" src="/images/fx/stroke-thin.webp" alt="" />
    </div>
    <div class="container hero__inner">
      <div class="hero__copy">
        <p class="status-chip" data-open-status><span class="dot"></span><span class="status-chip__text">Open 7 days a week</span></p>
        <h1 class="hero__title">
          <span class="chrome">${esc(punchA)},</span>
          <span class="red">${esc(punchB || '')}</span>
        </h1>
        <p class="hero__meaning">${esc(site.gym.punchlineMeaning)}</p>
        <p class="hero__lead">Serious equipment, certified coaches and a crew that pushes you to show up every single day.</p>
        <div class="hero__actions">
          <a href="/join" class="btn btn--red btn--lg"><span>Book Free Trial ${icon('arrow')}</span></a>
          <a href="/membership" class="btn btn--outline btn--lg"><span>View Membership</span></a>
        </div>
      </div>
      ${teamLineup(site)}
      ${side.length ? `<p class="hero__side" aria-hidden="true">${side.map((s, i) => `<span${i === side.length - 1 ? ' class="red"' : ''}>${esc(s)}</span>`).join('')}</p>` : ''}
    </div>
  </section>

  ${perksStrip(site)}

  <section class="section section--tex">
    <div class="container">
      ${sectionHead({ kicker: 'Choose your path', title: 'Train by <span class="red">category</span>', align: 'center' })}
      <div class="cats">
        ${EXPLORE.map((e) => `
        <a class="cat cat--${e.art}${e.wide ? ' cat--wide' : ''}" href="${e.href}">
          <span class="cat__art" aria-hidden="true">${e.art === 'team' ? '' : icon(e.icon, 'cat__icon')}</span>
          <span class="cat__bar">
            <span class="cat__title">${e.title}</span>
            <span class="cat__text">${e.text}</span>
            <span class="cat__go">Explore ${icon('arrow')}</span>
          </span>
        </a>`).join('')}
      </div>
    </div>
  </section>

  <section class="stats" aria-label="POWER FITNESS in numbers">
    <div class="container stats__grid">
      ${site.gym.stats.map((s) => `
      <div class="stat">
        <strong data-count="${s.value}" data-suffix="${esc(s.suffix)}">${Number(s.value).toLocaleString('en-IN')}${esc(s.suffix)}</strong>
        <span>${esc(s.label)}</span>
      </div>`).join('')}
    </div>
  </section>

  <section class="built">
    <img class="built__stroke" src="/images/fx/stroke-slash.webp" alt="" aria-hidden="true" loading="lazy" />
    <div class="container">
      <div class="built__head">
        <div>
          <p class="kicker">Meet the team</p>
          <h2 class="built__title">Coached by <span class="red">the strong</span></h2>
        </div>
        <div class="built__side">
          <p class="lead">Led by founder Adithya, our certified coaches correct your form, write your plan and push you past your limits. Every member, every session.</p>
          <a href="/trainers" class="btn btn--red"><span>Meet the coaches ${icon('arrow')}</span></a>
        </div>
      </div>
      ${teamRow(site)}
    </div>
  </section>

  <div class="marquee" aria-hidden="true">
    <div class="marquee__track">
      ${Array.from({ length: 2 }, () => ['Strength', 'Weight Training', 'Cardio', 'HIIT', 'Zumba', 'Personal Training', 'Fat Loss', 'Muscle Gain']
        .map((w) => `<span>${w}</span>${icon('bolt')}`).join('')).join('')}
    </div>
  </div>

  ${quoteBand(site.quotes[1])}

  <section class="section section--tex">
    <div class="container">
      ${sectionHead({ kicker: 'Member reviews', title: 'Real sweat. <span class="red">Real results.</span>', link: { href: '/reviews', label: 'Read all reviews' } })}
      <div class="reviews-grid reviews-grid--3">
        ${site.testimonials.slice(0, 3).map(testimonialCard).join('')}
      </div>
      ${samplesNote(site)}
    </div>
  </section>

  ${ctaBand(site)}`;
  },
};
