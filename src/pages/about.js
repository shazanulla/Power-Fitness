const { esc, icon } = require('../util');
const { pageHero, sectionHead, quoteBand, ctaBand } = require('../layout');

const VALUE_ICONS = ['target', 'trophy', 'users'];

module.exports = {
  key: 'about',
  path: '/about',
  file: 'about.html',
  title: 'About Us & Facilities',
  description: 'About POWER FITNESS: our story, what we stand for, and the facilities on our 8,000 sq ft training floor — free weights, power racks, cardio, functional zone and more.',
  render(site) {
    const g = site.gym;
    return `
  ${pageHero({ kicker: `Since ${g.established}`, title: 'Built on <span class="red">grind</span>', word: 'ABOUT', crumb: 'About', sub: esc(g.tagline) })}

  <section class="section">
    <div class="container about-story">
      <div class="about-story__text">
        <p class="kicker">Our story</p>
        <h2 class="sec-title">No shortcuts. <span class="red">Just work.</span></h2>
        ${g.story.map((p) => `<p class="lead">${esc(p)}</p>`).join('')}
        <ul class="checks">
          ${g.highlights.map((h) => `<li>${icon('check')}${esc(h)}</li>`).join('')}
        </ul>
      </div>
      <aside class="about-story__panel">
        <div class="year-block">
          <span class="year-block__label">Est.</span>
          <span class="year-block__year">${g.established}</span>
        </div>
        <dl class="mini-stats">
          ${g.stats.map((s) => `<div><dt>${esc(s.label)}</dt><dd>${Number(s.value).toLocaleString('en-IN')}${esc(s.suffix)}</dd></div>`).join('')}
        </dl>
      </aside>
    </div>
  </section>

  <section class="section section--ink">
    <div class="container">
      ${sectionHead({ kicker: 'What we stand for', title: 'The POWER <span class="red">code</span>' })}
      <div class="values">
        ${g.values.map((v, i) => `
        <article class="value">
          ${icon(VALUE_ICONS[i % VALUE_ICONS.length], 'value__icon')}
          <h3>${esc(v.title)}</h3>
          <p>${esc(v.text)}</p>
        </article>`).join('')}
      </div>
    </div>
  </section>

  <section class="section" id="facilities">
    <div class="container">
      ${sectionHead({ kicker: 'Facilities', title: 'Serious kit for <span class="red">serious work</span>', sub: 'Everything you need under one roof, maintained every single day.' })}
      <div class="facilities">
        ${site.facilities.map((f) => `
        <article class="facility">
          ${icon(f.icon, 'facility__icon')}
          <div>
            <h3>${esc(f.title)}</h3>
            <p>${esc(f.text)}</p>
          </div>
        </article>`).join('')}
      </div>
    </div>
  </section>

  ${quoteBand(site.quotes[0])}
  ${ctaBand(site, { title: 'See it for yourself', text: 'Walk the floor, try the equipment and train with a coach on your free trial.' })}`;
  },
};
