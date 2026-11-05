<?php
/**
 * DisplayAvenue Growth AI — conversion chatbot engine.
 * Works offline with a smart qualifier; upgrades to LLM when chat-local.php has a key.
 */
declare(strict_types=1);

function da_chat_bot_config(): array {
  static $cfg = null;
  if (is_array($cfg)) return $cfg;
  $cfg = [
    'provider' => 'auto', // auto|rules|gemini|openai|groq
    'api_key' => '',
    'model' => '',
    'whatsapp' => 'https://wa.me/919222122333',
    'phone' => 'tel:+919222122333',
    'strategy' => 'https://displayavenue.com/strategy/',
    'data' => 'https://displayavenue.com/data/',
    'contact' => 'https://displayavenue.com/contact',
    'catalogue' => 'https://displayavenue.com/catalogue/DisplayAvenue-Catalogue.pdf',
  ];
  $local = __DIR__ . '/../chat-local.php';
  if (is_file($local)) {
    $extra = include $local;
    if (is_array($extra)) $cfg = array_merge($cfg, $extra);
  }
  // Env fallbacks
  foreach (['GEMINI_API_KEY', 'GOOGLE_AI_API_KEY', 'OPENAI_API_KEY', 'GROQ_API_KEY'] as $env) {
    $v = getenv($env);
    if ($v && !$cfg['api_key']) {
      $cfg['api_key'] = $v;
      if (str_contains($env, 'GEMINI') || str_contains($env, 'GOOGLE')) $cfg['provider'] = 'gemini';
      elseif (str_contains($env, 'OPENAI')) $cfg['provider'] = 'openai';
      elseif (str_contains($env, 'GROQ')) $cfg['provider'] = 'groq';
    }
  }
  return $cfg;
}

function da_chat_bot_http(string $url, array $headers, string $body, int $timeout = 20): ?string {
  if (function_exists('curl_init')) {
    $ch = curl_init($url);
    curl_setopt_array($ch, [
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_POST => true,
      CURLOPT_POSTFIELDS => $body,
      CURLOPT_HTTPHEADER => $headers,
      CURLOPT_TIMEOUT => $timeout,
      CURLOPT_CONNECTTIMEOUT => 8,
    ]);
    $out = curl_exec($ch);
    $code = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    if ($out === false || $code >= 400) return null;
    return $out;
  }
  $ctx = stream_context_create([
    'http' => [
      'method' => 'POST',
      'header' => implode("\r\n", $headers),
      'content' => $body,
      'timeout' => $timeout,
    ],
  ]);
  $out = @file_get_contents($url, false, $ctx);
  return $out === false ? null : $out;
}

function da_chat_bot_system_prompt(array $chat, array $cfg): string {
  $v = $chat['visitor'] ?? [];
  $lead = json_encode($chat['lead'] ?? [], JSON_UNESCAPED_UNICODE);
  return "You are DA Growth AI, DisplayAvenue's on-site sales & marketing assistant for Indian SMEs.\n"
    . "DisplayAvenue (displayavenue.com, Mumbai) sells: SEO, Local SEO, Google Ads, Meta Ads, LinkedIn Ads, websites, ecommerce, branding, AI chatbots, content, growth retainers.\n"
    . "Phone/WhatsApp: 9222 122333. Strategy: {$cfg['strategy']}. Catalogue: {$cfg['catalogue']}. Contact: {$cfg['contact']}.\n"
    . "Qualify industry, goal, budget, timeline. Recommend services. Convert to WhatsApp or strategy call.\n"
    . "Keep replies to 2–5 short sentences. Always include a clear next step when appropriate.\n"
    . "Visitor: name={$v['name']}, phone={$v['phone']}, page={$v['page']}. Lead state: {$lead}";
}

