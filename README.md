# VELORA

**Smart Products. Better Living.**

AI-powered dropshipping ecommerce operating system for **jyotishkundali.com**.

Daily business objectives (not guarantees): ₹1,00,000 revenue · ₹10,000 net contribution.

## Stack

- Next.js 16 (App Router) + TypeScript + Tailwind CSS
- PostgreSQL + Prisma 7
- Supabase Auth ready (local JWT auth when unset)
- Razorpay + Shiprocket abstractions (mock providers in development)
- Meta Pixel / CAPI architecture + Google Merchant feeds
- Vitest

## Requirements

- Node.js 20+
- PostgreSQL 14+

## Setup

```bash
cp .env.example .env
# Set DATABASE_URL and AUTH_SECRET

npm install
npx prisma migrate dev
npm run db:seed
npm run dev
```

Open http://localhost:3000

### Seed accounts

| Role | Email | Password |
|------|-------|----------|
| Super Admin | admin@jyotishkundali.com | VeloraAdmin!234 |
| Customer | customer@example.com | Customer!234 |

~20 demo products are seeded with `demo=true`. They never mix into production metrics logic as live demand.

## Architecture

```
src/
  app/           # Storefront + Admin + API routes
  components/    # UI + store components
  services/      # Business logic (pricing, orders, feeds, AI, profit)
  providers/     # Supplier / payment / shipping adapters
  lib/           # Prisma, auth, RBAC, utils
  config/        # Brand + defaults
prisma/          # Schema + migrations + seed
```

### Supplier layer

Do **not** hard-code one supplier. Use `SupplierProvider`:

- `MockSupplierProvider` — development
- `CsvSupplierProvider` — CSV feeds
- `ApiSupplierProvider` — generic REST
- Plug CJ / Baapstore / Deodap adapters when you have legitimate credentials

### Profit-first engines

- Landed cost → selling price → contribution before ads
- Actual net contribution after shipping, fees, refunds, RTO, ads
- Product quality score 0–100
- Winner detection with minimum sample sizes

## Admin

`/admin` — VELORA Command Center

Includes products, import, discovery, winners, suppliers, orders, marketing, feeds, profit planner, simulator, AI assistant, automation, store health, reports.

## Feeds

- Google Merchant TSV: `/api/feeds/google`
- Meta Catalog CSV: `/api/feeds/meta`
- Sitemap: `/sitemap.xml`

## Integrations

Set credentials in `.env`. When missing, clearly labeled **mock** providers run — they are not live APIs.

| Integration | Env vars |
|-------------|----------|
| Supabase | `NEXT_PUBLIC_SUPABASE_URL`, keys |
| Razorpay | `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, webhook secret |
| Shiprocket | `SHIPROCKET_EMAIL`, `SHIPROCKET_PASSWORD` |
| OpenAI | `OPENAI_API_KEY` |
| Meta | `NEXT_PUBLIC_META_PIXEL_ID`, `META_ACCESS_TOKEN`, catalog/ad account |
| Google | `GOOGLE_MERCHANT_ID`, Ads OAuth vars |
| GA4 / GTM | `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_GTM_ID` |

## 5,000+ catalog

Architecture supports 5,000–50,000+ SKUs via:

- Indexed PostgreSQL queries
- Server-side pagination (24–48 / page)
- Batched import jobs
- Duplicate detection + multi-supplier offers
- Never loading the full catalog into the browser

Import only from connected legitimate sources. Do not fabricate products to hit 5,000.

## Scripts

```bash
npm run dev
npm run build
npm run test
npm run db:seed
npm run lint
```

## Deployment (Vercel + Supabase)

1. Create Supabase Postgres and set `DATABASE_URL`
2. Set all production env vars (disable `USE_MOCK_PROVIDERS`)
3. Deploy to Vercel; attach domain `jyotishkundali.com`
4. Run migrations: `npx prisma migrate deploy`
5. Configure cron for inventory/price sync and daily reports
6. Configure Razorpay + Shiprocket webhooks to `/api/payments/razorpay/webhook`

## Compliance notes

- No fabricated reviews, sales, inventory, GTINs, or testimonials
- Revenue/profit targets are objectives only
- AI content must not invent medical claims or missing specs
- Autopilot must never spend without caps

## API docs

See `docs/api/README.md`.
