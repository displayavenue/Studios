/** Google sitemap protocol — max 50,000 URLs per file. */
export const SITEMAP_MAX_URLS_PER_FILE = 50_000;

/** Recommended shard size for 100k+ URL catalogs. */
export const SITEMAP_DEFAULT_SHARD_SIZE = 45_000;

export type SitemapChangeFrequency =
  | "always"
  | "hourly"
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly"
  | "never";

export interface SitemapUrlEntry {
  loc: string;
  lastmod?: string;
  changefreq?: SitemapChangeFrequency;
  priority?: number;
}

export type SitemapSegment =
  | "products"
  | "categories"
  | "conditions"
  | "body-systems"
  | "organs"
  | "doctors"
  | "pets"
  | "articles"
  | "static";

export interface SitemapShardMeta {
  segment: SitemapSegment;
  shardIndex: number;
  urlCount: number;
  filename: string;
}

export interface SitemapIndexEntry {
  loc: string;
  lastmod?: string;
}

/**
 * Compute shard metadata for a segment given total URL count.
 */
export function computeSitemapShards(
  segment: SitemapSegment,
  totalUrls: number,
  shardSize = SITEMAP_DEFAULT_SHARD_SIZE,
): SitemapShardMeta[] {
  if (totalUrls <= 0) return [];
  const shardCount = Math.ceil(totalUrls / shardSize);
  return Array.from({ length: shardCount }, (_, i) => ({
    segment,
    shardIndex: i,
    urlCount: Math.min(shardSize, totalUrls - i * shardSize),
    filename: `sitemap-${segment}-${i + 1}.xml`,
  }));
}

export function sitemapShardFilename(segment: SitemapSegment, shardIndex: number): string {
  return `sitemap-${segment}-${shardIndex + 1}.xml`;
}

export function buildSitemapIndexEntries(
  baseUrl: string,
  shards: SitemapShardMeta[],
  lastmod?: string,
): SitemapIndexEntry[] {
  const base = baseUrl.replace(/\/+$/, "");
  return shards.map((shard) => ({
    loc: `${base}/${shard.filename}`,
    lastmod,
  }));
}

export function renderSitemapIndexXml(entries: SitemapIndexEntry[]): string {
  const urls = entries
    .map(
      (e) =>
        `  <sitemap>\n    <loc>${escapeXml(e.loc)}</loc>${e.lastmod ? `\n    <lastmod>${e.lastmod}</lastmod>` : ""}\n  </sitemap>`,
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</sitemapindex>`;
}

export function renderSitemapUrlSetXml(entries: SitemapUrlEntry[]): string {
  const urls = entries
    .map((e) => {
      let inner = `    <loc>${escapeXml(e.loc)}</loc>`;
      if (e.lastmod) inner += `\n    <lastmod>${e.lastmod}</lastmod>`;
      if (e.changefreq) inner += `\n    <changefreq>${e.changefreq}</changefreq>`;
      if (e.priority !== undefined) inner += `\n    <priority>${e.priority.toFixed(1)}</priority>`;
      return `  <url>\n${inner}\n  </url>`;
    })
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** Paginate URL entries into shard-sized chunks. */
export function chunkSitemapEntries(
  entries: SitemapUrlEntry[],
  shardSize = SITEMAP_DEFAULT_SHARD_SIZE,
): SitemapUrlEntry[][] {
  const chunks: SitemapUrlEntry[][] = [];
  for (let i = 0; i < entries.length; i += shardSize) {
    chunks.push(entries.slice(i, i + shardSize));
  }
  return chunks;
}
