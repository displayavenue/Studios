# SEO strategy

Search engine guidelines for HomeopathyPharma.com. SEO helpers live in `packages/seo` and Next.js routes under `apps/web`.

## Principles

1. **Visible content = structured data.** Schema.org JSON-LD must reflect what users see on the page — no fabricated ratings, prices, or availability.
2. **Quality over volume.** No thin AI-generated pages; every indexable URL must serve genuine user intent.
3. **Segment at scale.** Product and content catalogs target 100k+ URLs — sitemaps and crawl budget must be managed deliberately.
4. **Separate private from public.** Authenticated, checkout, and admin surfaces are never indexed.

## URL strategy

| Surface | Pattern | Indexable |
|---------|---------|-----------|
| Home | `/` | Yes |
| Product PDP | `/products/{slug}` | Yes (published only) |
| Category | `/categories/{slug}` | Yes |
| Health content | `/health/conditions/{slug}`, `/health/organs/{slug}` | Yes (medically reviewed) |
| Pet content | `/pets/{species}`, `/pets/conditions/{slug}` | Yes (if published) |
| Search | `/search?q=` | No (`noindex`) |
| Cart / checkout / account | `/cart`, `/checkout`, `/account/*` | No |
| Admin / doctor | separate origins (3001, 3002) | No |
| Legal | `/legal/{page}` | Yes (low priority) |

**Slug rules:**

- Lowercase, hyphenated, stable after first publish (redirect on slug change).
- One canonical URL per entity — trailing slash policy enforced in `@homeopathypharma/seo`.
- Hreflang reserved for future locales; default `en-IN` until translated content exists.

## Sitemap segmentation (100k+ URLs)

Sitemaps are generated asynchronously (`sitemaps` worker queue) using `SitemapSegment` from the database schema:

| Segment | Example path | Chunk size |
|---------|--------------|------------|
| `PRODUCTS` | `/sitemap-products-{n}.xml` | ≤ 50,000 URLs |
| `CATEGORIES` | `/sitemap-categories.xml` | single file |
| `CONDITIONS` | `/sitemap-conditions-{n}.xml` | ≤ 50,000 |
| `BODY_SYSTEMS` | `/sitemap-body-systems.xml` | single file |
| `ORGANS` | `/sitemap-organs-{n}.xml` | ≤ 50,000 |
| `DOCTORS` | `/sitemap-doctors-{n}.xml` | approved profiles only |
| `CITIES` | `/sitemap-cities-{n}.xml` | location landing pages |
| `PETS` | `/sitemap-pets-{n}.xml` | pet content |
| `ARTICLES` | `/sitemap-articles-{n}.xml` | editorial |
| `STATIC` | `/sitemap-static.xml` | home, about |
| `LEGAL` | `/sitemap-legal.xml` | terms, privacy |

**Index file:** `/sitemap.xml` lists all segment files with `lastmod`.

**Exclusions:** draft, unpublished, soft-deleted, `noindex` pages, and duplicate filter URLs.

Implementation: `packages/seo/src/sitemap/` + `apps/web/app/sitemap.ts`.

## Schema.org policy

| Page type | Allowed types | Rules |
|-----------|---------------|-------|
| Product PDP | `Product`, `Offer`, `BreadcrumbList` | Price/availability from API at render time; match PDP |
| Organization | `Organization`, `WebSite` | Site-wide on layout |
| Article / condition | `MedicalWebPage` or `Article` | Author attribution; `lastReviewed` when medically reviewed |
| Doctor profile | `Physician` | Only verified doctors; no fake credentials |
| FAQ | `FAQPage` | Questions must appear visibly on page |

**Prohibited:**

- AggregateRating unless computed from **approved** reviews on that SKU
- Fake `InStock` when inventory is zero
- Medical claims in schema stronger than visible page copy

Helpers: `packages/seo/src/jsonld/`.

## Robots and private pages

`apps/web/app/robots.ts` and per-page metadata:

```
User-agent: *
Disallow: /cart
Disallow: /checkout
Disallow: /account
Disallow: /api
Disallow: /search
```

Authenticated layouts set:

```html
<meta name="robots" content="noindex, nofollow" />
```

Doctor and admin apps on separate ports/origins should ship their own `robots.txt` blocking all crawlers.

## Google Merchant Center consistency

When `FEATURE_MERCHANT_CENTER_EXPORT=true`:

- Product feed generated from same PostgreSQL source as PDP (title, description, price, availability, image URL, GTIN/MPN when present).
- Feed refresh on publish/inventory change via `feeds` worker queue.
- Disapproved items in Merchant Center must be reconciled in admin — do not hand-edit feed-only fields.

## Content quality

- **No thin AI pages** — content requires editorial workflow and medical review where health information is presented.
- **E-E-A-T signals** — author bios, reviewer credentials, publish and review dates on health content.
- **Internal linking** — content pages link to relevant products; products link to educational content, not duplicate copy.
- **Performance** — Core Web Vitals targets via Next.js image optimization and edge caching (production).

## Monitoring

- Google Search Console — coverage, enhancements, manual actions.
- Log crawl errors on 404/410 for removed products (return 410 with short cache for discontinued SKUs).
- Alert on sitemap generation failures (worker dead-letter).

## Related documents

- [ARCHITECTURE.md](./ARCHITECTURE.md)
- [COMPLIANCE.md](./COMPLIANCE.md)
- [packages/seo/README.md](../packages/seo/README.md)
