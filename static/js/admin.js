// POWER FITNESS: staff panel script.
(function () {
  'use strict';

  const PF = window.PF || {};
  const $ = (s) => document.querySelector(s);
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const icon = (n) => `<svg class="ico" aria-hidden="true"><use href="#i-${n}"/></svg>`;
  const TOKEN_KEY = 'pf-admin-token';
  const STATUS = { new: 'New', contacted: 'Contacted', joined: 'Joined', 'not-interested': 'Not interested' };
  const TYPE = { trial: 'Free trial', class: 'Class booking', enquiry: 'Message' };

  const nameOf = (list, id, key = 'name') => ((PF[list] || []).find((x) => x.id === id) || {})[key] || '';
  const fmt12 = (hhmm) => { const [h, m] = hhmm.split(':').map(Number); return `${((h + 11) % 12) + 1}:${String(m).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`; };
  const prettyDate = (iso) => new Date(iso + 'T00:00:00Z').toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' });

  let token = null;
  try { token = sessionStorage.getItem(TOKEN_KEY); } catch {}
  let items = [];

  async function api(url, opts = {}) {
    const res = await fetch(url, { ...opts, headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token } });
    const json = await res.json().catch(() => ({}));
    if (res.status === 401) { logout(); throw new Error('Session expired. Please log in again.'); }
    if (!res.ok) throw new Error(json.message || 'Request failed.');
    return json;
  }

  const show = (v) => { $('#loginView').hidden = v !== 'login'; $('#appView').hidden = v !== 'app'; };
  function logout() {
    token = null;
    try { sessionStorage.removeItem(TOKEN_KEY); } catch {}
    show('login');
    $('#password').value = '';
  }

  // In-page confirmation (no browser pop-ups).
  function confirmBox(text) {
    return new Promise((resolve) => {
      const box = $('#confirmBox');
      $('#confirmText').textContent = text;
      box.hidden = false;
      $('#confirmYes').focus();
      const done = (v) => { box.hidden = true; $('#confirmYes').onclick = $('#confirmNo').onclick = null; resolve(v); };
      $('#confirmYes').onclick = () => done(true);
      $('#confirmNo').onclick = () => done(false);
    });
  }

  $('#loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    $('#loginError').textContent = '';
    const btn = e.target.querySelector('button');
    btn.disabled = true;
    try {
      const res = await fetch('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: $('#password').value }) });
      const json = await res.json().catch(() => ({}));
      if (!json.ok) throw new Error(json.message || 'Login failed.');
      token = json.token;
      try { sessionStorage.setItem(TOKEN_KEY, token); } catch {}
      start();
    } catch (err) {
      $('#loginError').textContent = err.message;
    } finally {
      btn.disabled = false;
    }
  });
  $('#logoutBtn').addEventListener('click', logout);
  $('#refreshBtn').addEventListener('click', load);
  ['#search', '#statusFilter', '#typeFilter'].forEach((s) => $(s).addEventListener('input', render));

  function start() { show('app'); load(); }

  async function load() {
    try {
      items = (await api('/api/admin/enquiries')).enquiries;
      render();
    } catch (err) {
      if (token) $('#list').innerHTML = `<div class="empty">${esc(err.message)}</div>`;
    }
  }

  function filtered() {
    const q = $('#search').value.trim().toLowerCase();
    const st = $('#statusFilter').value;
    const ty = $('#typeFilter').value;
    return items.filter((e) => (!st || e.status === st) && (!ty || (e.type || 'enquiry') === ty) &&
      (!q || [e.name, e.phone, e.email, e.message, e.notes, e.className].some((v) => (v || '').toLowerCase().includes(q))));
  }

  function when(e) {
    if (e.type === 'trial' && e.date) return `${icon('calendar')} Trial: ${prettyDate(e.date)}${e.time ? ', ' + fmt12(e.time) : ''}`;
    if (e.type === 'class' && e.date) return `${icon('calendar')} ${esc(e.className || 'Class')}: ${prettyDate(e.date)}${e.time ? ', ' + fmt12(e.time) : ''}`;
    return '';
  }

  function render() {
    const today = new Date().toISOString().slice(0, 10);
    const count = (fn) => items.filter(fn).length;
    $('#kpis').innerHTML = [
      [count((e) => e.status === 'new'), 'New: to call'],
      [count((e) => e.type === 'trial' && e.date >= today), 'Upcoming trials'],
      [count((e) => e.type === 'class' && e.date >= today), 'Upcoming class bookings'],
      [count((e) => e.status === 'joined'), 'Joined'],
    ].map(([v, l]) => `<div class="kpi"><strong>${v}</strong><span>${l}</span></div>`).join('');

    const list = filtered();
    $('#summary').textContent = `Showing ${list.length} of ${items.length}`;
    if (!list.length) {
      $('#list').innerHTML = `<div class="empty">${items.length ? 'Nothing matches your filters.' : 'No enquiries yet. Free-trial bookings, class bookings and messages from the website will appear here.'}</div>`;
      return;
    }
    $('#list').innerHTML = list.map((e) => {
      const type = e.type || 'enquiry';
      const tel = (e.phone || '').replace(/[^\d+]/g, '');
      const wa = tel.replace(/\D/g, '').replace(/^(\d{10})$/, '91$1');
      const pills = [
        e.program && nameOf('programs', e.program, 'title'),
        e.plan && `Plan: ${nameOf('plans', e.plan)}`,
        e.trainer && type !== 'class' && `Prefers ${nameOf('trainers', e.trainer)}`,
        e.age && `Age ${e.age}`,
        e.gender,
      ].filter(Boolean).map((p) => `<span class="pill">${esc(p)}</span>`).join('');
      const created = new Date(e.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
      return `
      <article class="enq" data-id="${esc(e.id)}" data-status="${esc(e.status)}">
        <div>
          <div class="enq__name">${esc(e.name)}</div>
          <div class="enq__contact">
            <a href="tel:${esc(tel)}">${icon('phone')} ${esc(e.phone)}</a>
            ${e.email ? `<a href="mailto:${esc(e.email)}">${icon('mail')} ${esc(e.email)}</a>` : ''}
            <a href="https://wa.me/${esc(wa)}" target="_blank" rel="noopener">${icon('whatsapp')} WhatsApp</a>
          </div>
        </div>
        <div class="enq__info">
          <div><span class="type type--${esc(type)}">${TYPE[type] || 'Message'}</span></div>
          ${when(e) ? `<div class="enq__when">${when(e)}</div>` : ''}
          ${pills ? `<div class="pills">${pills}</div>` : ''}
        </div>
        <div class="enq__side">
          <select data-action="status" data-status="${esc(e.status)}" aria-label="Status">
            ${Object.entries(STATUS).map(([v, l]) => `<option value="${v}"${v === e.status ? ' selected' : ''}>${l}</option>`).join('')}
          </select>
          <span class="enq__date">Received ${esc(created)}</span>
          <button class="link-btn" data-action="delete">Delete</button>
        </div>
        ${e.message ? `<p class="enq__msg">${esc(e.message)}</p>` : ''}
        <div class="enq__notes">
          <input data-action="notes" value="${esc(e.notes || '')}" placeholder="Staff notes (e.g. called, trial confirmed)" aria-label="Staff notes" />
        </div>
      </article>`;
    }).join('');
  }

  const itemFor = (el) => { const c = el.closest('.enq'); return c && items.find((x) => x.id === c.dataset.id); };

  $('#list').addEventListener('change', async (ev) => {
    const item = itemFor(ev.target);
    const action = ev.target.dataset.action;
    if (!item || !action) return;
    try {
      const body = action === 'status' ? { status: ev.target.value } : { notes: ev.target.value };
      const { enquiry } = await api(`/api/admin/enquiries?id=${encodeURIComponent(item.id)}`, { method: 'PATCH', body: JSON.stringify(body) });
      Object.assign(item, enquiry);
      if (action === 'status') render();
      else { ev.target.classList.add('is-saved'); setTimeout(() => ev.target.classList.remove('is-saved'), 1200); }
    } catch (err) {
      $('#summary').textContent = err.message;
    }
  });

  $('#list').addEventListener('click', async (ev) => {
    if (ev.target.dataset.action !== 'delete') return;
    const item = itemFor(ev.target);
    if (!item || !(await confirmBox(`Delete the entry from ${item.name}? This cannot be undone.`))) return;
    try {
      await api(`/api/admin/enquiries?id=${encodeURIComponent(item.id)}`, { method: 'DELETE' });
      items = items.filter((x) => x.id !== item.id);
      render();
    } catch (err) {
      $('#summary').textContent = err.message;
    }
  });

  $('#exportBtn').addEventListener('click', () => {
    const cols = ['createdAt', 'type', 'name', 'phone', 'email', 'date', 'time', 'className', 'program', 'plan', 'trainer', 'age', 'gender', 'message', 'status', 'notes'];
    const val = (e, c) => c === 'plan' ? nameOf('plans', e.plan) : c === 'program' ? nameOf('programs', e.program, 'title') : c === 'trainer' ? nameOf('trainers', e.trainer) : e[c];
    const cell = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const csv = '﻿' + [cols.join(','), ...filtered().map((e) => cols.map((c) => cell(val(e, c))).join(','))].join('\r\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    a.download = `power-fitness-enquiries-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  });

  if (token) start(); else show('login');
})();
