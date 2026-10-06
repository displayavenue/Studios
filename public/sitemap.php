<?php
/**
 * Always-fresh sitemap for crawlers. Reads live CMS JSON.
 * Prefer this URL in Search Console if static sitemap.xml fails once.
 */
declare(strict_types=1);

require __DIR__ . '/admin/seo-sync.php';

$contentDir = __DIR__ . '/content';
$bundle = da_collect_urls($contentDir);
$base = da_site_base($bundle['company']);
$lastmod = gmdate('Y-m-d');
$xml = da_build_sitemap_xml($base, $bundle['urls'], $lastmod);

header('Content-Type: application/xml; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('X-Robots-Tag: noindex');
header('Cache-Control: public, max-age=300');
header('Content-Length: ' . strlen($xml));
echo $xml;
