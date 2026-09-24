import { cpSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const srcStyles = join(root, "../src/styles");
const distStyles = join(root, "../dist/styles");

mkdirSync(distStyles, { recursive: true });
cpSync(join(srcStyles, "index.css"), join(distStyles, "index.css"));
cpSync(join(srcStyles, "tokens.css"), join(distStyles, "tokens.css"));
cpSync(join(srcStyles, "focus-ring.css"), join(distStyles, "focus-ring.css"));
