<?php
/**
 * DisplayAvenue Social Studio — trend drafts, schedule queue, multi-platform publish.
 */
declare(strict_types=1);

function da_social_dir(): string {
  return __DIR__ . '/../.social';
}

function da_social_posts_dir(): string {
  return da_social_dir() . '/posts';
}

function da_social_media_dir(): string {
  return da_social_dir() . '/media';
}

function da_social_settings(): array {
  $defaults = [
    'enabled' => true,
    'brandName' => 'DisplayAvenue',
    'timezone' => 'Asia/Kolkata',
    'autopilot' => true,
    'postsPerWeek' => 5,
    'defaultPlatforms' => [
      'facebook', 'instagram', 'gmb', 'linkedin', 'youtube', 'x', 'threads',
      'pinterest', 'tiktok', 'telegram', 'whatsapp', 'reddit', 'bluesky', 'mastodon',
    ],
    'voice' => 'Plain English, helpful Indian growth agency.',
    'ctaUrl' => 'https://displayavenue.com/strategy/',
    'whatsappUrl' => 'https://wa.me/919222122333',
    'siteUrl' => 'https://displayavenue.com/',
    'bestHoursIst' => [9, 12, 18, 20],
  ];
  $config = require __DIR__ . '/../config.php';
  $path = rtrim((string)$config['content_dir'], '/\\') . '/social.json';
  if (!is_file($path)) return $defaults;
  $data = json_decode((string)file_get_contents($path), true);
  return is_array($data) ? array_replace_recursive($defaults, $data) : $defaults;
}

function da_social_secrets(): array {
  $file = __DIR__ . '/../social-local.php';
  if (!is_file($file)) return [];
  $data = include $file;
  return is_array($data) ? $data : [];
}

function da_social_secret_defaults(): array {
  return [
    'cron_key' => '',
    'ayrshare_api_key' => '',
    'ayrshare_profile_key' => '',
    'meta_page_id' => '',
    'meta_page_access_token' => '',
    'meta_ig_user_id' => '',
    'linkedin_access_token' => '',
    'linkedin_author_urn' => '',
    'gbp_access_token' => '',
    'gbp_account_name' => '',
    'gbp_location_name' => '',
    'ai_provider' => 'gemini',
    'ai_api_key' => '',
    'ai_model' => 'gemini-2.0-flash',
    'publish_webhook_url' => '',
  ];
}

function da_social_mask_secret(string $value): string {
  $value = trim($value);
  if ($value === '') return '';
  $len = strlen($value);
  if ($len <= 8) return str_repeat('•', min(8, $len));
  return substr($value, 0, 4) . str_repeat('•', max(4, min(16, $len - 8))) . substr($value, -4);
}

/** Public view of secrets for admin forms (values masked). */
function da_social_secrets_public(): array {
  $s = array_merge(da_social_secret_defaults(), da_social_secrets());
  $sensitive = [
    'cron_key', 'ayrshare_api_key', 'ayrshare_profile_key',
    'meta_page_access_token', 'linkedin_access_token', 'gbp_access_token', 'ai_api_key',
  ];
  $out = [];
  foreach ($s as $k => $v) {
    $str = (string)$v;
    if (in_array($k, $sensitive, true)) {
      $out[$k] = [
        'set' => trim($str) !== '',
        'masked' => da_social_mask_secret($str),
      ];
    } else {
      $out[$k] = ['set' => trim($str) !== '', 'value' => $str];
    }
  }
  return $out;
}

function da_social_secrets_write(array $secrets): bool {
  $file = __DIR__ . '/../social-local.php';
  $defaults = da_social_secret_defaults();
  $clean = [];
  foreach ($defaults as $k => $_) {
    $clean[$k] = (string)($secrets[$k] ?? '');
  }
  $export = var_export($clean, true);
  $php = "<?php\n/**\n * Social Studio secrets — written by Admin → Social Studio.\n * Do not commit this file.\n */\ndeclare(strict_types=1);\n\nreturn " . $export . ";\n";
  $ok = @file_put_contents($file, $php);
  if ($ok === false) return false;
  @chmod($file, 0600);
  return true;
}

/**
 * Merge admin form payload into social-local.php.
 * Empty / unchanged masked values keep the previous secret.
 */
