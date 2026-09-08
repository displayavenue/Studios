# JyotishKundali

**Know Yourself. Understand Your Path.**

Production-ready astrology / self-discovery SaaS for [jyotishkundali.com](https://jyotishkundali.com).

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- PostgreSQL + Prisma 7
- Razorpay (payments + subscriptions architecture)
- Provider abstractions: Astrology, AI, Storage, Notifications
- Mock providers when credentials are missing (`USE_MOCK_PROVIDERS=true`)

## Quick start

```bash
cp .env.example .env
# set DATABASE_URL, AUTH_SECRET
npm install
npx prisma db push
npm run db:seed
npm run dev
```

Open http://localhost:3000

### Demo accounts (seed)

| Role | Email | Password |
|------|-------|----------|
| Super Admin | admin@jyotishkundali.com | JyotishAdmin!234 |
| Customer | demo@jyotishkundali.com | DemoUser!234 |

## Pricing

- Individual reports: **₹499**
- Complete Self Discovery Membership: **₹2,999 / year**
- Catalogue: **78** seeded report products across 8 categories

## Architecture highlights

- Automatic account creation after successful payment (server-verified Razorpay webhooks)
- Report job queue states: QUEUED → … → COMPLETED / FAILED
- Secure PDF download via signed URLs (storage provider)
- AstrologyProvider / AIProvider interfaces — never invent planetary positions in UI
- Face self-discovery presented as interpretive / entertainment only
- RBAC: CUSTOMER, EXPERT, ADMIN, SUPER_ADMIN

## Hostinger public site

Shared hosting serves a static catalogue mirror:

```bash
bash scripts/deploy-jyotishkundali.sh   # requires SSH_PASS
```

Full dynamic app (checkout, dashboard, admin) deploys to Vercel with production env vars.

## Scripts

| Script | Purpose |
|--------|---------|
| `npm run db:push` | Sync Prisma schema |
| `npm run db:seed` | Seed categories, 78 products, membership, users |
| `npm run build` | Prisma generate + Next build |
| `npm test` | Vitest |
| `scripts/build-jyotishkundali-static.py` | Static Hostinger build |
| `scripts/deploy-jyotishkundali.sh` | Deploy static site to domain |

## Disclaimer

Astrology and face-reading content is interpretive and for personal reflection / entertainment. It is not a guarantee of future events and is not medical, legal, or financial advice.

## Environment

See `.env.example` for DATABASE_URL, Razorpay, Astrology API, AI, object storage, email, WhatsApp, and Google OAuth placeholders.
