// POWER FITNESS: site script (all pages).
// Each feature only runs when its elements are on the page.
(function () {
  'use strict';

  const PF = window.PF || {};
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const icon = (n, cls = '') => `<svg class="ico ${cls}" aria-hidden="true"><use href="#i-${n}"/></svg>`;
  const DAY_KEYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const DAY_FULL = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const fmt12 = (hhmm) => {
    const [h, m] = hhmm.split(':').map(Number);
    return `${((h + 11) % 12) + 1}:${String(m).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`;
  };
  const toMin = (hhmm) => { const [h, m] = hhmm.split(':').map(Number); return h * 60 + m; };
  const fromMin = (n) => `${String(Math.floor(n / 60)).padStart(2, '0')}:${String(n % 60).padStart(2, '0')}`;

  // Current date/time at the gym (not the visitor's time zone).
  function gymNow() {
    const tz = PF.timezone || 'Asia/Kolkata';
    try {
      const p = Object.fromEntries(new Intl.DateTimeFormat('en-GB', {
        timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
      }).formatToParts(new Date()).map((x) => [x.type, x.value]));
      return { y: +p.year, m: +p.month, d: +p.day, minutes: +p.hour * 60 + +p.minute };
    } catch {
      const d = new Date();
      return { y: d.getFullYear(), m: d.getMonth() + 1, d: d.getDate(), minutes: d.getHours() * 60 + d.getMinutes() };
    }
  }
  // Next n days as { iso, dow, label, dayNum, month }
  function nextDays(n) {
    const now = gymNow();
    return Array.from({ length: n }, (_, i) => {
      const dt = new Date(Date.UTC(now.y, now.m - 1, now.d + i));
      return {
        iso: dt.toISOString().slice(0, 10),
        dow: dt.getUTCDay(),
        dayNum: dt.getUTCDate(),
        month: MONTHS[dt.getUTCMonth()],
        label: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : DAY_KEYS[dt.getUTCDay()],
        isToday: i === 0,
      };
    });
  }
  const timingFor = (dow) => (PF.timings || []).find((t) => t.day === DAY_FULL[dow]);
  const prettyDate = (iso) => {
    const dt = new Date(iso + 'T00:00:00Z');
    return `${DAY_KEYS[dt.getUTCDay()]}, ${dt.getUTCDate()} ${MONTHS[dt.getUTCMonth()]}`;
  };

  // ---------- header & menu ----------
  const header = $('#header');
  if (header) {
    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 10);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }
  const nav = $('#nav');
  const toggle = $('#navToggle');
  if (nav && toggle) {
    const setOpen = (open) => {
      // Start the panel right under the header (the announcement bar may be above it).
      if (open && header) nav.style.top = `${Math.max(0, header.getBoundingClientRect().bottom)}px`;
      nav.classList.toggle('is-open', open);
      document.body.classList.toggle('menu-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    };
    toggle.addEventListener('click', () => setOpen(!nav.classList.contains('is-open')));
    nav.addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
    window.addEventListener('resize', () => { if (window.innerWidth > 1180) setOpen(false); });
  }
  $$('[data-year]').forEach((el) => (el.textContent = new Date().getFullYear()));

  // ---------- open now / today ----------
  (function openStatus() {
    const chips = $$('[data-open-status]');
    const now = gymNow();
    const dow = new Date(Date.UTC(now.y, now.m - 1, now.d)).getUTCDay();
    $$('[data-timings] tr[data-day]').forEach((tr) => tr.classList.toggle('is-today', tr.dataset.day === DAY_FULL[dow]));
    if (!chips.length || !PF.timings) return;
    const t = timingFor(dow);
    let text = 'Closed today';
    let open = false;
    if (t && t.open && t.close) {
      if (now.minutes >= toMin(t.open) && now.minutes < toMin(t.close)) { open = true; text = `Open now · until ${fmt12(t.close)}`; }
      else if (now.minutes < toMin(t.open)) text = `Closed · opens ${fmt12(t.open)}`;
      else {
        const nt = timingFor((dow + 1) % 7);
        text = nt && nt.open ? `Closed · opens tomorrow ${fmt12(nt.open)}` : 'Closed now';
      }
    }
    chips.forEach((c) => {
      $('.dot', c).className = 'dot ' + (open ? 'is-open' : 'is-closed');
      $('.status-chip__text', c).textContent = text;
    });
  })();

  // ---------- count-up numbers ----------
  const counters = $$('[data-count]');
  if (counters.length && 'IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        io.unobserve(en.target);
        const el = en.target;
        const target = +el.dataset.count;
        const suffix = el.dataset.suffix || '';
        const start = performance.now();
        const step = (t) => {
          const k = Math.min(1, (t - start) / 1400);
          el.textContent = Math.round(target * (1 - Math.pow(1 - k, 3))).toLocaleString('en-IN') + suffix;
          if (k < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });
    }, { threshold: 0.5 });
    counters.forEach((c) => io.observe(c));
  }

  // ---------- program filter ----------
  const progFilter = $('[data-filter="programs"]');
  if (progFilter) {
    progFilter.addEventListener('click', (e) => {
      const btn = e.target.closest('.filter__btn');
      if (!btn) return;
      $$('.filter__btn', progFilter).forEach((b) => { b.classList.toggle('is-active', b === btn); b.setAttribute('aria-pressed', b === btn); });
      $$('.program').forEach((p) => p.classList.toggle('is-hidden', btn.dataset.cat !== 'All' && p.dataset.cat !== btn.dataset.cat));
    });
  }

  // ---------- form helpers ----------
  function setError(form, name, msg) {
    const input = form.elements[name];
    const el = input && (input.length && !input.tagName ? input[0] : input);
    const field = el && el.closest('.field');
    if (field) {
      field.classList.toggle('has-error', !!msg);
      const out = $('.field__error', field);
      if (out) out.textContent = msg || '';
    }
    const extra = $(`[data-error-for="${name}"]`, form);
    if (extra) extra.textContent = msg || '';
  }
  function clearErrors(form) {
    $$('.has-error', form).forEach((f) => f.classList.remove('has-error'));
    $$('.field__error', form).forEach((e) => (e.textContent = ''));
  }
  function checkContact(data) {
    const errors = {};
    if ((data.name || '').trim().length < 2) errors.name = 'Please enter your full name.';
    const digits = (data.phone || '').replace(/\D/g, '');
    if (digits.length < 10 || digits.length > 13) errors.phone = 'Please enter a valid 10-digit mobile number.';
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = 'Please enter a valid email address.';
    if (data.age && (+data.age < 12 || +data.age > 90)) errors.age = 'Age should be between 12 and 90.';
    return errors;
  }
  async function send(payload) {
    let res;
    try {
      res = await fetch('/api/enquiries', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    } catch {
      throw Object.assign(new Error(`Could not connect. Check your internet or call us on ${PF.phone}.`), { errors: {} });
    }
    const json = await res.json().catch(() => ({}));
    if (!res.ok || !json.ok) throw Object.assign(new Error(json.message || 'Please check the highlighted fields.'), { errors: json.errors || {} });
    return json;
  }
  function busy(btn, on, label) {
    if (!btn) return;
    btn.disabled = on;
    const span = $('span', btn);
    if (on) { btn.dataset.label = span.innerHTML; span.textContent = label || 'Sending…'; }
    else if (btn.dataset.label) span.innerHTML = btn.dataset.label;
  }
  const waLink = (text) => `https://wa.me/${PF.whatsapp}?text=${encodeURIComponent(text)}`;
  const firstName = (n) => esc(String(n).trim().split(/\s+/)[0]);
  $$('form').forEach((f) => f.addEventListener('input', (e) => { if (e.target.name) setError(f, e.target.name, ''); }));

  // ---------- contact form ----------
  const contactForm = $('[data-form="enquiry"]');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearErrors(contactForm);
      const status = $('.form-status', contactForm);
      status.textContent = '';
      const data = Object.fromEntries(new FormData(contactForm));
      const errors = checkContact(data);
      if (!(data.message || '').trim()) errors.message = 'Please write your message.';
      if (Object.keys(errors).length) {
        Object.entries(errors).forEach(([k, v]) => setError(contactForm, k, v));
        contactForm.elements[Object.keys(errors)[0]].focus();
        return;
      }
      const btn = $('button[type="submit"]', contactForm);
      busy(btn, true);
      try {
        await send({ ...data, type: 'enquiry' });
        contactForm.innerHTML = `<div class="success" role="status"><div class="success__icon">${icon('check')}</div><p class="success__tag">Form submitted</p><h3>Thanks, ${firstName(data.name)}!</h3><p>Your message has been sent to our team. We'll get back to you on <strong>${esc(data.phone)}</strong> soon.</p></div>`;
      } catch (err) {
        Object.entries(err.errors || {}).forEach(([k, v]) => setError(contactForm, k, v));
        status.textContent = err.message;
        status.classList.add('is-error');
        busy(btn, false);
      }
    });
  }

  // ---------- class schedule & booking ----------
  const schedule = $('[data-schedule]');
  if (schedule) {
    const days = nextDays(7);
    const trainerName = (id) => ((PF.trainers || []).find((t) => t.id === id) || {}).name || '';
    let selected = days[0];
    let type = 'All';

    $('[data-days]', schedule).innerHTML = days.map((d, i) => `
      <button type="button" class="day" role="tab" aria-selected="${i === 0}" data-iso="${d.iso}">
        <small>${d.label}</small><strong>${d.dayNum}</strong><small>${d.month}</small>
      </button>`).join('');

    const render = () => {
      const now = gymNow();
      const list = (PF.classes || [])
        .filter((c) => c.days.includes(DAY_KEYS[selected.dow]) && (type === 'All' || c.type === type))
        .sort((a, b) => a.time.localeCompare(b.time));
      const box = $('[data-slots]', schedule);
      if (!list.length) {
        box.innerHTML = `<p class="slots__empty">No ${type === 'All' ? '' : esc(type) + ' '}classes on ${selected.isToday ? 'today' : prettyDate(selected.iso)}. Try another day.</p>`;
        return;
      }
      box.innerHTML = list.map((c) => {
        const past = selected.isToday && toMin(c.time) <= now.minutes;
        const flames = [1, 2, 3].map((n) => icon('flame', n <= c.intensity ? 'is-on' : '')).join('');
        return `
        <article class="slot${past ? ' is-past' : ''}">
          <div class="slot__time"><strong>${fmt12(c.time)}</strong><span>${c.duration} min</span></div>
          <div>
            <h3 class="slot__title">${esc(c.title)}</h3>
            <div class="slot__meta">
              <span class="tag">${esc(c.type)}</span>
              <span>${icon('user')}${esc(trainerName(c.trainer))}</span>
              <span class="intensity" aria-label="Intensity ${c.intensity} of 3">${flames}</span>
              <span>${icon('users')}Max ${c.capacity}</span>
            </div>
          </div>
          ${past ? '<span class="muted small">Started</span>' : `<button type="button" class="btn btn--red btn--sm" data-book="${esc(c.id)}"><span>Book</span></button>`}
        </article>`;
      }).join('');
    };

    $('[data-days]', schedule).addEventListener('click', (e) => {
      const b = e.target.closest('.day');
      if (!b) return;
      selected = days.find((d) => d.iso === b.dataset.iso);
      $$('.day', schedule).forEach((x) => x.setAttribute('aria-selected', x === b));
      render();
    });
    $('[data-type-filter]', schedule).addEventListener('click', (e) => {
      const b = e.target.closest('.filter__btn');
      if (!b) return;
      type = b.dataset.type;
      $$('.filter__btn', schedule).forEach((x) => { x.classList.toggle('is-active', x === b); x.setAttribute('aria-pressed', x === b); });
      render();
    });
    render();

    const modal = $('#bookModal');
    const form = $('[data-book-form]');
    const original = form.innerHTML;
    schedule.addEventListener('click', (e) => {
      const b = e.target.closest('[data-book]');
      if (!b) return;
      const c = PF.classes.find((x) => x.id === b.dataset.book);
      form.innerHTML = original;
      $('[data-book-title]', form).textContent = c.title;
      $('[data-book-meta]', form).textContent = `${prettyDate(selected.iso)} · ${fmt12(c.time)} · ${c.duration} min · ${trainerName(c.trainer)}`;
      form.elements.classId.value = c.id;
      form.elements.date.value = selected.iso;
      form.dataset.summary = `${c.title} on ${prettyDate(selected.iso)} at ${fmt12(c.time)}`;
      if (typeof modal.showModal === 'function') modal.showModal(); else modal.setAttribute('open', '');
      setTimeout(() => form.elements.name.focus(), 50);
    });
    form.addEventListener('submit', async (e) => {
      if (e.submitter && e.submitter.value === 'cancel') return;
      e.preventDefault();
      clearErrors(form);
      const status = $('.form-status', form);
      status.textContent = '';
      const data = Object.fromEntries(new FormData(form));
      const errors = checkContact(data);
      if (Object.keys(errors).length) {
        Object.entries(errors).forEach(([k, v]) => setError(form, k, v));
        return;
      }
      const btn = $('button[type="submit"][value="submit"]', form);
      busy(btn, true, 'Booking…');
      try {
        await send({ ...data, type: 'class' });
        const summary = form.dataset.summary;
        form.innerHTML = `
          <button class="modal__close" value="cancel" formnovalidate aria-label="Close">${icon('x')}</button>
          <div class="success" role="status">
            <div class="success__icon">${icon('check')}</div>
            <p class="success__tag">Form submitted</p>
            <h3>You're in, ${firstName(data.name)}!</h3>
            <p>Your spot for <strong>${esc(summary)}</strong> is reserved. We'll confirm on WhatsApp. Arrive 10 minutes early.</p>
            <div class="success__actions">
              <a class="btn btn--red btn--sm" href="${waLink(`Hi POWER FITNESS, I booked ${summary}. Name: ${data.name}`)}" target="_blank" rel="noopener"><span>${icon('whatsapp')} Confirm on WhatsApp</span></a>
            </div>
          </div>`;
      } catch (err) {
        Object.entries(err.errors || {}).forEach(([k, v]) => setError(form, k, v));
        status.textContent = err.message;
        status.classList.add('is-error');
        busy(btn, false);
      }
    });
  }

  // ---------- free trial wizard ----------
  const wizard = $('[data-wizard]');
  if (wizard) {
    const days = nextDays(7);
    const params = new URLSearchParams(location.search);
    const panels = $$('[data-step]', wizard);
    const labels = $$('[data-step-label]', wizard);
    let step = 1;

    // Pre-fill from links like /join?plan=yearly or /join?trainer=naveed
    const pre = (name) => params.get(name);
    if (pre('program')) { const r = wizard.querySelector(`input[name="program"][value="${CSS.escape(pre('program'))}"]`); if (r) r.checked = true; }
    if (pre('plan') && wizard.elements.plan) wizard.elements.plan.value = pre('plan');
    if (pre('trainer') && wizard.elements.trainer) wizard.elements.trainer.value = pre('trainer');

    $('[data-dates]', wizard).innerHTML = days.map((d) => `
      <label class="chip-opt">
        <input type="radio" name="date" value="${d.iso}" />
        <span><small>${d.label}</small><strong>${d.dayNum}</strong><small>${d.month}</small></span>
      </label>`).join('');

    const renderTimes = () => {
      const iso = (wizard.querySelector('input[name="date"]:checked') || {}).value;
      const box = $('[data-times]', wizard);
      if (!iso) { box.innerHTML = '<p class="muted small">Pick a date first.</p>'; return; }
      const d = days.find((x) => x.iso === iso);
      const t = timingFor(d.dow);
      if (!t || !t.open) { box.innerHTML = '<p class="muted small">We are closed on this day.</p>'; return; }
      const now = gymNow();
      const slots = [];
      for (let m = toMin(t.open); m <= toMin(t.close) - 60; m += 60) slots.push(m);
      const html = slots.map((m) => {
        const disabled = d.isToday && m < now.minutes + 60;
        return `<label class="chip-opt"><input type="radio" name="time" value="${fromMin(m)}"${disabled ? ' disabled' : ''} /><span>${fmt12(fromMin(m))}</span></label>`;
      }).join('');
      box.innerHTML = html;
      if (!box.querySelector('input:not(:disabled)')) box.innerHTML += '<p class="muted small" style="width:100%">No slots left today. Please pick another day.</p>';
    };
    renderTimes();

    const summarize = () => {
      const prog = wizard.querySelector('input[name="program"]:checked');
      const date = wizard.querySelector('input[name="date"]:checked');
      const time = wizard.querySelector('input[name="time"]:checked');
      const set = (k, v) => { const el = $(`[data-sum="${k}"]`); if (el) el.textContent = v || '—'; };
      set('program', prog && (PF.programs.find((p) => p.id === prog.value) || {}).title);
      set('date', date && prettyDate(date.value));
      set('time', time && fmt12(time.value));
    };
    summarize();
    wizard.addEventListener('change', (e) => {
      if (e.target.name === 'date') renderTimes();
      summarize();
      if (e.target.name) setError(wizard, e.target.name, '');
    });

    const go = (n) => {
      step = n;
      panels.forEach((p) => (p.hidden = +p.dataset.step !== n));
      labels.forEach((l) => {
        const s = +l.dataset.stepLabel;
        l.classList.toggle('is-current', s === n);
        l.classList.toggle('is-done', s < n);
      });
      const top = wizard.getBoundingClientRect().top + window.scrollY - 100;
      if (window.scrollY > top) window.scrollTo({ top, behavior: 'smooth' });
      const first = panels[n - 1].querySelector('input:not([type=hidden]):not(.hp)');
      if (first && n === 3) first.focus({ preventScroll: true });
    };
    const checkStep = (n) => {
      if (n === 1 && !wizard.querySelector('input[name="program"]:checked')) { setError(wizard, 'program', 'Pick the goal closest to yours.'); return false; }
      if (n === 2) {
        if (!wizard.querySelector('input[name="date"]:checked')) { setError(wizard, 'date', 'Pick a date.'); return false; }
        if (!wizard.querySelector('input[name="time"]:checked')) { setError(wizard, 'time', 'Pick a time.'); return false; }
      }
      return true;
    };
    wizard.addEventListener('click', (e) => {
      if (e.target.closest('[data-next]') && checkStep(step)) go(step + 1);
      if (e.target.closest('[data-back]')) go(step - 1);
    });

    wizard.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (step !== 3) { if (checkStep(step)) go(step + 1); return; }
      clearErrors(wizard);
      const status = $('.form-status', wizard);
      status.textContent = '';
      const data = Object.fromEntries(new FormData(wizard));
      const errors = checkContact(data);
      if (Object.keys(errors).length) {
        Object.entries(errors).forEach(([k, v]) => setError(wizard, k, v));
        wizard.elements[Object.keys(errors)[0]].focus();
        return;
      }
      const btn = $('button[type="submit"]', wizard);
      busy(btn, true, 'Booking…');
      try {
        await send({ ...data, type: 'trial' });
        const prog = (PF.programs.find((p) => p.id === data.program) || {}).title || '';
        const when = `${prettyDate(data.date)} at ${fmt12(data.time)}`;
        const start = data.date.replace(/-/g, '') + 'T' + data.time.replace(':', '') + '00';
        const endMin = toMin(data.time) + 60;
        const end = data.date.replace(/-/g, '') + 'T' + fromMin(endMin).replace(':', '') + '00';
        const cal = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent('Free trial at POWER FITNESS')}&dates=${start}/${end}&ctz=${encodeURIComponent(PF.timezone)}&details=${encodeURIComponent('Bring workout clothes, indoor shoes, a towel and water.')}`;
        panels.forEach((p) => (p.hidden = true));
        $('.wizard__steps', wizard).hidden = true;
        const done = $('[data-done]', wizard);
        done.hidden = false;
        done.innerHTML = `
          <div class="success" role="status">
            <div class="success__icon">${icon('check')}</div>
            <p class="success__tag">Form submitted</p>
            <h3>See you soon, ${firstName(data.name)}!</h3>
            <p>Your free trial is booked. We'll call or WhatsApp you on <strong>${esc(data.phone)}</strong> to confirm. No payment now: pay only after your trial if you decide to join.</p>
            <dl>
              <div><dt>Goal</dt><dd>${esc(prog)}</dd></div>
              <div><dt>When</dt><dd>${esc(when)}</dd></div>
            </dl>
            <div class="success__actions">
              <a class="btn btn--red" href="${waLink(`Hi POWER FITNESS, I booked a free trial on ${when}. Name: ${data.name}`)}" target="_blank" rel="noopener"><span>${icon('whatsapp')} Confirm on WhatsApp</span></a>
              <a class="btn btn--outline" href="${cal}" target="_blank" rel="noopener"><span>${icon('calendar')} Add to calendar</span></a>
            </div>
          </div>`;
        done.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } catch (err) {
        Object.entries(err.errors || {}).forEach(([k, v]) => setError(wizard, k, v));
        status.textContent = err.message;
        status.classList.add('is-error');
        busy(btn, false);
      }
    });
  }

  // ---------- motion: smoke trail, card clouds, hero depth, reveals ----------
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;

  // Soft smoke that trails the mouse.
  if (!calm && finePointer) {
    const canvas = document.createElement('canvas');
    canvas.className = 'smoke-trail';
    canvas.setAttribute('aria-hidden', 'true');
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    let W = 0, H = 0;
    const resize = () => { W = innerWidth; H = innerHeight; canvas.width = W * dpr; canvas.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    resize();
    window.addEventListener('resize', resize);
    const puff = (rgb) => {
      const s = document.createElement('canvas'); s.width = s.height = 128;
      const g = s.getContext('2d'); const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
      gr.addColorStop(0, `rgba(${rgb},.5)`); gr.addColorStop(.45, `rgba(${rgb},.18)`); gr.addColorStop(1, `rgba(${rgb},0)`);
      g.fillStyle = gr; g.fillRect(0, 0, 128, 128); return s;
    };
    const grey = puff('205,205,212'), red = puff('225,30,10');
    const parts = [];
    let last = null, raf = 0;
    const tick = () => {
      ctx.clearRect(0, 0, W, H);
      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i];
        p.x += p.vx; p.y += p.vy; p.vx *= .97; p.vy *= .97; p.r += .7; p.life -= p.decay;
        if (p.life <= 0) { parts.splice(i, 1); continue; }
        ctx.globalAlpha = p.life * .32;
        ctx.drawImage(p.img, p.x - p.r, p.y - p.r, p.r * 2, p.r * 2);
      }
      raf = parts.length ? requestAnimationFrame(tick) : 0;
    };
    window.addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse') return;
      const x = e.clientX, y = e.clientY;
      if (last) {
        const dx = x - last.x, dy = y - last.y, n = Math.min(3, Math.floor(Math.hypot(dx, dy) / 16));
        for (let i = 0; i < n; i++) {
          if (parts.length > 60) parts.shift();
          parts.push({
            x: last.x + (dx * i) / n + (Math.random() - .5) * 8, y: last.y + (dy * i) / n + (Math.random() - .5) * 8,
            vx: dx * .012 + (Math.random() - .5) * .4, vy: dy * .012 - .3 - Math.random() * .3,
            r: 12 + Math.random() * 12, life: 1, decay: .011 + Math.random() * .009, img: Math.random() < .2 ? red : grey,
          });
        }
      }
      last = { x, y };
      if (!raf) raf = requestAnimationFrame(tick);
    }, { passive: true });
  }

  // A cloud of smoke that follows the pointer inside cards.
  const hosts = $$('.cat, .review, .program, .plan, .facility, .value, .step, .tool, .contact-card, .perk, .team__card, .hours-card, .summary, .expect, .pay');
  hosts.forEach((el) => {
    el.classList.add('fx-host');
    if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
    const cloud = document.createElement('span');
    cloud.className = 'fx-cloud';
    cloud.setAttribute('aria-hidden', 'true');
    el.appendChild(cloud);
    if (calm) return;
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const mx = e.clientX - r.left, my = e.clientY - r.top;
      el.style.setProperty('--mx', `${mx}px`);
      el.style.setProperty('--my', `${my}px`);
      // the smoke texture drifts against the pointer for a soft, cloudy feel
      el.style.setProperty('--sx', `${50 - (mx / r.width - .5) * 30}%`);
      el.style.setProperty('--sy', `${50 - (my / r.height - .5) * 30}%`);
    });
  });

  // Depth in the home hero: layers shift slightly with the mouse.
  const hero = $('.hero');
  if (hero && !calm && finePointer) {
    let frame = 0;
    hero.addEventListener('pointermove', (e) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        hero.style.setProperty('--px', (e.clientX / innerWidth - .5).toFixed(3));
        hero.style.setProperty('--py', (e.clientY / innerHeight - .5).toFixed(3));
      });
    });
    hero.addEventListener('pointerleave', () => { hero.style.setProperty('--px', 0); hero.style.setProperty('--py', 0); });
  }

  // Sections below the fold fade up softly as they scroll into view.
  if (!calm && 'IntersectionObserver' in window) {
    document.documentElement.classList.add('js-reveal');
    const io = new IntersectionObserver((entries) => entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const el = en.target;
      el.classList.add('is-in');
      io.unobserve(el);
      // hand the element back to its normal (hover) transitions once it has appeared
      setTimeout(() => { el.classList.remove('reveal', 'is-in'); el.style.transitionDelay = ''; }, 1400);
    }), { threshold: .12, rootMargin: '0px 0px -40px 0px' });
    $$('.sec-head, .cat, .review, .program, .plan, .facility, .value, .step, .tool, .contact-card, .coach__copy, .coach__photo, .faq__group, .stat, .built__head, .team__card, .quote-band blockquote, .cta-band__inner, .rating-summary, .slot')
      .filter((el) => el.getBoundingClientRect().top > innerHeight)
      .forEach((el) => {
        const sibs = el.parentElement ? Array.from(el.parentElement.children) : [];
        el.style.transitionDelay = `${Math.min(sibs.indexOf(el), 5) * 70}ms`;
        el.classList.add('reveal');
        io.observe(el);
      });
  }

  // ---------- fitness tools ----------
  const num = (form, name) => parseFloat(form.elements[name].value);
  const toolOut = (form, html) => { $('.tool__out', form).innerHTML = html; };
  const bad = (form, msg) => toolOut(form, `<p style="margin:0;color:#FF6B63">${msg}</p>`);

  const bmiForm = $('[data-tool="bmi"]');
  if (bmiForm) bmiForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const h = num(bmiForm, 'h'), w = num(bmiForm, 'w');
    if (!(h >= 100 && h <= 250) || !(w >= 25 && w <= 300)) return bad(bmiForm, 'Enter height 100–250 cm and weight 25–300 kg.');
    const bmi = w / Math.pow(h / 100, 2);
    const [label, color, tip, link] =
      bmi < 18.5 ? ['Underweight', '#4DA3FF', 'Build healthy weight with our muscle-gain program.', 'weight']
      : bmi < 25 ? ['Healthy', 'var(--ok)', 'Great base. Strength training will make you stronger and fitter.', 'strength']
      : bmi < 30 ? ['Overweight', 'var(--warn)', 'Our weight-loss program is a great place to start.', 'weightloss']
      : ['Obese', 'var(--red)', 'A coach can build a safe, gradual fat-loss plan for you.', 'weightloss'];
    const pos = Math.min(100, Math.max(0, ((bmi - 15) / 25) * 100));
    const lo = (18.5 * Math.pow(h / 100, 2)).toFixed(0), hi = (24.9 * Math.pow(h / 100, 2)).toFixed(0);
    toolOut(bmiForm, `
      <div class="big-num">${bmi.toFixed(1)}<small style="color:${color}">${label}</small></div>
      <div class="bmi-bar"><span style="left:${pos}%"></span></div>
      <div class="bmi-scale"><span>15</span><span>18.5</span><span>25</span><span>30</span><span>40</span></div>
      <p>Healthy weight for your height: <strong>${lo}–${hi} kg</strong>. ${tip} <a href="/join?program=${link}">Book a free trial →</a></p>`);
  });

  const tdeeForm = $('[data-tool="tdee"]');
  if (tdeeForm) tdeeForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const age = num(tdeeForm, 'age'), h = num(tdeeForm, 'h'), w = num(tdeeForm, 'w'), act = num(tdeeForm, 'act');
    const male = tdeeForm.elements.sex.value === 'm';
    if (!(age >= 14 && age <= 90) || !(h >= 100 && h <= 250) || !(w >= 25 && w <= 300)) return bad(tdeeForm, 'Enter age 14–90, height 100–250 cm and weight 25–300 kg.');
    const bmr = 10 * w + 6.25 * h - 5 * age + (male ? 5 : -161);
    const tdee = bmr * act;
    const r = (n) => (Math.round(n / 10) * 10).toLocaleString('en-IN');
    const floor = male ? 1500 : 1200;
    toolOut(tdeeForm, `
      <div class="big-num">${r(tdee)}<small>kcal / day</small></div>
      <div class="out-rows">
        <div><span>Lose fat</span><strong>${r(Math.max(floor, tdee - 500))} kcal</strong></div>
        <div><span>Maintain</span><strong>${r(tdee)} kcal</strong></div>
        <div><span>Gain muscle</span><strong>${r(tdee + 300)} kcal</strong></div>
        <div><span>Protein target</span><strong>${Math.round(w * 1.6)}–${Math.round(w * 2)} g</strong></div>
      </div>
      <p>Estimated with the Mifflin-St Jeor formula. <a href="/programs">Find a program →</a></p>`);
  });

  const ormForm = $('[data-tool="orm"]');
  if (ormForm) ormForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const w = num(ormForm, 'w'), reps = Math.round(num(ormForm, 'r'));
    if (!(w > 0 && w <= 500) || !(reps >= 1 && reps <= 12)) return bad(ormForm, 'Enter a weight up to 500 kg and 1–12 reps.');
    const orm = reps === 1 ? w : w * (1 + reps / 30);
    const rows = [[95, 2], [90, 4], [85, 6], [80, 8], [75, 10], [70, 12]];
    const kg = (n) => (Math.round(n * 2) / 2).toLocaleString('en-IN');
    toolOut(ormForm, `
      <div class="big-num">${kg(orm)}<small>kg max</small></div>
      <div class="out-rows">${rows.map(([p, r]) => `<div><span>${p}% · about ${r} reps</span><strong>${kg((orm * p) / 100)} kg</strong></div>`).join('')}</div>
      <p>Estimated with the Epley formula. Always lift heavy with a spotter.</p>`);
  });
})();
