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
], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
