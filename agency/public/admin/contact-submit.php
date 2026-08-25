<?php
/**
 * Public contact form endpoint (no auth).
 * Saves leads under admin/.leads/ and emails notifyEmail when mail() is available.
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
$contact = is_file($contactPath)
  ? (json_decode((string)file_get_contents($contactPath), true) ?: [])
  : [];

$raw = file_get_contents('php://input') ?: '';
$body = json_decode($raw, true);
if (!is_array($body)) {
  $body = $_POST;
}

$name = trim((string)($body['name'] ?? ''));
$phone = trim((string)($body['phone'] ?? ''));
$email = trim((string)($body['email'] ?? ''));
$business = trim((string)($body['business'] ?? ''));
$city = trim((string)($body['city'] ?? ''));
$interest = trim((string)($body['interest'] ?? ''));
$message = trim((string)($body['message'] ?? ''));
$hp = trim((string)($body['website'] ?? '')); // honeypot

$tags = [];
if (!empty($body['tags']) && is_array($body['tags'])) {
  foreach ($body['tags'] as $tag) {
    $t = trim((string)$tag);
    if ($t !== '' && strlen($t) <= 80) $tags[] = $t;
  }
}
if ($city !== '' && !in_array($city, $tags, true)) $tags[] = $city;
if ($interest !== '' && !in_array($interest, $tags, true)) $tags[] = $interest;
$tags = array_values(array_unique(array_slice($tags, 0, 12)));

if ($hp !== '') {
  echo json_encode(['ok' => true, 'saved' => true]);
  exit;
}

if ($name === '' || $phone === '') {
  http_response_code(400);
  echo json_encode(['ok' => false, 'error' => 'Name and phone are required']);
  exit;
}

if (strlen($name) > 120 || strlen($phone) > 40 || strlen($email) > 120 || strlen($business) > 160 || strlen($city) > 80 || strlen($interest) > 120 || strlen($message) > 4000) {
  http_response_code(400);
  echo json_encode(['ok' => false, 'error' => 'Input too long']);
  exit;
}

require_once __DIR__ . '/lib/automation.php';

$visitorId = preg_replace('/[^a-zA-Z0-9_\-]/', '', (string)($body['visitorId'] ?? '')) ?? '';
$utm = [];
if (!empty($body['utm']) && is_array($body['utm'])) {
  foreach (['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'] as $k) {
    if (!empty($body['utm'][$k])) $utm[$k] = substr(trim((string)$body['utm'][$k]), 0, 120);
  }
}
$visit = $visitorId !== '' ? da_visit_load($visitorId) : null;
$journey = da_visit_journey_text($visit);

$lead = [
  'id' => 'lead_' . date('Ymd_His') . '_' . bin2hex(random_bytes(3)),
  'createdAt' => gmdate('c'),
  'name' => $name,
  'phone' => $phone,
  'email' => $email,
  'business' => $business,
  'city' => $city,
  'interest' => $interest,
  'tags' => $tags,
  'message' => $message,
  'ip' => $_SERVER['REMOTE_ADDR'] ?? '',
  'userAgent' => substr((string)($_SERVER['HTTP_USER_AGENT'] ?? ''), 0, 240),
  'page' => (string)($body['page'] ?? '/contact'),
  'visitorId' => $visitorId,
  'utm' => $utm,
  'journey' => $journey,
  'landing' => is_array($visit) ? (string)($visit['landing'] ?? '') : '',
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

// Append index (newest first, cap 500)
$indexPath = $leadsDir . '/index.json';
$index = [];
if (is_file($indexPath)) {
  $index = json_decode((string)file_get_contents($indexPath), true) ?: [];
}
if (!is_array($index)) $index = [];
array_unshift($index, [
  'id' => $lead['id'],
  'createdAt' => $lead['createdAt'],
  'name' => $lead['name'],
  'phone' => $lead['phone'],
  'email' => $lead['email'],
  'business' => $lead['business'],
  'city' => $city,
  'interest' => $interest,
  'tags' => $tags,
  'visitorId' => $visitorId,
  'page' => $lead['page'],
]);
$index = array_slice($index, 0, 500);
@file_put_contents($indexPath, json_encode($index, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));

if ($visitorId !== '') {
  da_visit_mark_converted($visitorId, $lead['id']);
}

$autoSettings = da_automation_settings();
$notify = trim((string)($autoSettings['notifyEmail'] ?? ''));
if ($notify === '') {
  $notify = trim((string)($contact['notifyEmail'] ?? ''));
}

$lines = [
  'New contact form submission on displayavenue.com',
  '',
  'Name: ' . $name,
  'Phone: ' . $phone,
  'Email: ' . ($email !== '' ? $email : '(not provided)'),
  'Business: ' . ($business !== '' ? $business : '(not provided)'),
  'City: ' . ($city !== '' ? $city : '(not provided)'),
  'Interest: ' . ($interest !== '' ? $interest : '(not provided)'),
  'Tags: ' . ($tags ? implode(', ', $tags) : '(none)'),
  'Message:',
  $message !== '' ? $message : '(empty)',
  '',
  'Submitted: ' . $lead['createdAt'],
  'Page: ' . $lead['page'],
];
if ($journey !== '') $lines[] = $journey;
$lines[] = '';
$lines[] = 'Admin: https://displayavenue.com/admin/';

$notifyText = implode("\n", $lines);
$auto = da_automation_notify([
  'event' => 'contact_form',
  'subject' => 'New DisplayAvenue lead: ' . $name,
  'text' => $notifyText,
  'summary' => $name . ' · ' . $phone,
  'visitorId' => $visitorId,
  'leadId' => $lead['id'],
]);

// Legacy mail fallback if automation email channel off / failed
$mailOk = !empty($auto['channels']['email']['ok']);
if (!$mailOk && $notify !== '' && filter_var($notify, FILTER_VALIDATE_EMAIL)) {
  $headers = 'From: noreply@displayavenue.com' . "\r\n" .
    'Reply-To: ' . ($email !== '' && filter_var($email, FILTER_VALIDATE_EMAIL) ? $email : $notify) . "\r\n" .
    'Content-Type: text/plain; charset=UTF-8';
  $mailOk = @mail($notify, 'New DisplayAvenue lead: ' . $name, $notifyText, $headers);
}

echo json_encode([
  'ok' => true,
  'saved' => (bool)$written,
  'emailed' => $mailOk,
  'notified' => [
    'ok' => !empty($auto['ok']),
    'whatsapp' => !empty($auto['channels']['whatsapp']['ok']),
    'sms' => !empty($auto['channels']['sms']['ok']),
    'email' => $mailOk,
  ],
  'successTitle' => $contact['successTitle'] ?? 'Thanks - we got your message',
  'successMessage' => $contact['successMessage'] ?? 'Our team will reply soon.',
], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
