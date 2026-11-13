// Builds the static website into dist/.
//   npm run build
// Pages come from src/pages/*.js, content from data/site.json, assets from static/.

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.join(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const STATIC = path.join(ROOT, 'static');

function build() {
  // Fresh require each time so the dev server picks up edits.
  for (const k of Object.keys(require.cache)) {
    if (k.startsWith(path.join(ROOT, 'src')) || k.startsWith(path.join(ROOT, 'data'))) delete require.cache[k];
  }
  const site = require('../data/site.json');
  const { shell } = require('../src/layout');
  const pages = ['home', 'about', 'programs', 'classes', 'trainers', 'membership', 'reviews', 'contact', 'join', 'tools', 'faq', 'notfound', 'admin']
    .map((name) => require(`../src/pages/${name}`));

  fs.rmSync(DIST, { recursive: true, force: true });
  fs.cpSync(STATIC, DIST, { recursive: true });

  // Cache-busting: add a content hash to CSS/JS URLs.
  const v = (rel) => `/${rel}?v=${crypto.createHash('md5').update(fs.readFileSync(path.join(STATIC, rel))).digest('hex').slice(0, 8)}`;
  const assets = { css: v('css/main.css'), js: v('js/app.js'), adminCss: v('css/admin.css'), adminJs: v('js/admin.js') };

  const siteUrl = (process.env.SITE_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : '')).replace(/\/$/, '');

  for (const page of pages) {
    const html = page.standalone ? page.render(site, assets) : shell({ site, page, body: page.render(site), assets, siteUrl });
    fs.writeFileSync(path.join(DIST, page.file), html);
  }

  fs.writeFileSync(path.join(DIST, 'site.webmanifest'), JSON.stringify({
    name: 'POWER FITNESS',
    short_name: 'POWER FITNESS',
    start_url: '/',
    display: 'standalone',
    background_color: '#2A2A2A',
    theme_color: '#2A2A2A',
    icons: [
      { src: '/images/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/images/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  }, null, 2));

  const publicPages = pages.filter((p) => !p.standalone && p.key !== '404');
  fs.writeFileSync(path.join(DIST, 'robots.txt'), `User-agent: *\nDisallow: /admin\nDisallow: /api/\n${siteUrl ? `Sitemap: ${siteUrl}/sitemap.xml\n` : ''}`);
  if (siteUrl) {
    fs.writeFileSync(path.join(DIST, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${publicPages.map((p) => `  <url><loc>${siteUrl}${p.path === '/' ? '/' : p.path}</loc></url>`).join('\n')}
</urlset>
`);
  }

  return pages.length;
}

module.exports = build;

if (require.main === module) {
  const n = build();
  console.log(`Built ${n} pages into dist/`);
}
