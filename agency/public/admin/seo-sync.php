<?php
/**
 * Rebuild SEO artifacts (sitemap.xml + llms.txt + robots.txt) from agency CMS JSON.
 * Called after every admin save, Clear cache, and manual "Regenerate sitemap".
 */
declare(strict_types=1);

function da_read_json_file(string $path): array {
  if (!is_file($path)) return [];
  $data = json_decode((string)file_get_contents($path), true);
  return is_array($data) ? $data : [];
}

function da_site_base(array $company, array $settings = []): string {
  $website = rtrim((string)($company['website'] ?? 'https://displayavenue.com'), '/');
  // Empty demoBasePath = site lives at domain root after WordPress cutover
  $mount = trim((string)($settings['demoBasePath'] ?? ''), '/');
  if ($mount !== '') {
    return $website . '/' . $mount;
  }
  return $website !== '' ? $website : 'https://displayavenue.com';
}

function da_items(array $file): array {
  return is_array($file['items'] ?? null) ? $file['items'] : [];
}

/** Normalize CMS dates to sitemap lastmod (YYYY-MM-DD). */
function da_lastmod(?string $value = null): string {
  $fallback = gmdate('Y-m-d');
  if ($value === null || trim($value) === '') return $fallback;
  $raw = trim($value);
  if (preg_match('/^\d{4}-\d{2}-\d{2}/', $raw, $m)) return $m[0];
  if (preg_match('/^\d{4}$/', $raw)) return $raw . '-01-01';
  $ts = strtotime($raw);
  return $ts ? gmdate('Y-m-d', $ts) : $fallback;
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
  $catalogue = da_read_json_file($contentDir . '/catalogue.json');
  $shop = da_read_json_file($contentDir . '/shop.json');
  $landings = da_read_json_file($contentDir . '/landings.json');

  $today = gmdate('Y-m-d');
  $settingsLast = da_lastmod((string)($settings['updatedAt'] ?? $settings['seoSyncedAt'] ?? $today));
  $catalogueLast = da_lastmod((string)($catalogue['updatedAt'] ?? $catalogue['uploadedAt'] ?? $settingsLast));
  $shopLast = da_lastmod((string)($shop['updatedAt'] ?? $settingsLast));
  $landingsLast = da_lastmod((string)($landings['updatedAt'] ?? $settingsLast));

  $static = [
    ['path' => '/', 'priority' => '1.0', 'changefreq' => 'daily', 'lastmod' => $settingsLast],
    ['path' => '/services', 'priority' => '0.9', 'changefreq' => 'weekly', 'lastmod' => $settingsLast],
    ['path' => '/industries', 'priority' => '0.9', 'changefreq' => 'weekly', 'lastmod' => $settingsLast],
    ['path' => '/solutions', 'priority' => '0.9', 'changefreq' => 'weekly', 'lastmod' => $settingsLast],
    ['path' => '/ai-platform', 'priority' => '0.9', 'changefreq' => 'weekly', 'lastmod' => $settingsLast],
    ['path' => '/packages', 'priority' => '0.9', 'changefreq' => 'weekly', 'lastmod' => $settingsLast],
    ['path' => '/free-tools', 'priority' => '0.8', 'changefreq' => 'weekly', 'lastmod' => $settingsLast],
    ['path' => '/case-studies', 'priority' => '0.8', 'changefreq' => 'weekly', 'lastmod' => $settingsLast],
    ['path' => '/portfolio', 'priority' => '0.8', 'changefreq' => 'weekly', 'lastmod' => $settingsLast],
    ['path' => '/resources', 'priority' => '0.8', 'changefreq' => 'weekly', 'lastmod' => $settingsLast],
    ['path' => '/catalogue', 'priority' => '0.75', 'changefreq' => 'monthly', 'lastmod' => $catalogueLast],
    ['path' => '/shop', 'priority' => '0.85', 'changefreq' => 'weekly', 'lastmod' => $shopLast],
    ['path' => '/why-displayavenue', 'priority' => '0.7', 'changefreq' => 'monthly', 'lastmod' => $settingsLast],
    ['path' => '/contact', 'priority' => '0.8', 'changefreq' => 'monthly', 'lastmod' => $settingsLast],
    ['path' => '/privacy', 'priority' => '0.3', 'changefreq' => 'yearly', 'lastmod' => $settingsLast],
    ['path' => '/terms', 'priority' => '0.3', 'changefreq' => 'yearly', 'lastmod' => $settingsLast],
  ];

  // Hide catalogue from sitemap when disabled in CMS
  if (array_key_exists('enabled', $catalogue) && $catalogue['enabled'] === false) {
    $static = array_values(array_filter($static, static fn($u) => ($u['path'] ?? '') !== '/catalogue'));
  }
  if (array_key_exists('enabled', $shop) && $shop['enabled'] === false) {
    $static = array_values(array_filter($static, static fn($u) => ($u['path'] ?? '') !== '/shop'));
  }

  $urls = $static;

  $maps = [
    [da_items($services), '/services/', '0.7', 'weekly'],
    [da_items($industries), '/industries/', '0.7', 'monthly'],
    [da_items($packages), '/packages/', '0.7', 'monthly'],
    [da_items($solutions), '/solutions/', '0.65', 'monthly'],
    [da_items($ai), '/ai-platform/', '0.7', 'monthly'],
    [da_items($tools), '/free-tools/', '0.65', 'monthly'],
    [da_items($cases), '/case-studies/', '0.65', 'monthly'],
    [da_items($projects), '/portfolio/', '0.65', 'monthly'],
    [da_items($resources), '/resources/', '0.6', 'weekly'],
  ];

  foreach ($maps as [$items, $prefix, $priority, $changefreq]) {
    foreach ($items as $item) {
      if (empty($item['slug'])) continue;
      $urls[] = [
        'path' => $prefix . $item['slug'],
        'priority' => $priority,
        'changefreq' => $changefreq,
        'lastmod' => da_lastmod(
          (string)($item['updatedAt'] ?? $item['date'] ?? $settingsLast)
        ),
      ];
    }
  }

  // Shop product URLs
  if (!array_key_exists('enabled', $shop) || $shop['enabled'] !== false) {
    $shopProducts = is_array($shop['products'] ?? null) ? $shop['products'] : [];
    foreach ($shopProducts as $product) {
      if (!is_array($product)) continue;
      if (($product['enabled'] ?? true) === false) continue;
      $slug = (string)($product['slug'] ?? $product['id'] ?? '');
      if ($slug === '') continue;
      $urls[] = [
        'path' => '/shop/' . $slug,
        'priority' => '0.7',
        'changefreq' => 'weekly',
        'lastmod' => $shopLast,
      ];
    }
  }

  // Ads landing pages (/lp/:slug)
  foreach (da_items($landings) as $landing) {
    if (!is_array($landing)) continue;
    if (($landing['enabled'] ?? true) === false) continue;
    $slug = (string)($landing['slug'] ?? '');
    if ($slug === '') continue;
    $urls[] = [
      'path' => '/lp/' . $slug,
      'priority' => '0.6',
      'changefreq' => 'weekly',
      'lastmod' => da_lastmod((string)($landing['updatedAt'] ?? $landingsLast)),
    ];
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

function da_build_sitemap_xml(string $base, array $urls, ?string $fallbackLastmod = null): string {
  $fallbackLastmod = $fallbackLastmod ?: gmdate('Y-m-d');
  $xml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n";
  $xml .= "<?xml-stylesheet type=\"text/xsl\" href=\"/sitemap.xsl\"?>\n";
  $xml .= "<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n";
  foreach ($urls as $u) {
    $loc = rtrim($base, '/') . ($u['path'] === '/' ? '/' : $u['path']);
    $lastmod = da_lastmod((string)($u['lastmod'] ?? $fallbackLastmod));
    $xml .= "  <url>\n";
    $xml .= '    <loc>' . htmlspecialchars($loc, ENT_XML1) . "</loc>\n";
    $xml .= '    <lastmod>' . $lastmod . "</lastmod>\n";
    $xml .= '    <changefreq>' . htmlspecialchars((string)$u['changefreq'], ENT_XML1) . "</changefreq>\n";
    $xml .= '    <priority>' . htmlspecialchars((string)$u['priority'], ENT_XML1) . "</priority>\n";
    $xml .= "  </url>\n";
  }
  $xml .= "</urlset>\n";
  return $xml;
}

function da_build_robots_txt(string $base): string {
  $sitemap = rtrim($base, '/') . '/sitemap.xml';
  return implode("\n", [
    'User-agent: *',
    'Allow: /',
    'Disallow: /admin/',
    'Disallow: /admin',
    '',
    '# AI / assistant crawlers',
    'User-agent: GPTBot',
    'Allow: /',
    '',
    'User-agent: ChatGPT-User',
    'Allow: /',
    '',
    'User-agent: Google-Extended',
    'Allow: /',
    '',
    'User-agent: anthropic-ai',
    'Allow: /',
    '',
    'User-agent: ClaudeBot',
    'Allow: /',
    '',
    'User-agent: PerplexityBot',
    'Allow: /',
    '',
    'Sitemap: ' . $sitemap,
    'Host: ' . preg_replace('#^https?://#', '', rtrim($base, '/')),
    '',
  ]) . "\n";
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
  $lines[] = "- Sitemap: {$base}/sitemap.xml";
  $lines[] = "";
  return implode("\n", $lines) . "\n";
}

/**
 * Best-effort notify search engines that the sitemap updated.
 * Google's ping endpoint is deprecated but harmless; Bing still accepts it.
 */
function da_ping_search_engines(string $sitemapUrl): array {
  $targets = [
    'bing' => 'https://www.bing.com/ping?sitemap=' . rawurlencode($sitemapUrl),
    'google' => 'https://www.google.com/ping?sitemap=' . rawurlencode($sitemapUrl),
  ];
  $results = [];
  foreach ($targets as $name => $url) {
    $ok = false;
    $status = 0;
    if (function_exists('curl_init')) {
      $ch = curl_init($url);
      curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 6,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_USERAGENT => 'DisplayAvenueSitemapBot/1.0',
      ]);
      curl_exec($ch);
      $status = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
      $ok = $status >= 200 && $status < 400;
      curl_close($ch);
    } else {
      $ctx = stream_context_create(['http' => ['timeout' => 6, 'ignore_errors' => true]]);
      @file_get_contents($url, false, $ctx);
      if (isset($http_response_header[0]) && preg_match('/\s(\d{3})\s/', $http_response_header[0], $m)) {
        $status = (int)$m[1];
        $ok = $status >= 200 && $status < 400;
      }
    }
    $results[$name] = ['ok' => $ok, 'status' => $status];
  }
  return $results;
}

