<?php
/**
 * Hostinger cron endpoint — publish due posts + optional autopilot fill.
 * Example cron (every 15 min):
 *   curl -s "https://displayavenue.com/admin/social-cron.php?key=YOUR_CRON_KEY"
 */
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/lib/social.php';

$secrets = da_social_secrets();
$expected = trim((string)($secrets['cron_key'] ?? ''));
$given = trim((string)($_GET['key'] ?? $_POST['key'] ?? ''));

if ($expected === '' || $given === '' || !hash_equals($expected, $given)) {
  http_response_code(403);
  echo json_encode(['ok' => false, 'error' => 'Invalid cron key. Set cron_key in social-local.php']);
  exit;
}

$settings = da_social_settings();
$fill = [];
if (!empty($settings['autopilot'])) {
  $fill = da_social_autopilot_fill();
}
$published = da_social_run_due(15);

// Blog daily autopilot shares this cron key — publish if due / catch up missed days
$blog = ['ok' => false, 'created' => [], 'skipped' => 'not-loaded'];
try {
  require_once __DIR__ . '/lib/blog.php';
  $blog = da_blog_ensure_published(14);
  if (!empty($blog['created'])) {
    require_once __DIR__ . '/seo-sync.php';
    $publicDir = dirname(__DIR__);
    @da_sync_seo_artifacts($publicDir . '/content', $publicDir);
  }
} catch (Throwable $e) {
  $blog = ['ok' => false, 'created' => [], 'skipped' => $e->getMessage()];
}

$videos = ['ok' => false, 'created' => [], 'skipped' => 'not-loaded'];
try {
  require_once __DIR__ . '/lib/videos.php';
  $videos = da_videos_ensure_published(14);
  if (!empty($videos['created'])) {
    require_once __DIR__ . '/seo-sync.php';
    $publicDir = dirname(__DIR__);
    @da_sync_seo_artifacts($publicDir . '/content', $publicDir);
  }
} catch (Throwable $e) {
  $videos = ['ok' => false, 'created' => [], 'skipped' => $e->getMessage()];
}

echo json_encode([
  'ok' => true,
  'at' => gmdate('c'),
  'autopilot' => [
    'created' => count($fill['created'] ?? []),
    'reason' => $fill['reason'] ?? '',
  ],
  'published' => array_map(fn($r) => [
    'ok' => !empty($r['ok']),
    'id' => $r['post']['id'] ?? null,
    'status' => $r['post']['status'] ?? null,
  ], $published),
  'blog' => [
    'created' => $blog['created'] ?? [],
    'skipped' => $blog['skipped'] ?? '',
    'today' => $blog['today'] ?? null,
  ],
  'videos' => [
    'created' => $videos['created'] ?? [],
    'skipped' => $videos['skipped'] ?? '',
    'today' => $videos['today'] ?? null,
  ],
], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
