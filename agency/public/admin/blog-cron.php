<?php
/**
 * Daily blog publisher for DisplayAvenue.
 * Hostinger cron (once per day OR every few hours — safe to re-run):
 *   curl -s "https://displayavenue.com/admin/blog-cron.php?key=YOUR_CRON_KEY"
 * Uses cron_key from social-local.php (same as Social Studio).
 *
 * Also auto-runs from /blog visits and sitemap.xml so posts still publish
 * if Hostinger cron is not configured.
 */
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/lib/blog.php';

$key = '';
if (is_file(__DIR__ . '/social-local.php')) {
  $s = include __DIR__ . '/social-local.php';
  if (is_array($s)) $key = trim((string)($s['cron_key'] ?? ''));
}
$given = trim((string)($_GET['key'] ?? $_POST['key'] ?? ''));
if ($key === '' || $given === '' || !hash_equals($key, $given)) {
  http_response_code(403);
  echo json_encode(['ok' => false, 'error' => 'Invalid cron key']);
  exit;
}

$result = da_blog_ensure_published(14);
$created = $result['created'] ?? [];

// Refresh sitemap when new posts land
if ($created) {
  try {
    require_once __DIR__ . '/seo-sync.php';
    $publicDir = dirname(__DIR__);
    da_sync_seo_artifacts($publicDir . '/content', $publicDir);
  } catch (Throwable $e) {
    // non-fatal
  }
}

echo json_encode([
  'ok' => !empty($result['ok']),
  'at' => gmdate('c'),
  'today' => $result['today'] ?? null,
  'created' => $created,
  'skipped' => $result['skipped'] ?? '',
  'message' => $created
    ? ('Published ' . count($created) . ' post(s)')
    : (($result['skipped'] ?? '') === 'autopilot-off'
      ? 'Autopilot is off'
      : 'Already up to date'),
], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
