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

/** Load image resource from upload (JPEG/PNG/GIF/WebP). */
function da_image_from_file(string $path, string $mime) {
  return match (true) {
    str_contains($mime, 'jpeg'), str_contains($mime, 'jpg') => @imagecreatefromjpeg($path),
    str_contains($mime, 'png') => @imagecreatefrompng($path),
    str_contains($mime, 'gif') => @imagecreatefromgif($path),
    str_contains($mime, 'webp') => function_exists('imagecreatefromwebp') ? @imagecreatefromwebp($path) : false,
    default => false,
  };
}

/** Resize keeping aspect ratio; max edge = $maxEdge. */
function da_image_fit($im, int $maxEdge) {
  $w = imagesx($im);
  $h = imagesy($im);
  if ($w <= 0 || $h <= 0) return $im;
  $edge = max($w, $h);
  if ($edge <= $maxEdge) return $im;
  $scale = $maxEdge / $edge;
  $nw = max(1, (int)round($w * $scale));
  $nh = max(1, (int)round($h * $scale));
  $out = imagecreatetruecolor($nw, $nh);
  if ($out === false) return $im;
  imagealphablending($out, true);
  imagesavealpha($out, true);
  $transparent = imagecolorallocatealpha($out, 0, 0, 0, 127);
  imagefill($out, 0, 0, $transparent);
  imagecopyresampled($out, $im, 0, 0, 0, 0, $nw, $nh, $w, $h);
  imagedestroy($im);
  return $out;
}

/** Save GD image as WebP (quality 0-100). */
function da_save_webp($im, string $dest, int $quality = 78): bool {
  if (!function_exists('imagewebp')) return false;
  imagealphablending($im, true);
  imagesavealpha($im, true);
  return imagewebp($im, $dest, $quality);
}

/** Allowed upload folders under /images */
function da_image_folder(string $folder): string {
  $map = [
    'uploads' => 'uploads',
    'awards' => 'awards',
    'certs' => 'certs',
    'heroes' => 'heroes',
    'reviews' => 'reviews',
    'root' => '',
  ];
  $key = strtolower(trim($folder));
  if (!isset($map[$key])) $key = 'uploads';
  return $map[$key];
}

