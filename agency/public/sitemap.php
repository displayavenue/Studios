<?php
declare(strict_types=1);
/**
 * Dynamic sitemap for DisplayAvenue agency demo.
 * Prefer this over static sitemap.xml when PHP is available.
 */
header('Content-Type: application/xml; charset=utf-8');
header('Cache-Control: public, max-age=3600');

require_once __DIR__ . '/admin/seo-sync.php';

// Lazy daily blog publish when search engines (or anyone) hit the sitemap.
// Keeps autopilot alive even if Hostinger cron is not configured.
try {
  require_once __DIR__ . '/admin/lib/blog.php';
  $blogResult = da_blog_ensure_published(7);
  if (!empty($blogResult['created'])) {
    @da_sync_seo_artifacts(__DIR__ . '/content', __DIR__);
  }
} catch (Throwable $e) {
  // never break sitemap
}

$contentDir = __DIR__ . '/content';
$bundle = da_collect_urls($contentDir);
$base = da_site_base($bundle['company'], $bundle['settings'] ?? []);
$lastmod = gmdate('Y-m-d');
echo da_build_sitemap_xml($base, $bundle['urls'], $lastmod);
