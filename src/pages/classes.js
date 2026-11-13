const { esc, icon, fmt12, intensity } = require('../util');
const { pageHero, ctaBand } = require('../layout');

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

module.exports = {
  key: 'classes',
  path: '/classes',
  file: 'classes.html',
  title: 'Class Schedule & Booking',
  description: 'Weekly group class timetable at POWER FITNESS: HIIT, strength, Zumba, cardio, ladies batch and mobility. Book your spot online.',
  render(site) {
    const trainerName = (id) => (site.trainers.find((t) => t.id === id) || {}).name || '';
    const types = ['All', ...new Set(site.classes.map((c) => c.type))];
    const byTime = [...site.classes].sort((a, b) => a.time.localeCompare(b.time));
    return `
  ${pageHero({ kicker: 'Group classes', title: 'Book your <span class="red">spot</span>', word: 'CLASSES', crumb: 'Classes', sub: 'Pick a day, choose a class and reserve your place. Classes are small so every member gets coached.' })}

  <section class="section">
    <div class="container">
      <ol class="how">
        <li>${icon('calendar')}<span><strong>Pick a day</strong> from the next 7 days</span></li>
        <li>${icon('dumbbell')}<span><strong>Choose a class</strong> that fits your goal</span></li>
        <li>${icon('check')}<span><strong>Reserve</strong> and we confirm on WhatsApp</span></li>
      </ol>

      <div class="schedule" data-schedule>
        <div class="days" role="tablist" aria-label="Choose a day" data-days></div>
        <div class="filter filter--sm" role="group" aria-label="Filter by class type" data-type-filter>
          ${types.map((t, i) => `<button type="button" class="filter__btn${i === 0 ? ' is-active' : ''}" data-type="${esc(t)}" aria-pressed="${i === 0}">${esc(t)}</button>`).join('')}
        </div>
        <div class="slots" data-slots aria-live="polite">
          <p class="slots__empty">Loading today's classes…</p>
        </div>
      </div>
    </div>
  </section>

  <section class="section section--ink">
    <div class="container">
      <header class="sec-head"><div><p class="kicker">At a glance</p><h2 class="sec-title">Weekly <span class="red">timetable</span></h2></div></header>
      <div class="table-scroll">
        <table class="timetable">
          <thead><tr><th scope="col">Time</th>${DAYS.map((d) => `<th scope="col">${d}</th>`).join('')}</tr></thead>
          <tbody>
            ${[...new Set(byTime.map((c) => c.time))].map((time) => `
            <tr>
              <th scope="row">${fmt12(time)}</th>
              ${DAYS.map((d) => {
                const list = byTime.filter((c) => c.time === time && c.days.includes(d));
                return `<td>${list.map((c) => `<span class="tt-class tt-${esc(c.type.toLowerCase())}">${esc(c.title)}<small>${esc(trainerName(c.trainer))}</small></span>`).join('')}</td>`;
              }).join('')}
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
      <p class="muted small">Class access depends on your plan. Quarterly: 1 class a week. Half-Yearly and Yearly: unlimited. First class is free on your trial.</p>
    </div>
  </section>

  <dialog class="modal" id="bookModal" aria-labelledby="bookTitle">
    <form class="modal__box" method="dialog" data-book-form novalidate>
      <button class="modal__close" value="cancel" formnovalidate aria-label="Close">${icon('x')}</button>
      <p class="kicker">Reserve your spot</p>
      <h2 class="modal__title" id="bookTitle" data-book-title>Class</h2>
      <p class="modal__meta" data-book-meta></p>
      <div class="form-grid">
        <div class="field">
          <label for="bk-name">Full name *</label>
          <input id="bk-name" name="name" autocomplete="name" required maxlength="80" />
          <small class="field__error"></small>
        </div>
        <div class="field">
          <label for="bk-phone">Mobile number *</label>
          <input id="bk-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" required maxlength="16" placeholder="10-digit number" />
          <small class="field__error"></small>
        </div>
      </div>
      <input type="hidden" name="classId" />
      <input type="hidden" name="date" />
      <input class="hp" name="website" tabindex="-1" autocomplete="off" aria-hidden="true" />
      <button class="btn btn--red btn--block" type="submit" value="submit"><span>Confirm booking</span></button>
      <p class="form-status" role="status"></p>
    </form>
  </dialog>

  ${ctaBand(site, { title: 'First class is free', text: 'New here? Book a free trial and join any class this week.' })}`;
  },
};
