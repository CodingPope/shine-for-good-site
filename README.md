# Shine for Good — website

Marketing site and CMS for Shine for Good, a house cleaning business in St.
Petersburg & Tampa Bay. Next.js 15 (App Router) with Payload CMS 3, backed by
Postgres. Content — journal posts, before/after photos, the work gallery — is
managed through the Payload admin panel, not hardcoded in the repo.

## Stack

- **Next.js 15** (App Router, React 19) — `src/app/(frontend)` for the public
  site, `src/app/(payload)` for the admin panel and REST API.
- **Payload CMS 3** — `src/collections/` defines the content model
  (`journal-posts`, `before-after`, `work-gallery`, `media`, `users`).
  Config lives in `src/payload.config.ts`.
- **Postgres** via `@payloadcms/db-postgres`.
- **Vercel Blob** for media uploads in production (`BLOB_READ_WRITE_TOKEN`).
- Styling is a single hand-written stylesheet at `public/assets/site.css`,
  imported globally — there's no CSS framework or CSS-in-JS.

## Quick start (local)

```bash
npm install
cp .env.example .env.local   # fill in DATABASE_URL, PAYLOAD_SECRET, etc.
npm run dev
```

Open `http://localhost:3000` for the site, `http://localhost:3000/admin` for
the CMS (first run prompts you to create an admin user).

### Environment variables

See `.env.example`. At minimum you need `DATABASE_URL` (a Postgres instance —
Neon or Vercel Postgres both work) and `PAYLOAD_SECRET` (`openssl rand -hex
32`). `BLOB_READ_WRITE_TOKEN` is only required for media uploads to persist in
production. On Vercel, media writes are rejected if it is missing, since local
disk storage doesn't survive a deployment. Local development can still use disk
storage without a Blob token.

### Media storage and uploads

Connect a **public Vercel Blob store** to the production project and expose its
`BLOB_READ_WRITE_TOKEN` to the Production environment before redeploying. Keep
the same store connected across deployments: database records contain filenames,
not a backup of the image bytes.

The CMS uploads files directly from the browser to Blob to avoid the serverless
request-body limit. Public media URLs point to the Blob CDN. The work page uses
Next.js image optimization for appropriately sized images, including its
before/after sliders; stored originals are not compressed by this configuration.

If an existing image returns 404, check that its filename exists in the connected
Blob store. Reconnect the original store if the project is pointing at a different
one. If the original file is unavailable, replace the file on the existing Media
record in the CMS so its before/after and gallery relationships remain intact.
Changing image optimization settings cannot recover missing files.

The November 2026 recovery script, `node scripts/restore-work-media.mjs`, checks
the 15 originals in the disconnected `chelsea-storage` store against the active
store. Add `--restore` in an environment with the active store's
`BLOB_READ_WRITE_TOKEN` to copy missing files. It checks sizes and SHA-256 hashes,
refuses to overwrite different files, and leaves the source store intact.

## Scripts

| Command | Does |
|---|---|
| `npm run dev` | Start the Next.js dev server |
| `npm run build` | Run pending Payload migrations, then build for production |
| `npm start` | Start the production server (after `build`) |
| `npm run db:migrate` | Run Payload/Drizzle migrations manually |
| `npm run generate:types` | Regenerate `src/payload-types.ts` from the collection config |

## Content model

- **Journal posts** (`journal-posts`) — blog content, rendered at
  `/journal/[slug]`. Supports Payload's versioning/drafts and Live Preview
  (open a post in `/admin` and use the Live Preview tab to see edits
  side-by-side before publishing).
- **Before & after** (`before-after`) — photo pairs rendered as draggable
  comparison sliders on `/work`.
- **Work gallery** (`work-gallery`) — single photos in the gallery grid on
  `/work`.
- **Media** (`media`) — the upload collection backing all of the above.

## Routes worth knowing

- `src/app/sitemap.ts` / `src/app/robots.ts` — generated dynamically (the
  sitemap pulls in published journal posts automatically), not static files.
- `src/app/(frontend)/next/preview` / `.../next/exit-preview` — draft-mode
  routes that power Payload Live Preview.