function da_chat_bot_llm(array $chat, string $userText, array $cfg): ?array {
  $provider = $cfg['provider'] ?? 'auto';
  $key = trim((string)($cfg['api_key'] ?? ''));
  if ($key === '' || $provider === 'rules') return null;
  if ($provider === 'auto') {
    $provider = 'gemini';
  }

  $system = da_chat_bot_system_prompt($chat, $cfg);

  $history = [];
  foreach (array_slice($chat['messages'] ?? [], -12) as $m) {
    $role = ($m['role'] ?? '') === 'visitor' ? 'user' : 'model';
    $history[] = ['role' => $role, 'text' => (string)($m['text'] ?? '')];
  }
  $history[] = ['role' => 'user', 'text' => $userText];

  if ($provider === 'gemini') {
    $model = $cfg['model'] ?: 'gemini-2.0-flash';
    $contents = [];
    foreach ($history as $h) {
      $contents[] = [
        'role' => $h['role'] === 'user' ? 'user' : 'model',
        'parts' => [['text' => $h['text']]],
      ];
    }
    $payload = [
      'system_instruction' => ['parts' => [['text' => $system]]],
      'contents' => $contents,
      'generationConfig' => ['temperature' => 0.6, 'maxOutputTokens' => 350],
    ];
    $url = 'https://generativelanguage.googleapis.com/v1beta/models/' . rawurlencode($model) . ':generateContent?key=' . rawurlencode($key);
    $raw = da_chat_bot_http($url, ['Content-Type: application/json'], json_encode($payload));
    if (!$raw) return null;
    $json = json_decode($raw, true);
    $text = trim((string)($json['candidates'][0]['content']['parts'][0]['text'] ?? ''));
    if ($text === '') return null;
    return ['text' => $text, 'provider' => 'gemini'];
  }

  // OpenAI / Groq compatible
  $base = $provider === 'groq'
    ? 'https://api.groq.com/openai/v1/chat/completions'
    : 'https://api.openai.com/v1/chat/completions';
  $model = $cfg['model'] ?: ($provider === 'groq' ? 'llama-3.3-70b-versatile' : 'gpt-4o-mini');
  $messages = [['role' => 'system', 'content' => $system]];
  foreach ($history as $h) {
    $messages[] = [
      'role' => $h['role'] === 'user' ? 'user' : 'assistant',
      'content' => $h['text'],
    ];
  }
  $payload = [
    'model' => $model,
    'temperature' => 0.6,
    'max_tokens' => 350,
    'messages' => $messages,
  ];
  $raw = da_chat_bot_http($base, [
    'Content-Type: application/json',
    'Authorization: Bearer ' . $key,
  ], json_encode($payload));
  if (!$raw) return null;
  $json = json_decode($raw, true);
  $text = trim((string)($json['choices'][0]['message']['content'] ?? ''));
  if ($text === '') return null;
  return ['text' => $text, 'provider' => $provider];
}

