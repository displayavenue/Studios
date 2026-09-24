<?php
/**
 * SEO blog topic bank + article builder for daily auto-publish.
 * Generates unique wedding/celebration posts without external APIs.
 */
declare(strict_types=1);

function da_blog_slugify(string $text): string {
  $text = strtolower(trim($text));
  $text = preg_replace('/[^a-z0-9]+/', '-', $text) ?? '';
  return trim($text, '-') ?: 'post';
}

/** @return list<array{id:string,title:string,category:string,keyword:string,city:string,intent:string,service:string}> */
function da_blog_topic_bank(): array {
  static $cache = null;
  if ($cache !== null) return $cache;

  $cities = [
    'Mumbai', 'Delhi NCR', 'Bangalore', 'Pune', 'Goa', 'Udaipur', 'Jaipur',
    'Hyderabad', 'Chennai', 'Kolkata', 'Ahmedabad', 'Lonavala', 'Thane', 'Nashik',
  ];
  $services = [
    ['wedding photographer', 'Wedding Photography', 'Wedding'],
    ['candid wedding photographer', 'Candid Wedding Photography', 'Wedding'],
    ['wedding videographer', 'Wedding Videography', 'Films'],
    ['cinematic wedding films', 'Cinematic Wedding Films', 'Films'],
    ['pre wedding shoot', 'Pre Wedding Shoot', 'Pre-Wedding'],
    ['engagement photographer', 'Engagement Photography', 'Engagement'],
    ['maternity photographer', 'Maternity Photography', 'Maternity'],
    ['birthday photographer', 'Birthday Photography', 'Birthday'],
    ['destination wedding photographer', 'Destination Wedding Photography', 'Destination'],
    ['wedding photography packages', 'Wedding Packages', 'Pricing'],
  ];
  $intents = [
    'cost' => [
      'title' => 'How Much Does a %s Cost in %s? (2026 Guide)',
      'category' => 'Pricing',
    ],
    'best' => [
      'title' => 'Best %s in %s — How Couples Should Shortlist',
      'category' => 'Planning',
    ],
    'tips' => [
      'title' => '%s Tips for %s Couples (Practical Checklist)',
      'category' => 'Tips',
    ],
    'guide' => [
      'title' => 'Complete Guide to Hiring a %s in %s',
      'category' => 'Guides',
    ],
    'packages' => [
      'title' => '%s Packages in %s: Essential vs Signature vs Luxury',
      'category' => 'Pricing',
    ],
    'mistakes' => [
      'title' => '%s Mistakes Couples Make in %s (And How to Avoid Them)',
      'category' => 'Planning',
    ],
  ];

  $topics = [];
  $i = 0;
  foreach ($services as [$keyword, $serviceLabel, $svcCat]) {
    foreach ($cities as $city) {
      foreach ($intents as $intent => $meta) {
        $title = sprintf($meta['title'], $keyword, $city);
        // Capitalize keyword in title already handled by sprintf strings
        $id = da_blog_slugify($intent . '-' . $keyword . '-' . $city);
        $topics[] = [
          'id' => $id,
          'title' => ucwords($title, " -"),
          'category' => $meta['category'],
          'keyword' => $keyword,
          'city' => $city,
          'intent' => $intent,
          'service' => $serviceLabel,
          'serviceCategory' => $svcCat,
        ];
        $i++;
        if ($i >= 180) break 3;
      }
    }
  }

  // Extra evergreen topics (not city-bound)
  $evergreen = [
    ['candid-vs-traditional-wedding-photography-india', 'Candid vs Traditional Wedding Photography in India', 'Education', 'candid wedding photography', 'India', 'guide', 'Wedding Photography'],
    ['wedding-videography-vs-cinematic-films', 'Wedding Videography vs Cinematic Wedding Films: What to Book', 'Films', 'cinematic wedding films', 'India', 'guide', 'Cinematic Wedding Films'],
    ['pre-wedding-shoot-ideas-india', 'Pre-Wedding Shoot Ideas for Indian Couples (2026)', 'Pre-Wedding', 'pre wedding shoot', 'India', 'tips', 'Pre Wedding Shoot'],
    ['maternity-photoshoot-timing-india', 'Best Time for Maternity Photoshoot in India (Weeks 28–34)', 'Maternity', 'maternity photographer', 'India', 'tips', 'Maternity Photography'],
    ['haldi-mehendi-sangeet-photography-checklist', 'Haldi, Mehendi & Sangeet Photography Checklist', 'Wedding', 'wedding photographer', 'India', 'tips', 'Wedding Photography'],
    ['how-to-read-wedding-photography-contract', 'How to Read a Wedding Photography Contract Before You Pay', 'Planning', 'wedding photography packages', 'India', 'guide', 'Wedding Packages'],
    ['same-day-edit-wedding-reels-india', 'Same-Day Edit Wedding Reels: Are They Worth It?', 'Films', 'wedding videographer', 'India', 'tips', 'Wedding Videography'],
    ['destination-wedding-drone-rules-india', 'Destination Wedding Drone Rules Couples Should Know', 'Destination', 'destination wedding photographer', 'India', 'guide', 'Destination Wedding Photography'],
  ];
  foreach ($evergreen as [$id, $title, $cat, $kw, $city, $intent, $svc]) {
    array_unshift($topics, [
      'id' => $id,
      'title' => $title,
      'category' => $cat,
      'keyword' => $kw,
      'city' => $city,
      'intent' => $intent,
      'service' => $svc,
      'serviceCategory' => $cat,
    ]);
  }

  $cache = $topics;
  return $cache;
}

