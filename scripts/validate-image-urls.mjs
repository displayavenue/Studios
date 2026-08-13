#!/usr/bin/env node
/** Fail if any Unsplash URL in content JSON returns non-200. */
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const files = [
  "public/content/services.json",
  "public/content/portfolio.json",
  "public/content/content.json",
  "public/content/home.json",
];

const urls = new Set();
for (const rel of files) {
  const data = JSON.parse(fs.readFileSync(path.join(root, rel), "utf8"));
  const walk = (o) => {
    if (!o) return;
    if (typeof o === "string" && o.includes("unsplash")) urls.add(o.split("?")[0]);
    else if (Array.isArray(o)) o.forEach(walk);
    else if (typeof o === "object") Object.values(o).forEach(walk);
  };
  walk(data);
}

const broken = [];
for (const base of urls) {
  const res = await fetch(`${base}?auto=format&fit=crop&w=200&q=80`, { method: "HEAD" });
  if (!res.ok) broken.push({ status: res.status, base });
}

if (broken.length) {
  console.error(`Broken image URLs (${broken.length}):`);
  broken.forEach((b) => console.error(`  ${b.status} ${b.base}`));
  process.exit(1);
}

console.log(`OK — ${urls.size} image URLs verified`);
