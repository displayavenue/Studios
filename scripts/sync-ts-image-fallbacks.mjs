#!/usr/bin/env node
/** Sync image URLs in src/data/*.ts fallbacks from public/content/*.json */
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");

function patchServiceImages() {
  const json = JSON.parse(fs.readFileSync(path.join(root, "public/content/services.json"), "utf8"));
  let ts = fs.readFileSync(path.join(root, "src/data/services.ts"), "utf8");
  for (const s of json.services) {
    const re = new RegExp(
      `(slug:\\s*"${s.slug}"[\\s\\S]*?image:\\s*")[^"]+(")`,
      "m",
    );
    if (!re.test(ts)) {
      console.warn("missing slug in services.ts:", s.slug);
      continue;
    }
    ts = ts.replace(re, `$1${s.image}$2`);
  }
  fs.writeFileSync(path.join(root, "src/data/services.ts"), ts);
  console.log("synced src/data/services.ts");
}

function patchHomeHero() {
  const json = JSON.parse(fs.readFileSync(path.join(root, "public/content/home.json"), "utf8"));
  let ts = fs.readFileSync(path.join(root, "src/data/home.ts"), "utf8");
  ts = ts.replace(
    /image:\s*"https:\/\/images\.unsplash\.com\/[^"]+"/,
    `image: "${json.hero.image}"`,
  );
  fs.writeFileSync(path.join(root, "src/data/home.ts"), ts);
  console.log("synced src/data/home.ts");
}

function patchPortfolio() {
  const json = JSON.parse(fs.readFileSync(path.join(root, "public/content/portfolio.json"), "utf8"));
  const tsPath = path.join(root, "src/data/portfolio.ts");
  let ts = fs.readFileSync(tsPath, "utf8");

  // Replace entire portfolio array export with JSON-derived TS
  const items = json.portfolio
    .map((p) => {
      const gallery = (p.gallery || []).map((g) => `      "${g}"`).join(",\n");
      const client = p.client ? `\n    client: ${JSON.stringify(p.client)},` : "";
      return `  {
    slug: "${p.slug}",
    title: ${JSON.stringify(p.title)},${client}
    category: ${JSON.stringify(p.category)},
    location: ${JSON.stringify(p.location)},
    description: ${JSON.stringify(p.description)},
    image: "${p.image}",
    gallery: [
${gallery}
    ],
  }`;
    })
    .join(",\n");

  ts = ts.replace(
    /export const portfolio(?:: PortfolioItem\[\])? = \[[\s\S]*?\];/,
    `export const portfolio: PortfolioItem[] = [\n${items}\n];`,
  );

  const categories = json.portfolioCategories.map((c) => `  "${c}"`).join(",\n");
  ts = ts.replace(
    /export const portfolioCategories = \[[\s\S]*?\];/,
    `export const portfolioCategories = [\n${categories}\n];`,
  );
  fs.writeFileSync(tsPath, ts);
  console.log("synced src/data/portfolio.ts");
}

function patchContent() {
  const json = JSON.parse(fs.readFileSync(path.join(root, "public/content/content.json"), "utf8"));
  let ts = fs.readFileSync(path.join(root, "src/data/content.ts"), "utf8");

  for (const t of json.testimonials) {
    const re = new RegExp(`(name:\\s*"${t.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"[\\s\\S]*?image:\\s*")[^"]+(")`, "m");
    ts = ts.replace(re, `$1${t.image}$2`);
  }
  for (const b of json.blogs) {
    const re = new RegExp(`(slug:\\s*"${b.slug}"[\\s\\S]*?image:\\s*")[^"]+(")`, "m");
    ts = ts.replace(re, `$1${b.image}$2`);
  }
  for (const i of json.industries) {
    const re = new RegExp(`(slug:\\s*"${i.slug}"[\\s\\S]*?image:\\s*")[^"]+(")`, "m");
    ts = ts.replace(re, `$1${i.image}$2`);
  }
  for (const m of json.team) {
    const re = new RegExp(`(name:\\s*"${m.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"[\\s\\S]*?image:\\s*")[^"]+(")`, "m");
    ts = ts.replace(re, `$1${m.image}$2`);
  }

  fs.writeFileSync(path.join(root, "src/data/content.ts"), ts);
  console.log("synced src/data/content.ts");
}

patchServiceImages();
patchHomeHero();
patchPortfolio();
patchContent();
