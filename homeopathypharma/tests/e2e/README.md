# End-to-end tests (`@homeopathypharma/e2e`)

Playwright-based tests for **critical user journeys** across the storefront, doctor portal, admin console, and API.

## Setup (placeholder)

```bash
# From homeopathypharma/ root
pnpm install
pnpm exec playwright install --with-deps
pnpm test:e2e
```

Add `playwright.config.ts` when first specs are implemented. Target base URLs from `.env.example`:

| App | URL |
|-----|-----|
| Web | `http://localhost:3000` |
| Doctor | `http://localhost:3001` |
| Admin | `http://localhost:3002` |
| API | `http://localhost:4000` |

CI should start docker compose + seed data before e2e (future job).

## Critical flows to cover

Priority order for spec implementation:

### P0 — Revenue & trust

1. **Guest browse → product PDP** — published product renders price from API; out-of-stock state correct
2. **Google / OTP login** — session cookie set; protected route redirects unauthenticated users
3. **Checkout + Razorpay (test mode)** — idempotent checkout; payment verify; order confirmation page
4. **Webhook reconciliation** — simulate signed Razorpay webhook; order reaches `PAID` if verify skipped

### P1 — Operations

5. **Admin product publish** — draft → published; appears on storefront and search
6. **Inventory reservation** — concurrent checkout does not oversell last unit
7. **Shiprocket status sync** — signed webhook advances shipment to `DELIVERED`
8. **Refund flow** — admin partial refund; order status and ledger updated

### P2 — Healthcare

9. **Doctor verification** — submit credentials; admin approve; public profile visible
10. **Consultation booking** — slot lock; payment; confirmation email stub
11. **Review moderation** — verified purchase review; admin approve; rating on PDP

### P3 — Content & SEO

12. **Medical content publish** — content blocked until medical review approved
13. **Robots / noindex** — `/account` and `/checkout` not indexable
14. **Sitemap segment** — published product URL present in products sitemap chunk

## Test data

- Use `pnpm db:seed` fixtures; never production credentials
- Razorpay test keys only; Shiprocket sandbox

## Related

- [../integration/README.md](../integration/README.md)
- [../../docs/WORKFLOWS.md](../../docs/WORKFLOWS.md)
