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

function leadsFilePath(array $config): string {
  return (string)($config['leads_file'] ?? (__DIR__ . '/data/leads.json'));
}

function readLeadsStore(array $config): array {
  $path = leadsFilePath($config);
  if (!is_file($path)) return ['items' => [], 'updatedAt' => null];
  $data = json_decode((string)file_get_contents($path), true);
  if (!is_array($data)) return ['items' => [], 'updatedAt' => null];
  if (!isset($data['items']) || !is_array($data['items'])) $data['items'] = [];
  return $data;
}

function writeLeadsStore(array $config, array $store): void {
  $path = leadsFilePath($config);
  $dir = dirname($path);
  if (!is_dir($dir)) mkdir($dir, 0750, true);
  $store['updatedAt'] = gmdate('c');
  writeJson($path, $store);
}

$body = [];
$raw = file_get_contents('php://input');
if ($raw) {
  $decoded = json_decode($raw, true);
  if (is_array($decoded)) $body = $decoded;
}

$action = (string)($_GET['action'] ?? ($body['action'] ?? ($_POST['action'] ?? '')));
$mutating = in_array($action, ['login', 'logout', 'save', 'sync-seo', 'clear-cache', 'upload-catalogue', 'remove-catalogue', 'lead-update', 'lead-delete', 'shop-order-update', 'shop-order-delete'], true)
  || strtoupper((string)($_SERVER['REQUEST_METHOD'] ?? '')) === 'POST';

if ($mutating) {
  assertMutatingSameOrigin($selfOrigin);
}

