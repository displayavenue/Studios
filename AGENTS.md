<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Project

**JyotishKundali** astrology / self-discovery SaaS (not VELORA ecommerce).

## Deployment (jyotishkundali.com)

After public-site or static-site changes, **always deploy yourself** — do not ask the user to deploy.

### Hostinger (static catalogue)

1. Build and deploy the static Hostinger catalogue:
   ```bash
   bash scripts/deploy-jyotishkundali.sh
   ```
   Requires `SSH_PASS`. Builds via `scripts/build-jyotishkundali-static.py` and uploads to `domains/jyotishkundali.com/public_html`.
2. Verify live:
   ```bash
   curl -sL https://jyotishkundali.com/ | grep JyotishKundali
   curl -sL https://jyotishkundali.com/ | grep -c VELORA   # must be 0
   ```
3. Capture mobile screenshots of the live domain when validating layout changes.

### Vercel (Next.js app — checkout, dashboard, admin)

```bash
export VERCEL_TOKEN=…   # https://vercel.com/account/tokens
bash scripts/deploy-vercel.sh          # production
# or: bash scripts/deploy-vercel.sh preview
```

Set production env in the Vercel project: `DATABASE_URL`, `AUTH_SECRET`, `NEXT_PUBLIC_SITE_URL`, plus payment/provider keys when leaving mock mode. Region is `bom1` (Mumbai) via `vercel.json`. Health check: `/api/health`.

### Domain cutover (static catalogue ↔ app)

- **Apex today:** Hostinger static catalogue at `https://jyotishkundali.com` (browse/SEO).
- **App today:** Vercel at `https://jyotishkundali.vercel.app` (checkout, dashboard, PDF APIs).
- Static “Get My Report” / login CTAs should deep-link to the Vercel app product or login URLs until DNS cutover.
- When ready for live checkout on the brand domain: create `app.jyotishkundali.com` (CNAME → Vercel) or move the apex to Vercel and keep a static marketing mirror if desired.
- Keep `NEXT_PUBLIC_SITE_URL` aligned with the public app origin used in emails and PDF download links.
- Storage: default filesystem via `/api/storage/pdf`; set `STORAGE_PROVIDER=s3` (+ bucket keys) for production object storage. Email: set `RESEND_API_KEY` + `EMAIL_FROM` for real receipts.

## Content rules

- Do not fabricate testimonials, user counts, or planetary positions.
- Face analysis is entertainment / self-reflection only.
- Mock providers must be clearly labeled in development.
