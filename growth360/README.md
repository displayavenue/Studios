# DisplayAvenue Growth360

Production lead-generation platform for DisplayAvenue.

## Stack

- Next.js 15 (App Router) + TypeScript
- PostgreSQL + Prisma
- Server-side OpenAI (`OPENAI_API_KEY` only)
- Razorpay ₹99 strategy-call payments
- PDFKit reports
- Rule engines for score, pricing, ROI, strategy, competitors, 90-day plan

## AI rule

Business numbers (growth score, pricing, fees, ROI, competitor selection) always come from deterministic backend engines. AI only explains and personalizes. If AI fails, rule-based templates keep the experience working.

## Setup

```bash
cd growth360
cp .env.example .env
# set DATABASE_URL, OPENAI_API_KEY, RAZORPAY_*, JWT_SECRET, ADMIN_*
npm install
npx prisma migrate dev
npm run db:seed
npm run dev
```

Open http://localhost:3000

Admin: http://localhost:3000/admin/login  
Default seed admin comes from `ADMIN_EMAIL` / `ADMIN_PASSWORD` in `.env`.

## Scripts

- `npm run dev` – development server
- `npm run build` – production build
- `npm run test` – unit tests
- `npm run lint` – ESLint
- `npm run typecheck` – TypeScript
- `npm run db:seed` – seed industries, competitors, rules, prompts

## Key flows

Landing → assessment (8–10 questions) → contact → analysis → free results → full report/PDF → ₹99 Razorpay → booking
