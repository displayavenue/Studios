<?php
declare(strict_types=1);
/**
 * Live auto sitemap for DisplayAvenue.
 * Always built from CMS JSON so new/edited pages appear for SEO without a manual rebuild.
 * Routed from /sitemap.xml via .htaccess.
 */
header('Content-Type: application/xml; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: public, max-age=900');

require_once __DIR__ . '/admin/seo-sync.php';

$contentDir = __DIR__ . '/content';
$bundle = da_collect_urls($contentDir);
$base = da_site_base($bundle['company'], $bundle['settings'] ?? []);
echo da_build_sitemap_xml($base, $bundle['urls']);