function da_blog_image_for_topic(array $topic): string {
  $map = [
    'Maternity' => '/images/indian/maternity-01.jpg',
    'Birthday' => '/images/indian/birthday-01.jpg',
    'Pre-Wedding' => '/images/indian/wedding-07.jpg',
    'Engagement' => '/images/indian/engage-01.jpg',
    'Films' => '/images/indian/film-01.jpg',
    'Destination' => '/images/indian/wedding-04.jpg',
    'Pricing' => '/images/indian/wedding-03.jpg',
  ];
  $cat = $topic['serviceCategory'] ?? $topic['category'] ?? 'Wedding';
  return $map[$cat] ?? '/images/indian/wedding-01.jpg';
}

function da_blog_build_excerpt(array $topic): string {
  $kw = $topic['keyword'];
  $city = $topic['city'];
  return "A practical {$city} guide to {$kw} — pricing signals, deliverables, candid vs traditional choices, and how DisplayAvenue Studios helps couples book with clarity.";
}

function da_blog_build_html(array $topic): string {
  $kw = htmlspecialchars($topic['keyword'], ENT_QUOTES, 'UTF-8');
  $city = htmlspecialchars($topic['city'], ENT_QUOTES, 'UTF-8');
  $service = htmlspecialchars($topic['service'], ENT_QUOTES, 'UTF-8');
  $intent = $topic['intent'];

  $parts = [];
  $parts[] = "<p>Searching for a <strong>{$kw}</strong> in <strong>{$city}</strong>? Couples usually want three things: a clear package, a calm on-ground crew, and deliverables that still look premium years later. This guide from DisplayAvenue Studios covers what actually matters before you pay a booking token.</p>";

  if ($intent === 'cost' || $intent === 'packages') {
    $parts[] = "<h2>{$service} price ranges in {$city}</h2>";
    $parts[] = "<p>In {$city}, premium {$kw} investment typically follows tiered packages:</p>";
    $parts[] = "<ul><li><strong>Essential</strong> — focused single-function or half-day coverage for intimate celebrations.</li><li><strong>Signature</strong> — the most booked photo + film balance for full wedding days.</li><li><strong>Luxury</strong> — multi-day or destination crews with extended cinema and album design credit.</li></ul>";
    $parts[] = "<p>DisplayAvenue Studios publishes transparent starting prices: wedding photography from ₹75,000, Signature photo-film packages from ₹1,85,000, and Luxury destination productions from ₹3,50,000. Final quotes depend on days, crew size, travel and film length.</p>";
  }

  if ($intent === 'best' || $intent === 'guide') {
    $parts[] = "<h2>How to shortlist a {$kw} in {$city}</h2>";
    $parts[] = "<ol><li>Review full wedding galleries — not only highlight reels.</li><li>Confirm candid + traditional coverage if elders expect family groups.</li><li>Ask whether photography and videography come from one studio (consistent colour language).</li><li>Get deliverables in writing: edited count, film length, reels, album credit, timeline.</li><li>Book 6–12 months ahead for peak {$city} Saturdays and muhurat dates.</li></ol>";
  }

  if ($intent === 'tips' || $intent === 'mistakes') {
    $parts[] = "<h2>Practical tips for {$city} couples</h2>";
    $parts[] = "<ul><li>Share a ritual run-of-show and VIP family list before wedding week.</li><li>Protect 20–30 minutes at golden hour for cinematic couple portraits.</li><li>Ask for same-day or 48-hour social selects for Instagram.</li><li>Confirm drone permissions with the venue in advance.</li><li>Bundle pre-wedding with wedding coverage when you want one visual language.</li></ul>";
    $parts[] = "<h2>Common mistakes to avoid</h2>";
    $parts[] = "<p>Booking only on price, skipping written contracts, hiring separate photo and film teams without coordination, and delaying the booking token until peak dates are gone are the fastest ways to stress a celebration week.</p>";
  }

  $parts[] = "<h2>Candid vs traditional — what {$city} families usually need</h2>";
  $parts[] = "<p>Candid {$kw} coverage captures emotion without stiff posing. Traditional coverage organises family groups and ritual sequences elders treasure. Premium Indian weddings almost always need both. DisplayAvenue Studios builds hybrid crews so you do not have to choose.</p>";

  $parts[] = "<h2>What DisplayAvenue includes for {$service}</h2>";
  $parts[] = "<p>Based in Mira Road East, Mumbai, we travel pan-India for {$city} and destination celebrations. Couples receive colour-graded galleries, cinematic films where booked, private client gallery codes, and WhatsApp-first coordination from enquiry to delivery.</p>";

  $parts[] = "<h2>Ready to check availability?</h2>";
  $parts[] = "<p>Share your date, city and whether you need photography, videography or both. We reply quickly with package guidance and open calendar dates.</p>";
  $parts[] = '<p><a href="/book-now">Book a consultation</a> · <a href="/pricing">Compare packages</a> · <a href="/services">Browse services</a></p>';

  return implode("\n", $parts);
}

