const { icon } = require('../util');
const { pageHero, ctaBand } = require('../layout');

module.exports = {
  key: 'tools',
  path: '/tools',
  file: 'tools.html',
  title: 'Fitness Tools: BMI, Calories & 1RM',
  description: 'Free fitness calculators from POWER FITNESS: BMI calculator, daily calorie (TDEE) and protein calculator, and one-rep max calculator.',
  render(site) {
    return `
  ${pageHero({ kicker: 'Fitness tools', title: 'Know your <span class="red">numbers</span>', word: 'TOOLS', crumb: 'Fitness Tools', sub: 'Quick calculators our coaches use. Use them as a starting point, then let a coach fine-tune your plan.' })}

  <section class="section">
    <div class="container tools">
      <form class="tool" data-tool="bmi" novalidate>
        <header class="tool__head">${icon('target')}<div><h2>BMI calculator</h2><p>Body Mass Index from height and weight.</p></div></header>
        <div class="form-grid">
          <div class="field"><label for="bmi-h">Height (cm)</label><input id="bmi-h" name="h" type="number" inputmode="decimal" min="100" max="250" placeholder="170" required /></div>
          <div class="field"><label for="bmi-w">Weight (kg)</label><input id="bmi-w" name="w" type="number" inputmode="decimal" min="25" max="300" placeholder="68" required /></div>
        </div>
        <button class="btn btn--red btn--block" type="submit"><span>Calculate BMI</span></button>
        <div class="tool__out" aria-live="polite"></div>
      </form>

      <form class="tool" data-tool="tdee" novalidate>
        <header class="tool__head">${icon('flame')}<div><h2>Daily calories</h2><p>Calories and protein for your goal.</p></div></header>
        <div class="form-grid">
          <div class="field"><label for="td-sex">Sex</label><select id="td-sex" name="sex"><option value="m">Male</option><option value="f">Female</option></select></div>
          <div class="field"><label for="td-age">Age</label><input id="td-age" name="age" type="number" inputmode="numeric" min="14" max="90" placeholder="28" required /></div>
          <div class="field"><label for="td-h">Height (cm)</label><input id="td-h" name="h" type="number" inputmode="decimal" min="100" max="250" placeholder="170" required /></div>
          <div class="field"><label for="td-w">Weight (kg)</label><input id="td-w" name="w" type="number" inputmode="decimal" min="25" max="300" placeholder="68" required /></div>
        </div>
        <div class="field">
          <label for="td-act">Activity level</label>
          <select id="td-act" name="act">
            <option value="1.2">Desk job, little exercise</option>
            <option value="1.375">Light: 1–3 workouts a week</option>
            <option value="1.55" selected>Moderate: 3–5 workouts a week</option>
            <option value="1.725">Hard: 6–7 workouts a week</option>
            <option value="1.9">Athlete or physical job + training</option>
          </select>
        </div>
        <button class="btn btn--red btn--block" type="submit"><span>Calculate calories</span></button>
        <div class="tool__out" aria-live="polite"></div>
      </form>

      <form class="tool" data-tool="orm" novalidate>
        <header class="tool__head">${icon('trophy')}<div><h2>One-rep max</h2><p>Estimate your max from a set you did.</p></div></header>
        <div class="form-grid">
          <div class="field"><label for="orm-w">Weight lifted (kg)</label><input id="orm-w" name="w" type="number" inputmode="decimal" min="1" max="500" placeholder="80" required /></div>
          <div class="field"><label for="orm-r">Reps done</label><input id="orm-r" name="r" type="number" inputmode="numeric" min="1" max="12" placeholder="5" required /></div>
        </div>
        <button class="btn btn--red btn--block" type="submit"><span>Calculate 1RM</span></button>
        <div class="tool__out" aria-live="polite"></div>
      </form>
    </div>
    <p class="container muted small">These calculators give estimates only and are not medical advice. Speak to a doctor before starting training if you have a health condition.</p>
  </section>

  ${ctaBand(site, { title: 'Turn numbers into results', text: 'Book a free trial and a coach will build your plan from your numbers.' })}`;
  },
};
