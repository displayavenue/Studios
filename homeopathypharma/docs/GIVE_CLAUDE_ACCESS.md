# Give Claude access to this website

Claude cannot log into Hostinger by itself. You grant access in one of these ways.

## Option A — Claude in Cursor (simplest)

1. Open this GitHub repo in Cursor: `displayavenue/Studios`.
2. In the chat model picker, choose **Claude**.
3. Ask for edits (“change homepage banner”, “fix admin login”, etc.).
4. Cursor/Claude edits the repo; we deploy to Hostinger when you ask.

No Hostinger password needed in Claude for code edits — only when you ask to deploy live.

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

## Option D — Live server git (optional, advanced)

Hostinger’s `laravel/` folder is currently **not** a git repo. If you want Claude to `git pull` on the server:

1. Create a GitHub deploy key (read-only) or use a private access token.
2. Ask Cursor/Claude: “Initialize git on Hostinger and track branch X.”
3. Keep `.env` untracked forever.

Only do this if you explicitly want production to be git-based.

## What to share with Claude (safe)

| Share | Don’t share in chat/repo |
|--------|---------------------------|
| GitHub repo URL | Production `APP_KEY` |
| File paths from `CLAUDE.md` | DB passwords |
| SSH host/user/port | Commit `SSH_PASS` |
| Admin URL | Paste passwords into public Issues |

Put secrets only in: Hostinger hPanel, local `export SSH_PASS=…`, or Cursor environment secrets.