/**
 * Build a full blog post array ready for content.json
 * @return array<string,mixed>
 */
function da_blog_make_post(array $topic, string $date): array {
  $slug = $topic['id'];
  // Make slug unique per date if recycled
  if (strlen($slug) > 70) $slug = substr($slug, 0, 70);
  return [
    'slug' => $slug,
    'title' => $topic['title'],
    'excerpt' => da_blog_build_excerpt($topic),
    'category' => $topic['category'],
    'date' => $date,
    'image' => da_blog_image_for_topic($topic),
    'readTime' => '7 min read',
    'content' => da_blog_build_html($topic),
    'status' => 'published',
    'source' => 'auto',
    'keyword' => $topic['keyword'],
    'seoTitle' => $topic['title'] . ' | DisplayAvenue Studios',
    'seoDescription' => da_blog_build_excerpt($topic),
  ];
}

/**
 * Pick next unused topic given existing blog slugs and automation cursor.
 * @param list<array<string,mixed>> $existingBlogs
 * @param array<string,mixed> $automation
 * @return array{topic:array,index:int}|null
 */
function da_blog_next_topic(array $existingBlogs, array $automation): ?array {
  $bank = da_blog_topic_bank();
  $used = [];
  foreach ($existingBlogs as $b) {
    if (!empty($b['slug'])) $used[$b['slug']] = true;
    if (!empty($b['id'])) $used[(string)$b['id']] = true;
  }
  $start = (int)($automation['nextIndex'] ?? 0);
  $n = count($bank);
  if ($n === 0) return null;
  for ($offset = 0; $offset < $n; $offset++) {
    $idx = ($start + $offset) % $n;
    $topic = $bank[$idx];
    if (!isset($used[$topic['id']])) {
      return ['topic' => $topic, 'index' => $idx];
    }
  }
  // All used — recycle with dated slug suffix handled by caller via date uniqueness
  $idx = $start % $n;
  $topic = $bank[$idx];
  $topic['id'] = $topic['id'] . '-' . date('Ymd');
  return ['topic' => $topic, 'index' => $idx];
}

