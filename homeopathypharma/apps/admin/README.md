# @homeopathypharma/admin

WordPress-style CMS + operations command center for HomeopathyPharma — Next.js 15 App Router on port **3002**.

## Development

```bash
pnpm install
pnpm --filter @homeopathypharma/admin dev
# or: pnpm dev:admin
```

Open http://localhost:3002/login

### Credentials

| Variable | Default (dev) | Purpose |
|----------|---------------|---------|
| `ADMIN_PASSWORD` | `admin123` | Admin sign-in password |
| `ADMIN_SESSION_SECRET` | derived / fallback | Signs the HTTP-only session cookie |

Set strong values in production.

## CMS (WordPress-like)

Edits persist under `data/cms/` via `@homeopathypharma/content-store`.

| Screen | Path | CMS file / source |
|--------|------|-------------------|
| Homepage | `/homepage` | `homepage.json` (banners + images, categories, rails) |
| Pages | `/pages` | `pages.json` → storefront `/p/[slug]/` |
| Media | `/media` | `media.json` + uploads to `apps/web/public/images/uploads/` |
| Menus | `/menus` | `menus.json` (header / footer / mobile) |
| Products | `/catalog` | `catalog-snapshot.json` + overrides |
| Brands | `/brands` | brands in catalog snapshot |
| Doctors | `/doctors` | doctors in snapshot + overrides |
| Settings | `/settings` | `settings.json` |

Authenticated CMS APIs live under `/api/cms/*`.

### Publishing to Hostinger

The public site is a **static export**. After CMS changes, rebuild and redeploy the storefront so Hostinger picks up the updated `data/cms` content:

```bash
pnpm --filter @homeopathypharma/web build
# then deploy (e.g. scripts/deploy-hostinger.sh)
```

## Operations shells (still stubbed / queue views)

Doctor verification, content review, product publish, refunds, payouts, inventory, orders, shipments, coupons, SEO, audit logs, users — UI shells remain; CMS content editing above is live against the filesystem store.

## Design

Dark command-center chrome with `@homeopathypharma/ui` AdminShell, amber accent CTAs, Fraunces + Source Serif 4.
