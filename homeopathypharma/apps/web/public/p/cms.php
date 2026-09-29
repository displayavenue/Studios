<?php
declare(strict_types=1);
/**
 * Dynamic CMS page renderer for Hostinger.
 * Used when no static /p/{slug}/index.html exists, or always preferred via rewrite.
 */
header('Content-Type: text/html; charset=UTF-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');

$slug = preg_replace('/[^a-z0-9\-]/i', '', (string) ($_GET['slug'] ?? '')) ?? '';
$pagesFile = dirname(__DIR__) . '/cms-data/pages.json';
$pages = [];
if (is_readable($pagesFile)) {
    $pages = json_decode((string) file_get_contents($pagesFile), true) ?: [];
}

$page = null;
foreach ($pages as $row) {
    if (($row['slug'] ?? '') === $slug && ($row['status'] ?? '') === 'published') {
        $page = $row;
        break;
    }
}

if (!$page) {
    http_response_code(404);
    echo '<!DOCTYPE html><html><head><title>Not found</title></head><body><h1>Page not found</h1><p><a href="/">Home</a></p></body></html>';
    exit;
}

$title = htmlspecialchars((string) ($page['seoTitle'] ?? $page['title'] ?? 'Page'), ENT_QUOTES, 'UTF-8');
$desc = htmlspecialchars((string) ($page['seoDescription'] ?? $page['excerpt'] ?? ''), ENT_QUOTES, 'UTF-8');
$heading = htmlspecialchars((string) ($page['title'] ?? ''), ENT_QUOTES, 'UTF-8');
$excerpt = htmlspecialchars((string) ($page['excerpt'] ?? ''), ENT_QUOTES, 'UTF-8');
$body = (string) ($page['bodyHtml'] ?? '');
?><!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title><?= $title ?> · HomeopathyPharma</title>
  <meta name="description" content="<?= $desc ?>" />
  <link rel="stylesheet" href="/_next/static/css/<?= '' ?>" />
  <style>
    body{margin:0;font-family:Manrope,Avenir Next,Segoe UI,sans-serif;color:#1a1f1e;background:linear-gradient(180deg,#fff,#f5f7f6 42%,#eaf1ed)}
    .wrap{width:min(42rem, calc(100% - 1.5rem));margin:2rem auto 4rem}
    h1{font-family:Fraunces,Georgia,serif;color:#0b3d3a}
    .muted{color:#5c6663}
    a{color:#0b3d3a}
  </style>
</head>
<body>
  <main class="wrap">
    <p><a href="/">← HomeopathyPharma</a></p>
    <h1><?= $heading ?></h1>
    <?php if ($excerpt !== ''): ?><p class="muted"><?= $excerpt ?></p><?php endif; ?>
    <div><?= $body ?></div>
  </main>
</body>
</html>
