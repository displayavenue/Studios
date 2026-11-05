<?php
/**
 * DisplayAvenue lead automation — email / WhatsApp / SMS + visit journey helpers.
 */
declare(strict_types=1);

function da_automation_content_path(): string {
  static $path = null;
  if ($path !== null) return $path;
  $config = require __DIR__ . '/../config.php';
  $path = rtrim((string)$config['content_dir'], '/\\') . '/automation.json';
  return $path;
}

function da_automation_settings(): array {
  $defaults = [
    'enabled' => true,
    'notifyEmail' => 'info@displayavenue.com',
    'ownerName' => 'DisplayAvenue',
    'channels' => ['email' => true, 'whatsapp' => true, 'sms' => false],
    'events' => ['contactForm' => true, 'chatHotLead' => true, 'trackPageviews' => true],
    'messagePrefix' => '[DA Lead]',
    'includeJourney' => true,
  ];
  $path = da_automation_content_path();
  if (!is_file($path)) return $defaults;
  $data = json_decode((string)file_get_contents($path), true);
  if (!is_array($data)) return $defaults;
  return array_replace_recursive($defaults, $data);
}

function da_automation_secrets(): array {
  $file = __DIR__ . '/../automation-local.php';
  if (!is_file($file)) return [];
  $data = include $file;
  return is_array($data) ? $data : [];
}

function da_automation_channel_status(): array {
  $s = da_automation_secrets();
  $wa = (string)($s['whatsapp_provider'] ?? '');
  $sms = (string)($s['sms_provider'] ?? '');
  $waReady = false;
  if ($wa === 'callmebot') {
    $waReady = trim((string)($s['callmebot_apikey'] ?? '')) !== '' && trim((string)($s['whatsapp_phone'] ?? '')) !== '';
  } elseif ($wa === 'meta') {
    $waReady = trim((string)($s['meta_token'] ?? '')) !== '' && trim((string)($s['meta_phone_number_id'] ?? '')) !== '' && trim((string)($s['whatsapp_phone'] ?? '')) !== '';
  } elseif ($wa === 'webhook') {
    $waReady = trim((string)($s['whatsapp_webhook_url'] ?? '')) !== '';
  }
  $smsReady = false;
  if ($sms === 'msg91') {
    $smsReady = trim((string)($s['msg91_authkey'] ?? '')) !== '' && trim((string)($s['sms_phone'] ?? '')) !== '';
  } elseif ($sms === 'twilio') {
    $smsReady = trim((string)($s['twilio_sid'] ?? '')) !== '' && trim((string)($s['twilio_token'] ?? '')) !== '' && trim((string)($s['twilio_from'] ?? '')) !== '';
  } elseif ($sms === 'webhook') {
    $smsReady = trim((string)($s['sms_webhook_url'] ?? '')) !== '';
  }
  return [
    'localFile' => is_file(__DIR__ . '/../automation-local.php'),
    'whatsappProvider' => $wa,
    'whatsappReady' => $waReady,
    'smsProvider' => $sms,
    'smsReady' => $smsReady,
  ];
}