function da_social_secrets_save(array $incoming): array {
  $current = array_merge(da_social_secret_defaults(), da_social_secrets());
  $sensitive = [
    'cron_key', 'ayrshare_api_key', 'ayrshare_profile_key',
    'meta_page_access_token', 'linkedin_access_token', 'gbp_access_token', 'ai_api_key',
  ];
  $clearFlags = is_array($incoming['_clear'] ?? null) ? $incoming['_clear'] : [];

  foreach (da_social_secret_defaults() as $key => $_) {
    if (!empty($clearFlags[$key])) {
      $current[$key] = '';
      continue;
    }
    if (!array_key_exists($key, $incoming)) continue;
    $val = trim((string)$incoming[$key]);
    if ($val === '') continue; // keep existing
    if (in_array($key, $sensitive, true)) {
      $masked = da_social_mask_secret((string)($current[$key] ?? ''));
      if ($val === $masked || str_contains($val, '•')) continue; // user left masked value
    }
    $current[$key] = $val;
  }

  // Auto-generate cron key if still empty
  if (trim((string)$current['cron_key']) === '') {
    $current['cron_key'] = bin2hex(random_bytes(16));
  }

  if (!da_social_secrets_write($current)) {
    return ['ok' => false, 'error' => 'Could not write social-local.php (check file permissions on admin/)'];
  }
  return [
    'ok' => true,
    'secrets' => da_social_secrets_public(),
    'status' => da_social_connection_status(),
    'cronUrl' => 'https://displayavenue.com/admin/social-cron.php?key=' . rawurlencode((string)$current['cron_key']),
  ];
}

function da_social_platforms(): array {
  return [
    ['id' => 'facebook', 'name' => 'Facebook Page', 'group' => 'Meta'],
    ['id' => 'instagram', 'name' => 'Instagram', 'group' => 'Meta'],
    ['id' => 'gmb', 'name' => 'Google Business Profile', 'group' => 'Google'],
    ['id' => 'linkedin', 'name' => 'LinkedIn', 'group' => 'Professional'],
    ['id' => 'youtube', 'name' => 'YouTube', 'group' => 'Video'],
    ['id' => 'x', 'name' => 'X (Twitter)', 'group' => 'Micro'],
    ['id' => 'threads', 'name' => 'Threads', 'group' => 'Meta'],
    ['id' => 'pinterest', 'name' => 'Pinterest', 'group' => 'Visual'],
    ['id' => 'tiktok', 'name' => 'TikTok', 'group' => 'Video'],
    ['id' => 'telegram', 'name' => 'Telegram Channel', 'group' => 'Chat'],
    ['id' => 'whatsapp', 'name' => 'WhatsApp Channel / Status', 'group' => 'Chat'],
    ['id' => 'reddit', 'name' => 'Reddit', 'group' => 'Community'],
    ['id' => 'bluesky', 'name' => 'Bluesky', 'group' => 'Micro'],
    ['id' => 'mastodon', 'name' => 'Mastodon', 'group' => 'Micro'],
  ];
}

function da_social_http(string $method, string $url, array $opts = []): array {
  $headers = $opts['headers'] ?? [];
  $body = $opts['body'] ?? null;
  if (function_exists('curl_init')) {
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, strtoupper($method));
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 10);
    if ($headers) curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    if ($body !== null) curl_setopt($ch, CURLOPT_POSTFIELDS, $body);
    $raw = curl_exec($ch);
    $code = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $err = curl_error($ch);
    curl_close($ch);
    return ['ok' => $raw !== false && $code >= 200 && $code < 300, 'status' => $code, 'body' => (string)$raw, 'error' => $err];
  }
  $ctx = stream_context_create([
    'http' => [
      'method' => strtoupper($method),
      'header' => implode("\r\n", $headers),
      'content' => $body ?? '',
      'timeout' => 30,
      'ignore_errors' => true,
    ],
  ]);
  $raw = @file_get_contents($url, false, $ctx);
  $code = 0;
  if (isset($http_response_header[0]) && preg_match('/\s(\d{3})\s/', $http_response_header[0], $m)) {
    $code = (int)$m[1];
  }
  return ['ok' => $raw !== false && $code >= 200 && $code < 300, 'status' => $code, 'body' => (string)$raw, 'error' => ''];
}

function da_social_connection_status(): array {
  $s = da_social_secrets();
  return [
    'localFile' => is_file(__DIR__ . '/../social-local.php'),
    'ayrshare' => trim((string)($s['ayrshare_api_key'] ?? '')) !== '',
    'meta' => trim((string)($s['meta_page_access_token'] ?? '')) !== '' && trim((string)($s['meta_page_id'] ?? '')) !== '',
    'instagram' => trim((string)($s['meta_ig_user_id'] ?? '')) !== '' && trim((string)($s['meta_page_access_token'] ?? '')) !== '',
    'linkedin' => trim((string)($s['linkedin_access_token'] ?? '')) !== '' && trim((string)($s['linkedin_author_urn'] ?? '')) !== '',
    'gbp' => trim((string)($s['gbp_access_token'] ?? '')) !== '' && trim((string)($s['gbp_location_name'] ?? '')) !== '',
    'ai' => trim((string)($s['ai_api_key'] ?? '')) !== '' || is_file(__DIR__ . '/../chat-local.php'),
    'webhook' => trim((string)($s['publish_webhook_url'] ?? '')) !== '',
    'notifyFallback' => true,
  ];
}

