#!/usr/bin/env node
/**
 * Build-time prerender for crawlers and AI answer engines.
 *
 * 1. Builds src/entry-server.tsx as an SSR bundle (dist-ssr/).
 * 2. Renders every known route from public/seo-pages.json with the CMS JSON in
 *    public/content/ to dist/prerender/<route>.json  →  { html, jsonLd }.
 * 3. public/seo-router.php injects that HTML into <div id="root"> and the JSON-LD
 *    into <head>, so the raw HTML response contains the full page.
 *
 * Users still get the normal React app: it mounts over the prerendered markup.
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const ssrOut = join(root, "dist-ssr");
const outDir = join(dist, "prerender");

execFileSync(
  process.execPath,
  [join(root, "node_modules/vite/bin/vite.js"), "build", "--ssr", "src/entry-server.tsx", "--outDir", "dist-ssr", "--logLevel", "warn"],
  { cwd: root, stdio: "inherit" },
);

const entry = readdirSync(ssrOut).find((f) => /^entry-server\.(m?js)$/.test(f));
if (!entry) throw new Error("SSR entry not found in dist-ssr/");
const { render } = await import(pathToFileURL(join(ssrOut, entry)).href);

const contentDir = join(root, "public", "content");
const raw = {};
for (const file of readdirSync(contentDir)) {
  if (!file.endsWith(".json")) continue;
  try {
    raw[file.replace(/\.json$/, "")] = JSON.parse(readFileSync(join(contentDir, file), "utf8"));
  } catch {
    /* ignore malformed CMS file – fallbacks apply */
  }
}

const pages = JSON.parse(readFileSync(join(root, "public", "seo-pages.json"), "utf8"));
rmSync(outDir, { recursive: true, force: true });

// Silence expected client-only warnings (useLayoutEffect etc.) during SSR.
const origError = console.error;
console.error = (...args) => {
  if (String(args[0] ?? "").includes("useLayoutEffect")) return;
  origError(...args);
};

let ok = 0;
const failed = [];
for (const path of Object.keys(pages)) {
  try {
    const { html, jsonLd } = render(path, raw);
    const file = path === "/" ? "index.json" : `${path.replace(/^\//, "")}.json`;
    const target = join(outDir, file);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, JSON.stringify({ html, jsonLd }));
    ok += 1;
  } catch (err) {
    failed.push(`${path}: ${err?.message || err}`);
  }
}
console.error = origError;
rmSync(ssrOut, { recursive: true, force: true });

console.log(`prerender: ${ok} routes rendered → dist/prerender/`);
if (failed.length) {
  console.warn(`prerender: ${failed.length} routes failed (they fall back to the crawler shell):`);
  for (const f of failed.slice(0, 20)) console.warn("  " + f);
}
if (!existsSync(join(outDir, "index.json"))) {
  throw new Error("prerender: homepage failed to render");
}
