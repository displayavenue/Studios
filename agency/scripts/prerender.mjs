#!/usr/bin/env node
/**
 * Prerender every sitemap URL into static HTML after `vite build`.
 *
 * Why: the site is a React SPA, so crawlers and link-preview bots (Google,
 * Meta/Facebook, WhatsApp, LinkedIn) that don't run JavaScript only saw an
 * empty <div id="root"> and the homepage's meta tags on every URL. This writes
 * dist/<route>/index.html with the real page content plus that page's own
 * <title>, description, canonical, Open Graph and JSON-LD tags. Visitors still
 * get the live React app; it simply takes over the pre-filled page.
 *
 * Uses the Chrome/Chromium already installed on the machine (via playwright-core).
 * If no browser is found the build still succeeds and the step is skipped.
 *
 *   PRERENDER=0          skip this step
 *   CHROME_PATH=/path    use a specific Chrome/Chromium binary
 *   PRERENDER_CONCURRENCY=4
 */
import http from "node:http";
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");

if (process.env.PRERENDER === "0") {
  console.log("[prerender] PRERENDER=0, skipping.");
  process.exit(0);
}

let chromium;
try {
  ({ chromium } = await import("playwright-core"));
} catch {
  console.warn("[prerender] playwright-core not installed; skipping (run npm install).");
  process.exit(0);
}

const template = readFileSync(join(dist, "index.html"), "utf8");
const base = (process.env.DEPLOY_BASE || "/").replace(/\/?$/, "/");

/* ---------- routes from the generated sitemap ---------- */
function sitemapRoutes() {
  const file = join(dist, "sitemap.xml");
  if (!existsSync(file)) return ["/"];
  const xml = readFileSync(file, "utf8");
  const set = new Set(["/"]);
  for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
    try {
      let p = new URL(m[1].trim()).pathname;
      if (base !== "/" && p.startsWith(base)) p = "/" + p.slice(base.length);
      p = p.replace(/\/+$/, "") || "/";
      if (!/\.[a-z0-9]+$/i.test(p)) set.add(p);
    } catch {
      /* ignore bad entries */
    }
  }
  return [...set];
}

/* ---------- tiny static server with SPA fallback (always the original template) ---------- */
const MIME = {
  ".js": "text/javascript",
  ".mjs": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".txt": "text/plain",
  ".xml": "application/xml",
  ".pdf": "application/pdf",
};

const server = http.createServer((req, res) => {
  let url = decodeURIComponent((req.url || "/").split("?")[0]);
  if (base !== "/" && url.startsWith(base)) url = "/" + url.slice(base.length);
  const file = normalize(join(dist, url));
  if (file.startsWith(dist) && existsSync(file) && statSync(file).isFile() && !file.endsWith("index.html")) {
    res.writeHead(200, { "Content-Type": MIME[extname(file).toLowerCase()] || "application/octet-stream" });
    res.end(readFileSync(file));
    return;
  }
  if (/\.(php)$/.test(url) || url.startsWith("/admin/")) {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end("{}");
    return;
  }
  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  res.end(template);
});

await new Promise((r) => server.listen(0, "127.0.0.1", r));
const origin = `http://127.0.0.1:${server.address().port}`;

/* ---------- browser ---------- */
async function launch() {
  const attempts = [];
  if (process.env.CHROME_PATH) attempts.push({ executablePath: process.env.CHROME_PATH });
  attempts.push({ channel: "chrome" }, { channel: "msedge" }, {});
  for (const opts of attempts) {
    try {
      return await chromium.launch({ headless: true, ...opts });
    } catch {
      /* try next */
    }
  }
  return null;
}

const browser = await launch();
if (!browser) {
  console.warn("[prerender] No Chrome/Chromium found (set CHROME_PATH). Skipping prerender.");
  server.close();
  process.exit(0);
}

const context = await browser.newContext({
  viewport: { width: 1366, height: 900 },
  reducedMotion: "reduce", // reveal-on-scroll content renders in its final, visible state
  userAgent: "Mozilla/5.0 (compatible; DisplayAvenuePrerender/1.0)",
});

// Only our own server: no analytics, pixels or chat calls during prerender.
await context.route("**/*", (route) => {
  const u = route.request().url();
  if (u.startsWith(origin) || u.startsWith("https://fonts.")) return route.continue();
  return route.abort();
});

const HEAD_SELECTORS = [
  'meta[name="description"]',
  'meta[name="keywords"]',
  'meta[name="robots"]',
  'link[rel="canonical"]',
  'meta[property^="og:"]',
  'meta[name^="twitter:"]',
  'script[type="application/ld+json"]',
];

async function render(route) {
  const page = await context.newPage();
  try {
    await page.goto(origin + (base === "/" ? "" : base.replace(/\/$/, "")) + route, {
      waitUntil: "networkidle",
      timeout: 45000,
    });
    await page.waitForSelector("#root h1, #root main", { timeout: 8000 }).catch(() => {});
    await page.waitForTimeout(250);

    const html = await page.evaluate(
      ({ template, selectors }) => {
        const live = document;
        const doc = new DOMParser().parseFromString(template, "text/html");

        doc.title = live.title;
        for (const sel of selectors) {
          doc.head.querySelectorAll(sel).forEach((n) => n.remove());
          live.head.querySelectorAll(sel).forEach((n) => doc.head.appendChild(n.cloneNode(true)));
        }

        const liveRoot = live.getElementById("root");
        const outRoot = doc.getElementById("root");
        const clone = liveRoot.cloneNode(true);
        // drop runtime-only bits that should never ship as static HTML
        clone.querySelectorAll("script:not([type='application/ld+json']), iframe, noscript").forEach((n) => n.remove());
        clone.querySelectorAll(".is-hidden").forEach((n) => n.classList.remove("is-hidden"));
        outRoot.innerHTML = clone.innerHTML;
        outRoot.setAttribute("data-prerendered", "");
        return "<!doctype html>\n" + doc.documentElement.outerHTML;
      },
      { template, selectors: HEAD_SELECTORS },
    );

    const outDir = route === "/" ? dist : join(dist, route);
    mkdirSync(outDir, { recursive: true });
    writeFileSync(join(outDir, "index.html"), html);
    return true;
  } catch (err) {
    console.warn(`[prerender] ${route}: ${err.message.split("\n")[0]}`);
    return false;
  } finally {
    await page.close();
  }
}

const routes = sitemapRoutes();
const concurrency = Math.max(1, Number(process.env.PRERENDER_CONCURRENCY) || 4);
let ok = 0;
let next = 0;
const started = Date.now();

// Render "/" last so the SPA fallback keeps serving the clean template meanwhile.
const ordered = [...routes.filter((r) => r !== "/"), "/"];
async function worker() {
  while (next < ordered.length) {
    const r = ordered[next++];
    if (await render(r)) ok += 1;
  }
}
await Promise.all(Array.from({ length: concurrency }, worker));

// Keep a clean shell for any URL that has no prerendered file.
writeFileSync(join(dist, "spa-shell.html"), template);

await browser.close();
server.close();
console.log(
  `[prerender] ${ok}/${ordered.length} pages written in ${((Date.now() - started) / 1000).toFixed(1)}s`,
);
