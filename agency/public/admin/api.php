<?php
declare(strict_types=1);

header_remove('X-Powered-By');
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: strict-origin-when-cross-origin');
header('X-Frame-Options: DENY');
header('Cache-Control: no-store, no-cache, must-revalidate');
header('Pragma: no-cache');

// Same-origin admin only — do not reflect arbitrary Origins with credentials.
$https = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
  || ((int)($_SERVER['SERVER_PORT'] ?? 0) === 443)
  || (strtolower((string)($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '')) === 'https');
$host = (string)($_SERVER['HTTP_HOST'] ?? '');
$selfOrigin = ($https ? 'https://' : 'http://') . $host;
$reqOrigin = (string)($_SERVER['HTTP_ORIGIN'] ?? '');

if ($reqOrigin !== '') {
  if (!hash_equals($selfOrigin, $reqOrigin)) {
    http_response_code(403);
    echo json_encode(['ok' => false, 'error' => 'Cross-origin requests are not allowed']);
    exit;
  }
  header('Access-Control-Allow-Origin: ' . $selfOrigin);
  header('Access-Control-Allow-Credentials: true');
  header('Vary: Origin');
  header('Access-Control-Allow-Headers: Content-Type');
  header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(204);
  exit;
}

$config = require __DIR__ . '/config.php';
session_name((string)($config['session_name'] ?? 'da_agency_admin'));
session_start([
  'cookie_httponly' => true,
  'cookie_secure' => $https,
  'cookie_samesite' => 'Strict',
  'use_strict_mode' => true,
]);

function respond(int $code, array $payload): void {
  http_response_code($code);
  echo json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
  exit;
}

function clientIp(): string {
  return (string)($_SERVER['REMOTE_ADDR'] ?? '0.0.0.0');
}

function loginAttemptPath(string $ip): string {
  return sys_get_temp_dir() . '/da_agency_login_' . hash('sha256', $ip) . '.json';
}

function readLoginAttempts(string $ip): array {
  $path = loginAttemptPath($ip);
  if (!is_file($path)) return ['count' => 0, 'first' => time(), 'locked_until' => 0];
  $data = json_decode((string)file_get_contents($path), true);
  return is_array($data) ? $data : ['count' => 0, 'first' => time(), 'locked_until' => 0];
}

function writeLoginAttempts(string $ip, array $data): void {
  @file_put_contents(loginAttemptPath($ip), json_encode($data));
}

function clearLoginAttempts(string $ip): void {
  $path = loginAttemptPath($ip);
  if (is_file($path)) @unlink($path);
}

function assertNotRateLimited(array $config): void {
  $ip = clientIp();
  $state = readLoginAttempts($ip);
  $lockedUntil = (int)($state['locked_until'] ?? 0);
  if ($lockedUntil > time()) {
    $wait = $lockedUntil - time();
    respond(429, [
      'ok' => false,
      'error' => "Too many login attempts. Try again in {$wait} seconds.",
    ]);
  }
}

function registerFailedLogin(array $config): void {
  $ip = clientIp();
  $max = (int)($config['login_max_attempts'] ?? 8);
  $lockSecs = (int)($config['login_lockout_seconds'] ?? 900);
  $state = readLoginAttempts($ip);
  $window = 900;
  if ((time() - (int)($state['first'] ?? time())) > $window) {
    $state = ['count' => 0, 'first' => time(), 'locked_until' => 0];
  }
  $state['count'] = (int)($state['count'] ?? 0) + 1;
  if ($state['count'] >= $max) {
    $state['locked_until'] = time() + $lockSecs;
    $state['count'] = 0;
    $state['first'] = time();
  }
  writeLoginAttempts($ip, $state);
}

function assertMutatingSameOrigin(string $selfOrigin): void {
  $method = strtoupper((string)($_SERVER['REQUEST_METHOD'] ?? 'GET'));
  if (!in_array($method, ['POST', 'PUT', 'PATCH', 'DELETE'], true)) return;

  $origin = (string)($_SERVER['HTTP_ORIGIN'] ?? '');
  if ($origin !== '') {
    if (!hash_equals($selfOrigin, $origin)) {
      respond(403, ['ok' => false, 'error' => 'Invalid origin']);
    }
    return;
  }

  $referer = (string)($_SERVER['HTTP_REFERER'] ?? '');
  if ($referer === '' || strpos($referer, $selfOrigin . '/') !== 0 && $referer !== $selfOrigin) {
    respond(403, ['ok' => false, 'error' => 'Missing or invalid referer']);
  }
}

