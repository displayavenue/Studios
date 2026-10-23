import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

/** Resolve monorepo `data/cms` whether running from package dist, api, or admin. */
export function resolveCmsDir(): string {
  const fromEnv = process.env.HP_CMS_DIR;
  if (fromEnv && existsSync(fromEnv)) return fromEnv;

  const here = dirname(fileURLToPath(import.meta.url));
  const candidates = [
    resolve(here, "../../../data/cms"),
    resolve(here, "../../../../data/cms"),
    resolve(process.cwd(), "data/cms"),
    resolve(process.cwd(), "../data/cms"),
    resolve(process.cwd(), "../../data/cms"),
    resolve(process.cwd(), "homeopathypharma/data/cms"),
  ];

  for (const dir of candidates) {
    if (existsSync(dir)) return dir;
  }

  return join(process.cwd(), "data/cms");
}

export function cmsFile(name: string): string {
  return join(resolveCmsDir(), name);
}
