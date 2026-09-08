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

## Vercel (Next.js app)

Checkout, dashboard, admin, and APIs deploy to Vercel (Mumbai `bom1`).

### One-time setup

1. Create a Vercel project from this repo (Framework: Next.js).
2. Set environment variables (Production + Preview as needed):
   - `DATABASE_URL` — managed Postgres (Neon/Supabase/etc.)
   - `AUTH_SECRET` — long random string
   - `NEXT_PUBLIC_SITE_URL` — e.g. `https://your-app.vercel.app` or `https://app.jyotishkundali.com`
   - `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` / `NEXT_PUBLIC_RAZORPAY_KEY_ID` — from Razorpay dashboard (or existing Hostinger `api/config.php`)
   - Optional: `RAZORPAY_WEBHOOK_SECRET` for `payment.captured` webhooks
   - Set `USE_MOCK_PROVIDERS=false` once keys are present
3. Optional domain: add `app.jyotishkundali.com` in Vercel → Domains, then CNAME to `cname.vercel-dns.com`.
4. After first deploy, run migrations/seed against the production DB:
   ```bash
   DATABASE_URL='…' npx prisma migrate deploy
   DATABASE_URL='…' npm run db:seed
   ```

### Razorpay checkout

Product pages open **Razorpay Checkout.js** after birth details. Flow:

1. `POST /api/checkout` creates order + Razorpay order  
2. Client opens Checkout.js  
3. `POST /api/payments/razorpay/confirm` verifies payment signature  
4. Report job is queued  

Status: `GET /api/payments/razorpay/status`  
Webhook: `POST /api/payments/razorpay/webhook` (requires `RAZORPAY_WEBHOOK_SECRET`)

### Deploy from CLI

```bash
export VERCEL_TOKEN=…   # https://vercel.com/account/tokens
npm run deploy:vercel           # production
npm run deploy:vercel:preview   # preview URL
```

Health check: `GET /api/health`

## Scripts

| Script | Purpose |
|--------|---------|
| `npm run db:push` | Sync Prisma schema |
| `npm run db:seed` | Seed categories, 78 products, membership, users |
| `npm run build` | Prisma generate + Next build |
| `npm test` | Vitest |
| `npm run deploy:vercel` | Deploy Next.js app to Vercel (prod) |
| `scripts/build-jyotishkundali-static.py` | Static Hostinger build |
| `scripts/deploy-jyotishkundali.sh` | Deploy static site to domain |
| `scripts/deploy-vercel.sh` | Deploy Next.js app to Vercel |

## Disclaimer

Astrology and face-reading content is interpretive and for personal reflection / entertainment. It is not a guarantee of future events and is not medical, legal, or financial advice.

## Environment

See `.env.example` for DATABASE_URL, Razorpay, Astrology API, AI, object storage, email, WhatsApp, and Google OAuth placeholders.
