<?php
/**
 * DisplayAvenue blog auto-publisher — one trending article per day for the agency niche.
 */
declare(strict_types=1);

function da_blog_path(): string {
  $config = require __DIR__ . '/../config.php';
  return rtrim((string)$config['content_dir'], '/\\') . '/blog.json';
}

function da_blog_load(): array {
  $path = da_blog_path();
  if (!is_file($path)) {
    return [
      'title' => 'DisplayAvenue Blog',
      'lead' => 'Practical digital marketing updates for Indian business owners.',
      'autoPublish' => true,
      'postsPerDay' => 1,
      'posts' => [],
    ];
  }
  $data = json_decode((string)file_get_contents($path), true);
  return is_array($data) ? $data : ['posts' => []];
}

function da_blog_save(array $blog): bool {
  $blog['updatedAt'] = gmdate('c');
  return (bool)@file_put_contents(
    da_blog_path(),
    json_encode($blog, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT)
  );
}

function da_blog_topics(): array {
  return [
    [
      'category' => 'Google Ads',
      'title' => 'Google Ads Budget Mistakes Indian SMEs Make (And Fixes)',
      'hook' => 'Most wasted Google Ads spend comes from broad match chaos and slow WhatsApp follow-up.',
      'points' => [
        'Start with exact and phrase match on money keywords, then expand.',
        'Send traffic to one offer landing page — not the full website menu.',
        'Track calls and WhatsApp clicks as conversions.',
        'Review search terms twice a week and add negatives.',
      ],
    ],
    [
      'category' => 'Meta Ads',
      'title' => 'Instagram Lead Ads: How to Improve Lead Quality in India',
      'hook' => 'Cheap Meta leads only help if your form questions and WhatsApp reply speed are tight.',
      'points' => [
        'Ask budget range, city, and timeline inside the Instant Form.',
        'Use Click-to-WhatsApp for high-intent offers.',
        'Refresh creatives every week — fatigue kills ROAS fast.',
        'Assign an owner to reply within 5 minutes during business hours.',
      ],
    ],
    [
      'category' => 'SEO',
      'title' => 'Service Pages That Rank: City × Offer SEO for Indian Businesses',
      'hook' => 'Generic blogs rarely bring customers. City and service pages do.',
      'points' => [
        'Build one clear page per main service and city.',
        'Add FAQs with real owner questions.',
        'Internal link from homepage, services hub, and blog posts.',
        'Pair SEO with light Google Ads while rankings build.',
      ],
    ],
    [
      'category' => 'Local SEO',
      'title' => 'Google Business Profile Posts That Get Calls',
      'hook' => 'Weekly GBP posts keep your profile active and help local discovery.',
      'points' => [
        'Post offers, new work, and short tips every week.',
        'Use real photos from your location.',
        'Ask for reviews after delivery with a WhatsApp script.',
        'Keep NAP consistent across website and directories.',
      ],
    ],
    [
      'category' => 'Websites',
      'title' => 'Why Slow Mobile Sites Kill WhatsApp Enquiries',
      'hook' => 'If your page takes more than 3 seconds on 4G, many buyers never message you.',
      'points' => [
        'Compress images and remove heavy sliders.',
        'Put WhatsApp and call buttons above the fold on mobile.',
        'Use one primary CTA per landing page.',
        'Test on a real Android phone before launching ads.',
      ],
    ],
    [
      'category' => 'Lead Gen',
      'title' => 'From Enquiry to Sale: A Simple CRM Habit for SMEs',
      'hook' => 'Marketing fails when leads sit unanswered in Instagram DMs.',
      'points' => [
        'Tag every lead hot, warm, or nurture.',
        'Follow up 3 times in 48 hours if needed.',
        'Use a short script — not long pitches.',
        'Measure booked jobs, not only form fills.',
      ],
    ],
    [
      'category' => 'Branding',
      'title' => 'Brand Basics That Make Ads Convert Faster',
      'hook' => 'Clear offer and consistent visuals reduce cost per lead on Google and Meta.',
      'points' => [
        'One sentence offer people can repeat.',
        'Consistent logo, colours, and photo style.',
        'Show proof: reviews, before/after, client names.',
        'Match landing page look with ad creative.',
      ],
    ],
  ];
}

function da_blog_slugify(string $title): string {
  $s = strtolower($title);
  $s = preg_replace('/[^a-z0-9]+/', '-', $s) ?? '';
  $s = trim($s, '-');
  return substr($s, 0, 80) ?: ('post-' . date('Ymd'));
}

function da_blog_build_post(array $topic, string $date): array {
  $title = (string)$topic['title'];
  $slug = da_blog_slugify($title) . '-' . str_replace('-', '', $date);
  $points = $topic['points'] ?? [];
  $body = [
    (string)($topic['hook'] ?? ''),
    'Here is a practical DisplayAvenue checklist for Indian business owners this week:',
  ];
  $i = 1;
  foreach ($points as $p) {
    $body[] = $i . ') ' . $p;
    $i++;
  }
  $body[] = 'DisplayAvenue helps with Google Ads, Meta Ads, SEO, Local SEO, websites, and WhatsApp lead systems. Get a free plan on https://displayavenue.com/strategy/ or WhatsApp 9222 122333.';
  return [
    'slug' => $slug,
    'title' => $title,
    'excerpt' => (string)($topic['hook'] ?? $title),
    'category' => (string)($topic['category'] ?? 'Growth'),
    'tags' => [(string)($topic['category'] ?? 'Growth'), 'India', 'SME', 'DisplayAvenue'],
    'author' => 'DisplayAvenue',
    'publishedAt' => $date,
    'trending' => true,
    'readMinutes' => 4,
    'cover' => '/images/card/front.png',
    'body' => $body,
    'source' => 'daily-autopilot',
  ];
}

/** Publish today's post if missing. Returns created post or null. */
function da_blog_publish_today(): ?array {
  $blog = da_blog_load();
  if (isset($blog['autoPublish']) && empty($blog['autoPublish'])) {
    return null;
  }
  $tz = new DateTimeZone('Asia/Kolkata');
  $today = (new DateTime('now', $tz))->format('Y-m-d');
  $posts = is_array($blog['posts'] ?? null) ? $blog['posts'] : [];
  foreach ($posts as $p) {
    if (($p['publishedAt'] ?? '') === $today && ($p['source'] ?? '') === 'daily-autopilot') {
      return null; // already published today
    }
  }
  $topics = da_blog_topics();
  $dayIndex = (int)(new DateTime('now', $tz))->format('z');
  $topic = $topics[$dayIndex % count($topics)];
  $post = da_blog_build_post($topic, $today);
  // demote old trending flags (keep newest 3 trending)
  foreach ($posts as &$p) {
    if (!empty($p['trending'])) $p['trending'] = false;
  }
  unset($p);
  array_unshift($posts, $post);
  $posts[0]['trending'] = true;
  if (isset($posts[1])) $posts[1]['trending'] = true;
  if (isset($posts[2])) $posts[2]['trending'] = true;
  $posts = array_slice($posts, 0, 120);
  $blog['posts'] = $posts;
  da_blog_save($blog);
  return $post;
}