switch ($action) {
  case 'status':
    $authed = isAuthed($config);
    $newLeads = 0;
    $mailStats = null;
    if ($authed) {
      foreach (readLeadsStore($config)['items'] as $item) {
        if (($item['status'] ?? 'new') === 'new') $newLeads++;
      }
      require_once __DIR__ . '/mail-log.php';
      $mailStats = da_mail_stats($config);
      unset($mailStats['recent']); // keep status payload light
    }
    respond(200, [
      'ok' => true,
      'authenticated' => $authed,
      'collections' => $authed ? $config['collections'] : new stdClass(),
      'newLeads' => $newLeads,
      'notifyEmail' => $authed ? (string)($config['notify_email'] ?? 'info@displayavenue.com') : null,
      'mailStats' => $mailStats,
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
    if ($collection === 'catalogue' && !is_file($path)) {
      $defaults = [
        'enabled' => true,
        'title' => 'DisplayAvenue Catalogue',
        'eyebrow' => 'Company Catalogue',
        'headline' => 'Explore the DisplayAvenue catalogue',
        'summary' => 'Download our latest catalogue for services and capabilities.',
        'ctaLabel' => 'Download PDF',
        'secondaryCtaLabel' => 'Request a proposal',
        'secondaryCtaHref' => '/contact',
        'pdfUrl' => '',
        'fileName' => '',
        'fileSize' => 0,
        'uploadedAt' => null,
        'updatedAt' => gmdate('c'),
      ];
      writeJson($path, $defaults);
      respond(200, ['ok' => true, 'collection' => $collection, 'data' => $defaults]);
    }
    if ($collection === 'shop' && !is_file($path)) {
      $defaults = [
        'enabled' => true,
        'title' => 'Shop',
        'eyebrow' => 'Buy Services',
        'headline' => 'DisplayAvenue service shop',
        'summary' => 'Purchase ready-to-start digital growth services online.',
        'currency' => 'INR',
        'currencySymbol' => '₹',
        'successMessage' => 'Payment received. Our team will email you within one business day with next steps.',
        'products' => [],
        'updatedAt' => gmdate('c'),
      ];
      writeJson($path, $defaults);
      respond(200, ['ok' => true, 'collection' => $collection, 'data' => $defaults]);
    }
    if ($collection === 'landings' && !is_file($path)) {
      $defaults = [
        'items' => [],
        'updatedAt' => gmdate('c'),
      ];
      writeJson($path, $defaults);
      respond(200, ['ok' => true, 'collection' => $collection, 'data' => $defaults]);
    }
    $payload = ['ok' => true, 'collection' => $collection, 'data' => readJson($path)];
    if ($collection === 'shop' && isAuthed($config)) {
      $ordersPath = (string)($config['shop_orders_file'] ?? (__DIR__ . '/data/shop-orders.json'));
      $orders = ['items' => []];
      if (is_file($ordersPath)) {
        $rawOrders = json_decode((string)file_get_contents($ordersPath), true);
        if (is_array($rawOrders)) $orders = $rawOrders;
      }
      $payload['orders'] = $orders;
      $payload['razorpayConfigured'] = trim((string)($config['razorpay_key_id'] ?? '')) !== ''
        && trim((string)($config['razorpay_key_secret'] ?? '')) !== '';
    }
    respond(200, $payload);

  case 'save':
    if (!isAuthed($config)) respond(401, ['ok' => false, 'error' => 'Login required']);
    $collection = (string)($body['collection'] ?? '');
    if (!array_key_exists('data', $body)) respond(400, ['ok' => false, 'error' => 'Missing data']);
    $path = contentPath($config, $collection);
    // Preserve PDF metadata if save payload omitted it
    if ($collection === 'catalogue' && is_file($path)) {
      $existing = json_decode((string)file_get_contents($path), true);
      if (is_array($existing) && is_array($body['data'])) {
        foreach (['pdfUrl', 'fileName', 'fileSize', 'uploadedAt'] as $keep) {
          if (!array_key_exists($keep, $body['data']) || $body['data'][$keep] === '' || $body['data'][$keep] === null) {
            if (!empty($existing[$keep])) $body['data'][$keep] = $existing[$keep];
          }
        }
      }
    }
    if (is_array($body['data'])) {
      $body['data']['updatedAt'] = gmdate('c');
    }
    writeJson($path, $body['data']);
    require_once __DIR__ . '/seo-sync.php';
    $seo = da_sync_seo_artifacts($config['content_dir'], dirname($config['content_dir']));
    respond(200, ['ok' => true, 'collection' => $collection, 'saved' => true, 'seo' => $seo]);

  case 'upload-catalogue':
    if (!isAuthed($config)) respond(401, ['ok' => false, 'error' => 'Login required']);
    if (empty($_FILES['file']) || !is_array($_FILES['file'])) {
      respond(400, ['ok' => false, 'error' => 'Choose a PDF file to upload']);
    }
    $file = $_FILES['file'];
    if (($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
      respond(400, ['ok' => false, 'error' => 'Upload failed (error ' . (int)($file['error'] ?? 0) . ')']);
    }
    $maxBytes = (int)($config['catalogue_max_bytes'] ?? (30 * 1024 * 1024));
    $size = (int)($file['size'] ?? 0);
    if ($size <= 0 || $size > $maxBytes) {
      respond(400, ['ok' => false, 'error' => 'PDF must be under ' . (int)round($maxBytes / 1048576) . ' MB']);
    }
    $original = (string)($file['name'] ?? 'catalogue.pdf');
    $ext = strtolower(pathinfo($original, PATHINFO_EXTENSION));
    if ($ext !== 'pdf') {
      respond(400, ['ok' => false, 'error' => 'Only PDF files are allowed']);
    }
    $tmp = (string)($file['tmp_name'] ?? '');
    if ($tmp === '' || !is_uploaded_file($tmp)) {
      respond(400, ['ok' => false, 'error' => 'Invalid upload']);
    }
    $fh = fopen($tmp, 'rb');
    $magic = $fh ? (string)fread($fh, 5) : '';
    if ($fh) fclose($fh);
    if (strpos($magic, '%PDF') !== 0) {
      respond(400, ['ok' => false, 'error' => 'File does not look like a valid PDF']);
    }
    $finfoMime = '';
    if (function_exists('finfo_open')) {
      $finfo = finfo_open(FILEINFO_MIME_TYPE);
      if ($finfo) {
        $finfoMime = (string)finfo_file($finfo, $tmp);
        finfo_close($finfo);
      }
    }
    $allowedMimes = ['application/pdf', 'application/x-pdf', 'application/octet-stream'];
    if ($finfoMime !== '' && !in_array($finfoMime, $allowedMimes, true)) {
      respond(400, ['ok' => false, 'error' => 'Only PDF uploads are accepted']);
    }

    $uploadsRoot = rtrim((string)($config['uploads_dir'] ?? (dirname(__DIR__) . '/uploads')), '/\\');
    $destDir = $uploadsRoot . '/catalogue';
    if (!is_dir($destDir) && !mkdir($destDir, 0755, true)) {
      respond(500, ['ok' => false, 'error' => 'Could not create uploads folder']);
    }
    $safeBase = preg_replace('/[^a-zA-Z0-9._-]+/', '-', pathinfo($original, PATHINFO_FILENAME)) ?: 'displayavenue-catalogue';
    $safeBase = trim($safeBase, '-') ?: 'displayavenue-catalogue';
    $storedName = $safeBase . '-' . gmdate('YmdHis') . '.pdf';
    $destPath = $destDir . '/' . $storedName;
    if (!move_uploaded_file($tmp, $destPath)) {
      respond(500, ['ok' => false, 'error' => 'Could not save the PDF on the server']);
    }
    @chmod($destPath, 0644);

    // Remove older catalogue PDFs to avoid filling disk
    foreach (glob($destDir . '/*.pdf') ?: [] as $old) {
      if (realpath($old) !== realpath($destPath)) @unlink($old);
    }

    $publicUrl = '/uploads/catalogue/' . rawurlencode($storedName);
    $cataloguePath = contentPath($config, 'catalogue');
    $data = is_file($cataloguePath) ? readJson($cataloguePath) : [];
    if (!is_array($data)) $data = [];
    $data['enabled'] = array_key_exists('enabled', $data) ? (bool)$data['enabled'] : true;
    $data['title'] = $data['title'] ?? 'DisplayAvenue Catalogue';
    $data['eyebrow'] = $data['eyebrow'] ?? 'Company Catalogue';
    $data['headline'] = $data['headline'] ?? 'Explore the DisplayAvenue catalogue';
    $data['summary'] = $data['summary'] ?? 'Download our latest catalogue.';
    $data['ctaLabel'] = $data['ctaLabel'] ?? 'Download PDF';
    $data['secondaryCtaLabel'] = $data['secondaryCtaLabel'] ?? 'Request a proposal';
    $data['secondaryCtaHref'] = $data['secondaryCtaHref'] ?? '/contact';
    $data['pdfUrl'] = $publicUrl;
    $data['fileName'] = $original;
    $data['fileSize'] = $size;
    $data['uploadedAt'] = gmdate('c');
    $data['updatedAt'] = gmdate('c');
    writeJson($cataloguePath, $data);

    require_once __DIR__ . '/seo-sync.php';
    $seo = da_sync_seo_artifacts($config['content_dir'], dirname($config['content_dir']), false);

    respond(200, [
      'ok' => true,
      'uploaded' => true,
      'data' => $data,
      'seo' => $seo,
      'message' => 'Catalogue PDF uploaded successfully',
    ]);

  case 'remove-catalogue':
    if (!isAuthed($config)) respond(401, ['ok' => false, 'error' => 'Login required']);
    $cataloguePath = contentPath($config, 'catalogue');
    $data = is_file($cataloguePath) ? readJson($cataloguePath) : [];
    if (!is_array($data)) $data = [];
    $pdfUrl = (string)($data['pdfUrl'] ?? '');
    if ($pdfUrl !== '' && str_starts_with($pdfUrl, '/uploads/catalogue/')) {
      $uploadsRoot = rtrim((string)($config['uploads_dir'] ?? (dirname(__DIR__) . '/uploads')), '/\\');
      $filePath = $uploadsRoot . '/catalogue/' . basename(rawurldecode($pdfUrl));
      if (is_file($filePath)) @unlink($filePath);
    }
    $data['pdfUrl'] = '';
    $data['fileName'] = '';
    $data['fileSize'] = 0;
    $data['uploadedAt'] = null;
    $data['updatedAt'] = gmdate('c');
    writeJson($cataloguePath, $data);
    respond(200, ['ok' => true, 'removed' => true, 'data' => $data]);

  case 'sync-seo':
    if (!isAuthed($config)) respond(401, ['ok' => false, 'error' => 'Login required']);
    require_once __DIR__ . '/seo-sync.php';
    $seo = da_sync_seo_artifacts($config['content_dir'], dirname($config['content_dir']), true);
    respond(200, [
      'ok' => true,
      'seo' => $seo,
      'urlCount' => $seo['urlCount'] ?? 0,
      'sitemapUrl' => $seo['sitemapUrl'] ?? '',
      'message' => 'Auto sitemap regenerated from CMS content.',
    ]);

  case 'clear-cache':
    if (!isAuthed($config)) respond(401, ['ok' => false, 'error' => 'Login required']);
    $publicDir = dirname($config['content_dir']);
    $version = gmdate('YmdHis');
    $clearedAt = gmdate('c');

    // Bump cache version in settings.json (also used by the frontend for JSON busting)
    $settingsPath = $config['content_dir'] . '/settings.json';
    $settings = readJson($settingsPath);
    if (!is_array($settings)) $settings = [];
    $settings['cacheVersion'] = $version;
    $settings['cacheClearedAt'] = $clearedAt;
    $settings['updatedAt'] = $clearedAt;
    writeJson($settingsPath, $settings);

    // Public cache-bust marker
    @file_put_contents(
      $publicDir . '/cache-bust.json',
      json_encode([
        'ok' => true,
        'cacheVersion' => $version,
        'clearedAt' => $clearedAt,
      ], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT)
    );

    // Rewrite index.html asset URLs with ?v= so desktop caches fetch fresh CSS/JS
    $indexPath = $publicDir . '/index.html';
    $indexTouched = false;
    if (is_file($indexPath) && is_readable($indexPath)) {
      $html = (string)file_get_contents($indexPath);
      $html = preg_replace_callback(
        '/(href|src)=(["\'])(\/assets\/[^"\'?\s]+)(?:\?[^"\']*)?\2/i',
        static function (array $m) use ($version): string {
          return $m[1] . '=' . $m[2] . $m[3] . '?v=' . $version . $m[2];
        },
        $html
      ) ?? $html;
      // Refresh or insert cache meta
      if (preg_match('/<meta\s+name=["\']da-cache["\']/i', $html)) {
        $html = preg_replace(
          '/<meta\s+name=["\']da-cache["\']\s+content=["\'][^"\']*["\']\s*\/?>/i',
          '<meta name="da-cache" content="' . $version . '" />',
          $html
        ) ?? $html;
      } else {
        $html = preg_replace(
          '/<head([^>]*)>/i',
          '<head$1>' . "\n" . '    <meta name="da-cache" content="' . $version . '" />',
          $html,
          1
        ) ?? $html;
      }
      if (@file_put_contents($indexPath, $html) !== false) {
        $indexTouched = true;
        @touch($indexPath);
      }
    }

    // Best-effort PHP/opcache flush
    if (function_exists('opcache_reset')) {
      @opcache_reset();
    }
    clearstatcache(true);

    require_once __DIR__ . '/seo-sync.php';
    $seo = da_sync_seo_artifacts($config['content_dir'], $publicDir);

    respond(200, [
      'ok' => true,
      'cleared' => true,
      'cacheVersion' => $version,
      'clearedAt' => $clearedAt,
      'indexTouched' => $indexTouched,
      'seo' => $seo,
      'message' => 'Site cache cleared. Ask visitors to hard-refresh once (Ctrl/Cmd+Shift+R) if they still see an old layout.',
    ]);

  case 'leads':
    if (!isAuthed($config)) respond(401, ['ok' => false, 'error' => 'Login required']);
    require_once __DIR__ . '/mail-log.php';
    respond(200, [
      'ok' => true,
      'data' => readLeadsStore($config),
      'mailStats' => da_mail_stats($config),
      'notifyEmail' => (string)($config['notify_email'] ?? 'info@displayavenue.com'),
    ]);

  case 'lead-update':
    if (!isAuthed($config)) respond(401, ['ok' => false, 'error' => 'Login required']);
    $id = (string)($body['id'] ?? '');
    $status = (string)($body['status'] ?? '');
    if ($id === '' || !in_array($status, ['new', 'read', 'replied', 'archived'], true)) {
      respond(400, ['ok' => false, 'error' => 'Invalid lead update']);
    }
    $store = readLeadsStore($config);
    $found = false;
    foreach ($store['items'] as &$item) {
      if (($item['id'] ?? '') === $id) {
        $item['status'] = $status;
        $item['updatedAt'] = gmdate('c');
        $found = true;
        break;
      }
    }
    unset($item);
    if (!$found) respond(404, ['ok' => false, 'error' => 'Lead not found']);
    writeLeadsStore($config, $store);
    respond(200, ['ok' => true, 'data' => $store]);

  case 'lead-delete':
    if (!isAuthed($config)) respond(401, ['ok' => false, 'error' => 'Login required']);
    $id = (string)($body['id'] ?? '');
    if ($id === '') respond(400, ['ok' => false, 'error' => 'Missing lead id']);
    $store = readLeadsStore($config);
    $before = count($store['items']);
    $store['items'] = array_values(array_filter(
      $store['items'],
      static fn($item) => ($item['id'] ?? '') !== $id
    ));
    if (count($store['items']) === $before) {
      respond(404, ['ok' => false, 'error' => 'Lead not found']);
    }
    writeLeadsStore($config, $store);
    respond(200, ['ok' => true, 'data' => $store]);

  case 'shop-order-update':
    if (!isAuthed($config)) respond(401, ['ok' => false, 'error' => 'Login required']);
    $id = (string)($body['id'] ?? '');
    $status = (string)($body['status'] ?? '');
    if ($id === '' || !in_array($status, ['created', 'paid', 'fulfilled', 'refunded', 'cancelled'], true)) {
      respond(400, ['ok' => false, 'error' => 'Invalid shop order update']);
    }
    $ordersPath = (string)($config['shop_orders_file'] ?? (__DIR__ . '/data/shop-orders.json'));
    $store = ['items' => []];
    if (is_file($ordersPath)) {
      $rawOrders = json_decode((string)file_get_contents($ordersPath), true);
      if (is_array($rawOrders) && isset($rawOrders['items']) && is_array($rawOrders['items'])) {
        $store = $rawOrders;
      }
    }
    $found = false;
    foreach ($store['items'] as &$item) {
      if (($item['id'] ?? '') === $id) {
        $item['status'] = $status;
        $item['updatedAt'] = gmdate('c');
        $found = true;
        break;
      }
    }
    unset($item);
    if (!$found) respond(404, ['ok' => false, 'error' => 'Order not found']);
    $store['updatedAt'] = gmdate('c');
    writeJson($ordersPath, $store);
    respond(200, ['ok' => true, 'orders' => $store]);

  case 'shop-order-delete':
    if (!isAuthed($config)) respond(401, ['ok' => false, 'error' => 'Login required']);
    $id = (string)($body['id'] ?? '');
    if ($id === '') respond(400, ['ok' => false, 'error' => 'Missing order id']);
    $ordersPath = (string)($config['shop_orders_file'] ?? (__DIR__ . '/data/shop-orders.json'));
    $store = ['items' => []];
    if (is_file($ordersPath)) {
      $rawOrders = json_decode((string)file_get_contents($ordersPath), true);
      if (is_array($rawOrders) && isset($rawOrders['items']) && is_array($rawOrders['items'])) {
        $store = $rawOrders;
      }
    }
    $before = count($store['items']);
    $store['items'] = array_values(array_filter(
      $store['items'],
      static fn($item) => ($item['id'] ?? '') !== $id
    ));
    if (count($store['items']) === $before) {
      respond(404, ['ok' => false, 'error' => 'Order not found']);
    }
    $store['updatedAt'] = gmdate('c');
    writeJson($ordersPath, $store);
    respond(200, ['ok' => true, 'orders' => $store]);

  default:
    respond(400, ['ok' => false, 'error' => 'Unknown action']);
}
