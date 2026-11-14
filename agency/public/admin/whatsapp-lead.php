<?php
/**
 * Log WhatsApp contact intents into local CRM + optional HubSpot/Sheets.
 * Called when a visitor clicks WhatsApp with optional name/phone.
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
require_once __DIR__ . '/lib/crm.php';

$raw = file_get_contents('php://input') ?: '';
$body = json_decode($raw, true);
if (!is_array($body)) $body = $_POST;

$hp = trim((string)($body['website'] ?? ''));
if ($hp !== '') {
  echo json_encode(['ok' => true, 'saved' => true]);
  exit;
}

$name = trim((string)($body['name'] ?? 'WhatsApp visitor'));
$phone = trim((string)($body['phone'] ?? ''));
$email = trim((string)($body['email'] ?? ''));
$page = trim((string)($body['page'] ?? '/'));
$cta = trim((string)($body['cta_location'] ?? 'whatsapp'));
$message = trim((string)($body['message'] ?? 'Clicked WhatsApp on website'));

$phoneDigits = preg_replace('/\D+/', '', $phone) ?? '';
if ($phone !== '' && (strlen($phoneDigits) < 8 || strlen($phoneDigits) > 15)) {
  http_response_code(400);
  echo json_encode(['ok' => false, 'error' => 'Invalid phone']);
  exit;
}

$lead = [
  'id' => 'wa_' . date('Ymd_His') . '_' . bin2hex(random_bytes(3)),
  'created_at' => gmdate('c'),
  'createdAt' => gmdate('c'),
  'name' => mb_substr($name !== '' ? $name : 'WhatsApp visitor', 0, 120),
  'phone' => mb_substr($phone, 0, 40),
  'email' => mb_substr($email, 0, 120),
  'business' => mb_substr(trim((string)($body['business'] ?? '')), 0, 160),
  'message' => mb_substr($message, 0, 2000),
  'source' => 'whatsapp',
  'channel' => 'whatsapp',
  'page' => mb_substr($page, 0, 160),
  'cta_location' => mb_substr($cta, 0, 80),
  'first_utm_source' => mb_substr(trim((string)($body['utm_source'] ?? '')), 0, 120),
  'first_utm_campaign' => mb_substr(trim((string)($body['utm_campaign'] ?? '')), 0, 160),
  'last_utm_source' => mb_substr(trim((string)($body['utm_source'] ?? '')), 0, 120),
  'last_utm_campaign' => mb_substr(trim((string)($body['utm_campaign'] ?? '')), 0, 160),
  'ip' => $_SERVER['REMOTE_ADDR'] ?? '',
  'userAgent' => substr((string)($_SERVER['HTTP_USER_AGENT'] ?? ''), 0, 240),
];

$saved = da_crm_save_local($lead);
$crm = da_crm_forward($lead, $contentDir, $config);

echo json_encode([
  'ok' => true,
  'saved' => !empty($saved['saved']),
  'lead_id' => $saved['id'] ?? $lead['id'],
  'crm' => $crm,
], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
