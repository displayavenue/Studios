<?php
/**
 * SEO router for the DisplayAvenue SPA.
 * Serves unique title/description/canonical + crawler-visible HTML per known route,
 * and a real HTTP 404 for unknown paths (fixes soft-404 homepage shells).
 */
declare(strict_types=1);

$dir = __DIR__;
$indexPath = $dir . '/index.html';
$pagesPath = $dir . '/seo-pages.json';

if (!is_file($indexPath)) {
  http_response_code(500);
  header('Content-Type: text/plain; charset=utf-8');
  echo "index.html missing";
  exit;
}

$rawUri = $_SERVER['REQUEST_URI'] ?? '/';
$path = parse_url($rawUri, PHP_URL_PATH);
$path = is_string($path) ? $path : '/';
$path = '/' . ltrim($path, '/');
if ($path !== '/') {
  $path = rtrim($path, '/') ?: '/';
}

if ($path === '/index.html') {
  $path = '/';
}

// Never handle real files (assets, admin, content, etc.)
$asFile = $dir . $path;
if ($path !== '/' && is_file($asFile)) {
  return false;
}

$pages = [];
if (is_file($pagesPath)) {
  $decoded = json_decode((string)file_get_contents($pagesPath), true);
  if (is_array($decoded)) $pages = $decoded;
}

$site = 'https://displayavenue.com';
$html = (string)file_get_contents($indexPath);
$isKnown = array_key_exists($path, $pages);

if (!$isKnown) {
  http_response_code(404);
  $title = 'Page not found | DisplayAvenue';
  $description = 'The page you requested is not available. Browse DisplayAvenue services, case studies, or contact us.';
  $canonical = $site . '/404';
  $h1 = 'Page not found';
  $summary = 'Sorry — this URL is not part of the DisplayAvenue website. Use the links below to continue.';
  $links = [
    ['href' => '/', 'label' => 'Home'],
    ['href' => '/services', 'label' => 'Services'],
    ['href' => '/growth', 'label' => 'Growth Plan'],
    ['href' => '/contact', 'label' => 'Contact'],
  ];
  $robots = 'noindex,follow';
  $type = 'website';
} else {
  http_response_code(200);
  $meta = is_array($pages[$path]) ? $pages[$path] : [];
  $title = trim((string)($meta['title'] ?? 'DisplayAvenue'));
  $description = trim((string)($meta['description'] ?? ''));
  $canonical = $site . ($path === '/' ? '/' : $path);
  $h1 = trim((string)($meta['h1'] ?? $title));
  $summary = trim((string)($meta['summary'] ?? $description));
  $links = is_array($meta['links'] ?? null) ? $meta['links'] : [];
  $robots = !empty($meta['noindex']) ? 'noindex,follow' : 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1';
  $type = trim((string)($meta['ogType'] ?? 'website'));
}

$esc = static function (string $s): string {
  return htmlspecialchars($s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
};

$replaceMeta = static function (string $html, string $pattern, string $replacement): string {
  $out = preg_replace($pattern, $replacement, $html, 1);
  return is_string($out) ? $out : $html;
};

$html = $replaceMeta(
  $html,
  '/<title>.*?<\/title>/is',
  '<title>' . $esc($title) . '</title>'
);
$html = $replaceMeta(
  $html,
  '/<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i',
  '<meta name="description" content="' . $esc($description) . '" />'
);
$html = $replaceMeta(
  $html,
  '/<meta\s+name="robots"\s+content="[^"]*"\s*\/?>/i',
  '<meta name="robots" content="' . $esc($robots) . '" />'
);
$html = $replaceMeta(
  $html,
  '/<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i',
  '<link rel="canonical" href="' . $esc($canonical) . '" />'
);
$html = $replaceMeta(
  $html,
  '/<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/i',
  '<meta property="og:title" content="' . $esc($title) . '" />'
);
$html = $replaceMeta(
  $html,
  '/<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/i',
  '<meta property="og:description" content="' . $esc($description) . '" />'
);
$html = $replaceMeta(
  $html,
  '/<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/i',
  '<meta property="og:url" content="' . $esc($canonical) . '" />'
);
$html = $replaceMeta(
  $html,
  '/<meta\s+property="og:type"\s+content="[^"]*"\s*\/?>/i',
  '<meta property="og:type" content="' . $esc($type) . '" />'
);
$html = $replaceMeta(
  $html,
  '/<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/i',
  '<meta name="twitter:title" content="' . $esc($title) . '" />'
);
$html = $replaceMeta(
  $html,
  '/<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/i',
  '<meta name="twitter:description" content="' . $esc($description) . '" />'
);

$linkHtml = '';
foreach ($links as $link) {
  if (!is_array($link)) continue;
  $href = trim((string)($link['href'] ?? ''));
  $label = trim((string)($link['label'] ?? ''));
  if ($href === '' || $label === '') continue;
  $linkHtml .= '<li><a href="' . $esc($href) . '">' . $esc($label) . '</a></li>';
}
if ($linkHtml === '') {
  $linkHtml = '<li><a href="/">Home</a></li><li><a href="/services">Services</a></li><li><a href="/contact">Contact</a></li>';
}

// Full prerendered page (built by scripts/prerender.mjs) — preferred over the thin shell.
$prerender = null;
if ($isKnown) {
  $file = $dir . '/prerender/' . ($path === '/' ? 'index' : ltrim($path, '/')) . '.json';
  $real = is_file($file) ? realpath($file) : false;
  $base = realpath($dir . '/prerender');
  if ($real && $base && strpos($real, $base . DIRECTORY_SEPARATOR) === 0) {
    $decoded = json_decode((string)file_get_contents($real), true);
    if (is_array($decoded) && !empty($decoded['html'])) $prerender = $decoded;
  }
}

if ($prerender !== null) {
  $ld = '';
  foreach (($prerender['jsonLd'] ?? []) as $block) {
    if (!is_array($block) || !is_array($block['data'] ?? null)) continue;
    $id = preg_replace('/[^a-z0-9-]/i', '', (string)($block['id'] ?? ''));
    $json = json_encode($block['data'], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_HEX_TAG);
    // Same id as the React app uses, so it updates these instead of adding duplicates.
    if ($json) $ld .= '<script type="application/ld+json" id="' . $id . '">' . $json . "</script>\n";
  }
  if ($ld !== '') {
    $html = preg_replace('/<\/head>/i', $ld . '</head>', $html, 1) ?? $html;
  }
  $rootHtml = (string)$prerender['html'];
  $html = preg_replace_callback(
    '/<div id="root"><\/div>/',
    static fn() => '<div id="root">' . $rootHtml . '</div>',
    $html,
    1
  ) ?? $html;
} else {
  $static = '<main id="seo-static" data-seo-path="' . $esc($path) . '">'
    . '<h1>' . $esc($h1) . '</h1>'
    . '<p>' . $esc($summary) . '</p>'
    . '<nav aria-label="Popular pages"><ul>' . $linkHtml . '</ul></nav>'
    . '</main>';

  $html = preg_replace(
    '/<div id="root"><\/div>/',
    $static . "\n    <div id=\"root\"></div>",
    $html,
    1
  ) ?? $html;
}

header('Content-Type: text/html; charset=utf-8');
header('X-DA-SEO-Router: 1');
header('X-DA-SEO-Path: ' . $path);
header('Cache-Control: public, max-age=300');
echo $html;
