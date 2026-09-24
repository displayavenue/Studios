<?php
/**
 * Daily SEO auto-blog publisher for Hostinger cron.
 *
 * Cron example (Asia/Kolkata 7:00 AM):
 *   0 7 * * * curl -fsS "https://displayavenuestudios.com/admin/auto-blog.php?key=YOUR_SECRET"
 *
 * Optional: &force=1 to publish even if already ran today (admin testing).
 */
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

$config = require __DIR__ . '/config.php';
require_once __DIR__ . '/blog-engine.php';

$key = (string)($_GET['key'] ?? ($_POST['key'] ?? ''));
$secret = (string)($config['blog_cron_secret'] ?? '');
if ($secret === '' || $key === '' || !hash_equals($secret, $key)) {
  http_response_code(403);
  echo json_encode(['ok' => false, 'error' => 'Forbidden — invalid cron key'], JSON_UNESCAPED_SLASHES);
  exit;
}

$force = isset($_GET['force']) || isset($_POST['force']);
$contentDir = rtrim((string)$config['content_dir'], '/\\');
$publicDir = dirname($contentDir);

$result = da_blog_publish_one($contentDir, $publicDir, $force);

http_response_code(!empty($result['ok']) ? 200 : 409);
echo json_encode($result, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