function da_automation_log(array $entry): void {
  $dir = __DIR__ . '/../.automation-log';
  if (!is_dir($dir)) @mkdir($dir, 0755, true);
  $entry['id'] = $entry['id'] ?? ('auto_' . date('Ymd_His') . '_' . bin2hex(random_bytes(2)));
  $entry['at'] = $entry['at'] ?? gmdate('c');
  @file_put_contents(
    $dir . '/' . $entry['id'] . '.json',
    json_encode($entry, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT)
  );
  $indexPath = $dir . '/index.json';
  $index = [];
  if (is_file($indexPath)) {
    $index = json_decode((string)file_get_contents($indexPath), true) ?: [];
  }
  if (!is_array($index)) $index = [];
  array_unshift($index, [
    'id' => $entry['id'],
    'at' => $entry['at'],
    'event' => $entry['event'] ?? '',
    'ok' => !empty($entry['ok']),
    'channels' => $entry['channels'] ?? [],
    'summary' => substr((string)($entry['summary'] ?? ''), 0, 160),
  ]);
  $index = array_slice($index, 0, 200);
  @file_put_contents($indexPath, json_encode($index, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
}

function da_automation_http(string $method, string $url, array $opts = []): array {
  $headers = $opts['headers'] ?? [];
  $body = $opts['body'] ?? null;
  if (function_exists('curl_init')) {
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, strtoupper($method));
    curl_setopt($ch, CURLOPT_TIMEOUT, 12);
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 6);
    if ($headers) curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    if ($body !== null) curl_setopt($ch, CURLOPT_POSTFIELDS, $body);
    $raw = curl_exec($ch);
    $code = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $err = curl_error($ch);
    curl_close($ch);
    return ['ok' => $raw !== false && $code >= 200 && $code < 300, 'status' => $code, 'body' => (string)$raw, 'error' => $err];
  }
  $headerStr = implode("\r\n", $headers);
  $ctx = stream_context_create([
    'http' => [
      'method' => strtoupper($method),
      'header' => $headerStr,
      'content' => $body ?? '',
      'timeout' => 12,
      'ignore_errors' => true,
    ],
  ]);
  $raw = @file_get_contents($url, false, $ctx);
  $code = 0;
  if (isset($http_response_header[0]) && preg_match('/\s(\d{3})\s/', $http_response_header[0], $m)) {
    $code = (int)$m[1];
  }
  return ['ok' => $raw !== false && $code >= 200 && $code < 300, 'status' => $code, 'body' => (string)$raw, 'error' => $raw === false ? 'request failed' : ''];
}

function da_automation_digits(string $phone): string {
  return preg_replace('/\D+/', '', $phone) ?? '';
}

function da_visits_dir(): string {
  return __DIR__ . '/../.visits';
}

function da_visit_load(string $visitorId): ?array {
  $visitorId = preg_replace('/[^a-zA-Z0-9_\-]/', '', $visitorId) ?? '';
  if ($visitorId === '' || strlen($visitorId) > 64) return null;
  $file = da_visits_dir() . '/' . $visitorId . '.json';
  if (!is_file($file)) return null;
  $data = json_decode((string)file_get_contents($file), true);
  return is_array($data) ? $data : null;
}

