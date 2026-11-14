<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$host = ($_SERVER['HTTP_HOST'] ?? '');
$scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
$self = $scheme . '://' . $host;
// Only echo known same-site origins (never "*") when credentials are used
if ($origin && (str_starts_with($origin, 'https://displayavenue.com') || str_starts_with($origin, 'https://www.displayavenue.com') || $origin === $self)) {
  header('Access-Control-Allow-Origin: ' . $origin);
  header('Vary: Origin');
} else {
  header('Access-Control-Allow-Origin: ' . $self);
}
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-DA-Admin-Token');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(204);
  exit;
}

$config = require __DIR__ . '/config.php';

$secure = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
  || (($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https')
  || (($_SERVER['SERVER_PORT'] ?? '') === '443');

session_name((string)($config['session_name'] ?? 'da_agency_admin'));
session_set_cookie_params([
  'lifetime' => (int)($config['session_ttl'] ?? 28800),
  'path' => '/',
  'secure' => $secure,
  'httponly' => true,
  'samesite' => 'Lax',
]);
session_start();

function respond(int $code, array $payload): void {
  http_response_code($code);
  echo json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
  exit;
}

function bearerToken(): string {
  $hdr = $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '';
  if (preg_match('/Bearer\s+(\S+)/i', $hdr, $m)) return trim($m[1]);
  $alt = $_SERVER['HTTP_X_DA_ADMIN_TOKEN'] ?? '';
  return is_string($alt) ? trim($alt) : '';
}

function issueToken(): string {
  return bin2hex(random_bytes(32));
}

function isAuthed(array $config): bool {
  $ttl = (int)($config['session_ttl'] ?? 28800);
  $now = time();

  // Cookie/session auth
  if (!empty($_SESSION['da_auth'])) {
    $at = (int)($_SESSION['da_auth_at'] ?? 0);
    if ($at && ($now - $at) <= $ttl) {
      $_SESSION['da_auth_at'] = $now; // sliding expiry
      return true;
    }
  }

  // Token auth (survives flaky cookies on some hosts)
  $token = bearerToken();
  if ($token !== '' && !empty($_SESSION['da_token']) && hash_equals((string)$_SESSION['da_token'], $token)) {
    $at = (int)($_SESSION['da_auth_at'] ?? 0);
    if ($at && ($now - $at) <= $ttl) {
      $_SESSION['da_auth'] = true;
      $_SESSION['da_auth_at'] = $now;
      return true;
    }
  }

  // Persistent token file fallback (shared across PHP workers if sessions differ)
  $tokenDir = __DIR__ . '/.sessions';
  $tokenFile = $tokenDir . '/token.json';
  if ($token !== '' && is_file($tokenFile)) {
    $raw = file_get_contents($tokenFile);
    $data = json_decode($raw ?: 'null', true);
    if (is_array($data) && !empty($data['token']) && hash_equals((string)$data['token'], $token)) {
      $at = (int)($data['at'] ?? 0);
      if ($at && ($now - $at) <= $ttl) {
        $_SESSION['da_auth'] = true;
        $_SESSION['da_auth_at'] = $now;
        $_SESSION['da_token'] = $token;
        // refresh file timestamp
        @file_put_contents($tokenFile, json_encode(['token' => $token, 'at' => $now], JSON_UNESCAPED_SLASHES));
        return true;
      }
    }
  }

  return false;
}

function requireAuth(array $config): void {
  if (!isAuthed($config)) {
    respond(401, ['ok' => false, 'error' => 'Login required', 'code' => 'auth']);
  }
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
      respond(401, ['ok' => false, 'error' => 'Incorrect password', 'code' => 'bad_password']);
    }
    session_regenerate_id(true);
    $token = issueToken();
    $_SESSION['da_auth'] = true;
    $_SESSION['da_auth_at'] = time();
    $_SESSION['da_token'] = $token;
    $tokenDir = __DIR__ . '/.sessions';
    if (!is_dir($tokenDir)) @mkdir($tokenDir, 0750, true);
    @file_put_contents($tokenDir . '/token.json', json_encode(['token' => $token, 'at' => time()], JSON_UNESCAPED_SLASHES));
    @file_put_contents($tokenDir . '/.htaccess', "Require all denied\nDeny from all\n");
    respond(200, [
      'ok' => true,
      'authenticated' => true,
      'token' => $token,
      'expiresIn' => (int)($config['session_ttl'] ?? 28800),
    ]);

  case 'logout':
    $tokenFile = __DIR__ . '/.sessions/token.json';
    if (is_file($tokenFile)) @unlink($tokenFile);
    $_SESSION = [];
    if (ini_get('session.use_cookies')) {
      $p = session_get_cookie_params();
      setcookie(session_name(), '', time() - 42000, $p['path'] ?: '/', $p['domain'] ?? '', (bool)$p['secure'], (bool)$p['httponly']);
    }
    session_destroy();
    respond(200, ['ok' => true, 'authenticated' => false]);

  case 'list':
    requireAuth($config);
    respond(200, ['ok' => true, 'collections' => $config['collections']]);

  case 'get':
    // Reading content for the editor should stay logged-in (prevents open edits + auth confusion)
    requireAuth($config);
    $collection = (string)($_GET['collection'] ?? ($body['collection'] ?? ''));
    $path = contentPath($config, $collection);
    respond(200, ['ok' => true, 'collection' => $collection, 'data' => readJson($path)]);

  case 'save':
    requireAuth($config);
    $collection = (string)($body['collection'] ?? '');
    if (!array_key_exists('data', $body)) respond(400, ['ok' => false, 'error' => 'Missing data']);
    $path = contentPath($config, $collection);
    writeJson($path, $body['data']);
    require_once __DIR__ . '/seo-sync.php';
    $seo = da_sync_seo_artifacts($config['content_dir'], dirname($config['content_dir']));
    respond(200, ['ok' => true, 'collection' => $collection, 'saved' => true, 'seo' => $seo]);

  case 'sync-seo':
    requireAuth($config);
    require_once __DIR__ . '/seo-sync.php';
    $seo = da_sync_seo_artifacts($config['content_dir'], dirname($config['content_dir']));
    respond(200, ['ok' => true, 'seo' => $seo]);

  case 'sync-google-reviews':
    requireAuth($config);
    require_once __DIR__ . '/gmb-sync.php';
    $path = contentPath($config, 'google-reviews');
    $current = is_file($path) ? readJson($path) : [];
    if (!empty($body['placeId'])) $current['placeId'] = (string)$body['placeId'];
    if (!empty($body['placeQuery'])) $current['placeQuery'] = (string)$body['placeQuery'];
    $result = da_sync_google_reviews($config, $current);
    if (!empty($result['data']) && is_array($result['data'])) {
      writeJson($path, $result['data']);
    }
    if (!$result['ok']) {
      respond(400, [
        'ok' => false,
        'error' => $result['error'] ?? 'Sync failed',
        'data' => $result['data'] ?? null,
        'hasPlacesKey' => trim((string)($config['places_api_key'] ?? '')) !== '',
      ]);
    }
    respond(200, [
      'ok' => true,
      'message' => $result['message'] ?? 'Synced',
      'data' => $result['data'],
      'hasPlacesKey' => true,
    ]);

  case 'list-leads':
    requireAuth($config);
    $leadsDir = __DIR__ . '/.leads';
    $indexPath = $leadsDir . '/index.json';
    $leads = [];
    if (is_file($indexPath)) {
      $leads = json_decode((string)file_get_contents($indexPath), true) ?: [];
    }
    if (!is_array($leads)) $leads = [];
    // Enrich with message/source from individual files when present
    foreach ($leads as &$row) {
      if (!is_array($row) || empty($row['id'])) continue;
      $file = $leadsDir . '/' . $row['id'] . '.json';
      if (!is_file($file)) continue;
      $full = json_decode((string)file_get_contents($file), true);
      if (is_array($full)) {
        $row['message'] = (string)($full['message'] ?? $full['business_description'] ?? '');
        $row['email'] = (string)($full['email'] ?? ($row['email'] ?? ''));
        $row['business'] = (string)($full['business'] ?? $full['business_name'] ?? ($row['business'] ?? ''));
        $row['source'] = (string)($full['source'] ?? ($row['source'] ?? ''));
        $row['channel'] = (string)($full['channel'] ?? ($row['channel'] ?? 'form'));
        $row['page'] = (string)($full['page'] ?? $full['landing_page'] ?? ($row['page'] ?? ''));
        $row['lead_temperature'] = (string)($full['lead_temperature'] ?? ($row['lead_temperature'] ?? ''));
        $row['lead_score'] = (int)($full['lead_score'] ?? ($row['lead_score'] ?? 0));
        $phoneDigits = preg_replace('/\D+/', '', (string)($row['phone'] ?? '')) ?? '';
        $row['whatsappUrl'] = $phoneDigits !== '' ? ('https://wa.me/' . $phoneDigits) : '';
      }
    }
    unset($row);
    respond(200, ['ok' => true, 'leads' => $leads]);

  case 'hubspot-list-forms':
    requireAuth($config);
    require_once __DIR__ . '/lib/crm.php';
    $crmCfg = da_crm_load_config((string)$config['content_dir'], $config);
    $token = (string)($crmCfg['hubspot']['accessToken'] ?? '');
    if ($token === '') {
      respond(400, [
        'ok' => false,
        'error' => 'HubSpot Private App token missing. Add HUBSPOT_ACCESS_TOKEN or admin/.crm.secret.php',
        'hasToken' => false,
        'portalId' => $crmCfg['hubspot']['portalId'] ?? '',
      ]);
    }
    $listed = da_crm_hubspot_list_forms($token);
    if (empty($listed['ok'])) {
      respond(502, [
        'ok' => false,
        'error' => $listed['error'] ?? 'Could not list HubSpot forms',
        'hasToken' => true,
        'portalId' => $crmCfg['hubspot']['portalId'] ?? '',
      ]);
    }
    respond(200, [
      'ok' => true,
      'hasToken' => true,
      'portalId' => $crmCfg['hubspot']['portalId'] ?? '',
      'forms' => $listed['forms'] ?? [],
    ]);

  case 'hubspot-apply-form':
    requireAuth($config);
    require_once __DIR__ . '/lib/crm.php';
    $formGuid = trim((string)($body['formGuid'] ?? $_GET['formGuid'] ?? ''));
    $enable = array_key_exists('enable', $body) ? !empty($body['enable']) : true;
    if ($formGuid === '' || !preg_match('/^[a-f0-9-]{36}$/i', $formGuid)) {
      respond(400, ['ok' => false, 'error' => 'Valid formGuid (UUID) required']);
    }
    $path = contentPath($config, 'crm');
    $data = readJson($path);
    if (!isset($data['hubspot']) || !is_array($data['hubspot'])) $data['hubspot'] = [];
    $data['hubspot']['formGuid'] = $formGuid;
    $data['hubspot']['portalId'] = trim((string)($data['hubspot']['portalId'] ?? '244759409')) ?: '244759409';
    if ($enable) {
      $data['hubspot']['enabled'] = true;
      $data['enabled'] = true;
    }
    $data['setup'] = is_array($data['setup'] ?? null) ? $data['setup'] : [];
    $data['setup']['notes'] = 'Form GUID saved from HubSpot API. Contacts API token preferred when available.';
    $data['updatedAt'] = gmdate('c');
    writeJson($path, $data);
    respond(200, ['ok' => true, 'hubspot' => $data['hubspot'], 'data' => $data]);

  default:
    respond(400, ['ok' => false, 'error' => 'Unknown action']);
}
