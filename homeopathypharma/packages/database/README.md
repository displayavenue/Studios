# `@homeopathypharma/database`

PostgreSQL schema via Prisma — the system source of truth for entities used by ecommerce, doctors, content, SEO, shipping, payments, referrals, reviews, and analytics.

## Principles

- Soft deletes (`deletedAt`) for catalog/content where recovery matters
- **No soft deletes** on money ledgers, order status history, payment attempts, consents
- Order line items store immutable snapshots
- Product variant is the sellable SKU truth
- Doctor reviews require a verified appointment relation
- Product reviews track verified purchase flag (enforced in API)
- Content pages and commerce pages stay separate; `entity_content_maps` connects them
- Multi-country / multi-currency / multi-locale ready via fields on users, orders, slugs

## Commands

```bash
pnpm generate
pnpm migrate:dev
pnpm migrate:deploy
pnpm seed
pnpm studio
```

## Seed policy

`prisma/seed.ts` creates RBAC + unpublished taxonomy shells only. It does **not** invent production products, fake doctors, or fake reviews.
