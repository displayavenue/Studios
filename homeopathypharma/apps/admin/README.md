# @homeopathypharma/admin

Admin command center for HomeopathyPharma — Next.js 15 App Router on port **3002**.

## Development

```bash
pnpm install
pnpm dev:admin
```

API stubs in `lib/api.ts` target `API_URL/v1/admin/*`. MFA is noted on the login page; enforcement is via `ADMIN_REQUIRE_MFA` on the API.

## Features (shell)

- Login with MFA step
- Command-center dashboard with queue metrics
- Queues: doctor verification, content review, product publish, review moderation, refunds, payouts
- Catalog, inventory, orders, shipments, coupons
- SEO/sitemaps, audit logs, users/roles
- Role-based sidebar (UI filter; API enforces authorization)

## Design

Dark command-center chrome with `@homeopathypharma/ui` `AdminShell`, amber accent CTAs, Fraunces + Source Serif 4.