function isAuthed(array $config): bool {
  if (empty($_SESSION['da_auth'])) return false;
  $ttl = (int)($config['session_ttl'] ?? 14400);
  if (empty($_SESSION['da_auth_at']) || (time() - (int)$_SESSION['da_auth_at']) > $ttl) {
    $_SESSION = [];
    return false;
  }
  // Sliding expiration while actively using the CMS
  $_SESSION['da_auth_at'] = time();
  return true;
}

function verifyAdminPassword(array $config, string $password): bool {
  $hash = (string)($config['admin_password_hash'] ?? '');
  if ($hash !== '') {
    return password_verify($password, $hash);
  }
  // Legacy plaintext fallback (migrate ASAP)
  $legacy = (string)($config['admin_password'] ?? '');
  return $legacy !== '' && hash_equals($legacy, $password);
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
  if (!is_file($path)) respond(404, ['ok' => false, 'error' => 'File not found: ' . basename($path)]);
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
    respond(500, ['ok' => false, 'error' => 'Write failed - check folder permissions on /content']);
  }
  rename($tmp, $path);
}

$body = [];
$raw = file_get_contents('php://input');
if ($raw) {
  $decoded = json_decode($raw, true);
  if (is_array($decoded)) $body = $decoded;
}

$action = (string)($_GET['action'] ?? ($body['action'] ?? ''));
$mutating = in_array($action, ['login', 'logout', 'save', 'sync-seo'], true)
  || strtoupper((string)($_SERVER['REQUEST_METHOD'] ?? '')) === 'POST';

if ($mutating) {
  assertMutatingSameOrigin($selfOrigin);
}

switch ($action) {
  case 'status':
    respond(200, [
      'ok' => true,
      'authenticated' => isAuthed($config),
      'collections' => isAuthed($config) ? $config['collections'] : new stdClass(),
    ]);

  case 'login':
    assertNotRateLimited($config);
    $password = (string)($body['password'] ?? '');
    if ($password === '' || !verifyAdminPassword($config, $password)) {
      registerFailedLogin($config);
      // Constant-ish delay to slow brute force
      usleep(350000);
      respond(401, ['ok' => false, 'error' => 'Incorrect password']);
    }
    clearLoginAttempts(clientIp());
    session_regenerate_id(true);
    $_SESSION['da_auth'] = true;
    $_SESSION['da_auth_at'] = time();
    respond(200, ['ok' => true, 'authenticated' => true]);

  case 'logout':
    $_SESSION = [];
    if (ini_get('session.use_cookies')) {
      $p = session_get_cookie_params();
      setcookie(session_name(), '', time() - 42000, $p['path'], $p['domain'] ?? '', (bool)$p['secure'], (bool)$p['httponly']);
    }
    session_destroy();
    respond(200, ['ok' => true, 'authenticated' => false]);

  case 'list':
    if (!isAuthed($config)) respond(401, ['ok' => false, 'error' => 'Login required']);
    respond(200, ['ok' => true, 'collections' => $config['collections']]);

  case 'get':
    if (!isAuthed($config)) respond(401, ['ok' => false, 'error' => 'Login required']);
    $collection = (string)($_GET['collection'] ?? ($body['collection'] ?? ''));
    $path = contentPath($config, $collection);
    respond(200, ['ok' => true, 'collection' => $collection, 'data' => readJson($path)]);

  case 'save':
    if (!isAuthed($config)) respond(401, ['ok' => false, 'error' => 'Login required']);
    $collection = (string)($body['collection'] ?? '');
    if (!array_key_exists('data', $body)) respond(400, ['ok' => false, 'error' => 'Missing data']);
    $path = contentPath($config, $collection);
    writeJson($path, $body['data']);
    require_once __DIR__ . '/seo-sync.php';
    $seo = da_sync_seo_artifacts($config['content_dir'], dirname($config['content_dir']));
    respond(200, ['ok' => true, 'collection' => $collection, 'saved' => true, 'seo' => $seo]);

  case 'sync-seo':
    if (!isAuthed($config)) respond(401, ['ok' => false, 'error' => 'Login required']);
    require_once __DIR__ . '/seo-sync.php';
    $seo = da_sync_seo_artifacts($config['content_dir'], dirname($config['content_dir']));
    respond(200, ['ok' => true, 'seo' => $seo]);

  default:
    respond(400, ['ok' => false, 'error' => 'Unknown action']);
}
