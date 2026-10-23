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
$message = trim((string)($body['message'] ?? ''));
$hp = trim((string)($body['website'] ?? '')); // honeypot

if ($hp !== '') {
  echo json_encode(['ok' => true, 'saved' => true]);
  exit;
}

if ($name === '' || $phone === '') {
  http_response_code(400);
  echo json_encode(['ok' => false, 'error' => 'Name and phone are required']);
  exit;
}

if (strlen($name) > 120 || strlen($phone) > 40 || strlen($email) > 120 || strlen($business) > 160 || strlen($message) > 4000) {
  http_response_code(400);
  echo json_encode(['ok' => false, 'error' => 'Input too long']);
  exit;
}

$lead = [
  'id' => 'lead_' . date('Ymd_His') . '_' . bin2hex(random_bytes(3)),
  'createdAt' => gmdate('c'),
  'name' => $name,
  'phone' => $phone,
  'email' => $email,
  'business' => $business,
  'message' => $message,
  'ip' => $_SERVER['REMOTE_ADDR'] ?? '',
  'userAgent' => substr((string)($_SERVER['HTTP_USER_AGENT'] ?? ''), 0, 240),
  'page' => (string)($body['page'] ?? '/contact'),
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
]);
$index = array_slice($index, 0, 500);
@file_put_contents($indexPath, json_encode($index, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));

$notify = trim((string)($contact['notifyEmail'] ?? ''));
$mailOk = false;
if ($notify !== '' && filter_var($notify, FILTER_VALIDATE_EMAIL)) {
  $subject = 'New DisplayAvenue lead: ' . $name;
  $lines = [
    'New contact form submission',
    '',
    'Name: ' . $name,
    'Phone: ' . $phone,
    'Email: ' . ($email !== '' ? $email : '(not provided)'),
    'Business: ' . ($business !== '' ? $business : '(not provided)'),
    'Message:',
    $message !== '' ? $message : '(empty)',
    '',
    'Submitted: ' . $lead['createdAt'],
    'Page: ' . $lead['page'],
  ];
  $headers = 'From: noreply@displayavenue.com' . "\r\n" .
    'Reply-To: ' . ($email !== '' && filter_var($email, FILTER_VALIDATE_EMAIL) ? $email : $notify) . "\r\n" .
    'Content-Type: text/plain; charset=UTF-8';
  $mailOk = @mail($notify, $subject, implode("\n", $lines), $headers);
}

echo json_encode([
  'ok' => true,
  'saved' => (bool)$written,
  'emailed' => $mailOk,
  'successTitle' => $contact['successTitle'] ?? 'Thanks - we got your message',
  'successMessage' => $contact['successMessage'] ?? 'Our team will reply soon.',
], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
