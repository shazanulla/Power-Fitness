// Staff panel. Standalone page (no public header/footer), not indexed by search engines.
const { icon } = require('../util');

module.exports = {
  key: 'admin',
  path: '/admin',
  file: 'admin.html',
  standalone: true,
  render(site, assets) {
    return `<!doctype html>
<html lang="en-IN">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="robots" content="noindex, nofollow" />
  <title>Staff Panel | POWER FITNESS</title>
  <link rel="icon" href="/favicon.ico" sizes="any" />
  <link rel="stylesheet" href="${assets.css}" />
  <link rel="stylesheet" href="${assets.adminCss}" />
  <script>window.PF = ${JSON.stringify({
    plans: site.plans.map((p) => ({ id: p.id, name: p.name })),
    programs: site.programs.map((p) => ({ id: p.id, title: p.title })),
    trainers: site.trainers.map((t) => ({ id: t.id, name: t.name })),
  }).replace(/</g, '\\u003c')};</script>
  <script src="${assets.adminJs}" defer></script>
</head>
<body class="admin">
  <section class="login" id="loginView" hidden>
    <form class="form-card login__card" id="loginForm">
      <img class="login__logo" src="/images/logo-240.webp" width="235" height="120" alt="POWER FITNESS" />
      <h1 class="card-title">Staff panel</h1>
      <p class="muted">Log in to manage enquiries, free trials and class bookings.</p>
      <div class="field">
        <label for="password">Password</label>
        <input id="password" type="password" autocomplete="current-password" required />
      </div>
      <button class="btn btn--red btn--block" type="submit"><span>Log in</span></button>
      <p class="form-status is-error" id="loginError" role="alert"></p>
      <a class="link-arrow" href="/">${icon('arrow')} Back to website</a>
    </form>
  </section>

  <div id="appView" hidden>
    <header class="admin__bar">
      <div class="container admin__barInner">
        <a href="/" class="logo"><img src="/images/logo-120.webp" srcset="/images/logo-240.webp 2x" width="94" height="48" alt="POWER FITNESS" /></a>
        <div class="admin__actions">
          <a href="/" class="btn btn--outline btn--sm"><span>View website</span></a>
          <button class="btn btn--outline btn--sm" id="logoutBtn"><span>Log out</span></button>
        </div>
      </div>
    </header>
    <main class="container admin__main">
      <div class="admin__head">
        <div>
          <h1 class="sec-title">Enquiries & bookings</h1>
          <p class="muted" id="summary"></p>
        </div>
        <button class="btn btn--red btn--sm" id="exportBtn"><span>Export CSV</span></button>
      </div>
      <div class="kpis" id="kpis"></div>
      <div class="toolbar">
        <input type="search" id="search" placeholder="Search name, phone, email…" aria-label="Search" />
        <select id="typeFilter" aria-label="Filter by type">
          <option value="">All types</option>
          <option value="trial">Free trials</option>
          <option value="class">Class bookings</option>
          <option value="enquiry">Messages</option>
        </select>
        <select id="statusFilter" aria-label="Filter by status">
          <option value="">All statuses</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="joined">Joined</option>
          <option value="not-interested">Not interested</option>
        </select>
        <button class="btn btn--outline btn--sm" id="refreshBtn"><span>Refresh</span></button>
      </div>
      <div class="admin-list" id="list"></div>
    </main>
  </div>

  <div class="confirm" id="confirmBox" hidden>
    <div class="confirm__box" role="alertdialog" aria-labelledby="confirmText">
      <p id="confirmText"></p>
      <div class="confirm__actions">
        <button class="btn btn--outline btn--sm" id="confirmNo"><span>Cancel</span></button>
        <button class="btn btn--red btn--sm" id="confirmYes"><span>Delete</span></button>
      </div>
    </div>
  </div>
  ${require('../sprite')}
</body>
</html>
`;
  },
};
