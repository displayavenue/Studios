<?php
/**
 * Daily blog publisher for DisplayAvenue.
 * Hostinger cron (once per day, e.g. 09:15 IST):
 *   curl -s "https://displayavenue.com/admin/blog-cron.php?key=YOUR_CRON_KEY"
 * Uses cron_key from social-local.php (same as Social Studio) when present.
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

$created = da_blog_publish_today();
echo json_encode([
  'ok' => true,
  'at' => gmdate('c'),
  'created' => $created ? [
    'slug' => $created['slug'],
    'title' => $created['title'],
    'publishedAt' => $created['publishedAt'],
  ] : null,
  'message' => $created ? 'Published today\'s blog post' : 'Already published today or autopilot off',
], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
