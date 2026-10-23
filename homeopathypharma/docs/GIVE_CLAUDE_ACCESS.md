# Give Claude access to this website

Claude cannot log into Hostinger by itself. You grant access in one of these ways.

## Option A — Claude in Cursor (simplest)

1. Open this GitHub repo in Cursor: `displayavenue/Studios`.
2. In the chat model picker, choose **Claude**.
3. Ask for edits (“change homepage banner”, “fix admin login”, etc.).
4. Cursor/Claude edits the repo; we deploy to Hostinger when you ask.

No Hostinger password needed in Claude for code edits — only when you ask to deploy live.

`CLAUDE.md` in this folder is the project brief Claude should follow.

## Option B — Claude Code on your computer

1. Install [Claude Code](https://claude.ai/code) and log in with your Anthropic account.
2. Clone the repo:

```bash
git clone https://github.com/displayavenue/Studios.git
cd Studios/homeopathypharma
```

3. Open Claude Code in that folder. It will read `CLAUDE.md` for project rules.
4. To let Claude deploy/SSH to Hostinger, set the password in **your** terminal only:

```bash
# Get password from Hostinger hPanel → Advanced → SSH Access
export SSH_PASS='YOUR_SSH_PASSWORD'
./scripts/ssh-hostinger.sh 'php artisan --version'
```

5. Tell Claude: “Use `./scripts/ssh-hostinger.sh` for server commands; never print or commit `SSH_PASS`.”

## Option C — Claude.ai Project (web)

1. Go to [claude.ai](https://claude.ai) → **Projects** → New project.
2. Upload or sync the `homeopathypharma/` folder (or paste key files).
3. Attach `CLAUDE.md` so Claude knows paths and deploy rules.
4. Copy suggested code back into GitHub/Cursor, then deploy.

Claude.ai cannot SSH to Hostinger unless you paste outputs into a machine that has `SSH_PASS`.

## Option D — Live server git mirror (ready on Hostinger)

Hostinger keeps a **sparse git mirror** next to the live app (does not replace `laravel/` until you sync):

| Path | Role |
|------|------|
| `~/domains/homeopathypharma.com/Studios` | Sparse clone (`homeopathypharma/` only) |
| `~/domains/homeopathypharma.com/laravel` | Live Laravel app (`.env` stays here) |

### One-time init / re-init

```bash
export SSH_PASS='…'   # hPanel → Advanced → SSH Access
cd homeopathypharma
./scripts/init-hostinger-git.sh
# optional branch:
./scripts/init-hostinger-git.sh cursor/homeopathy-pharma-master-rebuild-846f
```

Repo is currently **public**, so HTTPS clone works with no deploy key.

### Pull + sync into live (safe defaults)

```bash
./scripts/sync-hostinger-from-git.sh              # dry-run only
./scripts/sync-hostinger-from-git.sh --apply       # write files, keep .env, clear view cache
```

Excludes always: `.env`, `vendor/`, `storage/` runtime dirs, `tests/`.

### If the GitHub repo becomes private

A read-only deploy keypair already exists on Hostinger:

- Private key: `~/.ssh/hp_github_deploy`
- Public key (add in GitHub → **Settings → Deploy keys** → Allow read-only):

```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIDwR56y0doRL8bSZpOW9IiVwikchWROrrX43wahJWzBe homeopathypharma-hostinger-deploy
```

Then point the mirror remote at SSH:

```bash
./scripts/ssh-hostinger.sh 'cd ~/domains/homeopathypharma.com/Studios && git remote set-url origin git@github.com:displayavenue/Studios.git'
```

(Cursor’s GitHub token cannot add deploy keys via API — paste the public key in the GitHub UI once.)

## What to share with Claude (safe)

| Share | Don’t share in chat/repo |
|--------|---------------------------|
| GitHub repo URL | Production `APP_KEY` |
| File paths from `CLAUDE.md` | DB passwords |
| SSH host/user/port | Commit `SSH_PASS` |
| Admin URL | Paste passwords into public Issues |

Put secrets only in: Hostinger hPanel, local `export SSH_PASS=…`, or Cursor environment secrets.
