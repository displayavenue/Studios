<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: ' . (isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '*'));
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(204);
  exit;
}

$config = require __DIR__ . '/config.php';
session_name('da_admin');
session_start([
  'cookie_httponly' => true,
  'cookie_samesite' => 'Lax',
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

require_once __DIR__ . '/seo-sync.php';

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
    $password = (string)($body['password'] ?? '');
    if ($password === '' || !hash_equals((string)$config['admin_password'], $password)) {
      respond(401, ['ok' => false, 'error' => 'Incorrect password']);
    }
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
    if (($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
      respond(400, ['ok' => false, 'error' => 'Upload failed — try a smaller image (max 5 MB)']);
    }

    $uploadCfg = $config['uploads'] ?? [];
    $maxBytes = (int)($uploadCfg['max_bytes'] ?? 5 * 1024 * 1024);
    $allowed = $uploadCfg['allowed_mimes'] ?? [
      'image/jpeg' => 'jpg',
      'image/png' => 'png',
      'image/webp' => 'webp',
      'image/gif' => 'gif',
    ];

    if (($file['size'] ?? 0) > $maxBytes) {
      respond(400, ['ok' => false, 'error' => 'Image too large — maximum 5 MB']);
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

    $ext = $allowed[$mime];
    $base = preg_replace('/[^a-z0-9-]+/i', '-', pathinfo((string)($file['name'] ?? 'image'), PATHINFO_FILENAME));
    $base = trim(substr(strtolower($base), 0, 40), '-') ?: 'image';
    $filename = gmdate('Ymd-His') . '-' . $base . '-' . bin2hex(random_bytes(3)) . '.' . $ext;
    $dest = $uploadsDir . '/' . $filename;

    if (!move_uploaded_file($file['tmp_name'], $dest)) {
      respond(500, ['ok' => false, 'error' => 'Could not save image — check /content/uploads permissions']);
    }

    @chmod($dest, 0644);
    $url = '/content/uploads/' . $filename;
    respond(200, [
      'ok' => true,
      'url' => $url,
      'filename' => $filename,
      'bytes' => (int)($file['size'] ?? 0),
    ]);

  default:
    respond(400, ['ok' => false, 'error' => 'Unknown action']);
}
