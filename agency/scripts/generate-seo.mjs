#!/usr/bin/env node
/**
 * Build-time SEO artifacts (sitemap.xml + llms.txt + robots.txt) from CMS JSON.
 * Mirrors agency/public/admin/seo-sync.php for local/CI builds without PHP.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const contentDir = join(root, "public", "content");
const publicDir = join(root, "public");

function readJson(name) {
  const path = join(contentDir, name);
  if (!existsSync(path)) return {};
  return JSON.parse(readFileSync(path, "utf8"));
}

function items(file) {
  return Array.isArray(file?.items) ? file.items : [];
}

function siteBase(company, settings) {
  const website = String(company.website || "https://displayavenue.com").replace(
    /\/$/,
    "",
  );
  const mount = String(settings.demoBasePath ?? "").replace(/^\/|\/$/g, "");
  return mount ? `${website}/${mount}` : website;
}

function lastmod(value, fallback) {
  const fb = fallback || new Date().toISOString().slice(0, 10);
  if (!value) return fb;
  const raw = String(value).trim();
  const m = raw.match(/^(\d{4}-\d{2}-\d{2})/);
  if (m) return m[1];
  if (/^\d{4}$/.test(raw)) return `${raw}-01-01`;
  const d = new Date(raw);
  return Number.isNaN(d.getTime()) ? fb : d.toISOString().slice(0, 10);
}

const company = readJson("company.json");
const settings = readJson("settings.json");
const services = readJson("services.json");
const industries = readJson("industries.json");
const packages = readJson("packages.json");
const solutions = readJson("solutions.json");
const ai = readJson("ai.json");
const tools = readJson("tools.json");
const cases = readJson("cases.json");
const projects = readJson("projects.json");
const resources = readJson("resources.json");
const catalogue = readJson("catalogue.json");
const shop = readJson("shop.json");
const landings = readJson("landings.json");

const today = new Date().toISOString().slice(0, 10);
const settingsLast = lastmod(settings.updatedAt || settings.seoSyncedAt, today);
const catalogueLast = lastmod(
  catalogue.updatedAt || catalogue.uploadedAt,
  settingsLast,
);
const shopLast = lastmod(shop.updatedAt, settingsLast);
const landingsLast = lastmod(landings.updatedAt, settingsLast);

const staticPages = [
  ["/", "1.0", "daily"],
  ["/services", "0.9", "weekly"],
  ["/industries", "0.9", "weekly"],
  ["/solutions", "0.9", "weekly"],
  ["/ai-platform", "0.9", "weekly"],
  ["/packages", "0.9", "weekly"],
  ["/free-tools", "0.8", "weekly"],
  ["/case-studies", "0.8", "weekly"],
  ["/portfolio", "0.8", "weekly"],
  ["/resources", "0.8", "weekly"],
  ["/catalogue", "0.75", "monthly", catalogueLast],
  ["/shop", "0.85", "weekly", shopLast],
  ["/why-displayavenue", "0.7", "monthly"],
  ["/contact", "0.8", "monthly"],
  ["/privacy", "0.3", "yearly"],
  ["/terms", "0.3", "yearly"],
];

const urls = staticPages
  .filter(([path]) => {
    if (path === "/catalogue" && catalogue.enabled === false) return false;
    if (path === "/shop" && shop.enabled === false) return false;
    return true;
  })
  .map(([path, priority, changefreq, pageLast]) => ({
    path,
    priority,
    changefreq,
    lastmod: pageLast || settingsLast,
  }));

const maps = [
  [items(services), "/services/", "0.7", "weekly"],
  [items(industries), "/industries/", "0.7", "monthly"],
  [items(packages), "/packages/", "0.7", "monthly"],
  [items(solutions), "/solutions/", "0.65", "monthly"],
  [items(ai), "/ai-platform/", "0.7", "monthly"],
  [items(tools), "/free-tools/", "0.65", "monthly"],
  [items(cases), "/case-studies/", "0.65", "monthly"],
  [items(projects), "/portfolio/", "0.65", "monthly"],
  [items(resources), "/resources/", "0.6", "weekly"],
];

for (const [list, prefix, priority, changefreq] of maps) {
  for (const item of list) {
    if (item?.slug) {
      urls.push({
        path: `${prefix}${item.slug}`,
        priority,
        changefreq,
        lastmod: lastmod(item.updatedAt || item.date || settingsLast, settingsLast),
      });
    }
  }
}

if (shop.enabled !== false) {
  for (const product of Array.isArray(shop.products) ? shop.products : []) {
    if (!product || product.enabled === false) continue;
    const slug = product.slug || product.id;
    if (!slug) continue;
    urls.push({
      path: `/shop/${slug}`,
      priority: "0.7",
      changefreq: "weekly",
      lastmod: shopLast,
    });
  }
}

for (const landing of items(landings)) {
  if (!landing || landing.enabled === false) continue;
  if (!landing.slug) continue;
  urls.push({
    path: `/lp/${landing.slug}`,
    priority: "0.6",
    changefreq: "weekly",
    lastmod: lastmod(landing.updatedAt || landingsLast, landingsLast),
  });
}

const seen = new Set();
const unique = [];
for (const u of urls) {
  if (seen.has(u.path)) continue;
  seen.add(u.path);
  unique.push(u);
}

const base = siteBase(company, settings);

let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
xml += `<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>\n`;
xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
for (const u of unique) {
  const loc = `${base.replace(/\/$/, "")}${u.path === "/" ? "/" : u.path}`;
  xml += `  <url>\n`;
  xml += `    <loc>${loc.replace(/&/g, "&amp;")}</loc>\n`;
  xml += `    <lastmod>${u.lastmod || today}</lastmod>\n`;
  xml += `    <changefreq>${u.changefreq}</changefreq>\n`;
  xml += `    <priority>${u.priority}</priority>\n`;
  xml += `  </url>\n`;
}
xml += `</urlset>\n`;

const name = company.name || "DisplayAvenue";
const tagline = company.tagline || "Digital Growth. AI Powered.";
const sitemapUrl = `${base.replace(/\/$/, "")}/sitemap.xml`;
const host = base.replace(/^https?:\/\//, "").replace(/\/$/, "");

const robots = [
  "User-agent: *",
  "Allow: /",
  "Disallow: /admin/",
  "Disallow: /admin",
  "",
  "# AI / assistant crawlers",
  "User-agent: GPTBot",
  "Allow: /",
  "",
  "User-agent: ChatGPT-User",
  "Allow: /",
  "",
  "User-agent: Google-Extended",
  "Allow: /",
  "",
  "User-agent: anthropic-ai",
  "Allow: /",
  "",
  "User-agent: ClaudeBot",
  "Allow: /",
  "",
  "User-agent: PerplexityBot",
  "Allow: /",
  "",
  `Sitemap: ${sitemapUrl}`,
  `Host: ${host}`,
  "",
].join("\n");

const llms = [
  `# ${name}`,
  `> ${tagline}`,
  "",
  "AI-powered digital marketing, web development, ecommerce, branding, and automation agency based in Mumbai, India.",
  "",
  "## Primary pages",
  ...unique
    .filter((u) => u.path === "/" || Number(u.priority) >= 0.8)
    .map((u) => `- ${base}${u.path === "/" ? "/" : u.path}`),
  "",
  "## Services (sample)",
  ...items(services)
    .slice(0, 25)
    .filter((s) => s.title && s.slug)
    .map((s) => `- ${s.title}: ${base}/services/${s.slug}`),
  "",
  "## Contact",
  `- Phone: ${company.phone || ""}`,
  `- Email: ${company.email || ""}`,
  `- Website: ${base}/`,
  `- Sitemap: ${sitemapUrl}`,
  "",
].join("\n");

writeFileSync(join(publicDir, "sitemap.xml"), xml);
writeFileSync(join(publicDir, "llms.txt"), llms);
writeFileSync(join(publicDir, "robots.txt"), robots);

settings.seoSyncedAt = new Date().toISOString();
settings.sitemapUrlCount = unique.length;
settings.sitemapUrl = sitemapUrl;
settings.autoSitemap = true;
settings.updatedAt = settings.seoSyncedAt;
writeFileSync(
  join(contentDir, "settings.json"),
  `${JSON.stringify(settings, null, 2)}\n`,
);

console.log(`SEO: wrote sitemap.xml + robots.txt + llms.txt (${unique.length} URLs) → ${base}`);
