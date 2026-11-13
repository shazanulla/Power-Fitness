const { esc, icon, fmt12 } = require('../util');
const { pageHero, quoteBand, ctaBand, teamRow } = require('../layout');

module.exports = {
  key: 'trainers',
  path: '/trainers',
  file: 'trainers.html',
  title: 'Our Coaches',
  description: 'Meet the POWER FITNESS team: founder Adithya, head coach Naveed, coaches Shazan and Rohit, and ladies coach Geetha.',
  render(site) {
    return `
  ${pageHero({ kicker: 'The coaches', title: 'Coached by <span class="red">the strong</span>', word: 'COACHES', crumb: 'Coaches', sub: 'Certified, experienced and on the floor with you. Our coaches correct your form, write your plan and push you past your limits.' })}

  <section class="section section--tex team-overview">
    <div class="container">
      <header class="sec-head sec-head--center"><div><p class="kicker">The team</p><h2 class="sec-title">Five coaches. <span class="red">One mission.</span></h2></div></header>
      ${teamRow(site)}
    </div>
  </section>

  ${site.trainers.map((t, i) => {
    const classes = site.classes.filter((c) => c.trainer === t.id);
    const [first, ...rest] = t.name.split(' ');
    return `
  <section class="coach${i % 2 ? ' coach--flip' : ''}" id="${esc(t.id)}">
    <span class="coach__word" aria-hidden="true">${esc(rest.join(' ') || first)}</span>
    <div class="container coach__inner">
      <figure class="coach__photo">
        <img class="coach__stroke" src="/images/fx/stroke-slash.webp" alt="" aria-hidden="true" loading="lazy" />
        <img class="coach__img" src="${esc(t.photo)}" alt="${esc(t.name)}, ${esc(t.role)}" width="900" height="1200" loading="lazy" style="object-position:${esc(t.focus)}" />
        <figcaption class="coach__stats">
          ${t.stats.map((s) => `<div><strong>${esc(s.value)}</strong><span>${esc(s.label)}</span></div>`).join('')}
        </figcaption>
      </figure>
      <div class="coach__copy">
        <p class="kicker">${esc(t.role)}</p>
        <h2 class="coach__name"><span class="chrome">${esc(first)}</span> <span class="red">${esc(rest.join(' '))}</span></h2>
        <blockquote class="coach__quote">${icon('quote')}<p>${esc(t.quote)}</p></blockquote>
        <p class="lead">${esc(t.bio)}</p>
        <h3 class="mini-title">Specialties</h3>
        <ul class="chips">${t.specialties.map((s) => `<li>${esc(s)}</li>`).join('')}</ul>
        <h3 class="mini-title">Certifications</h3>
        <ul class="checks checks--sm">${t.certifications.map((c) => `<li>${icon('shield')}${esc(c)}</li>`).join('')}</ul>
        ${classes.length ? `
        <h3 class="mini-title">Classes led</h3>
        <ul class="coach__classes">
          ${classes.map((c) => `<li><strong>${esc(c.title)}</strong><span>${c.days.join(', ')} · ${fmt12(c.time)}</span></li>`).join('')}
        </ul>` : ''}
        <div class="coach__actions">
          <a href="/join?trainer=${esc(t.id)}" class="btn btn--red btn--lg"><span>Train with ${esc(t.name)} ${icon('arrow')}</span></a>
          <a href="/classes" class="btn btn--outline btn--lg"><span>See classes</span></a>
        </div>
      </div>
    </div>
  </section>`;
  }).join('')}

  ${quoteBand(site.quotes[1])}
  ${ctaBand(site, { title: 'Train with a coach for free', text: 'Your free trial includes a guided workout with one of our coaches. Pay only if you decide to join.' })}`;
  },
};
