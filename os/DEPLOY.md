# Deploy DisplayAvenue OS to Vercel + Neon

Target domain: `os.displayavenue.com`

## 1. Neon

1. Create a project (region: close to India if possible, e.g. Singapore/Sydney).
2. Copy **both** connection strings:
   - **Pooled** (has `-pooler` in host) → `DATABASE_URL`
   - **Direct** (no pooler) → `DIRECT_URL`
3. Append to both if missing: `?sslmode=require`
4. For pooled URL, also add: `&pgbouncer=true` (Prisma)

Example:

```
DATABASE_URL="postgresql://USER:PASS@ep-xxxx-pooler.region.aws.neon.tech/neondb?sslmode=require&pgbouncer=true"
DIRECT_URL="postgresql://USER:PASS@ep-xxxx.region.aws.neon.tech/neondb?sslmode=require"
```

## 2. Vercel project

1. Import GitHub repo `displayavenue/Studios` (or `studios`).
2. **Root Directory:** `os`
3. Framework: Next.js (auto)
4. Add environment variables (Production + Preview):

| Name | Required | Notes |
|------|----------|--------|
| `DATABASE_URL` | yes | Neon **pooled** |
| `DIRECT_URL` | yes | Neon **direct** (migrations) |
| `JWT_SECRET` | yes | long random string |
| `ENCRYPTION_KEY` | yes | 32+ char secret |
| `APP_URL` | yes | `https://os.displayavenue.com` |
| `NEXT_PUBLIC_APP_URL` | yes | same |
| `NEXT_PUBLIC_APP_HOST` | yes | `os.displayavenue.com` |
| `SUPER_ADMIN_EMAIL` | yes | your login email |
| `SUPER_ADMIN_PASSWORD` | yes | strong password |
| `SUPER_ADMIN_NAME` | no | defaults OK |
| `SEED_ON_BUILD` | first deploy only | set `true` once to seed admin + Growth360 catalog, then remove |
| `AI_ENABLED` | no | `true` |
| `AI_MODEL` | no | `gpt-4o-mini` |
| `OPENAI_API_KEY` | no | needed for AI narratives |
| `RAZORPAY_KEY_ID` | no | payments |
| `RAZORPAY_KEY_SECRET` | no | payments |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | no | payments |
| `BOOKING_FEE_INR` | no | `99` |
| `GST_PERCENT` | no | `18` |

5. Deploy (build runs `prisma migrate deploy`; optional seed when `SEED_ON_BUILD=true`).

## 3. Seed admin + catalog (if you skipped SEED_ON_BUILD)

From your laptop:

```bash
cd os
export DATABASE_URL="...pooled..."
export DIRECT_URL="...direct..."
export SUPER_ADMIN_EMAIL="you@displayavenue.com"
export SUPER_ADMIN_PASSWORD="your-strong-password"
npx prisma migrate deploy
SEED_GROWTH360_CATALOG=true npx tsx prisma/seed.ts
```

Or use Vercel CLI:

```bash
cd os
npx vercel env pull .env.local
SEED_GROWTH360_CATALOG=true npx tsx prisma/seed.ts
```

## 4. Custom domain

1. Vercel → Project → **Domains** → add `os.displayavenue.com`
2. Hostinger DNS for `displayavenue.com`:
   - Type: **CNAME**
   - Name: `os`
   - Value: `cname.vercel-dns.com` (or the value Vercel shows)
3. Wait for SSL (usually a few minutes)

## 5. Smoke test

- https://os.displayavenue.com/
- https://os.displayavenue.com/login
- https://os.displayavenue.com/growth360
- https://os.displayavenue.com/app

## Notes

- Hostinger shared hosting stays for `displayavenue.com` marketing site only.
- PDFs write to `/tmp` on Vercel (ephemeral). For long-term storage later, use S3/R2.
- Free Vercel hobby is fine to start; watch serverless limits.
- If a Neon password was shared in chat, rotate it in Neon and update Vercel env vars.
