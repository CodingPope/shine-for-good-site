# Shine for Good — website

A plain static site. No build step, no framework, no dependencies. Upload the
folder and it works.

## Quick start (local)

### Option 1: Node (recommended)

```bash
npm install
npm run dev
```

Open `http://localhost:4173`.

### Option 2: Python

```bash
python3 -m http.server 4173
```

Open `http://localhost:4173`.

## Deploying

**Netlify / Vercel / Cloudflare Pages** — drag this folder onto the dashboard.
Nothing to configure. `404.html` is picked up automatically by all three.

**Any normal web host** — upload everything by FTP to the public folder.

**Testing locally** — run `npm run dev` or `python3 -m http.server 4173`.

**Checking routes locally** — run `npm run audit:routes` to verify that all
internal page links and local hash links resolve.

## Files

| File | Page |
|---|---|
| `index.html` | Home |
| `services.html` | Services hub |
| `residential-cleaning.html` | Service page |
| `deep-cleaning.html` | Service page |
| `home-organization.html` | Service page |
| `move-in-move-out.html` | Service page |
| `small-business-cleaning.html` | Service page |
| `pricing.html` | Estimate builder + how pricing works |
| `work.html` | Before/after + gallery |
| `giving-back.html` | The 10% |
| `about.html` | About Chelsea |
| `faq.html` | 10 questions |
| `journal.html` | Blog index |
| `journal-*.html` | Individual posts |
| `contact.html` | Contact |
| `404.html` | Not found |
| `assets/site.css` | All styling |
| `assets/site.js` | All behaviour |
| `sitemap.xml`, `robots.txt` | Search engines |

## Editing without touching code

Add `?edit=1` to any URL, or press `Ctrl + Shift + E`.

Anything with a dotted outline can be clicked and rewritten. The side panel
handles the phone number, email, service areas, photo URLs and all ten pricing
dials. Changes save in that browser and follow you from page to page.

- **Download changes** exports `shine-content.json`, the full set of edits.
- **Download this page** exports the current page with edits baked into the HTML.

## Adding a blog post

Copy any `journal-*.html`, change the content, and add a link from
`journal.html`.

## Before launch

1. Replace any hardcoded `https://shineforgood.com` URLs in HTML metadata,
   canonicals, and schema with your real domain.
2. Add a `social-card.jpg` (1200x630) to the root for link previews.
3. Swap in real photos via the edit panel, or point `data-img` at your files.
4. Fill in the bracketed sections of `journal-where-the-ten-percent-went.html`.
5. Submit `sitemap.xml` in Google Search Console.
