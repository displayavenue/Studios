<?php
declare(strict_types=1);
/**
 * SPA front controller: known CMS routes → 200 + index.html,
 * unknown paths → 404 + same SPA shell (React NotFound) with noindex.
 * Fixes soft-404 SEO errors (Seobility / Google) where every URL returned 200.
 */
require_once __DIR__ . '/admin/seo-sync.php';

$contentDir = __DIR__ . '/content';
$bundle = da_collect_urls($contentDir);

$raw = (string)(parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/');
$path = rawurldecode($raw);
$path = '/' . trim($path, '/');
if ($path !== '/') {
  $path = rtrim($path, '/');
} else {
  $path = '/';
}

$allowed = [];
foreach ($bundle['urls'] as $u) {
  if (!is_array($u) || empty($u['path'])) continue;
  $p = (string)$u['path'];
  $p = $p === '/' ? '/' : rtrim($p, '/');
  $allowed[$p] = true;
}

// Always treat explicit API / admin / asset-ish prefixes as non-SPA (should be real files).
// If we reached the router, the file was missing → 404.
$isKnown = isset($allowed[$path]);

$status = $isKnown ? 200 : 404;
http_response_code($status);

$indexPath = __DIR__ . '/index.html';
if (!is_file($indexPath)) {
  header('Content-Type: text/plain; charset=utf-8');
  echo $isKnown ? 'OK' : 'Not Found';
  exit;
}

$html = (string)file_get_contents($indexPath);

if (!$isKnown) {
  $html = preg_replace(
    '/<meta\s+name="robots"\s+content="[^"]*"\s*\/?>/i',
    '<meta name="robots" content="noindex,nofollow" />',
    $html,
    1
  ) ?? $html;
  $html = preg_replace(
    '/<title>[^<]*<\/title>/i',
    '<title>Page not found | DisplayAvenue</title>',
    $html,
    1
  ) ?? $html;
  $html = preg_replace(
    '/<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i',
    '<meta name="description" content="The page you requested does not exist on DisplayAvenue." />',
    $html,
    1
  ) ?? $html;
  $html = preg_replace(
    '/<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i',
    '<link rel="canonical" href="https://displayavenue.com/" />',
    $html,
    1
  ) ?? $html;
  $notFoundBody = <<<'HTML'
      <main>
        <h1>Page not found</h1>
        <p>This URL is not a published DisplayAvenue page.</p>
        <nav aria-label="Primary">
          <a href="/">Home</a>
          <a href="/services">Services</a>
          <a href="/contact">Contact</a>
        </nav>
      </main>
HTML;
  $html = preg_replace(
    '/(<div\s+id="root">)([\s\S]*?)(<\/div>\s*(?:<script|\s*<\/body>))/i',
    '$1' . "\n" . $notFoundBody . "\n    " . '$3',
    $html,
    1
  ) ?? $html;
}

header('Content-Type: text/html; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');
echo $html;