function da_sync_seo_artifacts(string $contentDir, ?string $publicDir = null, bool $ping = true): array {
  $publicDir = $publicDir ?: dirname($contentDir);
  $bundle = da_collect_urls($contentDir);
  $base = da_site_base($bundle['company'], $bundle['settings'] ?? []);
  $lastmod = gmdate('Y-m-d');
  $sitemap = da_build_sitemap_xml($base, $bundle['urls'], $lastmod);
  $llms = da_build_llms_txt($bundle);
  $robots = da_build_robots_txt($base);

  file_put_contents($publicDir . '/sitemap.xml', $sitemap);
  file_put_contents($publicDir . '/llms.txt', $llms);
  file_put_contents($publicDir . '/robots.txt', $robots);

  $sitemapUrl = rtrim($base, '/') . '/sitemap.xml';
  $pings = $ping ? da_ping_search_engines($sitemapUrl) : [];

  $settingsPath = $contentDir . '/settings.json';
  $settings = da_read_json_file($settingsPath);
  $settings['seoSyncedAt'] = gmdate('c');
  $settings['sitemapUrlCount'] = count($bundle['urls']);
  $settings['sitemapUrl'] = $sitemapUrl;
  $settings['autoSitemap'] = true;
  $settings['updatedAt'] = gmdate('c');
  if ($pings) $settings['sitemapLastPing'] = $pings;
  file_put_contents(
    $settingsPath,
    json_encode($settings, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT) . "\n"
  );

  return [
    'ok' => true,
    'base' => $base,
    'sitemapUrl' => $sitemapUrl,
    'urlCount' => count($bundle['urls']),
    'seoSyncedAt' => $settings['seoSyncedAt'],
    'pings' => $pings,
    'autoSitemap' => true,
  ];
}
