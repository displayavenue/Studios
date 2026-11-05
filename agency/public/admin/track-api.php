<?php
/**
 * Public visitor journey beacon (no auth).
 * POST JSON: { visitorId, path, title?, referrer?, utm? }
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

require_once __DIR__ . '/lib/automation.php';

$settings = da_automation_settings();
if (empty($settings['events']['trackPageviews'])) {
  echo json_encode(['ok' => true, 'tracked' => false, 'reason' => 'disabled']);
  exit;
}

$raw = file_get_contents('php://input') ?: '';
$body = json_decode($raw, true);
if (!is_array($body)) $body = $_POST;

$visitorId = trim((string)($body['visitorId'] ?? ''));
$path = trim((string)($body['path'] ?? ''));
if ($visitorId === '' || $path === '') {
  http_response_code(400);
  echo json_encode(['ok' => false, 'error' => 'visitorId and path required']);
  exit;
}

$utm = [];
if (!empty($body['utm']) && is_array($body['utm'])) {
  foreach (['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'] as $k) {
    if (!empty($body['utm'][$k])) $utm[$k] = substr(trim((string)$body['utm'][$k]), 0, 120);
  }
}

$visit = da_visit_track($visitorId, $path, [
  'title' => (string)($body['title'] ?? ''),
  'referrer' => (string)($body['referrer'] ?? ''),
  'utm' => $utm,
]);

echo json_encode([
  'ok' => true,
  'tracked' => (bool)$visit,
  'pageCount' => is_array($visit['pages'] ?? null) ? count($visit['pages']) : 0,
], JSON_UNESCAPED_SLASHES);
