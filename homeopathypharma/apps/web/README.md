# @homeopathypharma/web

Customer storefront for HomeopathyPharma — Next.js 15 App Router on port **3000**.

## Development

```bash
# From monorepo root
pnpm install
pnpm dev:web
```

Set `API_URL` or `NEXT_PUBLIC_API_URL` (defaults to `http://localhost:4000`). Typed stubs in `lib/api.ts` call `API_URL/v1/*`.

## Design

- **Brand palette:** deep forest teal, soft sage, warm ivory gradients
- **Fonts:** Fraunces (display), Source Serif 4 (body) via `next/font`
- **Accessibility:** skip link, focus rings, reduced motion, semantic landmarks

## Key routes

| Route | Purpose |
|-------|---------|
| `/` | Landing hero (single composition) |
| `/search` | Catalog search |
| `/products/[slug]` | Product detail shell |
| `/health/*` | Knowledge hub |
| `/doctors/*` | Practitioner directory |
| `/legal/*` | Trust & legal placeholders |

## SEO

- `app/robots.ts` — uses `@homeopathypharma/seo` rules + API manifest stub
- `app/sitemap.ts` — static URLs + product segment from API stub
