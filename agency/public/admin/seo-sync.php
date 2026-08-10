<?php
/**
 * Rebuild SEO artifacts (sitemap.xml + llms.txt) from agency CMS JSON.
 * Called after every admin save.
 */
declare(strict_types=1);

function da_read_json_file(string $path): array {
  if (!is_file($path)) return [];
  $data = json_decode((string)file_get_contents($path), true);
  return is_array($data) ? $data : [];
}

function da_site_base(array $company, array $settings = []): string {
  $website = rtrim((string)($company['website'] ?? 'https://displayavenue.com'), '/');
  $mount = trim((string)($settings['demoBasePath'] ?? ''), '/');
  // Empty demoBasePath = site root (live cutover)
  if ($mount !== '') {
    return $website . '/' . $mount;
  }
  return $website !== '' ? $website : 'https://displayavenue.com';
}

function da_items(array $file): array {
  return is_array($file['items'] ?? null) ? $file['items'] : [];
}

function da_collect_urls(string $contentDir): array {
  $company = da_read_json_file($contentDir . '/company.json');
  $settings = da_read_json_file($contentDir . '/settings.json');
  $home = da_read_json_file($contentDir . '/home.json');
  $services = da_read_json_file($contentDir . '/services.json');
  $industries = da_read_json_file($contentDir . '/industries.json');
  $packages = da_read_json_file($contentDir . '/packages.json');
  $solutions = da_read_json_file($contentDir . '/solutions.json');
  $ai = da_read_json_file($contentDir . '/ai.json');
  $tools = da_read_json_file($contentDir . '/tools.json');
  $cases = da_read_json_file($contentDir . '/cases.json');
  $projects = da_read_json_file($contentDir . '/projects.json');
  $resources = da_read_json_file($contentDir . '/resources.json');

  $static = [
    ['path' => '/', 'priority' => '1.0', 'changefreq' => 'weekly'],
    ['path' => '/services', 'priority' => '0.9', 'changefreq' => 'weekly'],
    ['path' => '/industries', 'priority' => '0.9', 'changefreq' => 'weekly'],
    ['path' => '/solutions', 'priority' => '0.9', 'changefreq' => 'weekly'],
    ['path' => '/ai-platform', 'priority' => '0.9', 'changefreq' => 'weekly'],
    ['path' => '/packages', 'priority' => '0.9', 'changefreq' => 'weekly'],
    ['path' => '/free-tools', 'priority' => '0.8', 'changefreq' => 'weekly'],
    ['path' => '/case-studies', 'priority' => '0.8', 'changefreq' => 'weekly'],
    ['path' => '/portfolio', 'priority' => '0.8', 'changefreq' => 'weekly'],
    ['path' => '/resources', 'priority' => '0.8', 'changefreq' => 'weekly'],
    ['path' => '/why-displayavenue', 'priority' => '0.7', 'changefreq' => 'monthly'],
    ['path' => '/contact', 'priority' => '0.8', 'changefreq' => 'monthly'],
    ['path' => '/privacy', 'priority' => '0.3', 'changefreq' => 'yearly'],
    ['path' => '/terms', 'priority' => '0.3', 'changefreq' => 'yearly'],
  ];

  $urls = $static;

  $maps = [
    [da_items($services), '/services/', '0.7'],
    [da_items($industries), '/industries/', '0.7'],
    [da_items($packages), '/packages/', '0.7'],
    [da_items($solutions), '/solutions/', '0.65'],
    [da_items($ai), '/ai-platform/', '0.7'],
    [da_items($tools), '/free-tools/', '0.65'],
    [da_items($cases), '/case-studies/', '0.65'],
    [da_items($projects), '/portfolio/', '0.65'],
    [da_items($resources), '/resources/', '0.6'],
  ];

  foreach ($maps as [$items, $prefix, $priority]) {
    foreach ($items as $item) {
      if (!empty($item['slug'])) {
        $urls[] = [
          'path' => $prefix . $item['slug'],
          'priority' => $priority,
          'changefreq' => 'monthly',
        ];
      }
    }
  }

  $seen = [];
  $unique = [];
  foreach ($urls as $u) {
    if (isset($seen[$u['path']])) continue;
    $seen[$u['path']] = true;
    $unique[] = $u;
  }

  return [
    'company' => $company,
    'settings' => $settings,
    'home' => $home,
    'services' => $services,
    'urls' => $unique,
  ];
}

