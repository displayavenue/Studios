# DisplayAvenue OS

Multi-tenant agency operating system for DisplayAvenue.

**Subdomain:** `os.displayavenue.com`

See [ARCHITECTURE.md](./ARCHITECTURE.md) for the full phase plan.

## Phase 1 (this commit)

- PostgreSQL + Prisma multi-tenant schema (`Organization` on tenant rows)
- Auth (JWT httpOnly cookie + sessions)
- RBAC permissions
- Audit log helper
- DB-backed job queue skeleton
- Command Center with **real** DB aggregates
- Tenant-scoped leads API (`/api/orgs/:orgId/leads`)

## Setup

```bash
cd os
cp .env.example .env
npm install
npx prisma migrate dev
npm run db:seed
npm run dev -- -p 3001
```

Open http://localhost:3001  
Sign in with `SUPER_ADMIN_EMAIL` / `SUPER_ADMIN_PASSWORD` from `.env`.

## Scripts

- `npm run dev` / `build` / `start`
- `npm run test` / `typecheck` / `lint`
- `npm run db:seed`
