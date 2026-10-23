<?php
declare(strict_types=1);
/**
 * Dynamic sitemap for DisplayAvenue agency demo.
 * Prefer this over static sitemap.xml when PHP is available.
 */
header('Content-Type: application/xml; charset=utf-8');
header('Cache-Control: public, max-age=3600');

require_once __DIR__ . '/admin/seo-sync.php';

$contentDir = __DIR__ . '/content';
$bundle = da_collect_urls($contentDir);
$base = da_site_base($bundle['company'], $bundle['settings'] ?? []);
$lastmod = gmdate('Y-m-d');
echo da_build_sitemap_xml($base, $bundle['urls'], $lastmod);
