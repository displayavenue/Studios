<?php
/**
 * Growth landing lead endpoint (/growth form).
 * Saves under admin/.leads/, optional webhook, email notify.
 * No Meta CAPI secrets in frontend — configure webhook/CAPI server-side.
 */
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$host = $_SERVER['HTTP_HOST'] ?? '';
$scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
$self = $scheme . '://' . $host;
if ($origin && (str_starts_with($origin, 'https://displayavenue.com') || str_starts_with($origin, 'https://www.displayavenue.com') || $origin === $self)) {
  header('Access-Control-Allow-Origin: ' . $origin);
  header('Vary: Origin');
} else {
  header('Access-Control-Allow-Origin: ' . $self);
}
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: POST, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(204);
  exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['ok' => false, 'error' => 'POST only']);
  exit;
}

$config = require __DIR__ . '/config.php';
$contentDir = rtrim((string)$config['content_dir'], '/\\');
$contactPath = $contentDir . '/contact.json';
$growthPath = $contentDir . '/growth.json';
$contact = is_file($contactPath)
  ? (json_decode((string)file_get_contents($contactPath), true) ?: [])
  : [];
$growth = is_file($growthPath)
  ? (json_decode((string)file_get_contents($growthPath), true) ?: [])
  : [];

$raw = file_get_contents('php://input') ?: '';
$body = json_decode($raw, true);
if (!is_array($body)) {
  $body = $_POST;
}

$hp = trim((string)($body['website'] ?? ''));
if ($hp !== '') {
  echo json_encode(['ok' => true, 'saved' => true, 'duplicate' => false]);
  exit;
}

$name = trim((string)($body['name'] ?? ''));
$phone = trim((string)($body['phone'] ?? ''));
$email = trim((string)($body['email'] ?? ''));
$business = trim((string)($body['business_name'] ?? $body['business'] ?? ''));
$consent = !empty($body['consent']);

if ($name === '' || $phone === '' || $email === '' || $business === '') {
  http_response_code(400);
  echo json_encode(['ok' => false, 'error' => 'Name, business, phone and email are required']);
  exit;
}

if (!$consent) {
  http_response_code(400);
  echo json_encode(['ok' => false, 'error' => 'Consent is required']);
  exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
  http_response_code(400);
  echo json_encode(['ok' => false, 'error' => 'Invalid email']);
  exit;
}

$phoneDigits = preg_replace('/\D+/', '', $phone) ?? '';
if (strlen($phoneDigits) < 10 || strlen($phoneDigits) > 15) {
  http_response_code(400);
  echo json_encode(['ok' => false, 'error' => 'Invalid phone number']);
  exit;
}

$services = $body['services_required'] ?? [];
$current = $body['current_marketing'] ?? [];
if (!is_array($services)) $services = [];
if (!is_array($current)) $current = [];

$lead = [
  'id' => 'growth_' . date('Ymd_His') . '_' . bin2hex(random_bytes(3)),
  'created_at' => gmdate('c'),
  'name' => mb_substr($name, 0, 120),
  'business_name' => mb_substr($business, 0, 160),
  'phone' => mb_substr($phone, 0, 40),
  'email' => mb_substr($email, 0, 120),
  'industry' => mb_substr(trim((string)($body['industry'] ?? '')), 0, 80),
  'services_required' => array_values(array_slice(array_map('strval', $services), 0, 20)),
  'current_marketing' => array_values(array_slice(array_map('strval', $current), 0, 20)),
  'monthly_marketing_budget' => mb_substr(trim((string)($body['monthly_marketing_budget'] ?? '')), 0, 80),
  'selected_plan' => mb_substr(trim((string)($body['selected_plan'] ?? '')), 0, 80),
  'timeline' => mb_substr(trim((string)($body['timeline'] ?? '')), 0, 80),
  'business_description' => mb_substr(trim((string)($body['business_description'] ?? '')), 0, 4000),
  'lead_score' => (int)($body['lead_score'] ?? 0),
  'lead_temperature' => mb_substr(trim((string)($body['lead_temperature'] ?? 'NURTURE')), 0, 20),
  'first_utm_source' => mb_substr(trim((string)($body['first_utm_source'] ?? '')), 0, 120),
  'first_utm_medium' => mb_substr(trim((string)($body['first_utm_medium'] ?? '')), 0, 120),
  'first_utm_campaign' => mb_substr(trim((string)($body['first_utm_campaign'] ?? '')), 0, 160),
  'first_utm_content' => mb_substr(trim((string)($body['first_utm_content'] ?? '')), 0, 160),
  'last_utm_source' => mb_substr(trim((string)($body['last_utm_source'] ?? '')), 0, 120),
  'last_utm_medium' => mb_substr(trim((string)($body['last_utm_medium'] ?? '')), 0, 120),
  'last_utm_campaign' => mb_substr(trim((string)($body['last_utm_campaign'] ?? '')), 0, 160),
  'last_utm_content' => mb_substr(trim((string)($body['last_utm_content'] ?? '')), 0, 160),
  'fbclid' => mb_substr(trim((string)($body['fbclid'] ?? '')), 0, 240),
  'landing_page' => mb_substr(trim((string)($body['landing_page'] ?? '/growth')), 0, 160),
  'referrer' => mb_substr(trim((string)($body['referrer'] ?? '')), 0, 300),
  'device' => mb_substr(trim((string)($body['device'] ?? '')), 0, 40),
  'event_id' => mb_substr(trim((string)($body['event_id'] ?? '')), 0, 80),
  'fbp' => mb_substr(trim((string)($body['fbp'] ?? '')), 0, 200),
  'fbc' => mb_substr(trim((string)($body['fbc'] ?? '')), 0, 300),
  'page' => '/growth',
  'ip' => $_SERVER['REMOTE_ADDR'] ?? '',
  'userAgent' => substr((string)($_SERVER['HTTP_USER_AGENT'] ?? ''), 0, 240),
];

