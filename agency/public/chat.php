<?php
/**
 * Website chatbot API — answers from CMS content + chatbot knowledge base.
 * Optional OpenAI key in admin/config.php (openai_api_key) for smarter replies.
 */
declare(strict_types=1);

header_remove('X-Powered-By');
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');

$https = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
  || ((int)($_SERVER['SERVER_PORT'] ?? 0) === 443)
  || (strtolower((string)($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '')) === 'https');
$host = (string)($_SERVER['HTTP_HOST'] ?? 'displayavenue.com');
$selfOrigin = ($https ? 'https://' : 'http://') . $host;

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(204);
  exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['ok' => false, 'error' => 'POST required']);
  exit;
}

$origin = (string)($_SERVER['HTTP_ORIGIN'] ?? '');
if ($origin !== '' && !hash_equals($selfOrigin, $origin)) {
  http_response_code(403);
  echo json_encode(['ok' => false, 'error' => 'Cross-origin requests are not allowed']);
  exit;
}

function chat_respond(int $code, array $payload): void {
  http_response_code($code);
  echo json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
  exit;
}

function chat_ip(): string {
  return (string)($_SERVER['REMOTE_ADDR'] ?? '0.0.0.0');
}

function chat_rate_limited(): bool {
  $path = sys_get_temp_dir() . '/da_chat_' . hash('sha256', chat_ip()) . '.json';
  $now = time();
  $state = ['count' => 0, 'window_start' => $now];
  if (is_file($path)) {
    $raw = json_decode((string)file_get_contents($path), true);
    if (is_array($raw)) $state = $raw;
  }
  if (($now - (int)($state['window_start'] ?? $now)) > 600) {
    $state = ['count' => 0, 'window_start' => $now];
  }
  $state['count'] = (int)($state['count'] ?? 0) + 1;
  @file_put_contents($path, json_encode($state));
  return $state['count'] > 40;
}

if (chat_rate_limited()) {
  chat_respond(429, ['ok' => false, 'error' => 'Too many messages. Please wait a minute and try again.']);
}

$raw = file_get_contents('php://input') ?: '';
$body = json_decode($raw, true);
if (!is_array($body)) $body = $_POST;

// Honeypot
if (trim((string)($body['website'] ?? '')) !== '') {
  chat_respond(200, [
    'ok' => true,
    'reply' => 'Thanks for reaching out! Our team will follow up shortly.',
    'source' => 'honeypot',
  ]);
}

$message = trim((string)($body['message'] ?? ''));
$history = $body['history'] ?? [];
if (!is_array($history)) $history = [];
$history = array_slice($history, -6);

if ($message === '' || mb_strlen($message) > 1000) {
  chat_respond(400, ['ok' => false, 'error' => 'Please enter a message (max 1000 characters).']);
}

$config = require __DIR__ . '/admin/config.php';
$contentDir = (string)($config['content_dir'] ?? (__DIR__ . '/content'));

function chat_read_json(string $path): array {
  if (!is_file($path)) return [];
  $data = json_decode((string)file_get_contents($path), true);
  return is_array($data) ? $data : [];
}

function chat_items(array $file): array {
  return is_array($file['items'] ?? null) ? $file['items'] : [];
}

$company = chat_read_json($contentDir . '/company.json');
$chatbot = chat_read_json($contentDir . '/chatbot.json');
$services = chat_items(chat_read_json($contentDir . '/services.json'));
$packages = chat_items(chat_read_json($contentDir . '/packages.json'));
$industries = chat_items(chat_read_json($contentDir . '/industries.json'));
$cases = chat_items(chat_read_json($contentDir . '/cases.json'));
$projects = chat_items(chat_read_json($contentDir . '/projects.json'));

if (($chatbot['enabled'] ?? true) === false) {
  chat_respond(200, [
    'ok' => true,
    'reply' => 'Chat is temporarily offline. Please contact us at ' . ($company['email'] ?? 'info@displayavenue.com') . ' or ' . ($company['phone'] ?? '+91 9222 122333') . '.',
    'source' => 'disabled',
  ]);
}

$chunks = [];

