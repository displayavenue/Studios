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
$allowed = [
  'contact',
  'newsletter',
  'property',
  'sell',
  'redevelopment',
  'valuation',
  'visit',
];
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
  return 'hello@displayavenuerealestate.com';
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

$subject = 'DisplayAvenue Realty — Website inquiry';
$lines = ["New {$type} inquiry from displayavenuerealestate.com", ''];

if ($type === 'newsletter') {
  $email = clean((string)($body['email'] ?? ''), 120);
  if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(400, ['ok' => false, 'error' => 'Please enter a valid email address.']);
  }
  $record['email'] = $email;
  $subject = 'Listing alerts signup — DisplayAvenue Realty';
  $lines[] = "Email: {$email}";
} else {
  $name = clean((string)($body['name'] ?? ''), 120);
  $phone = clean((string)($body['phone'] ?? ''), 40);
  $email = clean((string)($body['email'] ?? ''), 120);
  $message = clean((string)($body['message'] ?? ''), 4000);
  $interest = clean((string)($body['interest'] ?? ''), 120);
  $locality = clean((string)($body['locality'] ?? ''), 80);
  $propertyType = clean((string)($body['type'] ?? ($body['propertyType'] ?? '')), 80);
  // body type is inquiry type; property type field may collide — read extras
  $extras = [];
  foreach (['property', 'slug', 'price', 'society', 'units', 'role', 'intent'] as $key) {
    if (!empty($body[$key])) {
      $extras[$key] = clean((string)$body[$key], 200);
    }
  }
  // For property-type select on sell form the field is also named "type" in JSON
  // but inquiry type is already separate. Prefer explicit keys.
  if (!empty($body['property_type'])) {
    $extras['property_type'] = clean((string)$body['property_type'], 80);
  }

  if ($name === '' || $phone === '') {
    respond(400, ['ok' => false, 'error' => 'Please fill in name and phone.']);
  }
  if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(400, ['ok' => false, 'error' => 'Please enter a valid email address.']);
  }

  $record += [
    'name' => $name,
    'phone' => $phone,
    'email' => $email,
    'message' => $message,
    'interest' => $interest,
    'locality' => $locality,
  ] + $extras;

  $subject = match ($type) {
    'valuation' => "Valuation request — {$name}",
    'sell' => "List property — {$name}",
    'redevelopment' => "Redevelopment enquiry — {$name}",
    'property', 'visit' => "Property enquiry — {$name}",
    default => "Contact — {$name}",
  };

  $lines = array_merge($lines, [
    "Name: {$name}",
    "Phone: {$phone}",
    "Email: " . ($email !== '' ? $email : '(not provided)'),
    "Interest: " . ($interest !== '' ? $interest : '(n/a)'),
    "Locality: " . ($locality !== '' ? $locality : '(n/a)'),
  ]);
  foreach ($extras as $k => $v) {
    $lines[] = ucfirst(str_replace('_', ' ', $k)) . ": {$v}";
  }
  $lines[] = '';
  $lines[] = 'Message:';
  $lines[] = $message !== '' ? $message : '(none)';
}

$logPath = __DIR__ . '/content/inquiries-log.jsonl';
$logLine = json_encode($record, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
if ($logLine !== false) {
  @file_put_contents($logPath, $logLine . "\n", FILE_APPEND | LOCK_EX);
}

$to = loadRecipientEmail();
$replyTo = !empty($record['email']) ? $record['email'] : $to;
$bodyText = implode("\n", $lines);
$headers = [
  'MIME-Version: 1.0',
  'Content-Type: text/plain; charset=UTF-8',
  'From: DisplayAvenue Realty <noreply@displayavenue.com>',
  'Reply-To: ' . $replyTo,
  'X-Mailer: PHP/' . phpversion(),
];

$sent = @mail($to, $subject, $bodyText, implode("\r\n", $headers));

if (!$sent) {
  respond(200, [
    'ok' => true,
    'mail' => false,
    'message' => 'Thanks — we received your enquiry. If you need a faster reply, WhatsApp us.',
  ]);
}

respond(200, ['ok' => true, 'mail' => true, 'message' => 'Thank you — we will get back shortly.']);