/** Rolling trend topics for Indian SME digital growth (self-updating weekly seed). */
function da_social_trends(): array {
  $week = (int)gmdate('W');
  $pool = [
    ['topic' => 'Google Ads for local clinics', 'angle' => 'Cost per lead tips', 'format' => 'carousel', 'hook' => 'Clinic owners: stop guessing your Google Ads budget'],
    ['topic' => 'Instagram Reels for retail', 'angle' => '3-reel weekly system', 'format' => 'reel', 'hook' => '3 Reels a week that actually bring walk-ins'],
    ['topic' => 'Google Business Profile ranking', 'angle' => 'Maps pack checklist', 'format' => 'checklist', 'hook' => 'Win the Google Maps pack in your city'],
    ['topic' => 'WhatsApp sales automation', 'angle' => 'Lead response speed', 'format' => 'tip', 'hook' => 'Reply in 5 minutes or lose the lead'],
    ['topic' => 'SEO service pages that convert', 'angle' => 'City × service pages', 'format' => 'explainer', 'hook' => 'Why city pages beat generic SEO blogs'],
    ['topic' => 'Meta Ads lead quality', 'angle' => 'Filter tyre-kickers', 'format' => 'reel', 'hook' => 'Your Meta leads are cheap — but are they buyers?'],
    ['topic' => 'Website speed & enquiries', 'angle' => 'Mobile Core Web Vitals', 'format' => 'stat', 'hook' => 'Slow mobile sites kill WhatsApp enquiries'],
    ['topic' => 'Review generation engine', 'angle' => 'Ask after delivery', 'format' => 'script', 'hook' => 'The WhatsApp script that gets 5★ reviews'],
    ['topic' => 'LinkedIn for B2B SMEs', 'angle' => 'Founder content', 'format' => 'carousel', 'hook' => 'B2B owners: LinkedIn still prints meetings'],
    ['topic' => 'Festival campaign calendar', 'angle' => 'Plan 30 days early', 'format' => 'calendar', 'hook' => 'Diwali ads start before Diwali — here is when'],
    ['topic' => 'Free Strategy Maker tool', 'angle' => 'Product-led growth', 'format' => 'promo', 'hook' => 'Free growth plan in 2 minutes — no call needed'],
    ['topic' => 'Data lead extractor', 'angle' => 'Sales prospecting', 'format' => 'demo', 'hook' => 'Find businesses in your city that need marketing'],
    ['topic' => 'Local SEO vs Google Ads', 'angle' => 'When to use which', 'format' => 'vs', 'hook' => 'SEO or Ads first? Honest answer for Indian SMEs'],
    ['topic' => 'Landing pages that convert', 'angle' => 'One offer one page', 'format' => 'before-after', 'hook' => 'One landing page beat their whole website'],
    ['topic' => 'YouTube Shorts for services', 'angle' => 'Authority clips', 'format' => 'reel', 'hook' => '60-second Shorts that book strategy calls'],
  ];
  $out = [];
  for ($i = 0; $i < 8; $i++) {
    $idx = ($week * 3 + $i * 5) % count($pool);
    $item = $pool[$idx];
    $item['score'] = 92 - ($i * 3) - (($week + $i) % 5);
    $item['bestHourIst'] = [9, 12, 18, 20][($week + $i) % 4];
    $out[] = $item;
  }
  usort($out, fn($a, $b) => ($b['score'] <=> $a['score']));
  return $out;
}

function da_social_ai_key(): array {
  $s = da_social_secrets();
  $key = trim((string)($s['ai_api_key'] ?? ''));
  $provider = trim((string)($s['ai_provider'] ?? 'gemini'));
  $model = trim((string)($s['ai_model'] ?? 'gemini-2.0-flash'));
  if ($key === '' && is_file(__DIR__ . '/../chat-local.php')) {
    $chat = include __DIR__ . '/../chat-local.php';
    if (is_array($chat)) {
      $key = trim((string)($chat['api_key'] ?? ''));
      $provider = trim((string)($chat['provider'] ?? $provider));
      $model = trim((string)($chat['model'] ?? $model));
    }
  }
  return ['provider' => $provider, 'api_key' => $key, 'model' => $model];
}

