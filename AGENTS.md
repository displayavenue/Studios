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

The public apex currently serves the Hostinger static catalogue; point `app.jyotishkundali.com` (or the apex later) at Vercel when enabling live checkout.

## Content rules

- Do not fabricate testimonials, user counts, or planetary positions.
- Face analysis is entertainment / self-reflection only.
- Mock providers must be clearly labeled in development.
