/**
 * Backfill unique seoTitle, seoDescription, seoKeywords on all CMS catalog items.
 * Run: node scripts/backfill-seo.mjs
 * Idempotent: overwrites generated fields with improved unique values.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const contentDir = path.join(__dirname, "../public/content");
const BRAND = "DisplayAvenue";

const FILES = [
  "services.json",
  "industries.json",
  "packages.json",
  "solutions.json",
  "combos.json",
  "cases.json",
  "projects.json",
  "resources.json",
  "ai.json",
  "tools.json",
];

const KIND_SUFFIX = {
  service: "Services",
  industry: "Digital Marketing",
  package: "Package",
  solution: "Solution",
  ai: "AI Suite",
  tool: "Free Tools",
  "case-study": "Case Study",
  project: "Portfolio",
  resource: "Resources",
  combo: "Industry Solution",
};

function clamp(text, max) {
  const t = String(text || "")
    .replace(/\s+/g, " ")
    .trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1).trim()}…`;
}

function uniqueList(items, max = 10) {
  const seen = new Set();
  const out = [];
  for (const raw of items) {
    const k = String(raw || "").trim();
    const key = k.toLowerCase();
    if (!k || seen.has(key)) continue;
    seen.add(key);
    out.push(k);
    if (out.length >= max) break;
  }
  return out;
}

function buildTitle(item, usedTitles) {
  const kind = item.kind || "service";
  const suffix = KIND_SUFFIX[kind] || "DisplayAvenue";
  const primary = item.primaryKeyword || item.title;
  let title = `${primary} | ${suffix} | ${BRAND}`;

  // Prefer richer existing titles if already unique and branded
  if (item.seoTitle && item.seoTitle.includes(BRAND) && !usedTitles.has(item.seoTitle.toLowerCase())) {
    title = item.seoTitle;
  } else if (kind === "combo" && item.industrySlug && item.serviceSlug) {
    title = `${item.title} | ${BRAND}`;
  } else if (kind === "industry") {
    title = `${item.title} Digital Marketing Agency | Leads & Growth | ${BRAND}`;
  } else if (kind === "package") {
    title = `${item.title} | Pricing & Deliverables | ${BRAND}`;
  } else if (kind === "case-study") {
    title = `${item.title} | Results Case Study | ${BRAND}`;
  } else if (kind === "project") {
    title = `${item.title} | Portfolio Project | ${BRAND}`;
  } else if (kind === "tool") {
    title = `${item.title} | Free Marketing Tools | ${BRAND}`;
  } else if (kind === "ai") {
    title = `${item.title} | AI Platform | ${BRAND}`;
  } else if (kind === "resource") {
    title = `${item.title} | Guides & Resources | ${BRAND}`;
  } else if (kind === "solution") {
    title = `${item.title} Solution | Digital Growth | ${BRAND}`;
  } else {
    title = `${item.title} Services | ${BRAND}`;
  }

  // Ensure uniqueness
  let candidate = title;
  let n = 2;
  while (usedTitles.has(candidate.toLowerCase())) {
    candidate = `${item.title} | ${item.category || item.slug} | ${BRAND}`;
    if (usedTitles.has(candidate.toLowerCase())) {
      candidate = `${clamp(item.title, 40)} · ${item.slug} | ${BRAND}`;
    }
    if (usedTitles.has(candidate.toLowerCase())) {
      candidate = `${clamp(item.title, 35)} | ${BRAND} ${n}`;
      n += 1;
    } else {
      break;
    }
    if (n > 20) break;
  }
  usedTitles.add(candidate.toLowerCase());
  return clamp(candidate, 70);
}

function buildDescription(item, usedDescs) {
  const base =
    item.seoDescription ||
    item.quickAnswer ||
    item.summary ||
    `${item.title} from ${BRAND} for Indian businesses — strategy, execution, and WhatsApp support.`;
  let desc = clamp(
    `${base} Get a free plan from ${BRAND}. WhatsApp 9222 122333.`,
    160,
  );

  // If duplicate, differentiate with title/category
  if (usedDescs.has(desc.toLowerCase())) {
    desc = clamp(
      `${item.title}: ${item.summary || base} ${BRAND} · ${item.category || item.kind || "digital growth"}.`,
      160,
    );
  }
  if (usedDescs.has(desc.toLowerCase())) {
    desc = clamp(
      `${item.title} (${item.slug}) — ${item.summary || "Digital growth systems for Indian SMEs."} ${BRAND}.`,
      160,
    );
  }
  usedDescs.add(desc.toLowerCase());
  return desc;
}

function buildKeywords(item) {
  return uniqueList(
    [
      item.primaryKeyword,
      item.title,
      item.category,
      ...(item.secondaryKeywords || []),
      item.kind === "industry" ? `${item.title} digital marketing India` : null,
      item.kind === "service" ? `${item.title} agency Mumbai` : null,
      item.kind === "combo" ? item.title : null,
      "DisplayAvenue",
      "digital marketing India",
      "Mumbai MMR",
    ],
    10,
  );
}

function processFile(file, usedTitles, usedDescs) {
  const full = path.join(contentDir, file);
  const data = JSON.parse(fs.readFileSync(full, "utf8"));
  if (!Array.isArray(data.items)) {
    console.warn("skip (no items):", file);
    return { file, count: 0 };
  }
  let updated = 0;
  for (const item of data.items) {
    if (!item?.slug) continue;
    item.seoTitle = buildTitle(item, usedTitles);
    item.seoDescription = buildDescription(item, usedDescs);
    item.seoKeywords = buildKeywords(item);
    if (!item.primaryKeyword) item.primaryKeyword = item.title;
    updated += 1;
  }
  data.updatedAt = new Date().toISOString();
  fs.writeFileSync(full, `${JSON.stringify(data, null, 2)}\n`, "utf8");
  console.log(`${file}: ${updated} items`);
  return { file, count: updated };
}

const usedTitles = new Set();
const usedDescs = new Set();
let total = 0;
for (const file of FILES) {
  const r = processFile(file, usedTitles, usedDescs);
  total += r.count;
}

// Also improve home + contact seo blocks if present
function patchSimple(file, seo) {
  const full = path.join(contentDir, file);
  if (!fs.existsSync(full)) return;
  const data = JSON.parse(fs.readFileSync(full, "utf8"));
  data.seo = { ...(data.seo || {}), ...seo };
  data.updatedAt = new Date().toISOString();
  fs.writeFileSync(full, `${JSON.stringify(data, null, 2)}\n`, "utf8");
  console.log(`${file}: seo block updated`);
}

patchSimple("home.json", {
  title: `Digital Marketing Agency Mumbai | Google Ads, SEO & Leads | ${BRAND}`,
  description:
    "DisplayAvenue helps Indian SMEs get Google and Instagram enquiries with Google Ads, Meta Ads, SEO, Local SEO, websites, and WhatsApp lead systems. Free growth plan · WhatsApp 9222 122333.",
  keywords: [
    "digital marketing agency Mumbai",
    "Google Ads agency India",
    "SEO agency Mumbai",
    "DisplayAvenue",
  ],
});

patchSimple("contact.json", {
  title: `Get Free Proposal | Contact DisplayAvenue Mumbai`,
  description:
    "Book a free consultation or request a custom proposal. Tell us your city and goal — DisplayAvenue replies with a clear next step. WhatsApp 9222 122333.",
  keywords: [
    "contact DisplayAvenue",
    "free digital marketing consultation Mumbai",
    "WhatsApp 9222122333",
  ],
});

console.log(`\nBackfill complete: ${total} catalog items`);
console.log(`Unique titles: ${usedTitles.size} · Unique descriptions: ${usedDescs.size}`);
