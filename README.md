# POWER FITNESS: Gym Website

**Jitna Raghda, Uthna Taghda.**

A multi-page website for POWER FITNESS, with online free-trial booking, class booking, fitness calculators and a staff panel. Built to deploy on **Vercel**.

## Pages

| URL | Page |
| --- | --- |
| `/` | Home |
| `/about` | About us & facilities |
| `/programs` | Workout programs (filterable) |
| `/classes` | Class schedule with online booking + weekly timetable |
| `/trainers` | Coach profiles |
| `/membership` | Plans, fees, comparison table, how to join |
| `/reviews` | Member reviews with rating summary |
| `/contact` | Address, phone, WhatsApp, timings (open-now status), map, message form |
| `/join` | 3-step free trial booking (goal → date & time → details) |
| `/tools` | BMI, daily calorie and one-rep max calculators |
| `/faq` | Frequently asked questions |
| `/admin` | Staff panel (password protected) |

## Run on your computer

Requires Node.js 18 or newer.

```bash
npm install
npm run dev
```

Open http://localhost:3000. Staff panel: http://localhost:3000/admin, local password `powerfitness`.

The site rebuilds automatically when you edit files. Locally, bookings are saved to `data/enquiries.json`.

## Edit the content

Almost everything is in **`data/site.json`**: punchline, about text, stats, trainers, facilities, programs, class timetable, plans and prices, comparison table, reviews, FAQs, timings, address, phone, WhatsApp number and social links.

- **Coach photos**: put a 3:4 portrait (900×1200) in `static/images/team/` and set `photo` / `photoSmall` in `site.json`. `focus` controls which part of the photo stays visible when cropped (for example `"50% 20%"` keeps the face in view). `teamOrder` sets the left-to-right order on the home page (founder in the middle).
- **Reviews**: the reviews are **samples**. Replace them with real member reviews and set `"testimonialsAreSamples": false` to remove the "sample reviews" note. Don't publish invented reviews; it misleads customers and breaks consumer-protection rules.
- **Graphics**: the smoke, red fluid, concrete texture and paint strokes are in `static/images/fx/`. They are original images made for this site, so you can use them freely.
- **Colours and fonts**: the variables at the top of `static/css/main.css` (`--charcoal`, `--silver`, `--red`).
- **Logo**: `static/images/logo-120.webp` and `logo-240.webp` (transparent background).

## Deploy to Vercel

1. Push this folder to a GitHub repository.
2. In Vercel, click **Add New → Project** and import the repository. The settings come from `vercel.json` (build command `npm run build`, output folder `dist`); leave the framework set to **Other**.
3. Under **Settings → Environment Variables**, add:
   - `ADMIN_PASSWORD`: the staff panel password (required; the local default does not work on Vercel)
   - `SITE_URL` (optional): your domain, e.g. `https://powerfitness.in`, used for the sitemap and share links
4. Under **Storage**, add **Upstash Redis** (free tier is enough) and connect it to the project. Vercel adds the database keys automatically. Bookings and enquiries are stored here.
5. Redeploy. Add your own domain under **Settings → Domains**.

Until storage is connected, the forms show "Online booking is not available right now. Please call or WhatsApp us." instead of losing the visitor's details.

## Project structure

```
api/                 Serverless functions (Vercel turns each file into an endpoint)
  enquiries.js         POST: free trial, class booking and contact form
  admin/login.js       POST: staff login
  admin/enquiries.js   GET / PATCH / DELETE: staff panel
lib/                 Storage (Upstash Redis or local file), login tokens, validation
data/site.json       All website content (edit this)
src/                 Page templates (one file per page in src/pages/)
static/              CSS, JavaScript, fonts and images
scripts/build.js     Builds the pages into dist/
scripts/dev.js       Local development server
vercel.json          Vercel settings (clean URLs, caching, security headers)
```
