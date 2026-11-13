const { esc, icon, intensity } = require('../util');
const { pageHero, quoteBand, ctaBand } = require('../layout');

module.exports = {
  key: 'programs',
  path: '/programs',
  file: 'programs.html',
  title: 'Workout Programs',
  description: 'POWER FITNESS workout programs: strength training, weight training and muscle gain, cardio, weight loss, functional HIIT and personal training.',
  render(site) {
    const cats = ['All', ...new Set(site.programs.map((p) => p.category))];
    return `
  ${pageHero({ kicker: 'Workout programs', title: 'Pick your <span class="red">battle</span>', word: 'PROGRAMS', crumb: 'Programs', sub: 'Every program comes with coaching, a plan and progress tracking. Choose your goal and we will build the rest.' })}

  <section class="section">
    <div class="container">
      <div class="filter" role="group" aria-label="Filter programs" data-filter="programs">
        ${cats.map((c, i) => `<button type="button" class="filter__btn${i === 0 ? ' is-active' : ''}" data-cat="${esc(c)}" aria-pressed="${i === 0}">${esc(c)}</button>`).join('')}
      </div>
      <div class="programs" id="programs-list">
        ${site.programs.map((p) => `
        <article class="program" data-cat="${esc(p.category)}" id="${esc(p.id)}">
          <header class="program__head">
            <span class="tag">${esc(p.category)}</span>
            ${intensity(p.intensity)}
          </header>
          <h2 class="program__title">${esc(p.title)}</h2>
          <p class="program__text">${esc(p.text)}</p>
          <dl class="program__meta">
            <div><dt>${icon('user')} Level</dt><dd>${esc(p.level)}</dd></div>
            <div><dt>${icon('clock')} Session</dt><dd>${esc(p.duration)}</dd></div>
            <div><dt>${icon('calendar')} Frequency</dt><dd>${esc(p.frequency)}</dd></div>
          </dl>
          <ul class="checks checks--sm">
            ${p.points.map((pt) => `<li>${icon('check')}${esc(pt)}</li>`).join('')}
          </ul>
          <footer class="program__foot">
            <span class="program__for">Best for: <strong>${esc(p.for)}</strong></span>
            <a href="/join?program=${esc(p.id)}" class="btn btn--red btn--sm"><span>Start this program</span></a>
          </footer>
        </article>`).join('')}
      </div>
      <aside class="hint-bar">
        ${icon('calc')}
        <p><strong>Not sure where to start?</strong> Check your BMI and daily calories, then book a free trial and a coach will recommend the right program.</p>
        <a href="/tools" class="btn btn--outline btn--sm"><span>Fitness Tools</span></a>
      </aside>
    </div>
  </section>

  ${quoteBand(site.quotes[2])}
  ${ctaBand(site)}`;
  },
};
