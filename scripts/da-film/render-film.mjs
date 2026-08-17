#!/usr/bin/env node
/**
 * Render DisplayAvenue 20-min animated film (visuals + Indian female VO).
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
  writeFileSync,
} from "node:fs";
import { join, extname, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = __dirname;
const TIMELINE = JSON.parse(readFileSync(join(ROOT, "timeline.json"), "utf8"));
const DURATION = Math.ceil(TIMELINE.totalVisualSeconds) + 1;
const WIDTH = 1920;
const HEIGHT = 1080;
const DELAY_MS = 4500;
const OUT_RAW = "/tmp/da-film-raw.mp4";
const OUT_FINAL = "/tmp/displayavenue-20min-company-film.mp4";
const OUT_PUBLIC = join(__dirname, "..", "..", "public", "videos", "displayavenue-20min-company-film.mp4");
const OUT_ARTIFACT = "/opt/cursor/artifacts/displayavenue_20min_company_film.mp4";
const VO = join(ROOT, "audio", "full-vo-synced.mp3");
const CHROME =
  process.env.CHROME_PATH ||
  ["/usr/local/bin/google-chrome", "/usr/local/bin/chrome"].find((p) => existsSync(p));

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".json": "application/json",
  ".js": "application/javascript",
  ".css": "text/css",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".ttf": "font/ttf",
  ".mp3": "audio/mpeg",
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
      res.writeHead(200, { "Content-Type": MIME[extname(file).toLowerCase()] || "application/octet-stream" });
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
  if (!existsSync(VO)) throw new Error("Missing VO: " + VO);
  if (!process.env.DISPLAY) process.env.DISPLAY = ":99";

  mkdirSync(dirname(OUT_PUBLIC), { recursive: true });
  mkdirSync("/opt/cursor/artifacts", { recursive: true });
  rmSync(OUT_RAW, { force: true });
  rmSync(OUT_FINAL, { force: true });

  const { server, port } = await startServer();
  const url = `http://127.0.0.1:${port}/index.html?delay=${DELAY_MS}`;
  console.log("Serving", url);
  console.log("Duration", DURATION, "s (~", (DURATION / 60).toFixed(2), "min)");
  console.log("Voice", TIMELINE.voice);

  const userData = `/tmp/chrome-da-film-${process.pid}`;
  rmSync(userData, { recursive: true, force: true });
  mkdirSync(userData, { recursive: true });

  const chrome = spawn(
    CHROME,
    [
      `--user-data-dir=${userData}`,
      "--no-first-run",
      "--no-default-browser-check",
      "--disable-infobars",
      "--disable-session-crashed-bubble",
      "--hide-scrollbars",
      "--mute-audio",
      "--autoplay-policy=no-user-gesture-required",
      `--window-size=${WIDTH},${HEIGHT}`,
      "--window-position=0,0",
      "--force-device-scale-factor=1",
      "--kiosk",
      "--app=" + url,
    ],
    { stdio: ["ignore", "pipe", "pipe"], env: { ...process.env, DISPLAY: process.env.DISPLAY } }
  );

  console.log(`Waiting ${DELAY_MS}ms for film start…`);
  await sleep(DELAY_MS + 400);

  console.log(`Recording ${DURATION}s…`);
  const startedAt = Date.now();
  writeFileSync("/tmp/da-film-render-started.txt", String(startedAt));
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
      "veryfast",
      "-crf",
      "20",
      "-movflags",
      "+faststart",
      OUT_RAW,
    ],
    { stdio: ["ignore", "pipe", "pipe"] }
  );

  let ffLog = "";
  ffmpeg.stderr.on("data", (d) => {
    ffLog += d.toString();
  });
  const code = await waitExit(ffmpeg);
  chrome.kill("SIGTERM");
  await sleep(800);
  try {
    chrome.kill("SIGKILL");
  } catch {}
  server.close();

  if (code !== 0 || !existsSync(OUT_RAW)) {
    console.error(ffLog.slice(-4000));
    throw new Error("ffmpeg capture failed: " + code);
  }

  console.log("Muxing Indian female VO…");
  execFileSync(
    "ffmpeg",
    [
      "-y",
      "-i",
      OUT_RAW,
      "-i",
      VO,
      "-c:v",
      "copy",
      "-c:a",
      "aac",
      "-b:a",
      "192k",
      "-shortest",
      "-movflags",
      "+faststart",
      OUT_FINAL,
    ],
    { stdio: "inherit" }
  );

  copyFileSync(OUT_FINAL, OUT_PUBLIC);
  copyFileSync(OUT_FINAL, OUT_ARTIFACT);
  const mb = (statSync(OUT_PUBLIC).size / (1024 * 1024)).toFixed(1);
  const probe = execFileSync(
    "ffprobe",
    ["-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", OUT_PUBLIC],
    { encoding: "utf8" }
  ).trim();
  console.log(`Wrote ${OUT_PUBLIC} (${mb} MB, ${probe}s)`);
  console.log(`Wrote ${OUT_ARTIFACT}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