function da_chat_bot_detect(array &$lead, string $text): void {
  $t = strtolower($text);

  $industries = [
    'healthcare' => ['hospital', 'clinic', 'doctor', 'dental', 'dentist', 'healthcare', 'pharma', 'patient'],
    'real-estate' => ['real estate', 'property', 'builder', 'broker', 'flat', 'apartment'],
    'education' => ['school', 'college', 'coaching', 'education', 'edtech', 'tuition'],
    'restaurants' => ['restaurant', 'cafe', 'hotel food', 'cloud kitchen', 'f&b', 'bakery'],
    'ecommerce' => ['ecommerce', 'e-commerce', 'online store', 'shopify', 'd2c'],
    'saas' => ['saas', 'software', 'app startup', 'b2b software'],
    'manufacturing' => ['manufactur', 'factory', 'industrial', 'oem'],
    'hospitality' => ['hotel', 'resort', 'homestay', 'hospitality'],
    'finance' => ['ca firm', 'finance', 'insurance', 'loan', 'nbfc'],
    'fashion' => ['fashion', 'boutique', 'apparel', 'clothing'],
    'jewellery' => ['jewellery', 'jewelry', 'jeweller'],
    'automotive' => ['car dealer', 'garage', 'automotive', 'bike'],
    'travel' => ['travel', 'tour', 'visa'],
    'construction' => ['construction', 'contractor', 'interior'],
    'wellness' => ['salon', 'spa', 'gym', 'wellness', 'homeopathy'],
  ];
  foreach ($industries as $id => $words) {
    foreach ($words as $w) {
      if (str_contains($t, $w)) { $lead['industry'] = $id; break 2; }
    }
  }

  if (preg_match('/\b(leads?|enquir(?:y|ies)|inquir(?:y|ies)|appointments?|clients?|customers?|patients?)\b/', $t)) {
    $lead['goal'] = 'leads';
  }
  if (preg_match('/\b(sale|sales|booking|bookings|order|orders|revenue)\b/', $t)) $lead['goal'] = 'sales';
  if (preg_match('/\b(brand|awareness|visibility|followers)\b/', $t)) $lead['goal'] = 'brand';
  if (preg_match('/\b(pipeline|b2b|demo)\b/', $t)) $lead['goal'] = 'pipeline';

  $interests = is_array($lead['interests'] ?? null) ? $lead['interests'] : [];
  if (preg_match('/\b(google\s*ads?|adwords|ppc|search ads?)\b/', $t)) $interests[] = 'google-ads';
  if (preg_match('/\b(meta ads?|facebook ads?|instagram ads?|fb ads?)\b/', $t)) $interests[] = 'meta-ads';
  if (preg_match('/\b(seo|ranking|organic search)\b/', $t)) $interests[] = 'seo';
  if (preg_match('/\b(website|web design|landing pages?|shopify|wordpress)\b/', $t)) $interests[] = 'website';
  if (preg_match('/\b(linkedin ads?)\b/', $t)) $interests[] = 'linkedin-ads';
  if (preg_match('/\b(chatbot|ai bot|marketing automation)\b/', $t)) $interests[] = 'automation';
  if (preg_match('/\b(tracking|ga4|pixel|analytics)\b/', $t)) $interests[] = 'analytics';
  $interests = array_values(array_unique($interests));
  if ($interests) {
    $lead['interests'] = $interests;
    $lead['interest'] = $interests[0];
  }

  // Budgets: 25k, 1.5 lakh, 150000, etc.
  if (preg_match('/\b(\d+(?:\.\d+)?)\s*(lakh|lac)\b/', $t, $m)) {
    $lead['budget'] = (int) round(((float)$m[1]) * 100000);
  } elseif (preg_match('/\b(\d+(?:\.\d+)?)\s*k\b/', $t, $m)) {
    $lead['budget'] = (int) round(((float)$m[1]) * 1000);
  } elseif (preg_match('/₹?\s*(\d{2,3})[,\s]?(\d{3})\b/', $t, $m)) {
    $lead['budget'] = (int)($m[1] . $m[2]);
  } elseif (preg_match('/₹?\s*(\d{4,7})\b/', $t, $m)) {
    $n = (int)$m[1];
    if ($n >= 10000 && $n <= 5000000) $lead['budget'] = $n;
  }
  if (preg_match('/\b(25\s*k|25000)\b/', $t)) $lead['budget'] = 25000;
  if (preg_match('/\b(50\s*k|50000)\b/', $t)) $lead['budget'] = 50000;
  if (preg_match('/\b(1\s*lakh|1\s*lac|100000)\b/', $t) && empty($lead['budget'])) $lead['budget'] = 100000;
  if (preg_match('/\b(2\.5\s*lakh|2\.5\s*lac|250000)\b/', $t)) $lead['budget'] = 250000;

  if (preg_match('/\b(asap|urgent|this week|immediately|how fast|start now)\b/', $t)) $lead['timeline'] = 'urgent';
  elseif (preg_match('/\b(this month|30 days|1 month)\b/', $t)) $lead['timeline'] = 'month';
  elseif (preg_match('/\b(2.?3 month|quarter|90 days)\b/', $t)) $lead['timeline'] = 'quarter';

  if (preg_match('/(?:\+?91[-\s]?)?[6-9]\d{9}/', $t, $pm)) {
    $lead['phone'] = preg_replace('/\D+/', '', $pm[0]);
  }
  if (preg_match('/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i', $t, $em)) {
    $lead['email'] = $em[0];
  }

  // Convert intent (avoid treating every "WhatsApp" mention as done)
  if (preg_match('/\b(connect me|call me|whatsapp me|chat on whatsapp|let\'?s proceed|let\'?s do it|book (a )?strategy|i\'?m interested|ready to (start|go|proceed)|yes.*(whatsapp|call|book))\b/', $t)) {
    $lead['ready'] = true;
  }
  if (preg_match('/\b(price|pricing|cost|package|quote|quotation)\b/', $t)) {
    $lead['asked_pricing'] = true;
  }
  if (preg_match('/\b(catalogue|catalog|brochure)\b/', $t)) {
    $lead['want_catalogue'] = true;
  }
  if (preg_match('/\b(strategy planner|strategy tool|strategy discussion)\b/', $t)) {
    $lead['want_strategy'] = true;
  }
}