$name = (string)($company['name'] ?? 'DisplayAvenue');
$chunks[] = [
  'title' => 'Company',
  'text' => trim(($company['name'] ?? '') . ' — ' . ($company['tagline'] ?? '') . '. Website: ' . ($company['website'] ?? 'https://displayavenue.com')),
  'tags' => 'company about brand agency',
];
$chunks[] = [
  'title' => 'Contact',
  'text' => 'Phone: ' . ($company['phone'] ?? '') . '. WhatsApp: ' . ($company['whatsapp'] ?? '') . '. Email: ' . ($company['email'] ?? '') . '. Hours: ' . ($company['address']['hours'] ?? '') . '.',
  'tags' => 'contact phone email whatsapp call hours',
];
$addrLines = is_array($company['address']['lines'] ?? null) ? $company['address']['lines'] : [];
$chunks[] = [
  'title' => 'Location',
  'text' => 'Office address: ' . implode(', ', $addrLines) . '. City: ' . ($company['address']['city'] ?? 'Mumbai') . '. Directions: ' . ($company['googleMaps']['directionsUrl'] ?? 'https://displayavenue.com/'),
  'tags' => 'location address office mumbai mira road map directions visit',
];
if (!empty($company['stats']) && is_array($company['stats'])) {
  $statBits = [];
  foreach ($company['stats'] as $k => $v) $statBits[] = "$k: $v";
  $chunks[] = [
    'title' => 'Results',
    'text' => 'Key stats: ' . implode('; ', $statBits),
    'tags' => 'stats results projects clients industries leads satisfaction roi',
  ];
}

foreach (($chatbot['facts'] ?? []) as $fact) {
  $fact = trim((string)$fact);
  if ($fact === '') continue;
  $chunks[] = ['title' => 'Fact', 'text' => $fact, 'tags' => 'fact detail about'];
}

foreach (($chatbot['faqs'] ?? []) as $faq) {
  if (!is_array($faq)) continue;
  $q = trim((string)($faq['q'] ?? ''));
  $a = trim((string)($faq['a'] ?? ''));
  if ($q === '' || $a === '') continue;
  $chunks[] = [
    'title' => 'FAQ: ' . $q,
    'text' => $q . ' ' . $a,
    'answer' => $a,
    'question' => $q,
    'tags' => 'faq ' . mb_strtolower($q),
  ];
}

foreach (array_slice($services, 0, 80) as $item) {
  $title = trim((string)($item['title'] ?? ''));
  $summary = trim((string)($item['summary'] ?? $item['headline'] ?? ''));
  $slug = trim((string)($item['slug'] ?? ''));
  if ($title === '') continue;
  $chunks[] = [
    'title' => 'Service: ' . $title,
    'text' => $title . '. ' . $summary . ($slug ? ' Page: /services/' . $slug : ''),
    'tags' => 'service ' . mb_strtolower($title . ' ' . ($item['category'] ?? '')),
  ];
}

foreach (array_slice($packages, 0, 30) as $item) {
  $title = trim((string)($item['title'] ?? ''));
  $summary = trim((string)($item['summary'] ?? $item['headline'] ?? ''));
  if ($title === '') continue;
  $chunks[] = [
    'title' => 'Package: ' . $title,
    'text' => $title . '. ' . $summary . ' See /packages' . (!empty($item['slug']) ? '/' . $item['slug'] : ''),
    'tags' => 'package pricing pricing plan cost',
  ];
}

foreach (array_slice($industries, 0, 40) as $item) {
  $title = trim((string)($item['title'] ?? ''));
  $summary = trim((string)($item['summary'] ?? ''));
  if ($title === '') continue;
  $chunks[] = [
    'title' => 'Industry: ' . $title,
    'text' => 'We serve ' . $title . '. ' . $summary,
    'tags' => 'industry vertical ' . mb_strtolower($title),
  ];
}

foreach (array_slice($cases, 0, 20) as $item) {
  $industry = trim((string)($item['industry'] ?? $item['title'] ?? ''));
  $summary = trim((string)($item['summary'] ?? ''));
  $cat = trim((string)($item['category'] ?? ''));
  if ($industry === '') continue;
  $chunks[] = [
    'title' => 'Case study: ' . $industry,
    'text' => $cat . ' case study for ' . $industry . '. ' . $summary,
    'tags' => 'case study results ' . mb_strtolower($industry . ' ' . $cat),
  ];
}