function da_visit_save(array $visit): bool {
  $id = (string)($visit['id'] ?? '');
  $id = preg_replace('/[^a-zA-Z0-9_\-]/', '', $id) ?? '';
  if ($id === '') return false;
  $dir = da_visits_dir();
  if (!is_dir($dir)) @mkdir($dir, 0755, true);
  $visit['id'] = $id;
  $visit['updatedAt'] = gmdate('c');
  $ok = @file_put_contents(
    $dir . '/' . $id . '.json',
    json_encode($visit, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT)
  );
  $indexPath = $dir . '/index.json';
  $index = [];
  if (is_file($indexPath)) {
    $index = json_decode((string)file_get_contents($indexPath), true) ?: [];
  }
  if (!is_array($index)) $index = [];
  $pages = $visit['pages'] ?? [];
  $lastPath = is_array($pages) && $pages ? (string)($pages[count($pages) - 1]['path'] ?? '/') : '/';
  $row = [
    'id' => $id,
    'updatedAt' => $visit['updatedAt'],
    'pageCount' => is_array($pages) ? count($pages) : 0,
    'lastPath' => $lastPath,
    'landing' => (string)($visit['landing'] ?? '/'),
    'converted' => !empty($visit['converted']),
  ];
  $index = array_values(array_filter($index, fn($r) => !is_array($r) || ($r['id'] ?? '') !== $id));
  array_unshift($index, $row);
  $index = array_slice($index, 0, 800);
  @file_put_contents($indexPath, json_encode($index, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
  return (bool)$ok;
}

function da_visit_track(string $visitorId, string $path, array $meta = []): ?array {
  $visitorId = preg_replace('/[^a-zA-Z0-9_\-]/', '', $visitorId) ?? '';
  if ($visitorId === '') return null;
  $path = substr(trim($path) ?: '/', 0, 240);
  $visit = da_visit_load($visitorId) ?: [
    'id' => $visitorId,
    'createdAt' => gmdate('c'),
    'landing' => $path,
    'referrer' => substr((string)($meta['referrer'] ?? ''), 0, 400),
    'utm' => is_array($meta['utm'] ?? null) ? $meta['utm'] : [],
    'pages' => [],
    'converted' => false,
  ];
  if (empty($visit['utm']) && !empty($meta['utm']) && is_array($meta['utm'])) {
    $visit['utm'] = $meta['utm'];
  }
  if (empty($visit['referrer']) && !empty($meta['referrer'])) {
    $visit['referrer'] = substr((string)$meta['referrer'], 0, 400);
  }
  $pages = is_array($visit['pages'] ?? null) ? $visit['pages'] : [];
  $last = $pages ? ($pages[count($pages) - 1]['path'] ?? '') : '';
  if ($last !== $path) {
    $pages[] = [
      'path' => $path,
      'title' => substr((string)($meta['title'] ?? ''), 0, 160),
      'at' => gmdate('c'),
    ];
    if (count($pages) > 60) $pages = array_slice($pages, -60);
    $visit['pages'] = $pages;
  }
  $visit['ip'] = substr((string)($_SERVER['REMOTE_ADDR'] ?? ''), 0, 64);
  $visit['ua'] = substr((string)($_SERVER['HTTP_USER_AGENT'] ?? ''), 0, 200);
  da_visit_save($visit);
  return $visit;
}

function da_visit_mark_converted(string $visitorId, string $leadId): void {
  $visit = da_visit_load($visitorId);
  if (!$visit) return;
  $visit['converted'] = true;
  $visit['leadId'] = $leadId;
  $visit['convertedAt'] = gmdate('c');
  da_visit_save($visit);
}

function da_visit_journey_text(?array $visit): string {
  if (!$visit) return '';
  $pages = $visit['pages'] ?? [];
  if (!is_array($pages) || !$pages) return '';
  $paths = array_map(fn($p) => (string)($p['path'] ?? ''), $pages);
  $paths = array_values(array_filter($paths));
  if (!$paths) return '';
  $line = 'Journey: ' . implode(' → ', array_slice($paths, -12));
  $utm = $visit['utm'] ?? [];
  if (is_array($utm) && $utm) {
    $bits = [];
    foreach (['utm_source', 'utm_medium', 'utm_campaign'] as $k) {
      if (!empty($utm[$k])) $bits[] = $k . '=' . $utm[$k];
    }
    if ($bits) $line .= "\nUTM: " . implode(' ', $bits);
  }
  if (!empty($visit['referrer'])) $line .= "\nReferrer: " . $visit['referrer'];
  if (!empty($visit['landing'])) $line .= "\nLanding: " . $visit['landing'];
  return $line;
}

function da_automation_send_email(string $to, string $subject, string $body): array {
  if ($to === '' || !filter_var($to, FILTER_VALIDATE_EMAIL)) {
    return ['ok' => false, 'error' => 'invalid email'];
  }
  $headers = "From: noreply@displayavenue.com\r\nContent-Type: text/plain; charset=UTF-8";
  $ok = @mail($to, $subject, $body, $headers);
  return ['ok' => (bool)$ok, 'error' => $ok ? '' : 'mail() failed'];
}

function da_automation_send_whatsapp(string $text): array {
  $s = da_automation_secrets();
  $provider = (string)($s['whatsapp_provider'] ?? '');
  $phone = da_automation_digits((string)($s['whatsapp_phone'] ?? ''));
  if ($provider === '') return ['ok' => false, 'skipped' => true, 'error' => 'whatsapp provider not set'];

  if ($provider === 'callmebot') {
    $key = trim((string)($s['callmebot_apikey'] ?? ''));
    if ($key === '' || $phone === '') return ['ok' => false, 'error' => 'callmebot not configured'];
    $url = 'https://api.callmebot.com/whatsapp.php?' . http_build_query([
      'phone' => $phone,
      'text' => $text,
      'apikey' => $key,
    ]);
    $res = da_automation_http('GET', $url);
    return ['ok' => $res['ok'], 'provider' => 'callmebot', 'status' => $res['status'], 'error' => $res['ok'] ? '' : ($res['error'] ?: substr($res['body'], 0, 200))];
  }

  if ($provider === 'meta') {
    $token = trim((string)($s['meta_token'] ?? ''));
    $phoneId = trim((string)($s['meta_phone_number_id'] ?? ''));
    if ($token === '' || $phoneId === '' || $phone === '') return ['ok' => false, 'error' => 'meta not configured'];
    $tpl = trim((string)($s['meta_template_name'] ?? ''));
    if ($tpl !== '') {
      $payload = [
        'messaging_product' => 'whatsapp',
        'to' => $phone,
        'type' => 'template',
        'template' => [
          'name' => $tpl,
          'language' => ['code' => (string)($s['meta_template_lang'] ?? 'en')],
          'components' => [[
            'type' => 'body',
            'parameters' => [['type' => 'text', 'text' => substr($text, 0, 900)]],
          ]],
        ],
      ];
    } else {
      $payload = [
        'messaging_product' => 'whatsapp',
        'to' => $phone,
        'type' => 'text',
        'text' => ['body' => substr($text, 0, 3500)],
      ];
    }
    $res = da_automation_http('POST', 'https://graph.facebook.com/v19.0/' . rawurlencode($phoneId) . '/messages', [
      'headers' => [
        'Authorization: Bearer ' . $token,
        'Content-Type: application/json',
      ],
      'body' => json_encode($payload),
    ]);
    return ['ok' => $res['ok'], 'provider' => 'meta', 'status' => $res['status'], 'error' => $res['ok'] ? '' : ($res['error'] ?: substr($res['body'], 0, 240))];
  }

  if ($provider === 'webhook') {
    $url = trim((string)($s['whatsapp_webhook_url'] ?? ''));
    if ($url === '') return ['ok' => false, 'error' => 'whatsapp webhook missing'];
    $headers = ['Content-Type: application/json'];
    $token = trim((string)($s['whatsapp_webhook_token'] ?? ''));
    if ($token !== '') $headers[] = 'Authorization: Bearer ' . $token;
    $res = da_automation_http('POST', $url, [
      'headers' => $headers,
      'body' => json_encode(['phone' => $phone, 'text' => $text, 'source' => 'displayavenue']),
    ]);
    return ['ok' => $res['ok'], 'provider' => 'webhook', 'status' => $res['status'], 'error' => $res['ok'] ? '' : ($res['error'] ?: substr($res['body'], 0, 200))];
  }

  return ['ok' => false, 'error' => 'unknown whatsapp provider'];
}

function da_automation_send_sms(string $text): array {
  $s = da_automation_secrets();
  $provider = (string)($s['sms_provider'] ?? '');
  $phone = da_automation_digits((string)($s['sms_phone'] ?? ''));
  if ($provider === '') return ['ok' => false, 'skipped' => true, 'error' => 'sms provider not set'];
  $short = substr(preg_replace("/\s+/", ' ', $text) ?? $text, 0, 300);

  if ($provider === 'msg91') {
    $auth = trim((string)($s['msg91_authkey'] ?? ''));
    if ($auth === '' || $phone === '') return ['ok' => false, 'error' => 'msg91 not configured'];
    $tpl = trim((string)($s['msg91_template_id'] ?? ''));
    if ($tpl !== '') {
      $payload = [
        'template_id' => $tpl,
        'short_url' => '0',
        'recipients' => [[
          'mobiles' => $phone,
          'var' => $short,
        ]],
      ];
      $res = da_automation_http('POST', 'https://control.msg91.com/api/v5/flow', [
        'headers' => [
          'authkey: ' . $auth,
          'Content-Type: application/json',
          'accept: application/json',
        ],
        'body' => json_encode($payload),
      ]);
    } else {
      $url = 'https://api.msg91.com/api/sendhttp.php?' . http_build_query([
        'authkey' => $auth,
        'mobiles' => $phone,
        'message' => $short,
        'sender' => (string)($s['msg91_sender'] ?? 'DISPAY'),
        'route' => '4',
        'country' => '91',
      ]);
      $res = da_automation_http('GET', $url);
    }
    return ['ok' => $res['ok'], 'provider' => 'msg91', 'status' => $res['status'], 'error' => $res['ok'] ? '' : ($res['error'] ?: substr($res['body'], 0, 200))];
  }

  if ($provider === 'twilio') {
    $sid = trim((string)($s['twilio_sid'] ?? ''));
    $token = trim((string)($s['twilio_token'] ?? ''));
    $from = trim((string)($s['twilio_from'] ?? ''));
    if ($sid === '' || $token === '' || $from === '' || $phone === '') return ['ok' => false, 'error' => 'twilio not configured'];
    $to = str_starts_with($phone, '+') ? $phone : ('+' . $phone);
    $res = da_automation_http('POST', 'https://api.twilio.com/2010-04-01/Accounts/' . rawurlencode($sid) . '/Messages.json', [
      'headers' => [
        'Authorization: Basic ' . base64_encode($sid . ':' . $token),
        'Content-Type: application/x-www-form-urlencoded',
      ],
      'body' => http_build_query(['To' => $to, 'From' => $from, 'Body' => $short]),
    ]);
    return ['ok' => $res['ok'], 'provider' => 'twilio', 'status' => $res['status'], 'error' => $res['ok'] ? '' : ($res['error'] ?: substr($res['body'], 0, 200))];
  }

  if ($provider === 'webhook') {
    $url = trim((string)($s['sms_webhook_url'] ?? ''));
    if ($url === '') return ['ok' => false, 'error' => 'sms webhook missing'];
    $res = da_automation_http('POST', $url, [
      'headers' => ['Content-Type: application/json'],
      'body' => json_encode(['phone' => $phone, 'text' => $short, 'source' => 'displayavenue']),
    ]);
    return ['ok' => $res['ok'], 'provider' => 'webhook', 'status' => $res['status'], 'error' => $res['ok'] ? '' : ($res['error'] ?: substr($res['body'], 0, 200))];
  }

  return ['ok' => false, 'error' => 'unknown sms provider'];
}

/**
 * Notify owner about a lead event across enabled channels.
 *
 * @param array{event:string,subject?:string,text:string,summary?:string,visitorId?:string,leadId?:string} $payload
 */
function da_automation_notify(array $payload): array {
  $settings = da_automation_settings();
  $event = (string)($payload['event'] ?? 'lead');
  $text = trim((string)($payload['text'] ?? ''));
  $subject = (string)($payload['subject'] ?? ('DisplayAvenue lead: ' . $event));
  $summary = (string)($payload['summary'] ?? substr($text, 0, 120));

  if (empty($settings['enabled'])) {
    $result = ['ok' => false, 'skipped' => true, 'reason' => 'automation disabled', 'channels' => []];
    da_automation_log(['event' => $event, 'ok' => false, 'summary' => $summary, 'channels' => $result['channels'], 'detail' => $result]);
    return $result;
  }

  $events = $settings['events'] ?? [];
  $eventKey = match ($event) {
    'contact_form' => 'contactForm',
    'chat_hot_lead' => 'chatHotLead',
    'test' => 'contactForm',
    default => $event,
  };
  if ($event !== 'test' && isset($events[$eventKey]) && empty($events[$eventKey])) {
    $result = ['ok' => false, 'skipped' => true, 'reason' => 'event disabled', 'channels' => []];
    da_automation_log(['event' => $event, 'ok' => false, 'summary' => $summary, 'channels' => [], 'detail' => $result]);
    return $result;
  }

  if (!empty($settings['includeJourney']) && !empty($payload['visitorId'])) {
    $journey = da_visit_journey_text(da_visit_load((string)$payload['visitorId']));
    if ($journey !== '') $text .= "\n\n" . $journey;
  }

  $prefix = trim((string)($settings['messagePrefix'] ?? ''));
  $waText = $prefix !== '' ? ($prefix . "\n" . $text) : $text;
  $channelsCfg = $settings['channels'] ?? [];
  $channelResults = [];

  if (!empty($channelsCfg['email'])) {
    $to = trim((string)($settings['notifyEmail'] ?? ''));
    $channelResults['email'] = da_automation_send_email($to, $subject, $text . "\n\n— DisplayAvenue automation");
  }
  if (!empty($channelsCfg['whatsapp'])) {
    $channelResults['whatsapp'] = da_automation_send_whatsapp($waText);
  }
  if (!empty($channelsCfg['sms'])) {
    $channelResults['sms'] = da_automation_send_sms($waText);
  }

  $anyOk = false;
  foreach ($channelResults as $r) {
    if (!empty($r['ok'])) $anyOk = true;
  }
  $result = [
    'ok' => $anyOk,
    'channels' => $channelResults,
    'event' => $event,
  ];
  da_automation_log([
    'event' => $event,
    'ok' => $anyOk,
    'summary' => $summary,
    'channels' => array_map(fn($r) => [
      'ok' => !empty($r['ok']),
      'skipped' => !empty($r['skipped']),
      'error' => (string)($r['error'] ?? ''),
      'provider' => (string)($r['provider'] ?? ''),
    ], $channelResults),
    'leadId' => $payload['leadId'] ?? null,
    'visitorId' => $payload['visitorId'] ?? null,
  ]);
  return $result;
}