function da_chat_bot_ctas(array $cfg, array $lead): array {
  $waText = rawurlencode(
    'Hi DisplayAvenue, I chatted on the website.'
    . (!empty($lead['industry']) ? ' Industry: ' . $lead['industry'] . '.' : '')
    . (!empty($lead['interest']) ? ' Interested in: ' . $lead['interest'] . '.' : '')
    . (!empty($lead['budget']) ? ' Budget ~ ₹' . number_format((int)$lead['budget']) . '.' : '')
    . ' Please help me grow.'
  );
  $wa = $cfg['whatsapp'] . (str_contains($cfg['whatsapp'], '?') ? '&' : '?') . 'text=' . $waText;
  return [
    ['label' => 'WhatsApp now', 'href' => $wa, 'kind' => 'whatsapp'],
    ['label' => 'Strategy planner', 'href' => $cfg['strategy'], 'kind' => 'strategy'],
    ['label' => 'Get catalogue', 'href' => $cfg['catalogue'], 'kind' => 'catalogue'],
    ['label' => 'Call 9222 122333', 'href' => $cfg['phone'], 'kind' => 'call'],
  ];
}

function da_chat_bot_rules(array &$chat, string $userText, array $cfg): array {
  if (!isset($chat['lead']) || !is_array($chat['lead'])) $chat['lead'] = [];
  $lead = &$chat['lead'];
  da_chat_bot_detect($lead, $userText);

  // Sync captured phone onto visitor
  if (!empty($lead['phone'])) {
    $chat['visitor']['phone'] = $lead['phone'];
  }

  $name = (string)(($chat['visitor']['name'] ?? 'there'));
  if (strtolower($name) === 'visitor') $name = 'there';
  $ctas = da_chat_bot_ctas($cfg, $lead);
  $t = strtolower($userText);
  $alreadyConverted = (($lead['stage'] ?? '') === 'converted');

  // Post-conversion FAQs — keep helping instead of looping the same CTA
  if ($alreadyConverted) {
    if (preg_match('/\b(landing|tracking|pixel|ga4|website|seo|meta|google)\b/', $t)) {
      return [
        'text' => "Yes — DisplayAvenue handles landing pages, GA4/Ads pixel tracking, Google Ads, Meta Ads, and SEO under one team so leads don’t leak.\n\nWe’ll include setup in your onboarding. Tap WhatsApp to lock the kickoff slot.",
        'ctas' => $ctas,
        'provider' => 'rules',
        'hot' => true,
      ];
    }
    if (!empty($lead['want_catalogue']) || !empty($lead['want_strategy']) || preg_match('/\b(catalogue|catalog|strategy)\b/', $t)) {
      $lead['want_catalogue'] = false;
      $lead['want_strategy'] = false;
      return [
        'text' => "Here you go:\n• Strategy planner: {$cfg['strategy']}\n• Catalogue PDF: {$cfg['catalogue']}\n\nWhatsApp us anytime on 9222 122333 and we’ll personalize the plan for your budget.",
        'ctas' => $ctas,
        'provider' => 'rules',
        'hot' => true,
      ];
    }
    return [
      'text' => "You’re all set on our side. Prefer WhatsApp for fastest response, or open the Strategy planner while you wait — both links are below.",
      'ctas' => $ctas,
      'provider' => 'rules',
      'hot' => true,
    ];
  }

  // Explicit convert intent
  if (!empty($lead['ready'])) {
    $lead['stage'] = 'converted';
    $phone = $lead['phone'] ?? ($chat['visitor']['phone'] ?? '');
    $msg = "Perfect — let's connect on WhatsApp so our strategist can share a mini-plan"
      . ($phone ? " (we’ll use {$phone})" : ' (share your WhatsApp number if different)')
      . ".\n\nTap WhatsApp now, or generate a full channel plan in the Strategy planner.";
    return ['text' => $msg, 'ctas' => $ctas, 'provider' => 'rules', 'hot' => true];
  }

  if (!empty($lead['asked_pricing']) && empty($lead['budget'])) {
    $lead['stage'] = 'budget';
    return [
      'text' => "Happy to guide on pricing. What monthly marketing budget are you considering?\n• ₹25,000\n• ₹50,000\n• ₹1,00,000\n• ₹2,50,000+\n\nWith that I can recommend the right Google Ads / Meta / SEO mix.",
      'ctas' => array_slice($ctas, 0, 2),
      'provider' => 'rules',
      'hot' => false,
    ];
  }

  // Fill missing qualification fields in order
  if (empty($lead['goal']) && empty($lead['interest'])) {
    $lead['stage'] = 'goal';
    return [
      'text' => "Thanks {$name}. What do you want most right now?\n1) More qualified leads\n2) More sales / bookings\n3) Brand visibility\n4) Website / landing pages\n\nOr tell me if you need Google Ads, Meta Ads, or SEO.",
      'ctas' => [],
      'provider' => 'rules',
      'hot' => false,
    ];
  }

  if (empty($lead['industry'])) {
    $lead['stage'] = 'industry';
    return [
      'text' => "Got it" . (!empty($lead['interest']) ? ' — ' . str_replace('-', ' ', (string)$lead['interest']) : '') . ". Which industry is your business in? (e.g. healthcare, real estate, restaurants, education, manufacturing, ecommerce)",
      'ctas' => [],
      'provider' => 'rules',
      'hot' => false,
    ];
  }

  if (empty($lead['budget'])) {
    $lead['stage'] = 'budget';
    return [
      'text' => "Great — {$lead['industry']} is a strong fit for DisplayAvenue. What's your monthly budget range for ads + growth?\n₹25k · ₹50k · ₹1L · ₹1.5L · ₹2.5L+",
      'ctas' => [],
      'provider' => 'rules',
      'hot' => false,
    ];
  }

  // Recommend + convert
  $lead['stage'] = 'recommend';
  $interests = $lead['interests'] ?? [($lead['interest'] ?? 'google-ads')];
  $labels = [
    'google-ads' => 'Google Ads',
    'meta-ads' => 'Meta Ads',
    'seo' => 'SEO / Local SEO',
    'website' => 'Landing pages / website CRO',
    'linkedin-ads' => 'LinkedIn Ads',
    'automation' => 'WhatsApp automation',
    'analytics' => 'Tracking (GA4 + pixels)',
  ];
  $recBits = [];
  foreach ($interests as $i) {
    if (isset($labels[$i])) $recBits[] = $labels[$i];
  }
  if (!$recBits) $recBits[] = 'Google Ads + Meta + SEO mix';
  $rec = implode(' + ', array_slice($recBits, 0, 3));
  $budget = number_format((int)$lead['budget']);
  $goal = $lead['goal'] ?? 'leads';
  $speed = (($lead['timeline'] ?? '') === 'urgent')
    ? 'We can kick off within 3–5 working days after WhatsApp briefing.'
    : 'Typical kickoff is about 5–7 working days after scope confirmation.';

  $msg = "Based on what you shared ({$lead['industry']}, goal: {$goal}, ~₹{$budget}/mo), I recommend: {$rec}.\n\n"
    . "{$speed}\n\n"
    . "Next step: WhatsApp our strategist for a free mini-plan, or open the Strategy planner to generate the full channel mix.";

  return ['text' => $msg, 'ctas' => $ctas, 'provider' => 'rules', 'hot' => true];
}

