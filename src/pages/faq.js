const { esc, icon } = require('../util');
const { pageHero, ctaBand } = require('../layout');

module.exports = {
  key: 'faq',
  path: '/faq',
  file: 'faq.html',
  title: 'FAQ',
  description: 'Answers to common questions about POWER FITNESS: free trial, membership fees, freezing, payment, group classes, ladies batch and personal training.',
  head(site) {
    const ld = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: site.faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    };
    return `<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>`;
  },
  render(site) {
    const groups = [...new Set(site.faqs.map((f) => f.group))];
    return `
  ${pageHero({ kicker: 'FAQ', title: 'Got <span class="red">questions?</span>', word: 'FAQ', crumb: 'FAQ', sub: 'Everything you need to know before your first workout.' })}

  <section class="section">
    <div class="container faq">
      ${groups.map((g) => `
      <div class="faq__group">
        <h2 class="faq__title">${esc(g)}</h2>
        ${site.faqs.filter((f) => f.group === g).map((f) => `
        <details class="faq__item">
          <summary>${esc(f.q)}<span class="faq__icon" aria-hidden="true"></span></summary>
          <p>${esc(f.a)}</p>
        </details>`).join('')}
      </div>`).join('')}
      <aside class="hint-bar">
        ${icon('whatsapp')}
        <p><strong>Still have a question?</strong> Message us on WhatsApp or call ${esc(site.contact.phone)}. We usually reply within an hour during gym hours.</p>
        <a href="/contact" class="btn btn--outline btn--sm"><span>Contact us</span></a>
      </aside>
    </div>
  </section>

  ${ctaBand(site)}`;
  },
};