function da_social_template_draft(array $trend, array $settings): array {
  $brand = (string)($settings['brandName'] ?? 'DisplayAvenue');
  $cta = (string)($settings['ctaUrl'] ?? 'https://displayavenue.com/strategy/');
  $wa = (string)($settings['whatsappUrl'] ?? 'https://wa.me/919222122333');
  $hook = (string)($trend['hook'] ?? $trend['topic'] ?? 'Grow with digital');
  $topic = (string)($trend['topic'] ?? 'Digital marketing');
  $angle = (string)($trend['angle'] ?? 'Practical tips');
  $caption = "{$hook}\n\n"
    . "Today's focus: {$topic} — {$angle}.\n\n"
    . "What works in India right now:\n"
    . "1) Clear offer + city targeting\n"
    . "2) Fast WhatsApp follow-up\n"
    . "3) Weekly creative testing\n\n"
    . "Want a free plan for your business?\n"
    . "Strategy Maker → {$cta}\n"
    . "Or WhatsApp {$brand}: {$wa}\n\n"
    . "#DigitalMarketingIndia #GoogleAds #LocalSEO #{$brand} #SMEGrowth #InstagramMarketing";

  $reel = [
    'title' => $hook,
    'durationSec' => 35,
    'scenes' => [
      ['t' => '0-3s', 'visual' => 'Bold text hook on brand navy', 'voice' => $hook],
      ['t' => '3-12s', 'visual' => 'Problem flip — confused ads dashboard', 'voice' => "Most owners waste budget because {$angle} is unclear."],
      ['t' => '12-25s', 'visual' => '3 tip cards animating', 'voice' => 'Do this instead: target, message, WhatsApp speed.'],
      ['t' => '25-35s', 'visual' => 'CTA card with QR / URL', 'voice' => "Free plan at displayavenue.com/strategy — or WhatsApp us."],
    ],
    'onScreenText' => [$hook, $topic, 'Free Strategy Maker', 'WhatsApp 9222 122333'],
    'musicMood' => 'upbeat corporate Indian',
  ];

  return [
    'caption' => $caption,
    'hashtags' => ['#DigitalMarketingIndia', '#GoogleAds', '#LocalSEO', '#SMEGrowth', '#' . preg_replace('/\s+/', '', $brand)],
    'reelScript' => $reel,
    'altText' => $hook . ' — ' . $brand,
    'provider' => 'template',
  ];
}

function da_social_llm_draft(array $trend, array $settings): ?array {
  $ai = da_social_ai_key();
  if ($ai['api_key'] === '' || $ai['provider'] === '' || $ai['provider'] === 'rules') return null;
  $prompt = "You are a social media strategist for DisplayAvenue, an Indian digital marketing agency.\n"
    . "Brand voice: " . ($settings['voice'] ?? '') . "\n"
    . "Create ONE high-reach organic post for topic: " . json_encode($trend) . "\n"
    . "Return ONLY JSON with keys: caption (string, max 1200 chars), hashtags (array), reelScript (object with title,durationSec,scenes[{t,visual,voice}],onScreenText,musicMood), altText (string).\n"
    . "Caption must include CTA to " . ($settings['ctaUrl'] ?? '') . " and WhatsApp.\n"
    . "Write for Indian SME owners. No fluff. No em-dashes.";

  $provider = $ai['provider'];
  $key = $ai['api_key'];
  $model = $ai['model'];
  $raw = '';

  if ($provider === 'gemini') {
    $url = 'https://generativelanguage.googleapis.com/v1beta/models/' . rawurlencode($model) . ':generateContent?key=' . rawurlencode($key);
    $res = da_social_http('POST', $url, [
      'headers' => ['Content-Type: application/json'],
      'body' => json_encode([
        'contents' => [['parts' => [['text' => $prompt]]]],
        'generationConfig' => ['temperature' => 0.7],
      ]),
    ]);
    if (!$res['ok']) return null;
    $json = json_decode($res['body'], true);
    $raw = (string)($json['candidates'][0]['content']['parts'][0]['text'] ?? '');
  } elseif ($provider === 'openai' || $provider === 'groq') {
    $base = $provider === 'groq' ? 'https://api.groq.com/openai/v1/chat/completions' : 'https://api.openai.com/v1/chat/completions';
    $res = da_social_http('POST', $base, [
      'headers' => [
        'Content-Type: application/json',
        'Authorization: Bearer ' . $key,
      ],
      'body' => json_encode([
        'model' => $model ?: ($provider === 'groq' ? 'llama-3.1-8b-instant' : 'gpt-4o-mini'),
        'messages' => [
          ['role' => 'system', 'content' => 'Return only valid JSON.'],
          ['role' => 'user', 'content' => $prompt],
        ],
        'temperature' => 0.7,
      ]),
    ]);
    if (!$res['ok']) return null;
    $json = json_decode($res['body'], true);
    $raw = (string)($json['choices'][0]['message']['content'] ?? '');
  } else {
    return null;
  }

  if (preg_match('/\{[\s\S]*\}/', $raw, $m)) $raw = $m[0];
  $parsed = json_decode($raw, true);
  if (!is_array($parsed) || empty($parsed['caption'])) return null;
  $parsed['provider'] = $provider;
  return $parsed;
}

