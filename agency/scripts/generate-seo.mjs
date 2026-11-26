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
const blog = readJson("blog.json");

const staticPages = [
  ["/", "1.0", "weekly"],
  ["/services", "0.9", "weekly"],
  ["/industries", "0.9", "weekly"],
  ["/industry-solutions", "0.85", "weekly"],
  ["/solutions", "0.9", "weekly"],
  ["/ai-platform", "0.9", "weekly"],
  ["/packages", "0.9", "weekly"],
  ["/free-tools", "0.8", "weekly"],
  ["/free-tools/roi-calculator", "0.85", "monthly"],
  ["/free-tools/seo-checklist", "0.85", "monthly"],
  ["/free-tools/local-seo-score", "0.85", "monthly"],
  ["/free-tools/citation-directory", "0.85", "monthly"],
  ["/resources/india-sme-digital-growth-report", "0.85", "monthly"],
  ["/case-studies", "0.8", "weekly"],
  ["/portfolio", "0.8", "weekly"],
  ["/resources", "0.8", "weekly"],
  ["/blog", "0.85", "daily"],
  ["/awards", "0.75", "monthly"],
  ["/certifications", "0.75", "monthly"],
  ["/why-displayavenue", "0.7", "monthly"],
  ["/contact", "0.8", "monthly"],
  ["/growth", "0.85", "weekly"],
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

const blogPosts = Array.isArray(blog?.posts) ? blog.posts : [];
for (const post of blogPosts) {
  if (post?.slug) {
    urls.push({
      path: `/blog/${post.slug}`,
      priority: "0.7",
      changefreq: "weekly",
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

function clip(text, max = 155) {
  const clean = String(text || "")
    .replace(/\s+/g, " ")
    .trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1).replace(/\s+\S*$/, "")}…`;
}

function pageTitle(namePart) {
  const brand = name || "DisplayAvenue";
  const raw = String(namePart || brand).trim();
  if (!raw) return `${brand} | Get more customers online`;
  if (raw.toLowerCase().includes(brand.toLowerCase())) return clip(raw, 60);
  const suffix = ` | ${brand}`;
  return `${clip(raw, Math.max(24, 60 - suffix.length))}${suffix}`;
}

function addPage(map, path, meta) {
  const key = path === "/" ? "/" : path.replace(/\/$/, "");
  map[key] = {
    title: pageTitle(meta.title),
    description: clip(meta.description),
    h1: String(meta.h1 || meta.title || name).trim(),
    summary: clip(meta.summary || meta.description, 280),
    links: Array.isArray(meta.links) ? meta.links.slice(0, 8) : [],
    noindex: Boolean(meta.noindex),
    ogType: meta.ogType || "website",
  };
}

const defaultLinks = [
  { href: "/services", label: "Services" },
  { href: "/growth", label: "Growth Plan" },
  { href: "/case-studies", label: "Case Studies" },
  { href: "/contact", label: "Contact" },
];

const seoPages = {};
addPage(seoPages, "/", {
  title: `${name} | Digital Marketing Agency in Mumbai`,
  description:
    "Mumbai digital marketing agency that gets you leads from Google Search & Maps, Meta (Facebook & Instagram), ChatGPT & AI search, LinkedIn and your website.",
  h1: "Get more customers from Google, Meta & AI platforms",
  summary:
    company.tagline ||
    "DisplayAvenue helps business owners get found online and turn interest into real enquiries.",
  links: defaultLinks,
});

const staticMeta = {
  "/services": ["Services", "Digital marketing, websites, ads, SEO and AI services from DisplayAvenue."],
  "/industries": ["Industries", "Industry-specific digital growth systems for Indian businesses."],
  "/industry-solutions": ["Industry Solutions", "Industry × service landing pages for search and lead generation."],
  "/solutions": ["Solutions", "DisplayAvenue growth solutions across acquisition, conversion and retention."],
  "/ai-platform": ["AI Platform", "AI marketing tools and automation built for DisplayAvenue clients."],
  "/packages": ["Packages", "Digital growth packages for startups and growing businesses."],
  "/free-tools": ["Free Tools", "Free marketing calculators and SEO tools from DisplayAvenue."],
  "/free-tools/roi-calculator": ["ROI Calculator", "Estimate marketing ROI and lead volume with DisplayAvenue’s free calculator."],
  "/free-tools/seo-checklist": ["SEO Checklist", "Score your website SEO readiness with DisplayAvenue’s free checklist."],
  "/free-tools/local-seo-score": ["Local SEO Score", "Check local SEO fundamentals for Google Business Profile and maps."],
  "/free-tools/citation-directory": ["Citation Directory", "NAP citation directories for Indian local SEO."],
  "/resources/india-sme-digital-growth-report": [
    "India SME Digital Growth Report",
    "Practical digital growth insights for Indian SMEs from DisplayAvenue.",
  ],
  "/case-studies": ["Case Studies", "Selected DisplayAvenue client engagements across SEO, ads and websites."],
  "/portfolio": ["Portfolio", "Website and brand work from DisplayAvenue."],
  "/resources": ["Resources", "Guides and resources for digital growth."],
  "/blog": ["Blog", "Digital marketing articles and updates from DisplayAvenue."],
  "/awards": ["Awards", "Awards and recognition for DisplayAvenue."],
  "/certifications": ["Certifications", "Platform certifications held by the DisplayAvenue team."],
  "/why-displayavenue": ["Why DisplayAvenue", "Why businesses choose DisplayAvenue as their digital growth partner."],
  "/contact": ["Contact", "Book a free consultation with DisplayAvenue in Mumbai."],
  "/growth": [
    "Generate More Qualified Leads",
    "DisplayAvenue Growth Plan for websites, Meta Ads, Google Ads, GBP and lead generation.",
  ],
  "/growth/thank-you": [
    "Growth Plan Request Received",
    "Thanks for sharing your requirements. DisplayAvenue will contact you shortly.",
    true,
  ],
  "/privacy": ["Privacy Policy", "DisplayAvenue privacy policy.", true],
  "/terms": ["Terms of Service", "DisplayAvenue terms of service.", true],
};

for (const [path, meta] of Object.entries(staticMeta)) {
  addPage(seoPages, path, {
    title: meta[0],
    description: meta[1],
    h1: meta[0],
    noindex: Boolean(meta[2]),
    links: defaultLinks,
  });
}

const catalogMaps = [
  [items(services), "/services/", "Service"],
  [items(industries), "/industries/", "Industry"],
  [items(packages), "/packages/", "Package"],
  [items(solutions), "/solutions/", "Solution"],
  [items(ai), "/ai-platform/", "AI"],
  [items(tools), "/free-tools/", "Tool"],
  [items(cases), "/case-studies/", "Case study"],
  [items(projects), "/portfolio/", "Project"],
  [items(resources), "/resources/", "Resource"],
];

for (const [list, prefix] of catalogMaps) {
  for (const item of list) {
    if (!item?.slug) continue;
    const path = `${prefix}${item.slug}`;
    const title = item.seo?.title || item.headline || item.title;
    const description =
      item.seo?.description || item.summary || `${item.title} from DisplayAvenue.`;
    addPage(seoPages, path, {
      title,
      description,
      h1: item.title || title,
      summary: item.summary || description,
      links: [
        { href: prefix.replace(/\/$/, "") || "/", label: "Overview" },
        { href: "/contact", label: "Contact" },
        { href: "/growth", label: "Growth Plan" },
      ],
    });
  }
}

for (const item of items(combos)) {
  if (!item?.industrySlug || !item?.serviceSlug || item?.indexable === false) continue;
  const path = `/industries/${item.industrySlug}/${item.serviceSlug}`;
  addPage(seoPages, path, {
    title: item.seo?.title || item.headline || item.title,
    description: item.seo?.description || item.summary || item.title,
    h1: item.title,
    summary: item.summary || item.title,
    links: [
      { href: `/industries/${item.industrySlug}`, label: "Industry" },
      { href: "/contact", label: "Contact" },
    ],
  });
}

for (const post of blogPosts) {
  if (!post?.slug) continue;
  addPage(seoPages, `/blog/${post.slug}`, {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt || post.title,
    h1: post.title,
    summary: post.excerpt || post.title,
    ogType: "article",
    links: [
      { href: "/blog", label: "Blog" },
      { href: "/contact", label: "Contact" },
    ],
  });
}

writeFileSync(join(publicDir, "sitemap.xml"), xml);
writeFileSync(join(publicDir, "llms.txt"), llms);
writeFileSync(join(publicDir, "robots.txt"), robots);
writeFileSync(join(publicDir, `${INDEXNOW_KEY}.txt`), INDEXNOW_KEY);
writeFileSync(
  join(publicDir, "seo-pages.json"),
  `${JSON.stringify(seoPages, null, 2)}\n`,
);

settings.seoSyncedAt = new Date().toISOString();
settings.sitemapUrlCount = unique.length;
settings.sitemapUrl = `${base}/sitemap.xml`;
settings.updatedAt = settings.seoSyncedAt;
writeFileSync(
  join(contentDir, "settings.json"),
  `${JSON.stringify(settings, null, 2)}\n`,
);

console.log(
  `SEO: wrote sitemap.xml + llms.txt + robots.txt + seo-pages.json (${unique.length} URLs, ${Object.keys(seoPages).length} meta pages) → ${base}`,
);
