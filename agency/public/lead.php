<?php
/**
 * Public lead / contact form endpoint.
 * Saves to admin/data/leads.json and emails info@displayavenue.com.
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

function lead_respond(int $code, array $payload): void {
  http_response_code($code);
  echo json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
  exit;
}

function lead_client_ip(): string {
  return (string)($_SERVER['REMOTE_ADDR'] ?? '0.0.0.0');
}

function lead_rate_limited(): bool {
  $ip = lead_client_ip();
  $path = sys_get_temp_dir() . '/da_lead_' . hash('sha256', $ip) . '.json';
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
  return $state['count'] > 12;
}

if (lead_rate_limited()) {
  lead_respond(429, ['ok' => false, 'error' => 'Too many submissions. Please try again later.']);
}

$raw = file_get_contents('php://input') ?: '';
$body = json_decode($raw, true);
if (!is_array($body)) {
  // Also accept classic form posts
  $body = $_POST;
}

// Honeypot — bots fill this; humans never see it
if (trim((string)($body['website'] ?? $body['company_url'] ?? '')) !== '') {
  lead_respond(200, ['ok' => true, 'saved' => true]); // fake success
}

$name = trim((string)($body['name'] ?? ''));
$email = trim((string)($body['email'] ?? ''));
$phone = trim((string)($body['phone'] ?? ''));
$message = trim((string)($body['message'] ?? ''));
$source = trim((string)($body['source'] ?? 'contact'));
$page = trim((string)($body['page'] ?? ''));

$allowedSources = ['contact', 'newsletter', 'proposal', 'consultation', 'landing', 'other'];
if (!in_array($source, $allowedSources, true)) {
  $source = 'other';
}

if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
  lead_respond(400, ['ok' => false, 'error' => 'A valid email is required']);
}

if ($source === 'newsletter') {
  if ($name === '') $name = 'Newsletter subscriber';
  if ($message === '') $message = 'Subscribed to growth insights / resources newsletter.';
} else {
  if ($name === '') {
    lead_respond(400, ['ok' => false, 'error' => 'Name is required']);
  }
}

$name = mb_substr($name, 0, 120);
$email = mb_substr($email, 0, 180);
$phone = mb_substr($phone, 0, 40);
$message = mb_substr($message, 0, 5000);
$page = mb_substr($page, 0, 300);

$config = require __DIR__ . '/admin/config.php';
require_once __DIR__ . '/admin/mail-log.php';
$notifyTo = (string)($config['notify_email'] ?? 'info@displayavenue.com');
$dataDir = dirname((string)($config['leads_file'] ?? (__DIR__ . '/admin/data/leads.json')));
if (!is_dir($dataDir)) {
  @mkdir($dataDir, 0750, true);
}
$leadsFile = (string)($config['leads_file'] ?? ($dataDir . '/leads.json'));

$store = ['items' => []];
if (is_file($leadsFile)) {
  $existing = json_decode((string)file_get_contents($leadsFile), true);
  if (is_array($existing) && isset($existing['items']) && is_array($existing['items'])) {
    $store = $existing;
  }
}

$lead = [
  'id' => bin2hex(random_bytes(8)),
  'createdAt' => gmdate('c'),
  'status' => 'new',
  'source' => $source,
  'name' => $name,
  'email' => $email,
  'phone' => $phone,
  'message' => $message,
  'page' => $page !== '' ? $page : ((string)($_SERVER['HTTP_REFERER'] ?? '')),
  'landingSlug' => mb_substr(trim((string)($body['landingSlug'] ?? '')), 0, 120),
  'packageId' => mb_substr(trim((string)($body['packageId'] ?? '')), 0, 80),
  'utmSource' => mb_substr(trim((string)($body['utmSource'] ?? '')), 0, 80),
  'utmMedium' => mb_substr(trim((string)($body['utmMedium'] ?? '')), 0, 80),
  'utmCampaign' => mb_substr(trim((string)($body['utmCampaign'] ?? '')), 0, 120),
  'utmContent' => mb_substr(trim((string)($body['utmContent'] ?? '')), 0, 120),
  'utmTerm' => mb_substr(trim((string)($body['utmTerm'] ?? '')), 0, 120),
  'gclid' => mb_substr(trim((string)($body['gclid'] ?? '')), 0, 120),
  'fbclid' => mb_substr(trim((string)($body['fbclid'] ?? '')), 0, 120),
  'ip' => lead_client_ip(),
  'userAgent' => mb_substr((string)($_SERVER['HTTP_USER_AGENT'] ?? ''), 0, 250),
  'emailed' => false,
  'mailId' => null,
];

array_unshift($store['items'], $lead);
// Keep last 2000 leads
if (count($store['items']) > 2000) {
  $store['items'] = array_slice($store['items'], 0, 2000);
}
$store['updatedAt'] = gmdate('c');

$json = json_encode($store, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
$tmp = $leadsFile . '.tmp';
if (@file_put_contents($tmp, $json . "\n") === false || !@rename($tmp, $leadsFile)) {
  lead_respond(500, ['ok' => false, 'error' => 'Could not save your request. Please email info@displayavenue.com']);
}

$subjectSource = [
  'contact' => 'New contact / proposal request',
  'newsletter' => 'New newsletter subscription',
  'proposal' => 'New proposal request',
  'consultation' => 'New consultation request',
  'landing' => 'New landing page lead',
  'other' => 'New website lead',
][$source] ?? 'New website lead';

$subject = '[DisplayAvenue] ' . $subjectSource . ' — ' . $name;
$bodyText = "New lead from displayavenue.com\n\n"
  . "Source: {$source}\n"
  . "Landing: " . (($lead['landingSlug'] ?? '') !== '' ? $lead['landingSlug'] : '—') . "\n"
  . "Package: " . (($lead['packageId'] ?? '') !== '' ? $lead['packageId'] : '—') . "\n"
  . "UTM: " . trim(($lead['utmSource'] ?? '') . ' / ' . ($lead['utmMedium'] ?? '') . ' / ' . ($lead['utmCampaign'] ?? ''), ' /') . "\n"
  . "Name: {$name}\n"
  . "Email: {$email}\n"
  . "Phone: " . ($phone !== '' ? $phone : '—') . "\n"
  . "Page: " . ($lead['page'] !== '' ? $lead['page'] : '—') . "\n"
  . "Time (UTC): {$lead['createdAt']}\n"
  . "Lead ID: {$lead['id']}\n\n"
  . "Message:\n" . ($message !== '' ? $message : '—') . "\n\n"
  . "View in CMS: https://displayavenue.com/admin/\n";

$headers = [
  'MIME-Version: 1.0',
  'Content-Type: text/plain; charset=UTF-8',
  'From: DisplayAvenue Website <noreply@displayavenue.com>',
  'Reply-To: ' . $name . ' <' . $email . '>',
  'X-Mailer: DisplayAvenue-LeadForm',
];

$mailResult = da_send_tracked_mail($config, [
  'to' => $notifyTo,
  'subject' => $subject,
  'body' => $bodyText,
  'headers' => $headers,
  'type' => 'lead-notify',
  'meta' => [
    'leadId' => $lead['id'],
    'source' => $source,
    'visitorEmail' => $email,
  ],
]);

// Persist emailed status on the lead
$store = ['items' => []];
if (is_file($leadsFile)) {
  $existing = json_decode((string)file_get_contents($leadsFile), true);
  if (is_array($existing) && isset($existing['items']) && is_array($existing['items'])) {
    $store = $existing;
  }
}
foreach ($store['items'] as &$item) {
  if (($item['id'] ?? '') === $lead['id']) {
    $item['emailed'] = (bool)$mailResult['ok'];
    $item['mailId'] = $mailResult['id'] ?? null;
    $item['emailedAt'] = $mailResult['at'] ?? gmdate('c');
    break;
  }
}
unset($item);
$store['updatedAt'] = gmdate('c');
@file_put_contents(
  $leadsFile,
  json_encode($store, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT) . "\n"
);

$stats = da_mail_stats($config);

lead_respond(200, [
  'ok' => true,
  'saved' => true,
  'emailed' => (bool)$mailResult['ok'],
  'mailId' => $mailResult['id'] ?? null,
  'id' => $lead['id'],
  'mailStats' => [
    'sent' => $stats['sent'],
    'failed' => $stats['failed'],
    'attempted' => $stats['attempted'],
  ],
]);
