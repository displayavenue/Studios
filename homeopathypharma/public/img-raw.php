<?php
/**
 * Serve selected storefront images without Hostinger CDN resizing.
 * Static /images/* paths are downscaled by hcdn (max ~1600px), which
 * softens text-heavy banners — this proxy streams the original bytes.
 */
declare(strict_types=1);

$allowed = [
    'consult-banner-fullbleed.png',
    'consult-banner-fullbleed.jpg',
    'consult-banner-fullbleed-2x.jpg',
    'consult-banner-fullbleed@2x.jpg',
    'consult-banner-visual-2x.jpg',
    'doctor-lead-banner.jpg',
    'hero-personal-doctors-v3.jpg',
    'hero-banner.jpg',
];

$name = basename((string) ($_GET['f'] ?? ''));
if ($name === '' || ! in_array($name, $allowed, true)) {
    http_response_code(404);
    header('Content-Type: text/plain; charset=UTF-8');
    echo 'Not found';
    exit;
}

$file = __DIR__.'/images/home/'.$name;
if (! is_file($file)) {
    http_response_code(404);
    header('Content-Type: text/plain; charset=UTF-8');
    echo 'Not found';
    exit;
}

$ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));
$types = [
    'png' => 'image/png',
    'jpg' => 'image/jpeg',
    'jpeg' => 'image/jpeg',
    'webp' => 'image/webp',
];
if (! isset($types[$ext])) {
    http_response_code(404);
    exit;
}

$mtime = (string) filemtime($file);
$etag = '"'.md5($name.'|'.$mtime.'|'.filesize($file)).'"';
header('Content-Type: '.$types[$ext]);
header('Content-Length: '.(string) filesize($file));
header('Cache-Control: public, max-age=604800, immutable, no-transform');
header('ETag: '.$etag);
header('Last-Modified: '.gmdate('D, d M Y H:i:s', (int) $mtime).' GMT');
header('X-Content-Type-Options: nosniff');

if (
    (isset($_SERVER['HTTP_IF_NONE_MATCH']) && trim((string) $_SERVER['HTTP_IF_NONE_MATCH']) === $etag)
    || (
        isset($_SERVER['HTTP_IF_MODIFIED_SINCE'])
        && strtotime((string) $_SERVER['HTTP_IF_MODIFIED_SINCE']) >= $mtime
    )
) {
    http_response_code(304);
    exit;
}

readfile($file);
