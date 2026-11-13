const { esc, icon, rupees } = require('../util');
const { pageHero, sectionHead, ctaBand } = require('../layout');

module.exports = {
  key: 'membership',
  path: '/membership',
  file: 'membership.html',
  title: 'Membership Plans & Fees',
  description: 'POWER FITNESS membership plans and fees: Monthly ₹1,500, Quarterly ₹4,000, Half-Yearly ₹7,000 and Yearly ₹12,000. Compare benefits and join today.',
  render(site) {
    const base = Math.max(...site.plans.map((p) => p.price / p.months));
    return `
  ${pageHero({ kicker: 'Membership', title: 'Invest in <span class="red">your strength</span>', word: 'PLANS', crumb: 'Membership', sub: 'Simple pricing, no hidden charges. Try us free first, and pay only when you decide to join.' })}

  <section class="section">
    <div class="container">
      <div class="plans">
        ${site.plans.map((p) => {
          const perMonth = Math.round(p.price / p.months);
          const save = Math.round((1 - p.price / p.months / base) * 100);
          return `
        <article class="plan${p.popular ? ' plan--popular' : ''}">
          ${p.popular ? '<p class="plan__flag">Most popular</p>' : ''}
          <header class="plan__head">
            <h2 class="plan__name">${esc(p.name)}</h2>
            ${save > 0 ? `<span class="plan__save">Save ${save}%</span>` : ''}
          </header>
          <p class="plan__price">${rupees(p.price)}</p>
          <p class="plan__per">for ${p.months} month${p.months > 1 ? 's' : ''} · <strong>${rupees(perMonth)}/month</strong></p>
          <ul class="checks checks--sm">
            ${p.benefits.map((b) => `<li>${icon('check')}${esc(b)}</li>`).join('')}
          </ul>
          <a href="/join?plan=${esc(p.id)}" class="btn ${p.popular ? 'btn--red' : 'btn--outline'} btn--block"><span>Choose ${esc(p.name)}</span></a>
        </article>`;
        }).join('')}
      </div>
      <p class="plans__note">${icon('help')} ${esc(site.plansNote)}</p>
      ${site.payment ? `
      <div class="pay">
        <div class="pay__intro">
          <p class="kicker">How payment works</p>
          <h2 class="pay__title">${esc(site.payment.title)}</h2>
          <p>${esc(site.payment.text)}</p>
        </div>
        <ol class="pay__steps">
          <li><span>1</span><strong>Book a free trial</strong><small>No payment needed</small></li>
          <li><span>2</span><strong>Meet us & train</strong><small>Try the gym with a coach</small></li>
          <li><span>3</span><strong>Pay & start</strong><small>Only when you decide to join</small></li>
        </ol>
        <div class="pay__options">
          ${site.payment.options.map((o) => `<div class="pay__option">${icon(o.icon)}<div><strong>${esc(o.title)}</strong><small>${esc(o.text)}</small></div></div>`).join('')}
          <div class="pay__actions">
            <a href="/join" class="btn btn--red btn--sm"><span>Book Free Trial</span></a>
            <a href="https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent('Hi POWER FITNESS, I would like to join. Please share payment details.')}" target="_blank" rel="noopener" class="btn btn--outline btn--sm"><span>${icon('whatsapp')} Pay on WhatsApp</span></a>
          </div>
        </div>
      </div>` : ''}
    </div>
  </section>

  <section class="section section--ink">
    <div class="container">
      ${sectionHead({ kicker: 'Compare', title: 'Plan <span class="red">comparison</span>' })}
      <div class="table-scroll">
        <table class="compare">
          <thead>
            <tr><th scope="col">Feature</th>${site.plans.map((p) => `<th scope="col"${p.popular ? ' class="is-pop"' : ''}>${esc(p.name)}</th>`).join('')}</tr>
          </thead>
          <tbody>
            <tr><th scope="row">Price</th>${site.plans.map((p) => `<td${p.popular ? ' class="is-pop"' : ''}><strong>${rupees(p.price)}</strong></td>`).join('')}</tr>
            ${site.compare.map((row) => `
            <tr><th scope="row">${esc(row.feature)}</th>${site.plans.map((p) => {
              const pop = p.popular ? ' is-pop' : '';
              if (!row.plans.includes(p.id)) return `<td class="no${pop}"><span class="sr-only">Not included</span>${icon('x')}</td>`;
              const note = row.note && row.note[p.id];
              return `<td class="yes${pop}">${note ? esc(note) : `<span class="sr-only">Included</span>${icon('check')}`}</td>`;
            }).join('')}</tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      ${sectionHead({ kicker: 'How to join', title: 'From trial to <span class="red">first PR</span>' })}
      <ol class="steps">
        ${site.joinSteps.map((s, i) => `
        <li class="step">
          <span class="step__num">${String(i + 1).padStart(2, '0')}</span>
          <h3>${esc(s.title)}</h3>
          <p>${esc(s.text)}</p>
        </li>`).join('')}
      </ol>
      <p class="center"><a class="link-arrow" href="/faq">Questions about fees, freezing or payment? Read the FAQ ${icon('arrow')}</a></p>
    </div>
  </section>

  ${ctaBand(site, { title: 'Not sure which plan?', text: 'Book a free trial and our coach will help you pick the right plan for your goal.' })}`;
  },
};
