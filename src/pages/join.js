const { esc, icon, rupees } = require('../util');
const { pageHero } = require('../layout');

module.exports = {
  key: 'join',
  path: '/join',
  file: 'join.html',
  title: 'Book a Free Trial',
  description: 'Book a free trial workout at POWER FITNESS. Choose your goal, pick a date and time, and train with a certified coach. No account needed.',
  render(site) {
    return `
  ${pageHero({ kicker: 'Free trial', title: 'Your first workout <span class="red">is on us</span>', word: 'JOIN', crumb: 'Free Trial', sub: 'Three quick steps. No account and no payment. Pay only after your trial if you decide to join.' })}

  <section class="section">
    <div class="container join">
      <form class="wizard" data-wizard novalidate>
        <ol class="wizard__steps" aria-label="Booking progress">
          <li class="is-current" data-step-label="1"><span>1</span>Goal</li>
          <li data-step-label="2"><span>2</span>Date & time</li>
          <li data-step-label="3"><span>3</span>Your details</li>
        </ol>

        <fieldset class="wizard__panel" data-step="1">
          <legend class="wizard__title">What's your goal?</legend>
          <div class="goal-grid">
            ${site.programs.map((p, i) => `
            <label class="goal">
              <input type="radio" name="program" value="${esc(p.id)}"${i === 0 ? ' required' : ''} />
              <span class="goal__box">
                <strong>${esc(p.title)}</strong>
                <small>${esc(p.for)}</small>
              </span>
            </label>`).join('')}
          </div>
          <small class="field__error" data-error-for="program"></small>
          <div class="wizard__nav">
            <span></span>
            <button type="button" class="btn btn--red" data-next><span>Next: pick a time ${icon('arrow')}</span></button>
          </div>
        </fieldset>

        <fieldset class="wizard__panel" data-step="2" hidden>
          <legend class="wizard__title">When do you want to come in?</legend>
          <p class="label">Date</p>
          <div class="date-chips" data-dates role="radiogroup" aria-label="Date"></div>
          <small class="field__error" data-error-for="date"></small>
          <p class="label">Time</p>
          <div class="time-chips" data-times role="radiogroup" aria-label="Time"></div>
          <small class="field__error" data-error-for="time"></small>
          <div class="wizard__nav">
            <button type="button" class="btn btn--outline" data-back><span>Back</span></button>
            <button type="button" class="btn btn--red" data-next><span>Next: your details ${icon('arrow')}</span></button>
          </div>
        </fieldset>

        <fieldset class="wizard__panel" data-step="3" hidden>
          <legend class="wizard__title">Tell us about you</legend>
          <div class="form-grid">
            <div class="field">
              <label for="j-name">Full name *</label>
              <input id="j-name" name="name" autocomplete="name" required maxlength="80" />
              <small class="field__error"></small>
            </div>
            <div class="field">
              <label for="j-phone">Mobile number *</label>
              <input id="j-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" required maxlength="16" placeholder="10-digit number" />
              <small class="field__error"></small>
            </div>
            <div class="field">
              <label for="j-email">Email</label>
              <input id="j-email" name="email" type="email" autocomplete="email" maxlength="120" />
              <small class="field__error"></small>
            </div>
            <div class="form-grid form-grid--tight">
              <div class="field">
                <label for="j-age">Age</label>
                <input id="j-age" name="age" type="number" inputmode="numeric" min="12" max="90" />
                <small class="field__error"></small>
              </div>
              <div class="field">
                <label for="j-gender">Gender</label>
                <select id="j-gender" name="gender">
                  <option value="">Select</option><option>Male</option><option>Female</option><option>Other</option>
                </select>
              </div>
            </div>
            <div class="field">
              <label for="j-plan">Interested plan</label>
              <select id="j-plan" name="plan">
                <option value="">Not sure yet</option>
                ${site.plans.map((p) => `<option value="${esc(p.id)}">${esc(p.name)} — ${rupees(p.price)}</option>`).join('')}
              </select>
            </div>
            <div class="field">
              <label for="j-trainer">Preferred coach</label>
              <select id="j-trainer" name="trainer">
                <option value="">Any coach</option>
                ${site.trainers.map((t) => `<option value="${esc(t.id)}">${esc(t.name)}</option>`).join('')}
              </select>
            </div>
          </div>
          <div class="field">
            <label for="j-message">Anything we should know?</label>
            <textarea id="j-message" name="message" rows="3" maxlength="1000" placeholder="Injuries, medical conditions, goals…"></textarea>
          </div>
          <input class="hp" name="website" tabindex="-1" autocomplete="off" aria-hidden="true" />
          <div class="wizard__nav">
            <button type="button" class="btn btn--outline" data-back><span>Back</span></button>
            <button type="submit" class="btn btn--red"><span>Book my free trial</span></button>
          </div>
          <p class="form-status" role="status"></p>
        </fieldset>

        <div class="wizard__done" data-done hidden></div>
      </form>

      <aside class="join__aside">
        <div class="summary" data-summary>
          <h2 class="card-title">Your trial</h2>
          <dl>
            <div><dt>Goal</dt><dd data-sum="program">—</dd></div>
            <div><dt>Date</dt><dd data-sum="date">—</dd></div>
            <div><dt>Time</dt><dd data-sum="time">—</dd></div>
          </dl>
        </div>
        <div class="expect">
          <h2 class="card-title">What you get</h2>
          <ul class="checks checks--sm">
            <li>${icon('check')}60-minute guided workout with a coach</li>
            <li>${icon('check')}Free body assessment & BMI check</li>
            <li>${icon('check')}Help choosing the right program and plan</li>
            <li>${icon('check')}Tour of the gym and facilities</li>
            <li>${icon('check')}No payment now. Pay only if you join, at the gym or on WhatsApp</li>
          </ul>
          <p class="muted small">Bring workout clothes, clean indoor shoes, a towel and water.</p>
        </div>
      </aside>
    </div>
  </section>`;
  },
};