foreach (array_slice($projects, 0, 20) as $item) {
  $industry = trim((string)($item['industry'] ?? $item['title'] ?? ''));
  $summary = trim((string)($item['summary'] ?? ''));
  $cat = trim((string)($item['category'] ?? ''));
  if ($industry === '') continue;
  $chunks[] = [
    'title' => 'Portfolio: ' . $industry,
    'text' => $cat . ' project for ' . $industry . '. ' . $summary,
    'tags' => 'portfolio project work ' . mb_strtolower($industry . ' ' . $cat),
  ];
}

function chat_normalize(string $s): string {
  $s = mb_strtolower($s);
  $s = preg_replace('/[^a-z0-9\s\+\-\/]/u', ' ', $s) ?? $s;
  return trim(preg_replace('/\s+/', ' ', $s) ?? $s);
}

function chat_tokens(string $s): array {
  $stop = ['the','a','an','and','or','to','of','in','on','for','is','are','do','you','your','we','our','me','my','what','where','how','can','with','from','about','this','that','please','tell','need','want'];
  $parts = preg_split('/\s+/', chat_normalize($s)) ?: [];
  $out = [];
  foreach ($parts as $p) {
    if (mb_strlen($p) < 2) continue;
    if (in_array($p, $stop, true)) continue;
    $out[] = $p;
  }
  return array_values(array_unique($out));
}

$qNorm = chat_normalize($message);
$qTokens = chat_tokens($message);

// Direct FAQ hit
$bestFaq = null;
$bestFaqScore = 0.0;
foreach ($chunks as $chunk) {
  if (empty($chunk['question']) || empty($chunk['answer'])) continue;
  similar_text($qNorm, chat_normalize((string)$chunk['question']), $pct);
  $qTok = chat_tokens((string)$chunk['question']);
  $overlap = count(array_intersect($qTokens, $qTok));
  // Require real overlap or strong string similarity — avoid "services" matching "industries"
  if ($overlap < 1 && $pct < 72) continue;
  $score = ($pct * 0.7) + ($overlap * 18);
  if ($score > $bestFaqScore) {
    $bestFaqScore = $score;
    $bestFaq = $chunk;
  }
}

$scored = [];
foreach ($chunks as $i => $chunk) {
  $hay = chat_normalize(($chunk['title'] ?? '') . ' ' . ($chunk['text'] ?? '') . ' ' . ($chunk['tags'] ?? ''));
  $score = 0.0;
  foreach ($qTokens as $tok) {
    if ($tok !== '' && str_contains($hay, $tok)) $score += 3 + min(3, mb_strlen($tok) / 4);
  }
  if ($qNorm !== '' && str_contains($hay, $qNorm)) $score += 20;
  // Intent boosts
  if (preg_match('/\b(contact|phone|email|whatsapp|call)\b/', $qNorm) && str_contains($hay, 'contact')) $score += 8;
  if (preg_match('/\b(address|office|location|where|map|directions|visit)\b/', $qNorm) && (str_contains($hay, 'location') || str_contains($hay, 'office'))) $score += 8;
  if (preg_match('/\b(price|pricing|package|cost|plan)\b/', $qNorm) && str_contains($hay, 'package')) $score += 6;
  if (preg_match('/\b(services?|seo|ads|website|branding|ecommerce|marketing)\b/', $qNorm) && str_contains(($chunk['tags'] ?? ''), 'service')) $score += 8;
  if (preg_match('/\b(industr(?:y|ies)|vertical)\b/', $qNorm) && str_contains(($chunk['tags'] ?? ''), 'industry')) $score += 8;
  if ($score > 0) $scored[] = ['score' => $score, 'chunk' => $chunk];
}

usort($scored, static fn($a, $b) => $b['score'] <=> $a['score']);
$top = array_slice($scored, 0, 6);

