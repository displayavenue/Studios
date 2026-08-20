import path from "path";
import fs from "fs";
import os from "os";

/** Writable reports dir — /tmp on Vercel, local storage/ otherwise. */
export function reportsDir() {
  const base = process.env.VERCEL ? path.join(os.tmpdir(), "displayavenue-os", "reports") : path.join(process.cwd(), "storage", "reports");
  fs.mkdirSync(base, { recursive: true });
  return base;
}
