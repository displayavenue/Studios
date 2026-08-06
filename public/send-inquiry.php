<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(204);
  exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
  exit;
}

function respond(int $code, array $payload): void {
  http_response_code($code);
  echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
  exit;
}

$raw = file_get_contents('php://input');
$body = json_decode($raw ?: 'null', true);
if (!is_array($body)) {
  respond(400, ['ok' => false, 'error' => 'Invalid JSON body']);
}

// Honeypot — bots fill hidden fields
if (!empty($body['company_website'])) {
  respond(200, ['ok' => true, 'message' => 'Thank you']);
}

$type = (string)($body['type'] ?? '');
$allowed = ['contact', 'book-now', 'newsletter'];
if (!in_array($type, $allowed, true)) {
  respond(400, ['ok' => false, 'error' => 'Unknown inquiry type']);
}

function clean(string $value, int $max = 500): string {
  $value = trim(strip_tags($value));
  if (strlen($value) > $max) {
    $value = substr($value, 0, $max);
  }
  return $value;
}

function loadRecipientEmail(): string {
  $path = __DIR__ . '/content/company.json';
  if (is_file($path)) {
    $data = json_decode(file_get_contents($path) ?: '', true);
    if (is_array($data) && !empty($data['email']) && filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
      return (string)$data['email'];
    }
  }
  return 'hello@displayavenuestudios.com';
}

$ip = (string)($_SERVER['REMOTE_ADDR'] ?? 'unknown');
$rateDir = __DIR__ . '/content/.inquiry-rate';
if (!is_dir($rateDir)) {
  @mkdir($rateDir, 0755, true);
}
$rateFile = $rateDir . '/' . preg_replace('/[^a-zA-Z0-9._-]/', '_', $ip) . '.txt';
$now = time();
if (is_file($rateFile)) {
  $last = (int)file_get_contents($rateFile);
  if ($now - $last < 45) {
    respond(429, ['ok' => false, 'error' => 'Please wait a moment before sending another message.']);
  }
}
file_put_contents($rateFile, (string)$now);

$record = [
  'type' => $type,
  'createdAt' => gmdate('c'),
  'ip' => $ip,
];

$subject = 'DisplayAvenue Studios — Website inquiry';
$lines = ["New {$type} inquiry from displayavenuestudios.com", ''];

if ($type === 'newsletter') {
  $email = clean((string)($body['email'] ?? ''), 120);
  if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(400, ['ok' => false, 'error' => 'Please enter a valid email address.']);
  }
  $record['email'] = $email;
  $subject = 'Newsletter signup — DisplayAvenue Studios';
  $lines[] = "Email: {$email}";
} elseif ($type === 'contact') {
  $name = clean((string)($body['name'] ?? ''), 120);
  $phone = clean((string)($body['phone'] ?? ''), 40);
  $email = clean((string)($body['email'] ?? ''), 120);
  $message = clean((string)($body['message'] ?? ''), 4000);
  if ($name === '' || $phone === '' || $email === '' || $message === '') {
    respond(400, ['ok' => false, 'error' => 'Please fill in all required fields.']);
  }
  if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(400, ['ok' => false, 'error' => 'Please enter a valid email address.']);
  }
  $record += compact('name', 'phone', 'email', 'message');
  $subject = "Contact form — {$name}";
  $lines = array_merge($lines, [
    "Name: {$name}",
    "Phone: {$phone}",
    "Email: {$email}",
    '',
    'Message:',
    $message,
  ]);
} else {
  $name = clean((string)($body['name'] ?? ''), 120);
  $phone = clean((string)($body['phone'] ?? ''), 40);
  $email = clean((string)($body['email'] ?? ''), 120);
  $city = clean((string)($body['city'] ?? ''), 80);
  $date = clean((string)($body['date'] ?? ''), 40);
  $package = clean((string)($body['package'] ?? ''), 120);
  $service = clean((string)($body['service'] ?? ''), 120);
  $message = clean((string)($body['message'] ?? ''), 4000);
  if ($name === '' || $phone === '' || $email === '' || $city === '' || $date === '') {
    respond(400, ['ok' => false, 'error' => 'Please fill in all required fields.']);
  }
  if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(400, ['ok' => false, 'error' => 'Please enter a valid email address.']);
  }
  $record += compact('name', 'phone', 'email', 'city', 'date', 'package', 'service', 'message');
  $subject = "Booking request — {$name} ({$date})";
  $lines = array_merge($lines, [
    "Name: {$name}",
    "Phone: {$phone}",
    "Email: {$email}",
    "City: {$city}",
    "Preferred date: {$date}",
    "Package: {$package}",
    "Service: {$service}",
    '',
    'Details:',
    $message !== '' ? $message : '(none)',
  ]);
}

$logPath = __DIR__ . '/content/inquiries-log.jsonl';
$logLine = json_encode($record, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
if ($logLine !== false) {
  @file_put_contents($logPath, $logLine . "\n", FILE_APPEND | LOCK_EX);
}

$to = loadRecipientEmail();
$replyTo = $type === 'newsletter' ? $to : ($record['email'] ?? $to);
$bodyText = implode("\n", $lines);
$headers = [
  'MIME-Version: 1.0',
  'Content-Type: text/plain; charset=UTF-8',
  'From: DisplayAvenue Website <noreply@displayavenuestudios.com>',
  'Reply-To: ' . $replyTo,
  'X-Mailer: PHP/' . phpversion(),
];

$sent = @mail($to, $subject, $bodyText, implode("\r\n", $headers));

if (!$sent) {
  // Inquiry is still logged — don't fail the user if mail is delayed
  respond(200, [
    'ok' => true,
    'message' => 'Received — our team will contact you shortly.',
    'mail' => false,
  ]);
}

respond(200, [
  'ok' => true,
  'message' => 'Thank you — we received your message and will reply soon.',
  'mail' => true,
]);
