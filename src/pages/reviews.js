const { esc, icon, stars } = require('../util');
const { pageHero, testimonialCard, samplesNote, ctaBand } = require('../layout');

module.exports = {
  key: 'reviews',
  path: '/reviews',
  file: 'reviews.html',
  title: 'Member Reviews',
  description: 'Read what members say about training at POWER FITNESS: coaching, equipment, classes, cleanliness and value for money.',
  render(site) {
    const list = site.testimonials;
    const avg = list.reduce((s, t) => s + t.rating, 0) / list.length;
    const dist = [5, 4, 3, 2, 1].map((n) => ({ n, count: list.filter((t) => t.rating === n).length }));
    return `
  ${pageHero({ kicker: 'Reviews', title: 'Real sweat. <span class="red">Real results.</span>', word: 'REVIEWS', crumb: 'Reviews', sub: 'Our members say it better than we can.' })}

  <section class="section">
    <div class="container">
      <div class="rating-summary">
        <div class="rating-summary__score">
          <strong>${avg.toFixed(1)}</strong>
          ${stars(Math.round(avg))}
          <span>Based on ${list.length} reviews</span>
        </div>
        <div class="rating-summary__bars">
          ${dist.map((d) => `
          <div class="bar-row">
            <span>${d.n} ${icon('star')}</span>
            <span class="bar"><span style="width:${list.length ? (d.count / list.length) * 100 : 0}%"></span></span>
            <span>${d.count}</span>
          </div>`).join('')}
        </div>
        <div class="rating-summary__cta">
          <p>Train with us? Tell others how it's going.</p>
          <a href="${esc(site.googleReviewUrl)}" target="_blank" rel="noopener" class="btn btn--red"><span>${icon('star')} Review us on Google</span></a>
        </div>
      </div>

      <div class="reviews-grid">
        ${list.map(testimonialCard).join('')}
      </div>
      ${samplesNote(site)}
    </div>
  </section>

  ${ctaBand(site, { title: 'Write your own story', text: 'Start with a free trial. Your transformation could be the next review here.' })}`;
  },
};
