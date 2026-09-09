import { createRequire } from 'module';
import { pathToFileURL } from 'url';
import path from 'path';

// Use tsx to run TypeScript seed entry
import { spawnSync } from 'child_process';
const r = spawnSync('npx', ['tsx', 'scripts/seed-marketplace-experts.ts'], {
  cwd: process.cwd(),
  stdio: 'inherit',
  env: process.env,
});
process.exit(r.status ?? 1);