$leadsDir = __DIR__ . '/.leads';
if (!is_dir($leadsDir)) {
  @mkdir($leadsDir, 0755, true);
}
$file = $leadsDir . '/' . $lead['id'] . '.json';
$written = @file_put_contents(
  $file,
  json_encode($lead, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT)
);

$indexPath = $leadsDir . '/index.json';
$index = [];
if (is_file($indexPath)) {
  $index = json_decode((string)file_get_contents($indexPath), true) ?: [];
}
if (!is_array($index)) $index = [];
array_unshift($index, [
  'id' => $lead['id'],
  'createdAt' => $lead['created_at'],
  'name' => $lead['name'],
  'phone' => $lead['phone'],
  'email' => $lead['email'],
  'business' => $lead['business_name'],
  'page' => '/growth',
  'lead_temperature' => $lead['lead_temperature'],
  'lead_score' => $lead['lead_score'],
]);
$index = array_slice($index, 0, 500);
@file_put_contents($indexPath, json_encode($index, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));

$notify = trim((string)($contact['notifyEmail'] ?? ''));
$mailOk = false;
if ($notify !== '' && filter_var($notify, FILTER_VALIDATE_EMAIL)) {
  $subject = 'New /growth lead (' . $lead['lead_temperature'] . '): ' . $name;
  $lines = [
    'New DisplayAvenue Growth Plan request',
    '',
    'Name: ' . $lead['name'],
    'Business: ' . $lead['business_name'],
    'Phone: ' . $lead['phone'],
    'Email: ' . $lead['email'],
    'Industry: ' . $lead['industry'],
    'Services: ' . implode(', ', $lead['services_required']),
    'Current marketing: ' . implode(', ', $lead['current_marketing']),
    'Budget: ' . $lead['monthly_marketing_budget'],
    'Plan: ' . $lead['selected_plan'],
    'Timeline: ' . $lead['timeline'],
    'Score: ' . $lead['lead_score'] . ' / ' . $lead['lead_temperature'],
    'UTM first: ' . $lead['first_utm_source'] . ' / ' . $lead['first_utm_campaign'],
    'UTM last: ' . $lead['last_utm_source'] . ' / ' . $lead['last_utm_campaign'],
    '',
    $lead['business_description'],
  ];
  $headers = 'From: noreply@' . preg_replace('/^www\./', '', $host) . "\r\n" .
    'Reply-To: ' . $email . "\r\n" .
    "Content-Type: text/plain; charset=UTF-8\r\n";
  $mailOk = @mail($notify, $subject, implode("\n", $lines), $headers);
}

$webhookOk = null;
$webhookUrl = trim((string)($growth['webhookUrl'] ?? ''));
if ($webhookUrl !== '' && filter_var($webhookUrl, FILTER_VALIDATE_URL)) {
  $ch = curl_init($webhookUrl);
  if ($ch) {
    curl_setopt_array($ch, [
      CURLOPT_POST => true,
      CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
      CURLOPT_POSTFIELDS => json_encode($lead, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE),
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_TIMEOUT => 8,
    ]);
    curl_exec($ch);
    $code = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    $webhookOk = $code >= 200 && $code < 300;
  }
}

// Meta Conversions API (server-side Lead) — deduped with browser Pixel via event_id
require_once __DIR__ . '/meta-capi.php';
$capiEnabled = !empty($growth['capiEnabled']);
$capiResult = ['ok' => false, 'skipped' => true];
if ($capiEnabled) {
  $trackingPath = $contentDir . '/tracking.json';
  $tracking = is_file($trackingPath)
    ? (json_decode((string)file_get_contents($trackingPath), true) ?: [])
    : [];
  if (empty($config['meta_capi_pixel_id'])) {
    $config['meta_capi_pixel_id'] = trim((string)(
      $growth['metaPixelId']
      ?? $tracking['metaPixelId']
      ?? ''
    ));
  }
  $schemeHost = $scheme . '://' . preg_replace('/:\d+$/', '', $host);
  $sourceUrl = $schemeHost . '/growth';
  $capiResult = da_meta_capi_send_event($config, [
    'event_name' => 'Lead',
    'event_id' => $lead['event_id'] !== '' ? $lead['event_id'] : $lead['id'],
    'event_source_url' => $sourceUrl,
    'email' => $lead['email'],
    'phone' => $lead['phone'],
    'name' => $lead['name'],
    'client_ip_address' => $lead['ip'],
    'client_user_agent' => $lead['userAgent'],
    'fbp' => $lead['fbp'],
    'fbc' => $lead['fbc'],
    'fbclid' => $lead['fbclid'],
    'custom_data' => [
      'content_name' => 'growth_lead_form',
      'content_category' => $lead['industry'] !== '' ? $lead['industry'] : 'growth',
      'status' => true,
      'value' => $lead['lead_score'],
      'currency' => 'INR',
    ],
  ]);
}

echo json_encode([
  'ok' => true,
  'saved' => (bool)$written,
  'lead_id' => $lead['id'],
  'event_id' => $lead['event_id'],
  'mail' => $mailOk,
  'webhook' => $webhookOk,
  'webhook_configured' => $webhookUrl !== '',
  'capi' => [
    'enabled' => $capiEnabled,
    'ok' => !empty($capiResult['ok']),
    'skipped' => !empty($capiResult['skipped']),
    'http_code' => $capiResult['http_code'] ?? null,
    'error' => $capiResult['error'] ?? null,
  ],
]);
