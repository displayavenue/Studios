#!/usr/bin/env bash
# Deploy HOMEOPATHY PHARMA Laravel app to Hostinger shared hosting over SSH.
# Requires: SSH_PASS (and optional SSH_HOST, SSH_PORT)
# Does NOT invent MySQL — uses SQLite outside web root unless DB_* are provided.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
HOST="${SSH_HOST:-u452926742@195.35.44.93}"
PORT="${SSH_PORT:-65002}"
REMOTE_BASE="${SSH_REMOTE_BASE:-domains/homeopathypharma.com}"
PASS="${SSH_PASS:?Set SSH_PASS}"
export SSHPASS="$PASS"

SSH=(sshpass -e ssh -o StrictHostKeyChecking=no -o PreferredAuthentications=password -o PubkeyAuthentication=no -p "$PORT" "$HOST")
RSYNC_RSH="sshpass -e ssh -o StrictHostKeyChecking=no -o PreferredAuthentications=password -o PubkeyAuthentication=no -p $PORT"

STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
LOCAL_BUNDLE="/tmp/hp-laravel-deploy-$STAMP"
ADMIN_PASS_FILE="/tmp/hp-admin-pass-$STAMP.txt"

echo "==> Preparing local bundle"
rm -rf "$LOCAL_BUNDLE"
mkdir -p "$LOCAL_BUNDLE"
rsync -a \
  --exclude='.git' \
  --exclude='node_modules' \
  --exclude='vendor' \
  --exclude='.env' \
  --exclude='database/*.sqlite' \
  --exclude='storage/logs/*' \
  --exclude='storage/framework/cache/data/*' \
  --exclude='storage/framework/sessions/*' \
  --exclude='storage/framework/views/*' \
  --exclude='storage/pail' \
  --exclude='tests' \
  --exclude='.phpunit.result.cache' \
  "$ROOT/" "$LOCAL_BUNDLE/"

# Ensure empty writable storage scaffolding exists in the bundle
mkdir -p \
  "$LOCAL_BUNDLE/storage/app/public" \
  "$LOCAL_BUNDLE/storage/framework/cache/data" \
  "$LOCAL_BUNDLE/storage/framework/sessions" \
  "$LOCAL_BUNDLE/storage/framework/views" \
  "$LOCAL_BUNDLE/storage/logs" \
  "$LOCAL_BUNDLE/bootstrap/cache" \
  "$LOCAL_BUNDLE/database"
touch "$LOCAL_BUNDLE/storage/logs/.gitkeep"
touch "$LOCAL_BUNDLE/database/database.sqlite"

APP_KEY="base64:$(openssl rand -base64 32)"
ADMIN_PASS="$(openssl rand -base64 18 | tr -d '/+=' | head -c 20)Aa1!"
ADMIN_EMAIL="${ADMIN_EMAIL:-admin@homeopathypharma.com}"
printf '%s\n' "$ADMIN_PASS" > "$ADMIN_PASS_FILE"
chmod 600 "$ADMIN_PASS_FILE"

cat > "$LOCAL_BUNDLE/.env" <<EOF
APP_NAME="HOMEOPATHY PHARMA"
APP_ENV=production
APP_KEY=$APP_KEY
APP_DEBUG=false
APP_URL=https://homeopathypharma.com

APP_LOCALE=en
APP_FALLBACK_LOCALE=en
APP_FAKER_LOCALE=en_IN

APP_MAINTENANCE_DRIVER=file
BCRYPT_ROUNDS=12

LOG_CHANNEL=stack
LOG_STACK=single
LOG_LEVEL=error

DB_CONNECTION=sqlite
# DB file path is absolute on the server (set after upload in remote step)

SESSION_DRIVER=database
SESSION_LIFETIME=120
SESSION_ENCRYPT=false
SESSION_PATH=/
SESSION_DOMAIN=null
SESSION_SECURE_COOKIE=true

BROADCAST_CONNECTION=log
FILESYSTEM_DISK=public
QUEUE_CONNECTION=database
CACHE_STORE=database

MAIL_MAILER=log
MAIL_FROM_ADDRESS="noreply@homeopathypharma.com"
MAIL_FROM_NAME="\${APP_NAME}"

ADMIN_EMAIL=$ADMIN_EMAIL
ADMIN_PASSWORD=$ADMIN_PASS