function da_social_generate_draft(?array $trend = null): array {
  $settings = da_social_settings();
  $trends = da_social_trends();
  $trend = $trend ?: ($trends[0] ?? ['topic' => 'Digital marketing', 'hook' => 'Grow enquiries this week', 'angle' => 'Practical plan', 'format' => 'tip']);
  $llm = da_social_llm_draft($trend, $settings);
  $draft = $llm ?: da_social_template_draft($trend, $settings);
  return [
    'trend' => $trend,
    'caption' => (string)($draft['caption'] ?? ''),
    'hashtags' => $draft['hashtags'] ?? [],
    'reelScript' => $draft['reelScript'] ?? null,
    'altText' => (string)($draft['altText'] ?? ''),
    'provider' => (string)($draft['provider'] ?? 'template'),
    'suggestedPlatforms' => $settings['defaultPlatforms'],
    'suggestedAtIst' => da_social_next_slot_iso($settings),
  ];
}

function da_social_next_slot_iso(array $settings): string {
  $tz = new DateTimeZone((string)($settings['timezone'] ?? 'Asia/Kolkata'));
  $hours = $settings['bestHoursIst'] ?? [9, 12, 18, 20];
  if (!is_array($hours) || !$hours) $hours = [9, 12, 18, 20];
  $now = new DateTime('now', $tz);
  for ($d = 0; $d < 7; $d++) {
    foreach ($hours as $h) {
      $slot = clone $now;
      if ($d > 0) $slot->modify('+' . $d . ' day');
      $slot->setTime((int)$h, 0, 0);
      if ($slot > $now) {
        $slot->setTimezone(new DateTimeZone('UTC'));
        return $slot->format('c');
      }
    }
  }
  $now->modify('+1 day')->setTime((int)$hours[0], 0, 0);
  $now->setTimezone(new DateTimeZone('UTC'));
  return $now->format('c');
}

function da_social_ensure_dirs(): void {
  foreach ([da_social_dir(), da_social_posts_dir(), da_social_media_dir()] as $d) {
    if (!is_dir($d)) @mkdir($d, 0755, true);
  }
}

function da_social_index_load(): array {
  da_social_ensure_dirs();
  $path = da_social_dir() . '/index.json';
  if (!is_file($path)) return [];
  $data = json_decode((string)file_get_contents($path), true);
  return is_array($data) ? $data : [];
}

function da_social_index_save(array $index): void {
  da_social_ensure_dirs();
  usort($index, function ($a, $b) {
    return strcmp((string)($b['updatedAt'] ?? ''), (string)($a['updatedAt'] ?? ''));
  });
  $index = array_slice($index, 0, 300);
  @file_put_contents(
    da_social_dir() . '/index.json',
    json_encode($index, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT)
  );
}

function da_social_post_path(string $id): string {
  $id = preg_replace('/[^a-zA-Z0-9_\-]/', '', $id) ?? '';
  return da_social_posts_dir() . '/' . $id . '.json';
}

function da_social_load_post(string $id): ?array {
  $file = da_social_post_path($id);
  if (!is_file($file)) return null;
  $data = json_decode((string)file_get_contents($file), true);
  return is_array($data) ? $data : null;
}

function da_social_save_post(array $post): array {
  da_social_ensure_dirs();
  if (empty($post['id'])) {
    $post['id'] = 'sp_' . date('Ymd_His') . '_' . bin2hex(random_bytes(3));
  }
  $now = gmdate('c');
  $post['updatedAt'] = $now;
  if (empty($post['createdAt'])) $post['createdAt'] = $now;
  if (empty($post['status'])) $post['status'] = 'draft';
  $post['caption'] = substr(trim((string)($post['caption'] ?? '')), 0, 4000);
  $post['platforms'] = array_values(array_unique(array_filter(array_map('strval', $post['platforms'] ?? []))));
  @file_put_contents(
    da_social_post_path((string)$post['id']),
    json_encode($post, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT)
  );
  $index = array_values(array_filter(da_social_index_load(), fn($r) => ($r['id'] ?? '') !== $post['id']));
  $index[] = [
    'id' => $post['id'],
    'status' => $post['status'],
    'scheduledAt' => $post['scheduledAt'] ?? null,
    'publishedAt' => $post['publishedAt'] ?? null,
    'platforms' => $post['platforms'],
    'title' => substr((string)($post['trend']['hook'] ?? $post['caption'] ?? 'Post'), 0, 100),
    'updatedAt' => $post['updatedAt'],
  ];
  da_social_index_save($index);
  return $post;
}

function da_social_delete_post(string $id): bool {
  $file = da_social_post_path($id);
  if (is_file($file)) @unlink($file);
  $index = array_values(array_filter(da_social_index_load(), fn($r) => ($r['id'] ?? '') !== $id));
  da_social_index_save($index);
  return true;
}

function da_social_ayrshare_platforms(array $platforms): array {
  $map = [
    'facebook' => 'facebook',
    'instagram' => 'instagram',
    'gmb' => 'gmb',
    'linkedin' => 'linkedin',
    'youtube' => 'youtube',
    'x' => 'twitter',
    'threads' => 'threads',
    'pinterest' => 'pinterest',
    'tiktok' => 'tiktok',
    'telegram' => 'telegram',
    'reddit' => 'reddit',
    'bluesky' => 'bluesky',
  ];
  $out = [];
  foreach ($platforms as $p) {
    if (isset($map[$p])) $out[] = $map[$p];
  }
  return array_values(array_unique($out));
}

function da_social_publish_ayrshare(array $post): array {
  $s = da_social_secrets();
  $key = trim((string)($s['ayrshare_api_key'] ?? ''));
  if ($key === '') return ['ok' => false, 'skipped' => true, 'error' => 'ayrshare not configured'];
  $platforms = da_social_ayrshare_platforms($post['platforms'] ?? []);
  // WhatsApp / mastodon may not be on Ayrshare — handled separately
  if (!$platforms) return ['ok' => false, 'skipped' => true, 'error' => 'no ayrshare platforms selected'];
  $payload = [
    'post' => (string)$post['caption'],
    'platforms' => $platforms,
  ];
  if (!empty($post['mediaUrls']) && is_array($post['mediaUrls'])) {
    $payload['mediaUrls'] = array_values($post['mediaUrls']);
  }
  $headers = [
    'Content-Type: application/json',
    'Authorization: Bearer ' . $key,
  ];
  $profile = trim((string)($s['ayrshare_profile_key'] ?? ''));
  if ($profile !== '') $headers[] = 'Profile-Key: ' . $profile;
  $res = da_social_http('POST', 'https://api.ayrshare.com/api/post', [
    'headers' => $headers,
    'body' => json_encode($payload),
  ]);
  return [
    'ok' => $res['ok'],
    'provider' => 'ayrshare',
    'status' => $res['status'],
    'platforms' => $platforms,
    'error' => $res['ok'] ? '' : ($res['error'] ?: substr($res['body'], 0, 300)),
    'raw' => substr($res['body'], 0, 800),
  ];
}

function da_social_publish_meta_facebook(array $post): array {
  $s = da_social_secrets();
  $token = trim((string)($s['meta_page_access_token'] ?? ''));
  $pageId = trim((string)($s['meta_page_id'] ?? ''));
  if ($token === '' || $pageId === '') return ['ok' => false, 'skipped' => true, 'error' => 'meta facebook not configured'];
  $message = (string)$post['caption'];
  $media = $post['mediaUrls'][0] ?? null;
  if ($media) {
    $url = 'https://graph.facebook.com/v19.0/' . rawurlencode($pageId) . '/photos';
    $body = http_build_query(['url' => $media, 'caption' => $message, 'access_token' => $token]);
  } else {
    $url = 'https://graph.facebook.com/v19.0/' . rawurlencode($pageId) . '/feed';
    $body = http_build_query(['message' => $message, 'access_token' => $token]);
  }
  $res = da_social_http('POST', $url, [
    'headers' => ['Content-Type: application/x-www-form-urlencoded'],
    'body' => $body,
  ]);
  return ['ok' => $res['ok'], 'provider' => 'meta_facebook', 'error' => $res['ok'] ? '' : substr($res['body'], 0, 240), 'status' => $res['status']];
}

function da_social_publish_meta_instagram(array $post): array {
  $s = da_social_secrets();
  $token = trim((string)($s['meta_page_access_token'] ?? ''));
  $ig = trim((string)($s['meta_ig_user_id'] ?? ''));
  $media = $post['mediaUrls'][0] ?? null;
  if ($token === '' || $ig === '') return ['ok' => false, 'skipped' => true, 'error' => 'instagram not configured'];
  if (!$media) return ['ok' => false, 'error' => 'instagram requires an image URL'];
  $create = da_social_http('POST', 'https://graph.facebook.com/v19.0/' . rawurlencode($ig) . '/media', [
    'headers' => ['Content-Type: application/x-www-form-urlencoded'],
    'body' => http_build_query([
      'image_url' => $media,
      'caption' => (string)$post['caption'],
      'access_token' => $token,
    ]),
  ]);
  if (!$create['ok']) return ['ok' => false, 'provider' => 'meta_instagram', 'error' => substr($create['body'], 0, 240)];
  $cj = json_decode($create['body'], true);
  $creationId = (string)($cj['id'] ?? '');
  if ($creationId === '') return ['ok' => false, 'provider' => 'meta_instagram', 'error' => 'no creation id'];
  $pub = da_social_http('POST', 'https://graph.facebook.com/v19.0/' . rawurlencode($ig) . '/media_publish', [
    'headers' => ['Content-Type: application/x-www-form-urlencoded'],
    'body' => http_build_query(['creation_id' => $creationId, 'access_token' => $token]),
  ]);
  return ['ok' => $pub['ok'], 'provider' => 'meta_instagram', 'error' => $pub['ok'] ? '' : substr($pub['body'], 0, 240), 'status' => $pub['status']];
}

function da_social_publish_linkedin(array $post): array {
  $s = da_social_secrets();
  $token = trim((string)($s['linkedin_access_token'] ?? ''));
  $author = trim((string)($s['linkedin_author_urn'] ?? ''));
  if ($token === '' || $author === '') return ['ok' => false, 'skipped' => true, 'error' => 'linkedin not configured'];
  $payload = [
    'author' => $author,
    'lifecycleState' => 'PUBLISHED',
    'specificContent' => [
      'com.linkedin.ugc.ShareContent' => [
        'shareCommentary' => ['text' => (string)$post['caption']],
        'shareMediaCategory' => 'NONE',
      ],
    ],
    'visibility' => ['com.linkedin.ugc.MemberNetworkVisibility' => 'PUBLIC'],
  ];
  $res = da_social_http('POST', 'https://api.linkedin.com/v2/ugcPosts', [
    'headers' => [
      'Content-Type: application/json',
      'Authorization: Bearer ' . $token,
      'X-Restli-Protocol-Version: 2.0.0',
    ],
    'body' => json_encode($payload),
  ]);
  return ['ok' => $res['ok'], 'provider' => 'linkedin', 'error' => $res['ok'] ? '' : substr($res['body'], 0, 240), 'status' => $res['status']];
}

function da_social_publish_gbp(array $post): array {
  $s = da_social_secrets();
  $token = trim((string)($s['gbp_access_token'] ?? ''));
  $loc = trim((string)($s['gbp_location_name'] ?? ''));
  if ($token === '' || $loc === '') return ['ok' => false, 'skipped' => true, 'error' => 'gbp not configured'];
  $payload = [
    'languageCode' => 'en-US',
    'summary' => substr((string)$post['caption'], 0, 1500),
    'topicType' => 'STANDARD',
  ];
  if (!empty($post['mediaUrls'][0])) {
    $payload['media'] = [[
      'mediaFormat' => 'PHOTO',
      'sourceUrl' => $post['mediaUrls'][0],
    ]];
  }
  $url = 'https://mybusiness.googleapis.com/v4/' . $loc . '/localPosts';
  $res = da_social_http('POST', $url, [
    'headers' => [
      'Content-Type: application/json',
      'Authorization: Bearer ' . $token,
    ],
    'body' => json_encode($payload),
  ]);
  return ['ok' => $res['ok'], 'provider' => 'gbp', 'error' => $res['ok'] ? '' : substr($res['body'], 0, 240), 'status' => $res['status']];
}

function da_social_publish_webhook(array $post): array {
  $s = da_social_secrets();
  $url = trim((string)($s['publish_webhook_url'] ?? ''));
  if ($url === '') return ['ok' => false, 'skipped' => true, 'error' => 'webhook not configured'];
  $res = da_social_http('POST', $url, [
    'headers' => ['Content-Type: application/json'],
    'body' => json_encode(['event' => 'social_publish', 'post' => $post]),
  ]);
  return ['ok' => $res['ok'], 'provider' => 'webhook', 'error' => $res['ok'] ? '' : substr($res['body'], 0, 200)];
}

function da_social_notify_owner(array $post, array $results): array {
  // Always available fallback — emails owner the ready-to-post pack
  if (is_file(__DIR__ . '/automation.php')) {
    require_once __DIR__ . '/automation.php';
    $lines = [
      'Social Studio publish update',
      'Post: ' . ($post['id'] ?? ''),
      'Status: ' . ($post['status'] ?? ''),
      '',
      substr((string)($post['caption'] ?? ''), 0, 900),
      '',
      'Platforms: ' . implode(', ', $post['platforms'] ?? []),
      'Results: ' . json_encode($results),
    ];
    if (!empty($post['reelScript'])) {
      $lines[] = '';
      $lines[] = 'Reel script: ' . json_encode($post['reelScript']);
    }
    $r = da_automation_notify([
      'event' => 'test',
      'subject' => '[Social Studio] ' . substr((string)($post['trend']['hook'] ?? 'Post'), 0, 80),
      'text' => implode("\n", $lines),
      'summary' => 'Social post ' . ($post['id'] ?? ''),
    ]);
    return ['ok' => !empty($r['ok']), 'provider' => 'notify', 'channels' => $r['channels'] ?? []];
  }
  $to = (string)(da_social_settings()['notifyEmail'] ?? 'info@displayavenue.com');
  // settings may not have notifyEmail — use company
  $config = require __DIR__ . '/../config.php';
  $companyPath = rtrim((string)$config['content_dir'], '/\\') . '/company.json';
  if (is_file($companyPath)) {
    $co = json_decode((string)file_get_contents($companyPath), true);
    if (!empty($co['email'])) $to = (string)$co['email'];
  }
  $ok = @mail($to, '[Social Studio] Post ready', (string)$post['caption'], "From: noreply@displayavenue.com\r\nContent-Type: text/plain; charset=UTF-8");
  return ['ok' => (bool)$ok, 'provider' => 'email'];
}

function da_social_publish_post(array $post, bool $forceNotify = false): array {
  $platforms = $post['platforms'] ?? [];
  $results = [];

  // Prefer unified Ayrshare when configured
  $ay = da_social_publish_ayrshare($post);
  if (empty($ay['skipped'])) $results['ayrshare'] = $ay;

  $hasAyrshareOk = !empty($ay['ok']);

  // Direct adapters for platforms not covered / as backup when Ayrshare missing
  if (!$hasAyrshareOk) {
    if (in_array('facebook', $platforms, true)) $results['facebook'] = da_social_publish_meta_facebook($post);
    if (in_array('instagram', $platforms, true)) $results['instagram'] = da_social_publish_meta_instagram($post);
    if (in_array('linkedin', $platforms, true)) $results['linkedin'] = da_social_publish_linkedin($post);
    if (in_array('gmb', $platforms, true)) $results['gmb'] = da_social_publish_gbp($post);
  }

  $wh = da_social_publish_webhook($post);
  if (empty($wh['skipped'])) $results['webhook'] = $wh;

  $anyOk = false;
  foreach ($results as $r) {
    if (!empty($r['ok'])) $anyOk = true;
  }

  // Always notify if nothing published or forceNotify — keeps pipeline useful before API keys
  if (!$anyOk || $forceNotify || in_array('whatsapp', $platforms, true)) {
    $results['notify'] = da_social_notify_owner($post, $results);
    if (!empty($results['notify']['ok'])) $anyOk = true;
  }

  $post['publishResults'] = $results;
  $post['publishedAt'] = gmdate('c');
  $post['status'] = $anyOk ? 'published' : 'failed';
  da_social_save_post($post);
  return ['ok' => $anyOk, 'post' => $post, 'results' => $results];
}

function da_social_run_due(int $limit = 10): array {
  $now = time();
  $done = [];
  foreach (da_social_index_load() as $row) {
    if (($row['status'] ?? '') !== 'scheduled') continue;
    $at = strtotime((string)($row['scheduledAt'] ?? ''));
    if (!$at || $at > $now) continue;
    $post = da_social_load_post((string)$row['id']);
    if (!$post) continue;
    $done[] = da_social_publish_post($post);
    if (count($done) >= $limit) break;
  }
  return $done;
}

function da_social_autopilot_fill(): array {
  $settings = da_social_settings();
  if (empty($settings['enabled']) || empty($settings['autopilot'])) {
    return ['created' => [], 'reason' => 'autopilot off'];
  }
  $perWeek = max(1, min(14, (int)($settings['postsPerWeek'] ?? 5)));
  $scheduled = array_filter(da_social_index_load(), fn($r) => in_array(($r['status'] ?? ''), ['scheduled', 'draft'], true));
  $need = max(0, $perWeek - count($scheduled));
  if ($need <= 0) return ['created' => [], 'reason' => 'queue full'];

  $trends = da_social_trends();
  $created = [];
  $tz = new DateTimeZone((string)($settings['timezone'] ?? 'Asia/Kolkata'));
  $hours = $settings['bestHoursIst'] ?? [9, 12, 18, 20];
  $cursor = new DateTime('now', $tz);
  $cursor->modify('+1 day');

  for ($i = 0; $i < $need; $i++) {
    $trend = $trends[$i % count($trends)];
    $draft = da_social_generate_draft($trend);
    $hour = (int)$hours[$i % count($hours)];
    $slot = clone $cursor;
    $slot->modify('+' . $i . ' day');
    $slot->setTime($hour, 0, 0);
    $slotUtc = clone $slot;
    $slotUtc->setTimezone(new DateTimeZone('UTC'));
    $post = da_social_save_post([
      'status' => 'scheduled',
      'caption' => $draft['caption'],
      'hashtags' => $draft['hashtags'],
      'reelScript' => $draft['reelScript'],
      'altText' => $draft['altText'],
      'trend' => $draft['trend'],
      'platforms' => $settings['defaultPlatforms'],
      'scheduledAt' => $slotUtc->format('c'),
      'mediaUrls' => [],
      'source' => 'autopilot',
      'generator' => $draft['provider'],
    ]);
    $created[] = $post;
  }
  return ['created' => $created, 'reason' => 'ok'];
}
