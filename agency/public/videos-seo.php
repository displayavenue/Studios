<?php
/**
 * Videos SEO shell — indexable meta for /videos and lazy daily reel publish.
 */
declare(strict_types=1);

$publicDir = __DIR__;
$contentFile = $publicDir . '/content/videos.json';
$indexFile = $publicDir . '/index.html';

if (!is_file($indexFile)) {
  http_response_code(500);
  echo 'Missing index.html';
  exit;
}

$html = (string)file_get_contents($indexFile);
$base = 'https://displayavenue.com';
$path = parse_url($_SERVER['REQUEST_URI'] ?? '/videos', PHP_URL_PATH) ?: '/videos';
$path = rtrim($path, '/') ?: '/videos';

// Ensure today's (and missed) autopilot reels exist when /videos is viewed.
try {
  require_once __DIR__ . '/admin/lib/videos.php';
  $ensure = da_videos_ensure_published(7);
  if (!empty($ensure['created'])) {
    require_once __DIR__ . '/admin/seo-sync.php';
    @da_sync_seo_artifacts($publicDir . '/content', $publicDir);
  }
} catch (Throwable $e) {
  // never break the page
}

$videos = [];
if (is_file($contentFile)) {
  $decoded = json_decode((string)file_get_contents($contentFile), true);
  if (is_array($decoded)) $videos = $decoded;
}

$title = (string)($videos['title'] ?? 'DisplayAvenue Videos');
$lead = (string)($videos['lead'] ?? 'Daily talking-head reels for Indian business owners.');
$canonical = $base . '/videos';
$pageTitle = $title . ' | Daily Reels';
$desc = $lead;
$ogImage = trim((string)($videos['speakerImage'] ?? ''));
if ($ogImage === '') {
  $ogImage = $base . '/images/card/front.png';
} elseif (str_starts_with($ogImage, '/')) {
  $ogImage = $base . $ogImage;
}

$esc = static function (string $s): string {
  return htmlspecialchars($s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
};

$meta = ''
  . '<title>' . $esc($pageTitle) . '</title>' . "\n"
  . '<meta name="description" content="' . $esc($desc) . '" />' . "\n"
  . '<link rel="canonical" href="' . $esc($canonical) . '" />' . "\n"
  . '<meta property="og:type" content="website" />' . "\n"
  . '<meta property="og:title" content="' . $esc($pageTitle) . '" />' . "\n"
  . '<meta property="og:description" content="' . $esc($desc) . '" />' . "\n"
  . '<meta property="og:url" content="' . $esc($canonical) . '" />' . "\n"
  . '<meta property="og:image" content="' . $esc($ogImage) . '" />' . "\n"
  . '<meta name="twitter:card" content="summary_large_image" />' . "\n"
  . '<meta name="twitter:title" content="' . $esc($pageTitle) . '" />' . "\n"
  . '<meta name="twitter:description" content="' . $esc($desc) . '" />' . "\n"
  . '<meta name="twitter:image" content="' . $esc($ogImage) . '" />' . "\n"
  . '<meta name="robots" content="index,follow" />';

// Replace or inject title/description blocks lightly
if (preg_match('/<title>.*?<\/title>/is', $html)) {
  $html = preg_replace('/<title>.*?<\/title>/is', '<title>' . $esc($pageTitle) . '</title>', $html, 1) ?? $html;
} else {
  $html = str_replace('</head>', $meta . "\n</head>", $html);
}
if (preg_match('/<meta\s+name=["\']description["\'][^>]*>/i', $html)) {
  $html = preg_replace(
    '/<meta\s+name=["\']description["\'][^>]*>/i',
    '<meta name="description" content="' . $esc($desc) . '" />',
    $html,
    1
  ) ?? $html;
}
if (preg_match('/<link\s+rel=["\']canonical["\'][^>]*>/i', $html)) {
  $html = preg_replace(
    '/<link\s+rel=["\']canonical["\'][^>]*>/i',
    '<link rel="canonical" href="' . $esc($canonical) . '" />',
    $html,
    1
  ) ?? $html;
} else {
  $html = str_replace('</head>', '<link rel="canonical" href="' . $esc($canonical) . '" />' . "\n</head>", $html);
}

$reels = is_array($videos['reels'] ?? null) ? $videos['reels'] : [];
$noscript = '<noscript><h1>' . $esc($title) . '</h1><p>' . $esc($lead) . '</p><ul>';
foreach (array_slice($reels, 0, 30) as $r) {
  if (empty($r['title'])) continue;
  $noscript .= '<li>' . $esc((string)$r['title']) . ' (' . $esc((string)($r['publishedAt'] ?? '')) . ')</li>';
}
$noscript .= '</ul><p><a href="' . $esc($base . '/videos') . '">DisplayAvenue Videos</a></p></noscript>';
$html = str_replace('</body>', $noscript . "\n</body>", $html);

header('Content-Type: text/html; charset=utf-8');
header('Cache-Control: public, max-age=300');
echo $html;