$openaiKey = trim((string)($config['openai_api_key'] ?? ''));
$contextLines = [];
foreach ($top as $row) {
  $c = $row['chunk'];
  $contextLines[] = '- ' . ($c['title'] ?? 'Info') . ': ' . ($c['text'] ?? '');
}
$context = implode("\n", $contextLines);

$reply = '';
$source = 'retrieval';

if ($bestFaq && $bestFaqScore >= 55) {
  $reply = (string)$bestFaq['answer'];
  $source = 'faq';
} elseif ($openaiKey !== '' && function_exists('curl_init')) {
  $system = "You are {$name}'s helpful website assistant. Answer ONLY using the CONTEXT below. Be concise (2-5 short sentences), friendly, and specific. If the answer is not in CONTEXT, say you don't have that detail and suggest contacting {$name} via phone/email/contact page. Do not invent prices or guarantees.";
  $userPrompt = "CONTEXT:\n{$context}\n\nUSER QUESTION:\n{$message}";
  $payload = [
    'model' => (string)($config['openai_model'] ?? 'gpt-4o-mini'),
    'temperature' => 0.2,
    'messages' => [
      ['role' => 'system', 'content' => $system],
      ['role' => 'user', 'content' => $userPrompt],
    ],
  ];
  // Include brief history
  foreach ($history as $h) {
    if (!is_array($h)) continue;
    $role = ($h['role'] ?? '') === 'assistant' ? 'assistant' : 'user';
    $content = trim((string)($h['content'] ?? ''));
    if ($content === '') continue;
    // Insert before latest user (already in userPrompt) as prior turns - skip; history already limited
  }
  $ch = curl_init('https://api.openai.com/v1/chat/completions');
  curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_HTTPHEADER => [
      'Content-Type: application/json',
      'Authorization: Bearer ' . $openaiKey,
    ],
    CURLOPT_POSTFIELDS => json_encode($payload),
    CURLOPT_TIMEOUT => 20,
  ]);
  $resp = curl_exec($ch);
  $code = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
  curl_close($ch);
  if ($resp && $code >= 200 && $code < 300) {
    $decoded = json_decode($resp, true);
    $text = trim((string)($decoded['choices'][0]['message']['content'] ?? ''));
    if ($text !== '') {
      $reply = $text;
      $source = 'openai';
    }
  }
}

if ($reply === '') {
  if ($top && ($top[0]['score'] ?? 0) >= 6) {
    $bits = [];
    foreach (array_slice($top, 0, 3) as $row) {
      $c = $row['chunk'];
      if (!empty($c['answer'])) {
        $bits[] = $c['answer'];
      } else {
        $bits[] = trim((string)($c['text'] ?? ''));
      }
    }
    $bits = array_values(array_unique(array_filter($bits)));
    $reply = implode("\n\n", array_slice($bits, 0, 2));
    // Soft CTA
    $phone = $company['phone'] ?? '+91 9222 122333';
    if (!preg_match('/contact|call|whatsapp|email/i', $reply)) {
      $reply .= "\n\nNeed a tailored plan? Call/WhatsApp {$phone} or visit /contact for a free proposal.";
    }
  } else {
    $fallback = trim((string)($chatbot['fallbackMessage'] ?? ''));
    if ($fallback === '') {
      $fallback = "I don’t have that exact detail yet. Contact us at " . ($company['email'] ?? 'info@displayavenue.com') . " or " . ($company['phone'] ?? '+91 9222 122333') . ".";
    }
    $reply = $fallback;
    $source = 'fallback';
  }
}

chat_respond(200, [
  'ok' => true,
  'reply' => $reply,
  'source' => $source,
  'botName' => $chatbot['botName'] ?? 'DA Assist',
  'suggestions' => array_values(array_filter(array_map(
    static fn($s) => trim((string)$s),
    is_array($chatbot['suggestedPrompts'] ?? null) ? $chatbot['suggestedPrompts'] : []
  ))),
  'handoff' => [
    'label' => $chatbot['handoffLabel'] ?? 'Talk to a human',
    'href' => $chatbot['handoffHref'] ?? '/contact',
    'whatsapp' => $company['whatsappHref'] ?? '',
  ],
]);
