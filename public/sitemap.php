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

header('Content-Type: application/xml; charset=utf-8');
header('Cache-Control: public, max-age=300');
echo da_build_sitemap_xml($base, $bundle['urls'], $lastmod);