function da_build_sitemap_xml(string $base, array $urls, string $lastmod): string {
  $xml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n";
  $xml .= "<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n";
  foreach ($urls as $u) {
    $loc = rtrim($base, '/') . ($u['path'] === '/' ? '/' : $u['path']);
    $xml .= "  <url>\n";
    $xml .= '    <loc>' . htmlspecialchars($loc, ENT_XML1) . "</loc>\n";
    $xml .= '    <lastmod>' . $lastmod . "</lastmod>\n";
    $xml .= '    <changefreq>' . $u['changefreq'] . "</changefreq>\n";
    $xml .= '    <priority>' . $u['priority'] . "</priority>\n";
    $xml .= "  </url>\n";
  }
  $xml .= "</urlset>\n";
  return $xml;
}

function da_build_llms_txt(array $bundle): string {
  $company = $bundle['company'];
  $name = $company['name'] ?? 'DisplayAvenue';
  $tagline = $company['tagline'] ?? 'Digital Growth. AI Powered.';
  $base = da_site_base($company, $bundle['settings'] ?? []);
  $lines = [];
  $lines[] = "# {$name}";
  $lines[] = "> {$tagline}";
  $lines[] = "";
  $lines[] = "AI-powered digital marketing, web development, ecommerce, branding, and automation agency based in Mumbai, India.";
  $lines[] = "";
  $lines[] = "## Primary pages";
  foreach ($bundle['urls'] as $u) {
    if (($u['priority'] ?? '0') >= '0.8' || $u['path'] === '/') {
      $lines[] = "- {$base}" . ($u['path'] === '/' ? '/' : $u['path']);
    }
  }
  $lines[] = "";
  $lines[] = "## Services (sample)";
  foreach (array_slice(da_items($bundle['services'] ?? []), 0, 25) as $s) {
    $title = $s['title'] ?? '';
    $slug = $s['slug'] ?? '';
    if ($title && $slug) $lines[] = "- {$title}: {$base}/services/{$slug}";
  }
  $lines[] = "";
  $lines[] = "## Contact";
  $lines[] = "- Phone: " . ($company['phone'] ?? '');
  $lines[] = "- Email: " . ($company['email'] ?? '');
  $lines[] = "- Website: {$base}/";
  $lines[] = "";
  return implode("\n", $lines) . "\n";
}

function da_sync_seo_artifacts(string $contentDir, ?string $publicDir = null): array {
  $publicDir = $publicDir ?: dirname($contentDir);
  $bundle = da_collect_urls($contentDir);
  $base = da_site_base($bundle['company'], $bundle['settings'] ?? []);
  $lastmod = gmdate('Y-m-d');
  $sitemap = da_build_sitemap_xml($base, $bundle['urls'], $lastmod);
  $llms = da_build_llms_txt($bundle);

  file_put_contents($publicDir . '/sitemap.xml', $sitemap);
  file_put_contents($publicDir . '/llms.txt', $llms);

  $settingsPath = $contentDir . '/settings.json';
  $settings = da_read_json_file($settingsPath);
  $settings['seoSyncedAt'] = gmdate('c');
  $settings['sitemapUrlCount'] = count($bundle['urls']);
  $settings['updatedAt'] = gmdate('c');
  file_put_contents(
    $settingsPath,
    json_encode($settings, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT) . "\n"
  );

  return [
    'ok' => true,
    'base' => $base,
    'urlCount' => count($bundle['urls']),
    'seoSyncedAt' => $settings['seoSyncedAt'],
  ];
}
