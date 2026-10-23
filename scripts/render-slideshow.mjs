#!/usr/bin/env node
/**
 * Real-time render of the DisplayAvenue animated slideshow to MP4.
 * Opens Chrome on the current DISPLAY and records with ffmpeg x11grab.
 */
import { spawn, execFileSync } from "node:child_process";
import { createServer } from "node:http";
import {
  readFileSync,
  mkdirSync,
  rmSync,
  existsSync,
  copyFileSync,
  statSync,
} from "node:fs";
import { join, extname, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "slideshow");
const OUT_TMP = "/tmp/displayavenue-slideshow.mp4";
const OUT_PUBLIC = join(__dirname, "..", "public", "videos", "displayavenue-slideshow.mp4");
const OUT_ARTIFACT = "/opt/cursor/artifacts/displayavenue_animated_slideshow.mp4";
const WIDTH = 1920;
const HEIGHT = 1080;
const DURATION = 40; // seconds (covers all slides + buffer)
const CHROME =
  process.env.CHROME_PATH ||
  ["/usr/local/bin/google-chrome", "/usr/local/bin/chrome", "/usr/bin/google-chrome"].find((p) =>
    existsSync(p)
  );

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".ttf": "font/ttf",
};

function startServer() {
  return new Promise((resolve) => {
    const server = createServer((req, res) => {
      const urlPath = decodeURIComponent((req.url || "/").split("?")[0]);
      const safe = urlPath === "/" ? "/index.html" : urlPath;
      const file = join(ROOT, safe.replace(/^\//, ""));
      if (!file.startsWith(ROOT) || !existsSync(file) || statSync(file).isDirectory()) {
        res.writeHead(404);
        res.end("Not found");
        return;
      }
      res.writeHead(200, {
        "Content-Type": MIME[extname(file).toLowerCase()] || "application/octet-stream",
      });
      res.end(readFileSync(file));
    });
    server.listen(0, "127.0.0.1", () => resolve({ server, port: server.address().port }));
  });
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function waitExit(child) {
  return new Promise((resolve) => child.once("close", resolve));
}

async function main() {
  if (!CHROME) throw new Error("Chrome not found");
  if (!process.env.DISPLAY) process.env.DISPLAY = ":1";

  mkdirSync(dirname(OUT_PUBLIC), { recursive: true });
  mkdirSync("/opt/cursor/artifacts", { recursive: true });
  rmSync(OUT_TMP, { force: true });

  const { server, port } = await startServer();
  // delay=4500 in the page; we start ffmpeg at ~4.5s so slide 1 is captured fully
  const url = `http://127.0.0.1:${port}/index.html?delay=4500`;
  console.log("Serving", url, "DISPLAY=", process.env.DISPLAY);

  const userData = `/tmp/chrome-slideshow-${process.pid}`;
  rmSync(userData, { recursive: true, force: true });
  mkdirSync(userData, { recursive: true });

  // Position a fixed-size Chrome window for clean capture
  const chrome = spawn(
    CHROME,
    [
      `--user-data-dir=${userData}`,
      "--no-first-run",
      "--no-default-browser-check",
      "--disable-infobars",
      "--disable-session-crashed-bubble",
      "--disable-features=TranslateUI",
      "--hide-scrollbars",
      "--mute-audio",
      "--autoplay-policy=no-user-gesture-required",
      `--window-size=${WIDTH},${HEIGHT}`,
      `--window-position=0,0`,
      "--force-device-scale-factor=1",
      "--start-fullscreen",
      "--kiosk",
      "--app=" + url,
    ],
    {
      stdio: ["ignore", "pipe", "pipe"],
      env: { ...process.env, DISPLAY: process.env.DISPLAY },
    }
  );

  let chromeLog = "";
  chrome.stderr.on("data", (d) => {
    chromeLog += d.toString();
  });

  // Let Chrome paint the first frame / load fonts, then sync with page delay=4500
  console.log("Waiting for Chrome to load and slideshow start…");
  await sleep(4500);

  console.log(`Recording ${DURATION}s at 30fps…`);
  const ffmpeg = spawn(
    "ffmpeg",
    [
      "-y",
      "-video_size",
      `${WIDTH}x${HEIGHT}`,
      "-framerate",
      "30",
      "-draw_mouse",
      "0",
      "-f",
      "x11grab",
      "-i",
      `${process.env.DISPLAY}+0,0`,
      "-t",
      String(DURATION),
      "-c:v",
      "libx264",
      "-pix_fmt",
      "yuv420p",
      "-preset",
      "medium",
      "-crf",
      "18",
      "-movflags",
      "+faststart",
      OUT_TMP,
    ],
    { stdio: ["ignore", "pipe", "pipe"] }
  );

  let ffLog = "";
  ffmpeg.stderr.on("data", (d) => {
    ffLog += d.toString();
  });

  const code = await waitExit(ffmpeg);
  chrome.kill("SIGTERM");
  await sleep(500);
  try {
    chrome.kill("SIGKILL");
  } catch {
    /* ignore */
  }
  server.close();

  if (code !== 0 || !existsSync(OUT_TMP)) {
    console.error("ffmpeg failed", code);
    console.error(ffLog.slice(-3000));
    console.error(chromeLog.slice(-1500));
    process.exit(1);
  }

  copyFileSync(OUT_TMP, OUT_PUBLIC);
  copyFileSync(OUT_TMP, OUT_ARTIFACT);
  const sizeMb = (statSync(OUT_PUBLIC).size / (1024 * 1024)).toFixed(1);
  console.log(`Wrote ${OUT_PUBLIC} (${sizeMb} MB)`);
  console.log(`Wrote ${OUT_ARTIFACT}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
