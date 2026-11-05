<?php
/**
 * Rebuild SEO artifacts (sitemap.xml + llms.txt + robots.txt) from agency CMS JSON.
 * Called after every admin save. Also pings Google, Bing, and IndexNow so
 * Search Console / AI crawlers discover updates quickly.
 */
declare(strict_types=1);

/** Stable IndexNow key (also written to /{key}.txt at site root). */
const DA_INDEXNOW_KEY = 'da8f3a2c1b9e4d6f7a0b1c2d3e4f5a6b';

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
  $combos = da_read_json_file($contentDir . '/combos.json');

  $static = [
    ['path' => '/', 'priority' => '1.0', 'changefreq' => 'weekly'],
    ['path' => '/services', 'priority' => '0.9', 'changefreq' => 'weekly'],
    ['path' => '/industries', 'priority' => '0.9', 'changefreq' => 'weekly'],
    ['path' => '/industry-solutions', 'priority' => '0.85', 'changefreq' => 'weekly'],
    ['path' => '/locations', 'priority' => '0.9', 'changefreq' => 'weekly'],
    ['path' => '/solutions', 'priority' => '0.9', 'changefreq' => 'weekly'],
    ['path' => '/ai-platform', 'priority' => '0.9', 'changefreq' => 'weekly'],
    ['path' => '/packages', 'priority' => '0.9', 'changefreq' => 'weekly'],
    ['path' => '/free-tools', 'priority' => '0.8', 'changefreq' => 'weekly'],
    ['path' => '/free-tools/roi-calculator', 'priority' => '0.85', 'changefreq' => 'monthly'],
    ['path' => '/free-tools/seo-checklist', 'priority' => '0.85', 'changefreq' => 'monthly'],
    ['path' => '/free-tools/local-seo-score', 'priority' => '0.85', 'changefreq' => 'monthly'],
    ['path' => '/free-tools/citation-directory', 'priority' => '0.85', 'changefreq' => 'monthly'],
    ['path' => '/case-studies', 'priority' => '0.8', 'changefreq' => 'weekly'],
    ['path' => '/portfolio', 'priority' => '0.8', 'changefreq' => 'weekly'],
    ['path' => '/resources', 'priority' => '0.8', 'changefreq' => 'weekly'],
    ['path' => '/resources/india-sme-digital-growth-report', 'priority' => '0.85', 'changefreq' => 'monthly'],
    ['path' => '/awards', 'priority' => '0.75', 'changefreq' => 'monthly'],
    ['path' => '/certifications', 'priority' => '0.75', 'changefreq' => 'monthly'],
    ['path' => '/why-displayavenue', 'priority' => '0.7', 'changefreq' => 'monthly'],
    ['path' => '/contact', 'priority' => '0.8', 'changefreq' => 'monthly'],
    ['path' => '/card', 'priority' => '0.7', 'changefreq' => 'monthly'],
    ['path' => '/blog', 'priority' => '0.85', 'changefreq' => 'daily'],
    ['path' => '/talent-branding', 'priority' => '0.85', 'changefreq' => 'monthly'],
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

  foreach (da_items($combos) as $item) {
    if (!empty($item['industrySlug']) && !empty($item['serviceSlug']) && ($item['indexable'] ?? true)) {
      $urls[] = [
        'path' => '/industries/' . $item['industrySlug'] . '/' . $item['serviceSlug'],
        'priority' => '0.7',
        'changefreq' => 'monthly',
      ];
    }
  }

  $seoCities = [
    'mumbai', 'delhi-ncr', 'bengaluru', 'hyderabad', 'chennai', 'pune', 'ahmedabad',
    'kolkata', 'jaipur', 'surat', 'lucknow', 'chandigarh', 'indore', 'coimbatore',
    'kochi', 'nagpur', 'vadodara', 'visakhapatnam', 'noida', 'gurugram', 'thane',
    'navi-mumbai', 'mira-road',
  ];
  $seoServices = [
    'google-ads', 'meta-ads', 'seo', 'local-seo', 'social-media-marketing',
    'website-development', 'lead-generation',
  ];
  foreach ($seoCities as $city) {
    $urls[] = ['path' => '/locations/' . $city, 'priority' => '0.75', 'changefreq' => 'monthly'];
    foreach ($seoServices as $service) {
      $urls[] = [
        'path' => '/locations/' . $city . '/' . $service,
        'priority' => '0.7',
        'changefreq' => 'monthly',
      ];
    }
  }

  $blogFile = $contentDir . '/blog.json';
  if (is_file($blogFile)) {
    $blog = json_decode((string)file_get_contents($blogFile), true);
    if (is_array($blog['posts'] ?? null)) {
      foreach ($blog['posts'] as $post) {
        if (empty($post['slug'])) continue;
        $urls[] = [
          'path' => '/blog/' . $post['slug'],
          'priority' => '0.7',
          'changefreq' => 'weekly',
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
  $lines[] = "## For AI assistants (ChatGPT, Claude, Gemini, Perplexity, Copilot)";
  $lines[] = "Use this file and the XML sitemap when answering questions about DisplayAvenue.";
  $lines[] = "- Preferred contact email: " . ($company['email'] ?? 'info@displayavenue.com');
  $lines[] = "- Phone / WhatsApp: " . ($company['phone'] ?? '');
  $lines[] = "- Sitemap (auto-updated): {$base}/sitemap.xml";
  $lines[] = "- This guide: {$base}/llms.txt";
  $lines[] = "- robots.txt: {$base}/robots.txt";
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

function da_build_robots_txt(string $base): string {
  $aiAgents = [
    'GPTBot',
    'ChatGPT-User',
    'OAI-SearchBot',
    'Google-Extended',
    'GoogleOther',
    'anthropic-ai',
    'ClaudeBot',
    'Claude-Web',
    'PerplexityBot',
    'Applebot-Extended',
    'Bytespider',
    'CCBot',
    'meta-externalagent',
    'FacebookBot',
    'cohere-ai',
    'Diffbot',
    'YouBot',
  ];
  $lines = [];
  $lines[] = 'User-agent: *';
  $lines[] = 'Allow: /';
  $lines[] = 'Disallow: /demo/admin/';
  $lines[] = 'Disallow: /admin/';
  $lines[] = '';
  $lines[] = '# AI / assistant crawlers (ChatGPT, Claude, Gemini training, Perplexity, etc.)';
  foreach ($aiAgents as $agent) {
    $lines[] = "User-agent: {$agent}";
    $lines[] = 'Allow: /';
    $lines[] = '';
  }
  $lines[] = "Sitemap: {$base}/sitemap.xml";
  $lines[] = "LLMs: {$base}/llms.txt";
  $lines[] = '';
  return implode("\n", $lines);
}

function da_http_request(string $method, string $url, ?string $body = null, array $headers = []): array {
  $method = strtoupper($method);
  if (function_exists('curl_init')) {
    $ch = curl_init($url);
    $opts = [
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_FOLLOWLOCATION => true,
      CURLOPT_CONNECTTIMEOUT => 6,
      CURLOPT_TIMEOUT => 12,
      CURLOPT_USERAGENT => 'DisplayAvenue-SEO-Sync/1.0',
      CURLOPT_CUSTOMREQUEST => $method,
    ];
    if ($body !== null) {
      $opts[CURLOPT_POSTFIELDS] = $body;
    }
    if ($headers) {
      $opts[CURLOPT_HTTPHEADER] = $headers;
    }
    curl_setopt_array($ch, $opts);
    $response = curl_exec($ch);
    $status = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);
    return [
      'ok' => $error === '' && $status > 0 && $status < 400,
      'status' => $status,
      'error' => $error !== '' ? $error : null,
      'body' => is_string($response) ? substr($response, 0, 200) : '',
    ];
  }

  $headerLines = "User-Agent: DisplayAvenue-SEO-Sync/1.0\r\n";
  foreach ($headers as $h) {
    $headerLines .= $h . "\r\n";
  }
  $ctx = stream_context_create([
    'http' => [
      'method' => $method,
      'header' => $headerLines,
      'content' => $body ?? '',
      'timeout' => 12,
      'ignore_errors' => true,
    ],
  ]);
  $response = @file_get_contents($url, false, $ctx);
  $status = 0;
  if (isset($http_response_header[0]) && preg_match('/\s(\d{3})\s/', $http_response_header[0], $m)) {
    $status = (int)$m[1];
  }
  return [
    'ok' => $status > 0 && $status < 400,
    'status' => $status,
    'error' => $response === false ? 'request_failed' : null,
    'body' => is_string($response) ? substr($response, 0, 200) : '',
  ];
}

/**
 * Notify Google, Bing, and IndexNow after sitemap rebuild.
 * Google Search Console still needs the sitemap URL submitted once in the GSC UI;
 * these pings keep engines aware of refreshes.
 */
function da_ping_search_engines(string $base, array $urls, string $publicDir): array {
  $sitemapUrl = rtrim($base, '/') . '/sitemap.xml';
  $host = (string)(parse_url($base, PHP_URL_HOST) ?: 'displayavenue.com');
  $key = DA_INDEXNOW_KEY;
  $keyFile = $publicDir . '/' . $key . '.txt';
  @file_put_contents($keyFile, $key);

  $results = [];

  $results['google'] = da_http_request(
    'GET',
    'https://www.google.com/ping?sitemap=' . rawurlencode($sitemapUrl)
  );
  // Google retired the public sitemap ping endpoint (often HTTP 404). GSC still
  // reads sitemap.xml after a one-time submit; treat 404 as expected.
  if (($results['google']['status'] ?? 0) === 404) {
    $results['google']['ok'] = true;
    $results['google']['note'] = 'legacy_ping_retired_use_gsc_sitemap';
  }

  $results['bing'] = da_http_request(
    'GET',
    'https://www.bing.com/ping?sitemap=' . rawurlencode($sitemapUrl)
  );
  // Bing retired /ping (HTTP 410). IndexNow is the supported path.
  if (($results['bing']['status'] ?? 0) === 410) {
    $results['bing']['ok'] = true;
    $results['bing']['note'] = 'legacy_ping_retired_use_indexnow';
  }

  $urlList = [];
  foreach ($urls as $u) {
    $path = $u['path'] ?? '/';
    $urlList[] = rtrim($base, '/') . ($path === '/' ? '/' : $path);
    if (count($urlList) >= 100) break; // IndexNow batch limit per request (keep first 100)
  }
  if (!$urlList) {
    $urlList[] = rtrim($base, '/') . '/';
  }

  $payload = json_encode([
    'host' => $host,
    'key' => $key,
    'keyLocation' => rtrim($base, '/') . '/' . $key . '.txt',
    'urlList' => $urlList,
  ], JSON_UNESCAPED_SLASHES);

  $results['indexnow'] = da_http_request(
    'POST',
    'https://api.indexnow.org/indexnow',
    $payload,
    ['Content-Type: application/json; charset=utf-8']
  );

  // Bing IndexNow endpoint (same protocol)
  $results['bing_indexnow'] = da_http_request(
    'POST',
    'https://www.bing.com/indexnow',
    $payload,
    ['Content-Type: application/json; charset=utf-8']
  );

  return [
    'sitemapUrl' => $sitemapUrl,
    'indexNowKeyLocation' => rtrim($base, '/') . '/' . $key . '.txt',
    'pingedUrlCount' => count($urlList),
    'engines' => $results,
  ];
}

function da_sync_seo_artifacts(string $contentDir, ?string $publicDir = null): array {
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

  $pings = da_ping_search_engines($base, $bundle['urls'], $publicDir);

  $settingsPath = $contentDir . '/settings.json';
  $settings = da_read_json_file($settingsPath);
  $settings['seoSyncedAt'] = gmdate('c');
  $settings['sitemapUrlCount'] = count($bundle['urls']);
  $settings['sitemapUrl'] = $pings['sitemapUrl'];
  $settings['seoPings'] = $pings;
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
    'sitemapUrl' => $pings['sitemapUrl'],
    'pings' => $pings,
  ];
}