/**
 * Publish one automated blog into content.json and sync SEO.
 * @return array{ok:bool,post?:array,error?:string,seo?:array}
 */
function da_blog_publish_one(string $contentDir, ?string $publicDir = null, bool $force = false): array {
  $contentDir = rtrim($contentDir, '/\\');
  $publicDir = rtrim($publicDir ?: dirname($contentDir), '/\\');
  $contentPath = $contentDir . '/content.json';
  $autoPath = $contentDir . '/blog-automation.json';

  $automation = [];
  if (is_file($autoPath)) {
    $automation = json_decode((string)file_get_contents($autoPath), true) ?: [];
  }
  $automation = array_merge([
    'enabled' => true,
    'timezone' => 'Asia/Kolkata',
    'lastPublishDate' => '',
    'lastSlug' => '',
    'nextIndex' => 0,
    'totalPublished' => 0,
    'postsPerDay' => 1,
  ], $automation);

  if (!$force && empty($automation['enabled'])) {
    return ['ok' => false, 'error' => 'Auto-blog is disabled in settings'];
  }

  $tz = @timezone_open((string)$automation['timezone']) ?: timezone_open('Asia/Kolkata');
  $now = new DateTimeImmutable('now', $tz);
  $today = $now->format('Y-m-d');

  if (!$force && ($automation['lastPublishDate'] ?? '') === $today) {
    return ['ok' => false, 'error' => 'Already published today (' . $today . ')', 'lastSlug' => $automation['lastSlug'] ?? ''];
  }

  if (!is_file($contentPath)) {
    return ['ok' => false, 'error' => 'content.json missing'];
  }
  $content = json_decode((string)file_get_contents($contentPath), true);
  if (!is_array($content)) {
    return ['ok' => false, 'error' => 'Invalid content.json'];
  }
  $blogs = $content['blogs'] ?? [];
  if (!is_array($blogs)) $blogs = [];

  $pick = da_blog_next_topic($blogs, $automation);
  if (!$pick) {
    return ['ok' => false, 'error' => 'No topics available'];
  }

  $post = da_blog_make_post($pick['topic'], $today);
  // Ensure unique slug against existing
  $slugs = array_column($blogs, 'slug');
  $baseSlug = $post['slug'];
  $n = 2;
  while (in_array($post['slug'], $slugs, true)) {
    $post['slug'] = $baseSlug . '-' . $n;
    $n++;
  }

  array_unshift($blogs, $post);
  $content['blogs'] = $blogs;

  $tmp = $contentPath . '.tmp';
  $json = json_encode($content, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
  if ($json === false || file_put_contents($tmp, $json . "\n") === false) {
    return ['ok' => false, 'error' => 'Failed writing content.json'];
  }
  rename($tmp, $contentPath);

  $automation['lastPublishDate'] = $today;
  $automation['lastSlug'] = $post['slug'];
  $automation['lastTitle'] = $post['title'];
  $automation['nextIndex'] = $pick['index'] + 1;
  $automation['totalPublished'] = (int)($automation['totalPublished'] ?? 0) + 1;
  $automation['updatedAt'] = $now->format(DateTimeInterface::ATOM);
  file_put_contents(
    $autoPath,
    json_encode($automation, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT) . "\n"
  );

  require_once __DIR__ . '/seo-sync.php';
  $seo = da_sync_seo_artifacts($contentDir, $publicDir);

  return ['ok' => true, 'post' => $post, 'seo' => $seo, 'automation' => $automation];
}
