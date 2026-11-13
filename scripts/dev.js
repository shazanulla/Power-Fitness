// Local development server: builds the site, serves dist/ and runs the /api functions.
//   npm run dev   →  http://localhost:3000
// Rebuilds automatically when you edit data/, src/ or static/.

const path = require('path');
const fs = require('fs');
const express = require('express');
const build = require('./build');

const ROOT = path.join(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const PORT = process.env.PORT || 3000;

build();

const app = express();
app.use(express.json({ limit: '20kb' }));

// Same routes Vercel creates from the api/ folder.
const api = (file) => (req, res) => {
  delete require.cache[require.resolve(file)];
  return require(file)(req, res);
};
app.all('/api/enquiries', api('../api/enquiries'));
app.all('/api/admin/login', api('../api/admin/login'));
app.all('/api/admin/enquiries', api('../api/admin/enquiries'));
app.use('/api', (req, res) => res.status(404).json({ ok: false, message: 'Not found.' }));

// Clean URLs like Vercel: /about → about.html
app.use(express.static(DIST, { extensions: ['html'], index: 'index.html' }));
app.use((req, res) => res.status(404).sendFile(path.join(DIST, '404.html')));

// Watch every folder (not files), so edits that replace a file are still noticed.
let timer;
const onChange = (event, file) => {
  if (file && /enquiries\.json|\.tmp$/.test(file)) return;
  clearTimeout(timer);
  timer = setTimeout(() => {
    try {
      build();
      console.log(`Rebuilt (${file})`);
    } catch (err) {
      console.error('Build failed:', err.message);
    }
  }, 150);
};
function watchTree(dir) {
  fs.watch(dir, onChange);
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) watchTree(path.join(dir, entry.name));
  }
}
['data', 'src', 'static'].forEach((dir) => watchTree(path.join(ROOT, dir)));

app.listen(PORT, () => {
  console.log(`POWER FITNESS running at http://localhost:${PORT}`);
  console.log(`Staff panel: http://localhost:${PORT}/admin  (local password: ${process.env.ADMIN_PASSWORD ? 'from ADMIN_PASSWORD' : 'powerfitness'})`);
});
