# JyotishKundali

**Know Yourself. Understand Your Path.**

Astrology SaaS platform for personalized Vedic reports, compatibility insights, and self-discovery — built for **jyotishkundali.com**.

## Stack

- Next.js 16 (App Router) + TypeScript + Tailwind CSS
- PostgreSQL + Prisma 7
- Local JWT auth (Supabase Auth ready when configured)
- Razorpay payments (mock providers in development)
- Mock astrology, AI, and storage providers for local dev
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
| Super Admin | admin@jyotishkundali.com | JyotishAdmin!234 |
| Customer | customer@example.com | Customer!234 |

Astrology report products are seeded at ₹499. Membership product at ₹2,999/year.

## Architecture

```
src/
  app/           # Marketing site + Dashboard + Admin + API routes
  components/    # UI + site components
  services/      # Order + report job queue
  providers/     # Astrology / AI / payment / storage adapters
  lib/           # Prisma, auth, RBAC, utils
  config/        # Brand + pricing
prisma/          # Schema + migrations + seed
```

### Provider layer

- `MockAstrologyProvider` — interpretive mock charts (clearly labeled, not real ephemeris)
- `MockAiProvider` — reflective AI responses for development
- `Razorpay` — payment orders + webhook stub
- `MockStorageProvider` — PDF upload placeholder

Set `USE_MOCK_PROVIDERS=true` or `JYOTISH_MODE=development` to force mock mode.

## Customer site

- `/` — Homepage with featured services
- `/services` — Report catalogue (₹499 each)
- `/services/[slug]` — Product page with birth details form
- `/membership` — Annual membership (₹2,999/year)
- `/dashboard` — Customer hub (reports, horoscope, AI)
- `/login` / `/signup` — Authentication

## Admin

`/admin` — Dashboard with KPIs

- Customers, Orders, Products, Reports, Subscriptions, Settings

## Disclaimer

All astrology and face-reading content is for **interpretive and entertainment purposes**. Mock providers never invent real planetary positions as factual data.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run db:seed` | Seed categories, products, admin user |
| `npm run db:studio` | Prisma Studio |

## Environment variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `AUTH_SECRET` | JWT signing secret |
| `RAZORPAY_KEY_ID` | Razorpay key (optional in dev) |
| `RAZORPAY_KEY_SECRET` | Razorpay secret |
| `RAZORPAY_WEBHOOK_SECRET` | Webhook verification |
| `USE_MOCK_PROVIDERS` | Force mock providers |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL |
