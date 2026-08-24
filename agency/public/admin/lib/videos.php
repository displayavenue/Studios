<?php
/**
 * DisplayAvenue talking-head reels autopilot — 3 speaker reels per IST day.
 * Uses the uploaded speaker portrait; public player animates speaking + captions.
 */
declare(strict_types=1);

function da_videos_path(): string {
  $config = require __DIR__ . '/../config.php';
  return rtrim((string)$config['content_dir'], '/\\') . '/videos.json';
}

function da_videos_lock_path(): string {
  return dirname(da_videos_path()) . '/.videos-publish.lock';
}

function da_videos_defaults(): array {
  return [
    'title' => 'DisplayAvenue Videos',
    'lead' => 'Daily talking-head reels from DisplayAvenue — hooks, tips, and proof for Indian business owners.',
    'autoPublish' => true,
    'reelsPerDay' => 3,
    'speakerName' => 'DisplayAvenue',
    'speakerImage' => '',
    'speakerImageAlt' => 'DisplayAvenue speaker',
    'updatedAt' => '',
    'reels' => [],
  ];
}

function da_videos_load(): array {
  $path = da_videos_path();
  if (!is_file($path)) {
    return da_videos_defaults();
  }
  $data = json_decode((string)file_get_contents($path), true);
  if (!is_array($data)) {
    return da_videos_defaults();
  }
  return array_merge(da_videos_defaults(), $data, [
    'reels' => is_array($data['reels'] ?? null) ? $data['reels'] : [],
  ]);
}

