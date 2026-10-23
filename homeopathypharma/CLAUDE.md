# HOMEOPATHY PHARMA — notes for Claude

You are editing a Laravel 13 storefront + admin that deploys to Hostinger.

## Repo layout

- App root: `homeopathypharma/`
- Public CSS: `public/css/app.css`, `public/css/storefront.css`
- Homepage: `resources/views/home/index.blade.php`
- Header/footer: `resources/views/components/`
- Condition SEO pages: `resources/views/conditions/`, model `HealthCondition`
- Deploy helper: `scripts/deploy-hostinger-laravel.sh` (full) and rsync of changed files
- SSH helper: `scripts/ssh-hostinger.sh`

## GitHub (source of truth)

- Remote: `https://github.com/displayavenue/Studios`
- Live `laravel/` is **not** a git working tree. Prefer edit-in-git → rsync, or:
  - `./scripts/init-hostinger-git.sh` — sparse mirror at `domains/…/Studios`
  - `./scripts/sync-hostinger-from-git.sh` — dry-run; add `--apply` only when asked to deploy
- Always keep production `.env` untracked / excluded from sync.

## Hostinger SSH (production)

| Item | Value |
|------|--------|
| SSH | `ssh -p 65002 u452926742@195.35.44.93` |
| App | `~/domains/homeopathypharma.com/laravel` |
| Web | `~/domains/homeopathypharma.com/public_html` |
| Site | https://homeopathypharma.com |
| Admin | https://homeopathypharma.com/admin/login |

Password: **never commit**. Use env `SSH_PASS` from Hostinger hPanel → Advanced → SSH Access.

```bash
export SSH_PASS='…'   # from hPanel only
./scripts/ssh-hostinger.sh
./scripts/ssh-hostinger.sh 'php artisan view:clear && php artisan view:cache'
```

## Safe deploy pattern (preferred)

1. Change files in this repo on a `cursor/…-846f` branch.
2. Commit + push to GitHub.
3. Rsync only needed paths to Hostinger (keep remote `.env`).
4. On server: `php artisan view:clear && php artisan view:cache` (and `migrate` / seed only when required).

Do **not** re-run the full deploy script unless asked — it regenerates `APP_KEY` / admin password.

## Admin content (no code)

Products, doctors, founders, testimonials, conditions copy: use Admin UI when possible.

## Verified business facts

- Brand: HOMEOPATHY PHARMA
- Phone: +91 8169 122333
- Address: Mira Road East, Mumbai (full string in Site Settings)
- Do not invent emails, medical claims, or cure promises.
