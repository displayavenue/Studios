<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Deployment (jyotishkundali.com)

After storefront or static-site changes, **always deploy yourself** — do not ask the user to deploy.

1. Ensure PostgreSQL is running and products are seeded (`npm run db:seed` if needed).
2. Build and deploy the static Hostinger storefront:
   ```bash
   bash scripts/deploy-jyotishkundali.sh
   ```
   Requires `SSH_PASS` in the environment (injected in Cloud Agent). The script builds via `scripts/build-static-storefront.py` and uploads to `domains/jyotishkundali.com/public_html`.
3. Verify live: `curl -sL https://jyotishkundali.com/ | grep VELORA` and spot-check a product page for `buybox` / `pdp-mobile-image`.
4. Capture mobile screenshots of the live domain when validating layout changes.

The Next.js app (admin, checkout API, etc.) runs separately on Vercel; the public domain serves the static storefront from Hostinger.
