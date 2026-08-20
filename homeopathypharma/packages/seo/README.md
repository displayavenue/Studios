# @homeopathypharma/seo

SEO utilities for HomeopathyPharma.com storefront and content surfaces.

## Content policy (enforced in builders)

- **No thin pages** — do not emit indexable schema for pages with insufficient unique content.
- **No fake reviews in schema** — `AggregateRating` is emitted only when verified purchase reviews exist and meet minimum thresholds.
- **Schema must match visible content** — JSON-LD fields must reflect what users see on the page; no keyword stuffing or hidden markup.

## Assumptions

- Storefront URLs use lowercase slugs with hyphens under `/workspace/homeopathypharma` web app routing conventions.
- Sitemap index supports sharding for 100k+ URLs (50k URLs per segment file, Google limit).
- Canonical URLs strip tracking params and trailing slashes.