function da_chat_bot_reply(array &$chat, string $userText): array {
  $cfg = da_chat_bot_config();
  // Always update lead from text first
  if (!isset($chat['lead']) || !is_array($chat['lead'])) $chat['lead'] = [];
  da_chat_bot_detect($chat['lead'], $userText);

  $llm = da_chat_bot_llm($chat, $userText, $cfg);
  if ($llm && !empty($llm['text'])) {
    $ctas = da_chat_bot_ctas($cfg, $chat['lead']);
    $hot = !empty($chat['lead']['ready']) || !empty($chat['lead']['budget']);
    // If qualification incomplete, still nudge with rules CTAs
    return [
      'text' => $llm['text'],
      'ctas' => $ctas,
      'provider' => $llm['provider'],
      'hot' => $hot,
    ];
  }

  return da_chat_bot_rules($chat, $userText, $cfg);
}

function da_chat_bot_greeting(array $chat, array $cfg): array {
  $name = (string)($chat['visitor']['name'] ?? '');
  $hi = ($name !== '' && strtolower($name) !== 'visitor') ? "Hi {$name}" : 'Hi';
  return [
    'text' => "{$hi}! I'm DA Growth AI — DisplayAvenue's assistant for Google Ads, Meta Ads, SEO, websites, and lead growth.\n\nWhat do you want help with today? (leads, sales, ads, SEO, or a website)",
    'ctas' => [
      ['label' => 'Google Ads', 'href' => '#intent:google-ads', 'kind' => 'chip'],
      ['label' => 'Meta Ads', 'href' => '#intent:meta-ads', 'kind' => 'chip'],
      ['label' => 'SEO', 'href' => '#intent:seo', 'kind' => 'chip'],
      ['label' => 'Website', 'href' => '#intent:website', 'kind' => 'chip'],
      ['label' => 'WhatsApp', 'href' => $cfg['whatsapp'] . '?text=' . rawurlencode('Hi, I want help from DisplayAvenue'), 'kind' => 'whatsapp'],
    ],
    'provider' => 'rules',
    'hot' => false,
  ];
}

