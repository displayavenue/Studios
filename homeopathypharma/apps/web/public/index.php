<?php
declare(strict_types=1);
/**
 * Hostinger shared-hosting front controller.
 * Serves the static Next export while forcing no-cache headers so CDN/LiteSpeed
 * cannot keep a stale WordPress HTML response for "/".
 */
header("Content-Type: text/html; charset=UTF-8");
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Pragma: no-cache");
header("Expires: 0");
header("X-LiteSpeed-Cache-Control: no-cache");
header("CDN-Cache-Control: no-store");
header("Surrogate-Control: no-store");

$file = __DIR__ . "/index.html";
if (!is_readable($file)) {
    http_response_code(503);
    echo "HomeopathyPharma deploy missing index.html";
    exit;
}
readfile($file);
