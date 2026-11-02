<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');

$config = require __DIR__ . '/config.php';

// CORS: only echo back origins we trust (never reflect arbitrary origins)
$origin = (string)($_SERVER['HTTP_ORIGIN'] ?? '');
if ($origin !== '' && in_array($origin, $config['allowed_origins'] ?? [], true)) {
  header('Access-Control-Allow-Origin: ' . $origin);
  header('Access-Control-Allow-Credentials: true');
  header('Access-Control-Allow-Headers: Content-Type');
  header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
  header('Vary: Origin');
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(204);
  exit;
}

session_name('da_admin');
session_start([
  'cookie_httponly' => true,
  'cookie_secure' => (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off'),
  'cookie_samesite' => 'Strict',
  'use_strict_mode' => true,
]);

function respond(int $code, array $payload): void {
  http_response_code($code);
  echo json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
  exit;
}

function isAuthed(array $config): bool {
  if (empty($_SESSION['da_auth'])) return false;
  $ttl = (int)($config['session_ttl'] ?? 28800);
  if (empty($_SESSION['da_auth_at']) || (time() - (int)$_SESSION['da_auth_at']) > $ttl) {
    $_SESSION = [];
    return false;
  }
  return true;
}

function contentPath(array $config, string $collection): string {
  $allowed = $config['collections'] ?? [];
  if (!isset($allowed[$collection])) {
    respond(400, ['ok' => false, 'error' => 'Unknown collection']);
  }
  $dir = rtrim($config['content_dir'], '/\\');
  return $dir . '/' . $collection . '.json';
}

function readJson(string $path): array {
  if (!is_file($path)) respond(404, ['ok' => false, 'error' => 'File not found']);
  $raw = file_get_contents($path);
  $data = json_decode($raw ?: 'null', true);
  if (!is_array($data)) respond(500, ['ok' => false, 'error' => 'Invalid JSON']);
  return $data;
}

function writeJson(string $path, $data): void {
  $dir = dirname($path);
  if (!is_dir($dir)) mkdir($dir, 0755, true);
  $json = json_encode($data, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
  if ($json === false) respond(500, ['ok' => false, 'error' => 'Encode failed']);
  $tmp = $path . '.tmp';
  if (file_put_contents($tmp, $json . "\n") === false) {
    respond(500, ['ok' => false, 'error' => 'Write failed — check folder permissions on /content']);
  }
  rename($tmp, $path);
}

/** File-based failed-login counter per IP (works on shared hosting). */
function loginRatePath(): string {
  $dir = sys_get_temp_dir() . '/da-admin-login';
  if (!is_dir($dir)) @mkdir($dir, 0700, true);
  $ip = (string)($_SERVER['REMOTE_ADDR'] ?? 'unknown');
  return $dir . '/' . hash('sha256', $ip) . '.json';
}

function loginRateRead(): array {
  $path = loginRatePath();
  if (!is_file($path)) return ['fails' => 0, 'first' => 0];
  $data = json_decode((string)@file_get_contents($path), true);
  return is_array($data) ? $data + ['fails' => 0, 'first' => 0] : ['fails' => 0, 'first' => 0];
}

function verifyAdminPassword(array $config, string $password): bool {
  if ($password === '') return false;
  $hash = (string)($config['admin_password_hash'] ?? '');
  if ($hash !== '') return password_verify($password, $hash);
  // Legacy plain-text password (discouraged) — still constant-time compared
  $plain = (string)($config['admin_password'] ?? '');
  if ($plain !== '') return hash_equals($plain, $password);
  return false; // no password configured → login disabled
}

require_once __DIR__ . '/seo-sync.php';
require_once __DIR__ . '/image-upload.php';

$body = [];
$raw = file_get_contents('php://input');
if ($raw) {
  $decoded = json_decode($raw, true);
  if (is_array($decoded)) $body = $decoded;
}

$action = $_GET['action'] ?? ($body['action'] ?? '');

switch ($action) {
  case 'status':
    respond(200, [
      'ok' => true,
      'authenticated' => isAuthed($config),
      'collections' => $config['collections'],
    ]);

  case 'login':
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
      respond(405, ['ok' => false, 'error' => 'POST required']);
    }
    $maxAttempts = (int)($config['login_max_attempts'] ?? 5);
    $lockout = (int)($config['login_lockout_seconds'] ?? 900);
    $rate = loginRateRead();
    if ($rate['first'] && (time() - (int)$rate['first']) > $lockout) {
      $rate = ['fails' => 0, 'first' => 0];
    }
    if ((int)$rate['fails'] >= $maxAttempts) {
      $wait = max(1, (int)ceil(($lockout - (time() - (int)$rate['first'])) / 60));
      respond(429, ['ok' => false, 'error' => "Too many failed attempts. Try again in {$wait} min."]);
    }
    $password = (string)($body['password'] ?? '');
    if (!verifyAdminPassword($config, $password)) {
      $rate['fails'] = (int)$rate['fails'] + 1;
      if (!$rate['first']) $rate['first'] = time();
      @file_put_contents(loginRatePath(), json_encode($rate), LOCK_EX);
      usleep(500000);
      respond(401, ['ok' => false, 'error' => 'Incorrect password']);
    }
    @unlink(loginRatePath());
    session_regenerate_id(true);
    $_SESSION['da_auth'] = true;
    $_SESSION['da_auth_at'] = time();
    respond(200, ['ok' => true, 'authenticated' => true]);

  case 'logout':
    $_SESSION = [];
    if (ini_get('session.use_cookies')) {
      $p = session_get_cookie_params();
      setcookie(session_name(), '', time() - 42000, $p['path'], $p['domain'], $p['secure'], $p['httponly']);
    }
    session_destroy();
    respond(200, ['ok' => true, 'authenticated' => false]);

  case 'list':
    if (!isAuthed($config)) respond(401, ['ok' => false, 'error' => 'Login required']);
    respond(200, ['ok' => true, 'collections' => $config['collections']]);

  case 'get':
    // Public read for the website OR authenticated admin
    $collection = (string)($_GET['collection'] ?? ($body['collection'] ?? ''));
    $path = contentPath($config, $collection);
    respond(200, ['ok' => true, 'collection' => $collection, 'data' => readJson($path)]);

  case 'save':
    if (!isAuthed($config)) respond(401, ['ok' => false, 'error' => 'Login required']);
    $collection = (string)($body['collection'] ?? '');
    if (!array_key_exists('data', $body)) respond(400, ['ok' => false, 'error' => 'Missing data']);
    $path = contentPath($config, $collection);
    writeJson($path, $body['data']);

    $contentDir = rtrim($config['content_dir'], '/\\');
    $publicDir = dirname($contentDir);
    $seo = da_sync_seo_artifacts($contentDir, $publicDir);

    respond(200, [
      'ok' => true,
      'saved' => $collection,
      'seo' => $seo,
    ]);

  case 'sync-seo':
    if (!isAuthed($config)) respond(401, ['ok' => false, 'error' => 'Login required']);
    $contentDir = rtrim($config['content_dir'], '/\\');
    $publicDir = dirname($contentDir);
    $seo = da_sync_seo_artifacts($contentDir, $publicDir);
    if (!$seo['ok']) respond(500, ['ok' => false, 'error' => $seo['error'] ?? 'SEO sync failed']);
    respond(200, ['ok' => true, 'seo' => $seo]);

  case 'upload-image':
    if (!isAuthed($config)) respond(401, ['ok' => false, 'error' => 'Login required']);
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
      respond(405, ['ok' => false, 'error' => 'POST required']);
    }
    if (empty($_FILES['file']) || !is_array($_FILES['file'])) {
      respond(400, ['ok' => false, 'error' => 'No file uploaded']);
    }

    $file = $_FILES['file'];
    $uploadErr = (int)($file['error'] ?? UPLOAD_ERR_NO_FILE);
    if ($uploadErr !== UPLOAD_ERR_OK) {
      respond(400, ['ok' => false, 'error' => da_upload_error_message($uploadErr)]);
    }

    $uploadCfg = $config['uploads'] ?? [];
    $maxBytes = (int)($uploadCfg['max_bytes'] ?? 0);
    $allowed = $uploadCfg['allowed_mimes'] ?? [
      'image/jpeg' => 'jpg',
      'image/png' => 'png',
      'image/webp' => 'webp',
      'image/gif' => 'gif',
    ];

    if ($maxBytes > 0 && ($file['size'] ?? 0) > $maxBytes) {
      $mb = max(1, (int)round($maxBytes / (1024 * 1024)));
      respond(400, ['ok' => false, 'error' => "Image too large — maximum {$mb} MB"]);
    }

    $finfo = new finfo(FILEINFO_MIME_TYPE);
    $mime = $finfo->file($file['tmp_name'] ?: '') ?: '';
    if (!isset($allowed[$mime])) {
      respond(400, ['ok' => false, 'error' => 'Only JPG, PNG, WebP and GIF images are allowed']);
    }

    $contentDir = rtrim($config['content_dir'], '/\\');
    $uploadsDir = $contentDir . '/uploads';
    if (!is_dir($uploadsDir) && !mkdir($uploadsDir, 0755, true)) {
      respond(500, ['ok' => false, 'error' => 'Could not create uploads folder — check /content permissions']);
    }

    $base = preg_replace('/[^a-z0-9-]+/i', '-', pathinfo((string)($file['name'] ?? 'image'), PATHINFO_FILENAME));
    $base = trim(substr(strtolower($base), 0, 40), '-') ?: 'image';
    $filename = gmdate('Ymd-His') . '-' . $base . '-' . bin2hex(random_bytes(3)) . '.webp';
    $dest = $uploadsDir . '/' . $filename;

    $result = da_process_image_upload((string)$file['tmp_name'], $mime, $dest, $uploadCfg);
    if (empty($result['ok'])) {
      respond(500, ['ok' => false, 'error' => $result['error'] ?? 'Image conversion failed']);
    }

    $url = '/content/uploads/' . $filename;
    respond(200, [
      'ok' => true,
      'url' => $url,
      'filename' => $filename,
      'format' => 'webp',
      'bytes' => (int)($result['bytes'] ?? 0),
      'original_bytes' => (int)($file['size'] ?? 0),
    ]);

  default:
    respond(400, ['ok' => false, 'error' => 'Unknown action']);
}
