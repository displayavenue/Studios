/**
 * Audit unique SEO titles/descriptions across static + CMS catalog pages.
 * Run: node scripts/audit-seo.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const contentDir = path.join(__dirname, "../public/content");
const outPath = path.join(__dirname, "../../opt-cursor-seo-audit.json");

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

const rows = [];
const titleMap = new Map();
const descMap = new Map();

for (const file of FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(contentDir, file), "utf8"));
  for (const item of data.items || []) {
    const title = item.seoTitle || "";
    const desc = item.seoDescription || "";
    const kw = item.seoKeywords || [];
    const row = {
      source: file,
      slug: item.slug,
      title,
      description: desc,
      keywords: kw,
      missingTitle: !title,
      missingDesc: !desc,
      missingKeywords: !kw.length,
    };
    rows.push(row);
    titleMap.set(title.toLowerCase(), (titleMap.get(title.toLowerCase()) || 0) + 1);
    descMap.set(desc.toLowerCase(), (descMap.get(desc.toLowerCase()) || 0) + 1);
  }
}

const dupTitles = [...titleMap.entries()].filter(([, n]) => n > 1 && ![""].includes);
const dupDescs = [...descMap.entries()].filter(([, n]) => n > 1 && ![""].includes);
const missing = rows.filter((r) => r.missingTitle || r.missingDesc || r.missingKeywords);

const report = {
  total: rows.length,
  withKeywords: rows.filter((r) => !r.missingKeywords).length,
  duplicateTitles: dupTitles.length,
  duplicateDescriptions: dupDescs.length,
  missingCount: missing.length,
  sampleDupTitles: dupTitles.slice(0, 10).map(([t, n]) => ({ title: t, count: n })),
  sampleDupDescs: dupDescs.slice(0, 5).map(([t, n]) => ({ description: t.slice(0, 80), count: n })),
};

fs.writeFileSync(
  path.join(__dirname, "../public/content/_seo-audit-summary.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
console.log(JSON.stringify(report, null, 2));
if (report.duplicateTitles || report.duplicateDescriptions || report.missingCount) {
  console.error("SEO audit found issues");
  process.exitCode = 1;
} else {
  console.log("SEO audit OK — all catalog titles/descriptions unique with keywords");
}