ALLOW_SQLITE_PRODUCTION=true

RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=

SHIPROCKET_EMAIL=
SHIPROCKET_PASSWORD=
SHIPROCKET_BASE_URL=https://apiv2.shiprocket.in/v1
SHIPROCKET_WEBHOOK_SECRET=
EOF

echo "==> Remote backup of public_html"
"${SSH[@]}" "mkdir -p ~/backups && \
  tar -czf ~/backups/homeopathypharma-public_html-$STAMP.tgz -C ~/$REMOTE_BASE public_html && \
  ls -lh ~/backups/homeopathypharma-public_html-$STAMP.tgz"

echo "==> Ensure remote laravel directory"
"${SSH[@]}" "mkdir -p ~/$REMOTE_BASE/laravel"

echo "==> Upload application (rsync)"
rsync -az --delete \
  -e "$RSYNC_RSH" \
  --exclude='.git' \
  "$LOCAL_BUNDLE/" "$HOST:~/$REMOTE_BASE/laravel/"

echo "==> Remote install, migrate, wire document root"
"${SSH[@]}" "STAMP='$STAMP' REMOTE_BASE='$REMOTE_BASE' bash -s" <<'EOS'
set -euo pipefail
APP="$HOME/$REMOTE_BASE/laravel"
PUB="$HOME/$REMOTE_BASE/public_html"
cd "$APP"

# Absolute sqlite path in .env
DB_FILE="$APP/database/database.sqlite"
touch "$DB_FILE"
# Rewrite DB path line
if grep -q '^DB_DATABASE=' .env; then
  sed -i "s|^DB_DATABASE=.*|DB_DATABASE=$DB_FILE|" .env
else
  printf '\nDB_DATABASE=%s\n' "$DB_FILE" >> .env
fi

export COMPOSER_MEMORY_LIMIT=-1
composer install --no-dev -o --no-interaction

php artisan migrate --force
php artisan db:seed --class=SiteSettingsSeeder --force
php artisan db:seed --class=HomepageSectionSeeder --force
php artisan db:seed --class=PolicyPageSeeder --force
php artisan db:seed --class=AdminUserSeeder --force
# Hostinger often disables exec(); create the public storage link manually.
rm -f "$APP/public/storage"
ln -s "$APP/storage/app/public" "$APP/public/storage" || true
php artisan config:cache
php artisan route:cache
php artisan view:cache
# Run preflight before relying on config:cache env() quirks — clear then check then re-cache if needed
php artisan config:clear >/dev/null
php artisan hp:preflight || true
php artisan config:cache

# Move previous public_html aside (backup tarball already made) and publish public/
KEEP_BACKUP="$HOME/backups/public_html-live-$STAMP"
if [ -d "$PUB" ]; then
  rm -rf "$KEEP_BACKUP"
  mv "$PUB" "$KEEP_BACKUP"
fi
mkdir -p "$PUB"
# Copy public assets
cp -a "$APP/public/." "$PUB/"

# Point index.php at sibling laravel app
cat > "$PUB/index.php" <<'PHP'
<?php

use Illuminate\Foundation\Application;
use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

if (file_exists($maintenance = __DIR__.'/../laravel/storage/framework/maintenance.php')) {
    require $maintenance;
}

require __DIR__.'/../laravel/vendor/autoload.php';

/** @var Application $app */
$app = require_once __DIR__.'/../laravel/bootstrap/app.php';

$app->handleRequest(Request::capture());
PHP

# Harden permissions
chmod -R u+rwX,go-rwx "$APP/storage" "$APP/bootstrap/cache" "$APP/database" || true
chmod 600 "$APP/.env" || true
find "$PUB" -type d -exec chmod 755 {} +
find "$PUB" -type f -exec chmod 644 {} +

# Quick local PHP smoke via artisan
php artisan about | head -40
echo DEPLOY_REMOTE_OK
EOS

echo "==> Local cleanup of bundle (keep admin pass file)"
rm -rf "$LOCAL_BUNDLE"
echo "ADMIN_PASS_FILE=$ADMIN_PASS_FILE"
echo "ADMIN_EMAIL=$ADMIN_EMAIL"
echo "BACKUP_STAMP=$STAMP"
echo "DONE"
