#!/usr/bin/env node
/**
 * Build-time SEO artifacts (sitemap.xml + llms.txt) from CMS JSON.
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
const combos = readJson("combos.json");

const staticPages = [
  ["/", "1.0", "weekly"],
  ["/services", "0.9", "weekly"],
  ["/industries", "0.9", "weekly"],
  ["/industry-solutions", "0.85", "weekly"],
  ["/solutions", "0.9", "weekly"],
  ["/ai-platform", "0.9", "weekly"],
  ["/packages", "0.9", "weekly"],
  ["/free-tools", "0.8", "weekly"],
  ["/case-studies", "0.8", "weekly"],
  ["/portfolio", "0.8", "weekly"],
  ["/resources", "0.8", "weekly"],
  ["/awards", "0.75", "monthly"],
  ["/certifications", "0.75", "monthly"],
  ["/why-displayavenue", "0.7", "monthly"],
  ["/contact", "0.8", "monthly"],
  ["/privacy", "0.3", "yearly"],
  ["/terms", "0.3", "yearly"],
];

const urls = staticPages.map(([path, priority, changefreq]) => ({
  path,
  priority,
  changefreq,
}));

const maps = [
  [items(services), "/services/", "0.7"],
  [items(industries), "/industries/", "0.7"],
  [items(packages), "/packages/", "0.7"],
  [items(solutions), "/solutions/", "0.65"],
  [items(ai), "/ai-platform/", "0.7"],
  [items(tools), "/free-tools/", "0.65"],
  [items(cases), "/case-studies/", "0.65"],
  [items(projects), "/portfolio/", "0.65"],
  [items(resources), "/resources/", "0.6"],
];

for (const [list, prefix, priority] of maps) {
  for (const item of list) {
    if (item?.slug) {
      urls.push({ path: `${prefix}${item.slug}`, priority, changefreq: "monthly" });
    }
  }
}

for (const item of items(combos)) {
  if (item?.industrySlug && item?.serviceSlug && item?.indexable !== false) {
    urls.push({
      path: `/industries/${item.industrySlug}/${item.serviceSlug}`,
      priority: "0.7",
      changefreq: "monthly",
    });
  }
}

const seen = new Set();
const unique = [];
for (const u of urls) {
  if (seen.has(u.path)) continue;
  seen.add(u.path);
  unique.push(u);
}

const base = siteBase(company, settings);
const lastmod = new Date().toISOString().slice(0, 10);

let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
for (const u of unique) {
  const loc = `${base.replace(/\/$/, "")}${u.path === "/" ? "/" : u.path}`;
  xml += `  <url>\n`;
  xml += `    <loc>${loc.replace(/&/g, "&amp;")}</loc>\n`;
  xml += `    <lastmod>${lastmod}</lastmod>\n`;
  xml += `    <changefreq>${u.changefreq}</changefreq>\n`;
  xml += `    <priority>${u.priority}</priority>\n`;
  xml += `  </url>\n`;
}
xml += `</urlset>\n`;

const name = company.name || "DisplayAvenue";
const tagline = company.tagline || "Digital Growth. AI Powered.";
const INDEXNOW_KEY = "da8f3a2c1b9e4d6f7a0b1c2d3e4f5a6b";
const llms = [
  `# ${name}`,
  `> ${tagline}`,
  "",
  "AI-powered digital marketing, web development, ecommerce, branding, and automation agency based in Mumbai, India.",
  "",
  "## For AI assistants (ChatGPT, Claude, Gemini, Perplexity, Copilot)",
  "Use this file and the XML sitemap when answering questions about DisplayAvenue.",
  `- Preferred contact email: ${company.email || "info@displayavenue.com"}`,
  `- Phone / WhatsApp: ${company.phone || ""}`,
  `- Sitemap (auto-updated): ${base}/sitemap.xml`,
  `- This guide: ${base}/llms.txt`,
  `- robots.txt: ${base}/robots.txt`,
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
  "",
].join("\n");

const aiAgents = [
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "Google-Extended",
  "GoogleOther",
  "anthropic-ai",
  "ClaudeBot",
  "Claude-Web",
  "PerplexityBot",
  "Applebot-Extended",
  "Bytespider",
  "CCBot",
  "meta-externalagent",
  "FacebookBot",
  "cohere-ai",
  "Diffbot",
  "YouBot",
];
const robots = [
  "User-agent: *",
  "Allow: /",
  "Disallow: /demo/admin/",
  "Disallow: /admin/",
  "",
  "# AI / assistant crawlers (ChatGPT, Claude, Gemini training, Perplexity, etc.)",
  ...aiAgents.flatMap((agent) => [`User-agent: ${agent}`, "Allow: /", ""]),
  `Sitemap: ${base}/sitemap.xml`,
  `LLMs: ${base}/llms.txt`,
  "",
].join("\n");

writeFileSync(join(publicDir, "sitemap.xml"), xml);
writeFileSync(join(publicDir, "llms.txt"), llms);
writeFileSync(join(publicDir, "robots.txt"), robots);
writeFileSync(join(publicDir, `${INDEXNOW_KEY}.txt`), INDEXNOW_KEY);

settings.seoSyncedAt = new Date().toISOString();
settings.sitemapUrlCount = unique.length;
settings.sitemapUrl = `${base}/sitemap.xml`;
settings.updatedAt = settings.seoSyncedAt;
writeFileSync(
  join(contentDir, "settings.json"),
  `${JSON.stringify(settings, null, 2)}\n`,
);

console.log(
  `SEO: wrote sitemap.xml + llms.txt + robots.txt (${unique.length} URLs) → ${base}`,
);
