<?php
/**
 * Blog SEO shell — serves the SPA with correct indexable meta for /blog and /blog/{slug}.
 * Crawlers (and social previews) get the right title, description, and canonical
 * without waiting for client-side React.
 */
declare(strict_types=1);

header('Content-Type: text/html; charset=UTF-8');
header('X-Robots-Tag: index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');

$base = 'https://displayavenue.com';
$indexFile = __DIR__ . '/index.html';
$contentFile = __DIR__ . '/content/blog.json';

if (!is_file($indexFile)) {
  http_response_code(500);
  echo 'Blog shell missing index.html';
  exit;
}

$html = (string)file_get_contents($indexFile);
$blog = [];
if (is_file($contentFile)) {
  $decoded = json_decode((string)file_get_contents($contentFile), true);
  if (is_array($decoded)) $blog = $decoded;
}

// Ensure today's (and missed) autopilot posts exist when /blog is viewed.
try {
  require_once __DIR__ . '/admin/lib/blog.php';
  $ensure = da_blog_ensure_published(7);
  if (!empty($ensure['created']) && is_file($contentFile)) {
    $decoded = json_decode((string)file_get_contents($contentFile), true);
    if (is_array($decoded)) $blog = $decoded;
  }
} catch (Throwable $e) {
  // never break the page shell
}

$slug = isset($_GET['slug']) ? trim((string)$_GET['slug'], '/') : '';
if ($slug === '' && !empty($_SERVER['REQUEST_URI'])) {
  $path = (string)(parse_url((string)$_SERVER['REQUEST_URI'], PHP_URL_PATH) ?: '');
  if (preg_match('#^/blog/([A-Za-z0-9._-]+)/?$#', $path, $m)) {
    $slug = $m[1];
  }
}

$title = 'Blog | DisplayAvenue Digital Marketing Insights';
$description = (string)($blog['lead'] ?? 'Practical digital marketing updates for Indian business owners — Google Ads, Meta Ads, SEO, websites, and WhatsApp growth.');
$canonical = $base . '/blog';
$ogType = 'website';
$jsonLd = [
  '@context' => 'https://schema.org',
  '@type' => 'Blog',
  'name' => (string)($blog['title'] ?? 'DisplayAvenue Blog'),
  'description' => $description,
  'url' => $canonical,
  'publisher' => [
    '@type' => 'Organization',
    'name' => 'DisplayAvenue',
    'url' => $base . '/',
  ],
  'inLanguage' => 'en-IN',
];

$post = null;
if ($slug !== '' && is_array($blog['posts'] ?? null)) {
  foreach ($blog['posts'] as $p) {
    if (($p['slug'] ?? '') === $slug) {
      $post = $p;
      break;
    }
  }
}

if ($post) {
  $title = ((string)$post['title']) . ' | DisplayAvenue Blog';
  $description = (string)($post['excerpt'] ?? $description);
  $canonical = $base . '/blog/' . rawurlencode((string)$post['slug']);
  $ogType = 'article';
  $jsonLd = [
    '@context' => 'https://schema.org',
    '@type' => 'BlogPosting',
    'headline' => (string)$post['title'],
    'description' => $description,
    'datePublished' => (string)($post['publishedAt'] ?? ''),
    'author' => [
      '@type' => 'Organization',
      'name' => (string)($post['author'] ?? 'DisplayAvenue'),
    ],
    'publisher' => [
      '@type' => 'Organization',
      'name' => 'DisplayAvenue',
      'url' => $base . '/',
      'logo' => [
        '@type' => 'ImageObject',
        'url' => $base . '/favicon.svg',
      ],
    ],
    'mainEntityOfPage' => $canonical,
    'articleSection' => (string)($post['category'] ?? 'Growth'),
    'keywords' => implode(', ', is_array($post['tags'] ?? null) ? $post['tags'] : []),
    'url' => $canonical,
    'inLanguage' => 'en-IN',
  ];
} elseif ($slug !== '') {
  // Unknown slug — still indexable listing fallback; SPA will show not-found
  $canonical = $base . '/blog/' . rawurlencode($slug);
}