function da_videos_save(array $videos): bool {
  $videos['updatedAt'] = gmdate('c');
  $path = da_videos_path();
  $json = json_encode($videos, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
  if ($json === false) return false;
  $ok = (bool)@file_put_contents($path, $json . "\n", LOCK_EX);
  if ($ok) @chmod($path, 0664);
  return $ok;
}

/**
 * Topic packs: each day picks one pack and emits hook / tip / proof reels.
 */
function da_videos_topic_packs(): array {
  return [
    [
      'category' => 'Google Ads',
      'hook' => [
        'title' => 'Stop wasting Google Ads budget',
        'lines' => [
          'Most Indian SMEs waste Google Ads on broad match.',
          'You pay for clicks that never become WhatsApp chats.',
          'Fix match types before you raise budget.',
        ],
        'cta' => 'Get a free Google Ads check',
      ],
      'tip' => [
        'title' => '3 Google Ads fixes this week',
        'lines' => [
          'Use exact and phrase match on money keywords.',
          'Send traffic to one offer page — not your full menu.',
          'Track calls and WhatsApp as conversions.',
        ],
        'cta' => 'WhatsApp us for the checklist',
      ],
      'proof' => [
        'title' => 'Why DisplayAvenue Ads work',
        'lines' => [
          'We build campaigns around booked jobs — not vanity clicks.',
          'Search terms reviewed twice a week.',
          'Landing pages and WhatsApp follow-up included.',
        ],
        'cta' => 'Book a free growth call',
      ],
    ],
    [
      'category' => 'Meta Ads',
      'hook' => [
        'title' => 'Cheap Meta leads are not always good leads',
        'lines' => [
          'Low cost per lead feels good — until sales says they are junk.',
          'Form questions decide lead quality.',
          'Speed to WhatsApp decides conversion.',
        ],
        'cta' => 'Improve your Meta lead quality',
      ],
      'tip' => [
        'title' => 'Instagram lead form tips',
        'lines' => [
          'Ask budget range, city, and timeline in the form.',
          'Prefer Click-to-WhatsApp for high-intent offers.',
          'Refresh creatives every week to fight fatigue.',
        ],
        'cta' => 'Get a Meta Ads plan',
      ],
      'proof' => [
        'title' => 'Meta that books real work',
        'lines' => [
          'DisplayAvenue pairs creatives with a 5-minute reply habit.',
          'We qualify before you pitch.',
          'You see cost per booked job — not only CPL.',
        ],
        'cta' => 'Talk to DisplayAvenue',
      ],
    ],
    [
      'category' => 'SEO',
      'hook' => [
        'title' => 'Blogs alone will not bring customers',
        'lines' => [
          'Generic articles rarely convert Indian SME buyers.',
          'City and service pages do.',
          'One clear page per offer beats 20 fluff posts.',
        ],
        'cta' => 'Audit your service pages',
      ],
      'tip' => [
        'title' => 'City × offer SEO basics',
        'lines' => [
          'Build one page per main service and city.',
          'Add FAQs with real owner questions.',
          'Link from homepage, services hub, and blog.',
        ],
        'cta' => 'Get an SEO roadmap',
      ],
      'proof' => [
        'title' => 'SEO that supports sales',
        'lines' => [
          'We pair organic pages with light Google Ads while rankings build.',
          'Clear CTAs to call and WhatsApp.',
          'Local proof on every key page.',
        ],
        'cta' => 'Book a free SEO review',
      ],
    ],
    [
      'category' => 'Local SEO',
      'hook' => [
        'title' => 'Your Google profile is a sales channel',
        'lines' => [
          'Buyers search near me every day.',
          'Quiet profiles lose calls to active competitors.',
          'Weekly posts and reviews keep you visible.',
        ],
        'cta' => 'Fix your Google Business Profile',
      ],
      'tip' => [
        'title' => 'GBP posts that get calls',
        'lines' => [
          'Post offers, new work, and short tips weekly.',
          'Use real photos from your location.',
          'Ask for reviews after delivery with a WhatsApp script.',
        ],
        'cta' => 'Get a Local SEO checklist',
      ],
      'proof' => [
        'title' => 'Local visibility that converts',
        'lines' => [
          'DisplayAvenue keeps NAP consistent and profiles active.',
          'Reviews + photos + posts on a simple cadence.',
          'Built for Mumbai and multi-city SMEs.',
        ],
        'cta' => 'WhatsApp for Local SEO help',
      ],
    ],
    [
      'category' => 'WhatsApp',
      'hook' => [
        'title' => 'Slow WhatsApp replies kill paid leads',
        'lines' => [
          'You pay for the click — then wait hours to reply.',
          'Hot leads cool fast in India.',
          'Speed beats fancy funnels for most SMEs.',
        ],
        'cta' => 'Speed up your reply system',
      ],
      'tip' => [
        'title' => 'WhatsApp reply script that converts',
        'lines' => [
          'Reply within 5 minutes during business hours.',
          'Ask one qualifying question before a long pitch.',
          'Save quick replies for price, location, and next step.',
        ],
        'cta' => 'Get our WhatsApp scripts',
      ],
      'proof' => [
        'title' => 'Leads to booked jobs',
        'lines' => [
          'DisplayAvenue connects ads, landing pages, and WhatsApp habits.',
          'Tag hot, warm, nurture — follow up 3 times in 48 hours.',
          'Measure booked work, not only form fills.',
        ],
        'cta' => 'Book a free growth call',
      ],
    ],
    [
      'category' => 'Websites',
      'hook' => [
        'title' => 'Slow mobile sites kill enquiries',
        'lines' => [
          'If your page takes more than 3 seconds on 4G, buyers bounce.',
          'Ads cannot fix a heavy site.',
          'WhatsApp and call buttons must sit above the fold.',
        ],
        'cta' => 'Check your mobile speed',
      ],
      'tip' => [
        'title' => 'Landing page rules that convert',
        'lines' => [
          'One primary CTA per page.',
          'Compress images and drop heavy sliders.',
          'Test on a real Android phone before launching ads.',
        ],
        'cta' => 'Get a website conversion check',
      ],
      'proof' => [
        'title' => 'Sites built for Indian buyers',
        'lines' => [
          'DisplayAvenue designs for mobile-first enquiry.',
          'Clear offer, proof, and WhatsApp path.',
          'Ready for Google and Meta traffic.',
        ],
        'cta' => 'Talk about your website',
      ],
    ],
    [
      'category' => 'Branding',
      'hook' => [
        'title' => 'Confused branding raises your ad cost',
        'lines' => [
          'If buyers cannot repeat your offer, ads get expensive.',
          'Look and message must match from ad to landing page.',
          'Proof beats fluff.',
        ],
        'cta' => 'Clarify your brand offer',
      ],
      'tip' => [
        'title' => 'Brand basics for better ROAS',
        'lines' => [
          'One sentence offer people can repeat.',
          'Consistent logo, colours, and photo style.',
          'Show reviews, before/after, and client names.',
        ],
        'cta' => 'Get a brand + ads plan',
      ],
      'proof' => [
        'title' => 'Brand that sells with ads',
        'lines' => [
          'DisplayAvenue aligns creative, landing page, and follow-up.',
          'Clear promise. Real proof. Fast reply.',
          'Built for Indian SME growth.',
        ],
        'cta' => 'Book a free consultation',
      ],
    ],
    [
      'category' => 'Lead Gen',
      'hook' => [
        'title' => 'Leads die in unread DMs',
        'lines' => [
          'Marketing fails when Instagram and forms sit unanswered.',
          'You do not need more leads first — you need a system.',
          'Owner habits beat more ad spend.',
        ],
        'cta' => 'Build a simple lead system',
      ],
      'tip' => [
        'title' => 'CRM habit for busy owners',
        'lines' => [
          'Tag every lead hot, warm, or nurture.',
          'Follow up 3 times in 48 hours if needed.',
          'Use a short script — not long pitches.',
        ],
        'cta' => 'Get the lead follow-up pack',
      ],
      'proof' => [
        'title' => 'From enquiry to sale',
        'lines' => [
          'DisplayAvenue connects acquisition with reply speed.',
          'Weekly report: leads, cost, booked jobs.',
          'Cut what never produces sales conversations.',
        ],
        'cta' => 'WhatsApp DisplayAvenue',
      ],
    ],
  ];
}

function da_videos_slugify(string $title): string {
  $s = strtolower($title);
  $s = preg_replace('/[^a-z0-9]+/', '-', $s) ?? '';
  $s = trim($s, '-');
  return substr($s, 0, 70) ?: ('reel-' . date('Ymd'));
}

function da_videos_pack_for_date(string $date): array {
  $packs = da_videos_topic_packs();
  $tz = new DateTimeZone('Asia/Kolkata');
  $dt = DateTime::createFromFormat('Y-m-d', $date, $tz) ?: new DateTime('now', $tz);
  $dayIndex = (int)$dt->format('z');
  return $packs[$dayIndex % count($packs)];
}

function da_videos_build_captions(array $lines): array {
  $captions = [];
  $t = 0.0;
  foreach ($lines as $line) {
    $text = trim((string)$line);
    if ($text === '') continue;
    $captions[] = ['t' => round($t, 2), 'text' => $text];
    // ~2.4s per short line, longer for longer text
    $words = max(1, str_word_count($text));
    $t += max(2.2, min(4.2, $words * 0.38));
  }
  return $captions;
}

function da_videos_build_reel(string $type, array $piece, string $category, string $date, string $speakerImage, string $speakerName): array {
  $title = (string)($piece['title'] ?? 'DisplayAvenue reel');
  $lines = array_values(array_filter(array_map('strval', $piece['lines'] ?? [])));
  $captions = da_videos_build_captions($lines);
  $duration = 12.0;
  if ($captions) {
    $last = $captions[count($captions) - 1];
    $duration = (float)$last['t'] + 3.2;
  }
  $script = implode(' ', $lines);
  $cta = (string)($piece['cta'] ?? 'Book a free growth call');
  $slug = da_videos_slugify($type . '-' . $title) . '-' . str_replace('-', '', $date);
  return [
    'slug' => $slug,
    'type' => $type,
    'category' => $category,
    'title' => $title,
    'lines' => $lines,
    'captions' => $captions,
    'script' => $script,
    'durationSec' => round($duration, 1),
    'cta' => $cta,
    'ctaHref' => 'https://wa.me/919222122333?text=' . rawurlencode('Hi DisplayAvenue, I watched your reel: ' . $title),
    'speakerImage' => $speakerImage,
    'speakerName' => $speakerName,
    'publishedAt' => $date,
    'trending' => true,
    'source' => 'daily-autopilot',
    'format' => 'talking-head',
  ];
}

function da_videos_count_autopilot_on_date(array $reels, string $date): int {
  $n = 0;
  foreach ($reels as $r) {
    if (($r['publishedAt'] ?? '') === $date && ($r['source'] ?? '') === 'daily-autopilot') {
      $n++;
    }
  }
  return $n;
}

function da_videos_publish_for_date(string $date): array {
  $videos = da_videos_load();
  if (isset($videos['autoPublish']) && empty($videos['autoPublish'])) {
    return [];
  }
  $reels = is_array($videos['reels'] ?? null) ? $videos['reels'] : [];
  $existing = da_videos_count_autopilot_on_date($reels, $date);
  $need = max(0, 3 - $existing);
  if ($need === 0) {
    return [];
  }

  $pack = da_videos_pack_for_date($date);
  $category = (string)($pack['category'] ?? 'Growth');
  $speakerImage = trim((string)($videos['speakerImage'] ?? ''));
  $speakerName = trim((string)($videos['speakerName'] ?? 'DisplayAvenue')) ?: 'DisplayAvenue';

  $order = ['hook', 'tip', 'proof'];
  // Skip types already present for the date
  $haveTypes = [];
  foreach ($reels as $r) {
    if (($r['publishedAt'] ?? '') === $date && ($r['source'] ?? '') === 'daily-autopilot') {
      $haveTypes[(string)($r['type'] ?? '')] = true;
    }
  }

  $created = [];
  foreach ($order as $type) {
    if (isset($haveTypes[$type])) continue;
    $piece = $pack[$type] ?? null;
    if (!is_array($piece)) continue;
    $reel = da_videos_build_reel($type, $piece, $category, $date, $speakerImage, $speakerName);
    array_unshift($reels, $reel);
    $created[] = $reel;
    if (count($created) >= $need) break;
  }

  if (!$created) {
    return [];
  }

  // Keep newest first, cap archive
  usort($reels, static function ($a, $b) {
    $c = strcmp((string)($b['publishedAt'] ?? ''), (string)($a['publishedAt'] ?? ''));
    if ($c !== 0) return $c;
    $orderMap = ['hook' => 0, 'tip' => 1, 'proof' => 2];
    return ($orderMap[(string)($a['type'] ?? '')] ?? 9) <=> ($orderMap[(string)($b['type'] ?? '')] ?? 9);
  });
  foreach ($reels as $i => &$r) {
    $r['trending'] = $i < 3;
    // Keep speaker image in sync with current studio portrait
    if ($speakerImage !== '') {
      $r['speakerImage'] = $speakerImage;
    }
    if ($speakerName !== '') {
      $r['speakerName'] = $speakerName;
    }
  }
  unset($r);
  $videos['reels'] = array_slice($reels, 0, 180);
  $videos['autoPublish'] = true;
  $videos['lastAutopilotAt'] = gmdate('c');
  $videos['lastAutopilotDate'] = $date;
  if (!da_videos_save($videos)) {
    return [];
  }
  return $created;
}

/**
 * Catch up missed IST days and ensure today has 3 reels.
 * @return array{ok:bool,created:array<int,array>,skipped:string,today:string}
 */
function da_videos_ensure_published(int $maxCatchUpDays = 7): array {
  $tz = new DateTimeZone('Asia/Kolkata');
  $today = (new DateTime('now', $tz))->format('Y-m-d');
  $lockFile = da_videos_lock_path();
  $fh = @fopen($lockFile, 'c+');
  if (!$fh) {
    return ['ok' => false, 'created' => [], 'skipped' => 'lock-open-failed', 'today' => $today];
  }
  if (!flock($fh, LOCK_EX | LOCK_NB)) {
    fclose($fh);
    return ['ok' => true, 'created' => [], 'skipped' => 'busy', 'today' => $today];
  }

  try {
    $videos = da_videos_load();
    if (isset($videos['autoPublish']) && empty($videos['autoPublish'])) {
      return ['ok' => true, 'created' => [], 'skipped' => 'autopilot-off', 'today' => $today];
    }

    $reels = is_array($videos['reels'] ?? null) ? $videos['reels'] : [];
    $end = new DateTime('now', $tz);
    $end->setTime(0, 0, 0);
    $dates = [$today];
    for ($i = 1; $i < $maxCatchUpDays; $i++) {
      $d = clone $end;
      $d->modify("-{$i} day");
      $ds = $d->format('Y-m-d');
      if (da_videos_count_autopilot_on_date($reels, $ds) >= 3) {
        break;
      }
      array_unshift($dates, $ds);
    }

    $created = [];
    foreach ($dates as $date) {
      $batch = da_videos_publish_for_date($date);
      foreach ($batch as $reel) {
        $created[] = [
          'slug' => $reel['slug'],
          'title' => $reel['title'],
          'type' => $reel['type'],
          'publishedAt' => $reel['publishedAt'],
        ];
      }
      if ($batch) {
        $reels = da_videos_load()['reels'] ?? $reels;
      }
    }

    return [
      'ok' => true,
      'created' => $created,
      'skipped' => $created ? '' : 'already-up-to-date',
      'today' => $today,
    ];
  } finally {
    flock($fh, LOCK_UN);
    fclose($fh);
  }
}

function da_videos_set_autopilot(bool $enabled): array {
  $videos = da_videos_load();
  $videos['autoPublish'] = $enabled;
  da_videos_save($videos);
  return $videos;
}

function da_videos_set_speaker(string $imageUrl, string $name = '', string $alt = ''): array {
  $videos = da_videos_load();
  $imageUrl = trim($imageUrl);
  if ($imageUrl !== '') {
    $videos['speakerImage'] = $imageUrl;
  }
  if (trim($name) !== '') {
    $videos['speakerName'] = trim($name);
  }
  if (trim($alt) !== '') {
    $videos['speakerImageAlt'] = trim($alt);
  }
  // Propagate portrait onto existing reels so older cards update
  if (!empty($videos['speakerImage']) && is_array($videos['reels'] ?? null)) {
    foreach ($videos['reels'] as &$r) {
      $r['speakerImage'] = $videos['speakerImage'];
      if (!empty($videos['speakerName'])) {
        $r['speakerName'] = $videos['speakerName'];
      }
    }
    unset($r);
  }
  da_videos_save($videos);
  return $videos;
}
