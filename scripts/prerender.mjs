#!/usr/bin/env node
/**
 * Prerender every page listed in sitemap.xml into static HTML.
 *
 * Why: AI crawlers (GPTBot, ClaudeBot, PerplexityBot, Bingbot …) do not run
 * JavaScript, so without this they see an empty page. After `vite build`, this
 * opens each route in headless Chrome, waits for React + CMS content, and
 * writes the finished markup + SEO tags into:
 *   dist/index.html            → homepage
 *   dist/_pre/<route>.html     → every other page
 *   dist/_shell.html           → empty app shell (fallback for unknown URLs)
 * .htaccess serves the matching _pre file; the browser then boots React as usual.
 *
 * Chrome: set CHROME_PATH, or it tries the usual install locations.
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(ROOT, "dist");
const PORT = 4789;
const ORIGIN = `http://127.0.0.1:${PORT}`;

const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/google-chrome-stable",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
].filter(Boolean);

const chrome = CHROME_CANDIDATES.find((p) => fs.existsSync(p));
if (!chrome) {
  console.error("prerender: no Chrome/Edge found — set CHROME_PATH. Skipping (site still works, but crawlers see empty pages).");
  process.exit(1);
}

const shellPath = path.join(DIST, "index.html");
const shell = fs.existsSync(path.join(DIST, "_shell.html"))
  ? fs.readFileSync(path.join(DIST, "_shell.html"), "utf8")
  : fs.readFileSync(shellPath, "utf8");
fs.writeFileSync(path.join(DIST, "_shell.html"), shell);

// Routes from the sitemap
const sitemap = fs.readFileSync(path.join(DIST, "sitemap.xml"), "utf8");
const routes = [...sitemap.matchAll(/<loc>https?:\/\/[^/]+(\/[^<]*)<\/loc>/g)]
  .map((m) => m[1].replace(/\/$/, "") || "/")
  .filter((r, i, all) => all.indexOf(r) === i);

// Tiny static server with SPA fallback to the shell
const MIME = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".svg": "image/svg+xml", ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp",
  ".woff2": "font/woff2", ".woff": "font/woff", ".txt": "text/plain", ".xml": "application/xml",
};
const server = http.createServer((req, res) => {
  const url = decodeURIComponent(req.url.split("?")[0]);
  const file = path.join(DIST, url);
  if (url !== "/" && file.startsWith(DIST) && fs.existsSync(file) && fs.statSync(file).isFile()) {
    res.writeHead(200, { "Content-Type": MIME[path.extname(file)] || "application/octet-stream" });
    fs.createReadStream(file).pipe(res);
    return;
  }
  res.writeHead(200, { "Content-Type": MIME[".html"] });
  res.end(shell);
});
await new Promise((r) => server.listen(PORT, "127.0.0.1", r));

const browser = await puppeteer.launch({
  executablePath: chrome,
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});

const esc = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

function buildHtml(snap) {
  let html = shell;
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(snap.title)}</title>`);
  const extra = [];
  for (const m of snap.metas) {
    const attr = m.name ? "name" : "property";
    const key = m.name || m.property;
    const re = new RegExp(`<meta\\s+${attr}="${key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"[\\s\\S]*?\\/>`);
    const tag = `<meta ${attr}="${esc(key)}" content="${esc(m.content)}" />`;
    if (re.test(html)) html = html.replace(re, tag);
    else extra.push(tag);
  }
  if (snap.canonical) {
    html = html.replace(/<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${esc(snap.canonical)}" />`);
  }
  extra.push(...snap.jsonLd);
  html = html.replace("</head>", `    ${extra.join("\n    ")}\n  </head>`);
  html = html.replace('<div id="root"></div>', `<div id="root">${snap.body}</div>`);
  return html;
}

let ok = 0;
const failed = [];
const queue = [...routes];
async function worker() {
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });
  await page.setRequestInterception(true);
  page.on("request", (r) => (r.url().startsWith(ORIGIN) ? r.continue() : r.abort()));
  while (queue.length) {
    const route = queue.shift();
    try {
      await page.goto(ORIGIN + route, { waitUntil: "networkidle0", timeout: 30000 });
      await page.waitForSelector("main h1", { timeout: 10000 });
      const snap = await page.evaluate(() => {
        const root = document.getElementById("root").cloneNode(true);
        // reveal-on-scroll content should be visible in the static copy
        root.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-visible"));
        root.querySelectorAll("iframe").forEach((el) => el.remove());
        return {
          title: document.title,
          canonical: document.querySelector('link[rel="canonical"]')?.getAttribute("href") || "",
          metas: [...document.head.querySelectorAll("meta[name], meta[property]")]
            .filter((m) => m.getAttribute("content") !== null)
            .filter((m) => !/^(viewport|theme-color|google-site-verification)$/.test(m.getAttribute("name") || ""))
            .map((m) => ({ name: m.getAttribute("name"), property: m.getAttribute("property"), content: m.getAttribute("content") })),
          jsonLd: [...document.head.querySelectorAll('script[type="application/ld+json"]')].map((s) => s.outerHTML),
          body: root.innerHTML,
        };
      });
      const out = route === "/" ? shellPath : path.join(DIST, "_pre", `${route.slice(1)}.html`);
      fs.mkdirSync(path.dirname(out), { recursive: true });
      fs.writeFileSync(out, buildHtml(snap));
      ok++;
    } catch (e) {
      failed.push(`${route}: ${e.message.split("\n")[0]}`);
    }
  }
  await page.close();
}
await Promise.all(Array.from({ length: 4 }, worker));
await browser.close();
server.close();

console.log(`prerender: ${ok}/${routes.length} pages written`);
if (failed.length) {
  console.log("prerender: failed:\n  " + failed.join("\n  "));
  process.exit(1);
}
