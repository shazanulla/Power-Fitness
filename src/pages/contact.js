const { esc, icon, fmt12 } = require('../util');
const { pageHero } = require('../layout');

module.exports = {
  key: 'contact',
  path: '/contact',
  file: 'contact.html',
  title: 'Contact, Timings & Location',
  description: 'Contact POWER FITNESS: address, phone, WhatsApp, email, gym opening hours and map location. Send us a message online.',
  render(site) {
    const c = site.contact;
    const tel = c.phone.replace(/[^\d+]/g, '');
    const maps = encodeURIComponent(c.mapQuery || c.address);
    return `
  ${pageHero({ kicker: 'Contact', title: 'Come <span class="red">train</span> with us', word: 'CONTACT', crumb: 'Contact', sub: 'Call, WhatsApp or drop by. Our front desk is happy to show you around.' })}

  <section class="section">
    <div class="container contact-grid">
      <div class="contact-cards">
        <a class="contact-card" href="https://www.google.com/maps/search/?api=1&query=${maps}" target="_blank" rel="noopener">
          ${icon('pin')}<div><strong>Address</strong><span>${esc(c.address)}</span></div>
        </a>
        <a class="contact-card" href="tel:${tel}">
          ${icon('phone')}<div><strong>Call us</strong><span>${esc(c.phone)}</span></div>
        </a>
        <a class="contact-card" href="https://wa.me/${c.whatsapp}" target="_blank" rel="noopener">
          ${icon('whatsapp')}<div><strong>WhatsApp</strong><span>Quick replies during gym hours</span></div>
        </a>
        <a class="contact-card" href="mailto:${esc(c.email)}">
          ${icon('mail')}<div><strong>Email</strong><span>${esc(c.email)}</span></div>
        </a>
      </div>

      <div class="hours-card">
        <header>
          <h2 class="card-title">Gym timings</h2>
          <p class="status-chip" data-open-status><span class="dot"></span><span class="status-chip__text">Open 7 days a week</span></p>
        </header>
        <table class="hours" data-timings>
          <tbody>
            ${site.timings.map((t) => `<tr data-day="${esc(t.day)}"><th scope="row">${esc(t.day)}</th><td>${t.open && t.close ? `${fmt12(t.open)} – ${fmt12(t.close)}` : 'Closed'}</td></tr>`).join('')}
          </tbody>
        </table>
        <p class="note">${esc(site.timingsNote)}</p>
      </div>
    </div>
  </section>

  <section class="section section--ink">
    <div class="container contact-grid contact-grid--even">
      <div class="map">
        <iframe title="POWER FITNESS on Google Maps" src="https://maps.google.com/maps?q=${maps}&z=15&output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
      </div>
      <form class="form-card" data-form="enquiry" novalidate>
        <p class="kicker">Send a message</p>
        <h2 class="card-title">Have a question?</h2>
        <div class="form-grid">
          <div class="field">
            <label for="ct-name">Full name *</label>
            <input id="ct-name" name="name" autocomplete="name" required maxlength="80" />
            <small class="field__error"></small>
          </div>
          <div class="field">
            <label for="ct-phone">Mobile number *</label>
            <input id="ct-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" required maxlength="16" placeholder="10-digit number" />
            <small class="field__error"></small>
          </div>
        </div>
        <div class="field">
          <label for="ct-email">Email</label>
          <input id="ct-email" name="email" type="email" autocomplete="email" maxlength="120" />
          <small class="field__error"></small>
        </div>
        <div class="field">
          <label for="ct-message">Message *</label>
          <textarea id="ct-message" name="message" rows="4" maxlength="1000" required placeholder="Ask about plans, timings, personal training…"></textarea>
          <small class="field__error"></small>
        </div>
        <input class="hp" name="website" tabindex="-1" autocomplete="off" aria-hidden="true" />
        <button class="btn btn--red btn--block" type="submit"><span>Send message</span></button>
        <p class="form-status" role="status"></p>
      </form>
    </div>
  </section>`;
  },
};