$body = [];
$contentType = (string)($_SERVER['CONTENT_TYPE'] ?? $_SERVER['HTTP_CONTENT_TYPE'] ?? '');
// Do not read php://input for multipart uploads (keeps $_FILES intact)
if (stripos($contentType, 'multipart/form-data') === false) {
  $raw = file_get_contents('php://input');
  if ($raw) {
    $decoded = json_decode($raw, true);
    if (is_array($decoded)) $body = $decoded;
  }
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
    // Enrich with message from individual files when present
    foreach ($leads as &$row) {
      if (!is_array($row) || empty($row['id'])) continue;
      $file = $leadsDir . '/' . $row['id'] . '.json';
      if (!is_file($file)) continue;
      $full = json_decode((string)file_get_contents($file), true);
      if (is_array($full)) {
        $row['message'] = (string)($full['message'] ?? '');
        $row['email'] = (string)($full['email'] ?? ($row['email'] ?? ''));
        $row['business'] = (string)($full['business'] ?? ($row['business'] ?? ''));
        $row['journey'] = (string)($full['journey'] ?? '');
        $row['visitorId'] = (string)($full['visitorId'] ?? ($row['visitorId'] ?? ''));
        $row['page'] = (string)($full['page'] ?? ($row['page'] ?? ''));
        $row['landing'] = (string)($full['landing'] ?? '');
      }
    }
    unset($row);
    respond(200, ['ok' => true, 'leads' => $leads]);

  case 'get-automation':
    requireAuth($config);
    require_once __DIR__ . '/lib/automation.php';
    respond(200, [
      'ok' => true,
      'settings' => da_automation_settings(),
      'status' => da_automation_channel_status(),
    ]);

  case 'save-automation':
    requireAuth($config);
    require_once __DIR__ . '/lib/automation.php';
    $incoming = $body['settings'] ?? null;
    if (!is_array($incoming)) {
      respond(400, ['ok' => false, 'error' => 'settings object required']);
    }
    $current = da_automation_settings();
    $next = array_replace_recursive($current, $incoming);
    $next['updatedAt'] = gmdate('c');
    // Keep structure tight
    $next['enabled'] = !empty($next['enabled']);
    $next['notifyEmail'] = trim((string)($next['notifyEmail'] ?? ''));
    $next['ownerName'] = trim((string)($next['ownerName'] ?? 'DisplayAvenue'));
    $next['messagePrefix'] = trim((string)($next['messagePrefix'] ?? '[DA Lead]'));
    $next['includeJourney'] = !empty($next['includeJourney']);
    $next['channels'] = [
      'email' => !empty($next['channels']['email']),
      'whatsapp' => !empty($next['channels']['whatsapp']),
      'sms' => !empty($next['channels']['sms']),
    ];
    $next['events'] = [
      'contactForm' => !empty($next['events']['contactForm']),
      'chatHotLead' => !empty($next['events']['chatHotLead']),
      'trackPageviews' => !empty($next['events']['trackPageviews']),
    ];
    $path = da_automation_content_path();
    $written = @file_put_contents(
      $path,
      json_encode($next, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT)
    );
    if (!$written) respond(500, ['ok' => false, 'error' => 'Could not write automation.json']);
    respond(200, ['ok' => true, 'settings' => $next, 'status' => da_automation_channel_status()]);

  case 'test-automation':
    requireAuth($config);
    require_once __DIR__ . '/lib/automation.php';
    $result = da_automation_notify([
      'event' => 'test',
      'subject' => '[DA Test] Automation channel check',
      'text' => "Test alert from DisplayAvenue admin.\nTime: " . gmdate('c') . "\nIf you received this on WhatsApp/SMS/email, automation is working.",
      'summary' => 'Manual test from admin',
    ]);
    respond(200, ['ok' => true, 'result' => $result, 'status' => da_automation_channel_status()]);

  case 'list-automation-log':
    requireAuth($config);
    $dir = __DIR__ . '/.automation-log';
    $indexPath = $dir . '/index.json';
    $rows = [];
    if (is_file($indexPath)) {
      $rows = json_decode((string)file_get_contents($indexPath), true) ?: [];
    }
    if (!is_array($rows)) $rows = [];
    respond(200, ['ok' => true, 'log' => array_slice($rows, 0, 80)]);

  case 'list-visits':
    requireAuth($config);
    require_once __DIR__ . '/lib/automation.php';
    $indexPath = da_visits_dir() . '/index.json';
    $rows = [];
    if (is_file($indexPath)) {
      $rows = json_decode((string)file_get_contents($indexPath), true) ?: [];
    }
    if (!is_array($rows)) $rows = [];
    respond(200, ['ok' => true, 'visits' => array_slice($rows, 0, 100)]);

  case 'get-visit':
    requireAuth($config);
    require_once __DIR__ . '/lib/automation.php';
    $vid = (string)($body['visitorId'] ?? $_GET['visitorId'] ?? '');
    $visit = da_visit_load($vid);
    if (!$visit) respond(404, ['ok' => false, 'error' => 'Visit not found']);
    respond(200, ['ok' => true, 'visit' => $visit]);

  case 'social-status':
    requireAuth($config);
    require_once __DIR__ . '/lib/social.php';
    respond(200, [
      'ok' => true,
      'settings' => da_social_settings(),
      'status' => da_social_connection_status(),
      'platforms' => da_social_platforms(),
      'trends' => da_social_trends(),
      'secrets' => da_social_secrets_public(),
    ]);

  case 'social-save-keys':
    requireAuth($config);
    require_once __DIR__ . '/lib/social.php';
    $incoming = $body['keys'] ?? null;
    if (!is_array($incoming)) respond(400, ['ok' => false, 'error' => 'keys object required']);
    $result = da_social_secrets_save($incoming);
    if (empty($result['ok'])) {
      respond(500, ['ok' => false, 'error' => $result['error'] ?? 'Save failed']);
    }
    respond(200, $result);

  case 'social-save-settings':
    requireAuth($config);
    require_once __DIR__ . '/lib/social.php';
    $incoming = $body['settings'] ?? null;
    if (!is_array($incoming)) respond(400, ['ok' => false, 'error' => 'settings required']);
    $next = array_replace_recursive(da_social_settings(), $incoming);
    $next['enabled'] = !empty($next['enabled']);
    $next['autopilot'] = !empty($next['autopilot']);
    $next['postsPerWeek'] = max(1, min(14, (int)($next['postsPerWeek'] ?? 5)));
    $next['updatedAt'] = gmdate('c');
    $path = rtrim((string)$config['content_dir'], '/\\') . '/social.json';
    if (!@file_put_contents($path, json_encode($next, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT))) {
      respond(500, ['ok' => false, 'error' => 'Could not write social.json']);
    }
    respond(200, ['ok' => true, 'settings' => $next]);

  case 'social-list':
    requireAuth($config);
    require_once __DIR__ . '/lib/social.php';
    respond(200, ['ok' => true, 'posts' => da_social_index_load()]);

  case 'social-get':
    requireAuth($config);
    require_once __DIR__ . '/lib/social.php';
    $id = (string)($body['id'] ?? $_GET['id'] ?? '');
    $post = da_social_load_post($id);
    if (!$post) respond(404, ['ok' => false, 'error' => 'Post not found']);
    respond(200, ['ok' => true, 'post' => $post]);

  case 'social-generate':
    requireAuth($config);
    require_once __DIR__ . '/lib/social.php';
    $trend = is_array($body['trend'] ?? null) ? $body['trend'] : null;
    respond(200, ['ok' => true, 'draft' => da_social_generate_draft($trend)]);

  case 'social-save':
    requireAuth($config);
    require_once __DIR__ . '/lib/social.php';
    $incoming = $body['post'] ?? null;
    if (!is_array($incoming)) respond(400, ['ok' => false, 'error' => 'post required']);
    $existing = [];
    if (!empty($incoming['id'])) {
      $existing = da_social_load_post((string)$incoming['id']) ?: [];
    }
    $post = array_merge($existing, $incoming);
    if (($post['status'] ?? '') === 'scheduled' && empty($post['scheduledAt'])) {
      respond(400, ['ok' => false, 'error' => 'scheduledAt required']);
    }
    $saved = da_social_save_post($post);
    respond(200, ['ok' => true, 'post' => $saved]);

  case 'social-delete':
    requireAuth($config);
    require_once __DIR__ . '/lib/social.php';
    $id = (string)($body['id'] ?? '');
    if ($id === '') respond(400, ['ok' => false, 'error' => 'id required']);
    da_social_delete_post($id);
    respond(200, ['ok' => true]);

  case 'social-publish':
    requireAuth($config);
    require_once __DIR__ . '/lib/social.php';
    $id = (string)($body['id'] ?? '');
    $post = da_social_load_post($id);
    if (!$post) respond(404, ['ok' => false, 'error' => 'Post not found']);
    $forceNotify = !empty($body['forceNotify']);
    $result = da_social_publish_post($post, $forceNotify);
    respond(200, ['ok' => !empty($result['ok']), 'result' => $result]);

  case 'social-run-due':
    requireAuth($config);
    require_once __DIR__ . '/lib/social.php';
    $fill = !empty($body['autopilot']) ? da_social_autopilot_fill() : ['created' => []];
    $published = da_social_run_due(15);
    respond(200, [
      'ok' => true,
      'created' => count($fill['created'] ?? []),
      'published' => count($published),
      'details' => $published,
    ]);

  case 'social-autopilot':
    requireAuth($config);
    require_once __DIR__ . '/lib/social.php';
    $fill = da_social_autopilot_fill();
    respond(200, ['ok' => true, 'fill' => $fill]);

  case 'blog-publish-today':
    requireAuth($config);
    require_once __DIR__ . '/lib/blog.php';
    $result = da_blog_ensure_published(14);
    $createdList = $result['created'] ?? [];
    $created = $createdList ? $createdList[count($createdList) - 1] : null;
    if ($createdList) {
      try {
        require_once __DIR__ . '/seo-sync.php';
        $publicDir = dirname(__DIR__);
        da_sync_seo_artifacts($publicDir . '/content', $publicDir);
      } catch (Throwable $e) {
      }
    }
    respond(200, [
      'ok' => true,
      'created' => $created,
      'createdAll' => $createdList,
      'message' => $createdList
        ? ('Published ' . count($createdList) . ' post(s)')
        : (($result['skipped'] ?? '') === 'autopilot-off'
          ? 'Autopilot is off — enable Auto-publish daily'
          : 'Already published for today'),
    ]);

  case 'blog-set-autopilot':
    requireAuth($config);
    require_once __DIR__ . '/lib/blog.php';
    $enabled = !empty($body['enabled']);
    $blog = da_blog_set_autopilot($enabled);
    respond(200, ['ok' => true, 'blog' => $blog]);

  case 'blog-list':
    requireAuth($config);
    require_once __DIR__ . '/lib/blog.php';
    $cronKey = '';
    if (is_file(__DIR__ . '/social-local.php')) {
      $s = include __DIR__ . '/social-local.php';
      if (is_array($s)) $cronKey = trim((string)($s['cron_key'] ?? ''));
    }
    respond(200, [
      'ok' => true,
      'blog' => da_blog_load(),
      'cron' => [
        'hasKey' => $cronKey !== '',
        'blogCronUrl' => $cronKey !== ''
          ? ('https://displayavenue.com/admin/blog-cron.php?key=' . rawurlencode($cronKey))
          : 'https://displayavenue.com/admin/blog-cron.php?key=YOUR_CRON_KEY',
        'hint' => 'Hostinger → Advanced → Cron Jobs → daily curl. Blog also auto-publishes on /blog and sitemap.xml visits if cron is missing.',
      ],
    ]);

  case 'upload-catalogue':
    requireAuth($config);
    if (empty($_FILES['file']) || !is_array($_FILES['file'])) {
      respond(400, ['ok' => false, 'error' => 'Choose a PDF file to upload']);
    }
    $file = $_FILES['file'];
    $err = (int)($file['error'] ?? UPLOAD_ERR_NO_FILE);
    if ($err !== UPLOAD_ERR_OK) {
      respond(400, ['ok' => false, 'error' => 'Upload failed (code ' . $err . ')']);
    }
    $tmp = (string)($file['tmp_name'] ?? '');
    $origName = (string)($file['name'] ?? 'catalogue.pdf');
    $size = (int)($file['size'] ?? 0);
    if ($tmp === '' || !is_uploaded_file($tmp)) {
      respond(400, ['ok' => false, 'error' => 'Invalid upload']);
    }
    if ($size <= 0) {
      respond(400, ['ok' => false, 'error' => 'Empty file']);
    }
    $ext = strtolower(pathinfo($origName, PATHINFO_EXTENSION));
    if ($ext !== 'pdf') {
      respond(400, ['ok' => false, 'error' => 'Only PDF files are allowed']);
    }
    $finfo = new finfo(FILEINFO_MIME_TYPE);
    $mime = (string)$finfo->file($tmp);
    if (!in_array($mime, ['application/pdf', 'application/x-pdf', 'application/octet-stream'], true)) {
      respond(400, ['ok' => false, 'error' => 'File does not look like a PDF (' . $mime . ')']);
    }

    $publicDir = dirname(rtrim($config['content_dir'], '/\\'));
    $catDir = $publicDir . '/catalogue';
    if (!is_dir($catDir) && !mkdir($catDir, 0755, true)) {
      respond(500, ['ok' => false, 'error' => 'Could not create /catalogue folder']);
    }
    $destName = 'DisplayAvenue-Catalogue.pdf';
    $destPath = $catDir . '/' . $destName;
    if (!move_uploaded_file($tmp, $destPath)) {
      // Fallback for hosts where move_uploaded_file is restricted
      if (!@copy($tmp, $destPath)) {
        respond(500, ['ok' => false, 'error' => 'Could not save PDF - check /catalogue permissions']);
      }
      @unlink($tmp);
    }
    @chmod($destPath, 0644);

    $url = '/catalogue/' . $destName . '?v=' . time();
    $companyPath = contentPath($config, 'company');
    $company = is_file($companyPath) ? readJson($companyPath) : [];
    $company['catalogueUrl'] = $url;
    $company['catalogueFileName'] = $destName;
    $company['catalogueUpdatedAt'] = gmdate('c');
    writeJson($companyPath, $company);

    respond(200, [
      'ok' => true,
      'url' => $url,
      'fileName' => $destName,
      'bytes' => $size,
      'data' => $company,
      'message' => 'Catalogue uploaded - sticky bar will use this PDF',
    ]);

  case 'upload-image':
    requireAuth($config);
    if (!function_exists('imagewebp') || !function_exists('imagecreatefromjpeg')) {
      respond(500, ['ok' => false, 'error' => 'Server GD WebP support is required']);
    }
    if (empty($_FILES['file']) || !is_array($_FILES['file'])) {
      respond(400, ['ok' => false, 'error' => 'Choose an image to upload']);
    }
    $file = $_FILES['file'];
    $err = (int)($file['error'] ?? UPLOAD_ERR_NO_FILE);
    if ($err !== UPLOAD_ERR_OK) {
      respond(400, ['ok' => false, 'error' => 'Upload failed (code ' . $err . ')']);
    }
    $tmp = (string)($file['tmp_name'] ?? '');
    $origName = (string)($file['name'] ?? 'image.jpg');
    $size = (int)($file['size'] ?? 0);
    if ($tmp === '' || !is_uploaded_file($tmp)) {
      respond(400, ['ok' => false, 'error' => 'Invalid upload']);
    }
    if ($size <= 0) {
      respond(400, ['ok' => false, 'error' => 'Empty file']);
    }

    $finfo = new finfo(FILEINFO_MIME_TYPE);
    $mime = strtolower((string)$finfo->file($tmp));
    $allowed = ['image/jpeg', 'image/jpg', 'image/pjpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!in_array($mime, $allowed, true)) {
      respond(400, ['ok' => false, 'error' => 'Only JPG, PNG, GIF, or WebP images are allowed']);
    }

    $im = da_image_from_file($tmp, $mime);
    if ($im === false) {
      respond(400, ['ok' => false, 'error' => 'Could not read image']);
    }

    $folderKey = (string)($_POST['folder'] ?? $_GET['folder'] ?? 'uploads');
    $relFolder = da_image_folder($folderKey);
    $publicDir = dirname(rtrim($config['content_dir'], '/\\'));
    $imgDir = $publicDir . '/images' . ($relFolder !== '' ? '/' . $relFolder : '');
    if (!is_dir($imgDir) && !mkdir($imgDir, 0755, true)) {
      imagedestroy($im);
      respond(500, ['ok' => false, 'error' => 'Could not create images folder']);
    }

    $stem = pathinfo($origName, PATHINFO_FILENAME);
    $stem = preg_replace('/[^a-zA-Z0-9_-]+/', '-', (string)$stem) ?: 'image';
    $stem = trim($stem, '-');
    if ($stem === '') $stem = 'image';
    $stem = strtolower(substr($stem, 0, 60));
    $maxEdge = in_array($folderKey, ['awards', 'certs'], true) ? 1400 : 1920;

    $thumbIm = null;
    if (in_array($folderKey, ['awards', 'certs'], true)) {
      $thumbDir = $imgDir . '/thumbs';
      if (!is_dir($thumbDir)) @mkdir($thumbDir, 0755, true);
      $w = imagesx($im);
      $h = imagesy($im);
      $clone = imagecreatetruecolor(max(1, $w), max(1, $h));
      if ($clone !== false) {
        imagealphablending($clone, false);
        imagesavealpha($clone, true);
        imagecopy($clone, $im, 0, 0, 0, 0, $w, $h);
        $thumbIm = da_image_fit($clone, 560);
      }
    }

    $im = da_image_fit($im, $maxEdge);
    $destName = $stem . '-' . substr(bin2hex(random_bytes(4)), 0, 8) . '.webp';
    $destPath = $imgDir . '/' . $destName;
    if (!da_save_webp($im, $destPath, 78)) {
      if ($thumbIm) imagedestroy($thumbIm);
      imagedestroy($im);
      respond(500, ['ok' => false, 'error' => 'Could not save WebP - check /images permissions']);
    }
    @chmod($destPath, 0644);

    $thumbUrl = null;
    if ($thumbIm) {
      $thumbStem = pathinfo($destName, PATHINFO_FILENAME);
      $thumbWebp = $imgDir . '/thumbs/' . $thumbStem . '.webp';
      $thumbJpg = $imgDir . '/thumbs/' . $thumbStem . '.jpg';
      da_save_webp($thumbIm, $thumbWebp, 68);
      if (function_exists('imagejpeg')) {
        imagejpeg($thumbIm, $thumbJpg, 72);
        @chmod($thumbJpg, 0644);
      }
      @chmod($thumbWebp, 0644);
      imagedestroy($thumbIm);
      $thumbUrl = '/images/' . $relFolder . '/thumbs/' . $thumbStem . '.webp';
    }

    imagedestroy($im);
    @unlink($tmp);

    $url = '/images/' . ($relFolder !== '' ? $relFolder . '/' : '') . $destName;
    respond(200, [
      'ok' => true,
      'url' => $url,
      'thumbUrl' => $thumbUrl,
      'fileName' => $destName,
      'bytes' => is_file($destPath) ? (int)filesize($destPath) : 0,
      'format' => 'webp',
      'message' => 'Image uploaded as WebP',
    ]);

  default:
    respond(400, ['ok' => false, 'error' => 'Unknown action']);
}