function da_chat_save_lead_file(array $chat): void {
  $leadDir = __DIR__ . '/../.leads';
  if (!is_dir($leadDir)) @mkdir($leadDir, 0750, true);
  $v = $chat['visitor'] ?? [];
  $lead = $chat['lead'] ?? [];
  $row = [
    'id' => 'chatlead_' . ($chat['id'] ?? bin2hex(random_bytes(4))),
    'source' => 'live-chat-ai',
    'createdAt' => gmdate('c'),
    'name' => $v['name'] ?? '',
    'phone' => $lead['phone'] ?? ($v['phone'] ?? ''),
    'email' => $lead['email'] ?? ($v['email'] ?? ''),
    'business' => $lead['industry'] ?? '',
    'message' => json_encode([
      'goal' => $lead['goal'] ?? null,
      'interest' => $lead['interest'] ?? null,
      'budget' => $lead['budget'] ?? null,
      'timeline' => $lead['timeline'] ?? null,
      'stage' => $lead['stage'] ?? null,
      'chatId' => $chat['id'] ?? null,
    ], JSON_UNESCAPED_UNICODE),
    'hot' => !empty($lead['ready']) || !empty($lead['budget']),
  ];
  $file = $leadDir . '/' . $row['id'] . '.json';
  @file_put_contents($file, json_encode($row, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
}
