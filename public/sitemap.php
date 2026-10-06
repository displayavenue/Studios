<?php
/**
 * Always-fresh sitemap for crawlers. Reads live CMS JSON.
 */
declare(strict_types=1);

require __DIR__ . '/admin/seo-sync.php';

$contentDir = __DIR__ . '/content';
$bundle = da_collect_urls($contentDir);
$base = da_site_base($bundle['company']);
$lastmod = gmdate('Y-m-d');
$xml = da_build_sitemap_xml($base, $bundle['urls'], $lastmod);

// Do not set Content-Length: Hostinger CDN may gzip the body and a fixed
 // length breaks Googlebot fetches ("couldn't fetch").
header('Content-Type: application/xml; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: public, max-age=300');
echo $xml;