$esc = static function (string $s): string {
  return htmlspecialchars($s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
};

$titleE = $esc($title);
$descE = $esc($description);
$canonE = $esc($canonical);
$typeE = $esc($ogType);

// Title
$html = preg_replace('#<title>.*?</title>#s', '<title>' . $titleE . '</title>', $html, 1) ?? $html;

// Description
$html = preg_replace(
  '#<meta\s+name="description"\s+content="[^"]*"\s*/?>#i',
  '<meta name="description" content="' . $descE . '" />',
  $html,
  1
) ?? $html;

// Robots — force indexable
$html = preg_replace(
  '#<meta\s+name="robots"\s+content="[^"]*"\s*/?>#i',
  '<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" />',
  $html,
  1
) ?? $html;

// Canonical
$html = preg_replace(
  '#<link\s+rel="canonical"\s+href="[^"]*"\s*/?>#i',
  '<link rel="canonical" href="' . $canonE . '" />',
  $html,
  1
) ?? $html;

// Open Graph / Twitter
$replacements = [
  '#<meta\s+property="og:title"\s+content="[^"]*"\s*/?>#i' => '<meta property="og:title" content="' . $titleE . '" />',
  '#<meta\s+property="og:description"\s+content="[^"]*"\s*/?>#i' => '<meta property="og:description" content="' . $descE . '" />',
  '#<meta\s+property="og:url"\s+content="[^"]*"\s*/?>#i' => '<meta property="og:url" content="' . $canonE . '" />',
  '#<meta\s+property="og:type"\s+content="[^"]*"\s*/?>#i' => '<meta property="og:type" content="' . $typeE . '" />',
  '#<meta\s+name="twitter:title"\s+content="[^"]*"\s*/?>#i' => '<meta name="twitter:title" content="' . $titleE . '" />',
  '#<meta\s+name="twitter:description"\s+content="[^"]*"\s*/?>#i' => '<meta name="twitter:description" content="' . $descE . '" />',
];
foreach ($replacements as $pattern => $replacement) {
  $html = preg_replace($pattern, $replacement, $html, 1) ?? $html;
}

$ldJson = json_encode($jsonLd, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
if ($ldJson) {
  $ldTag = '<script type="application/ld+json" id="blog-seo-jsonld">' . $ldJson . '</script>';
  $html = preg_replace('#</head>#i', $ldTag . "\n  </head>", $html, 1) ?? $html;
}

// Noscript fallback list for non-JS crawlers
$noscript = '<noscript><div style="max-width:720px;margin:2rem auto;font-family:system-ui,sans-serif;padding:1rem">';
$noscript .= '<h1>' . $titleE . '</h1><p>' . $descE . '</p>';
if ($post && is_array($post['body'] ?? null)) {
  foreach ($post['body'] as $para) {
    $noscript .= '<p>' . $esc((string)$para) . '</p>';
  }
} elseif (is_array($blog['posts'] ?? null)) {
  $noscript .= '<ul>';
  foreach (array_slice($blog['posts'], 0, 20) as $p) {
    if (empty($p['slug'])) continue;
    $noscript .= '<li><a href="' . $esc($base . '/blog/' . $p['slug']) . '">' . $esc((string)($p['title'] ?? $p['slug'])) . '</a></li>';
  }
  $noscript .= '</ul>';
}
$noscript .= '<p><a href="' . $esc($base . '/blog') . '">DisplayAvenue Blog</a> · <a href="' . $esc($base . '/sitemap.xml') . '">Sitemap</a></p>';
$noscript .= '</div></noscript>';
$html = preg_replace('#<div id="root"></div>#', '<div id="root"></div>' . $noscript, $html, 1) ?? $html;

echo $html;
