<?php
/**
 * Daily talking-head reels publisher for DisplayAvenue.
 * Hostinger cron (once per day OR every few hours — safe to re-run):
 *   curl -s "https://displayavenue.com/admin/videos-cron.php?key=YOUR_CRON_KEY"
 * Uses cron_key from social-local.php (same as Social / Blog Studio).
 *
 * Also auto-runs from /videos visits and sitemap.xml so reels still publish
 * if Hostinger cron is not configured.
 */
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/lib/videos.php';

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

$result = da_videos_ensure_published(14);
$created = $result['created'] ?? [];

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
    ? ('Published ' . count($created) . ' reel(s)')
    : (($result['skipped'] ?? '') === 'autopilot-off'
      ? 'Autopilot is off'
      : 'Already up to date'),
], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
