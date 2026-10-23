import { describe, expect, it } from "vitest";
import { buildAggregateRatingJsonLd } from "./jsonld/index.js";
import { computeSitemapShards, SITEMAP_DEFAULT_SHARD_SIZE } from "./sitemap/index.js";
import { buildCanonicalUrl } from "./canonical.js";

describe("seo helpers", () => {
  it("returns null aggregate rating below verified review threshold", () => {
    expect(buildAggregateRatingJsonLd({ ratingValue: 4.5, reviewCount: 2 })).toBeNull();
  });

  it("computes sitemap shards for large catalogs", () => {
    const shards = computeSitemapShards("products", 100_000);
    expect(shards.length).toBe(Math.ceil(100_000 / SITEMAP_DEFAULT_SHARD_SIZE));
  });

  it("strips tracking params from canonical URLs", () => {
    const url = buildCanonicalUrl({
      baseUrl: "https://homeopathypharma.com",
      path: "/products/arnica?utm_source=google",
    });
    expect(url).toBe("https://homeopathypharma.com/products/arnica");
  });
});
