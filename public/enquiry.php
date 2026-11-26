<?php
/**
 * DisplayAvenue Studios — website enquiry endpoint.
 * Saves every enquiry to admin/leads/enquiries.csv (blocked from public access)
 * and emails it. Change the recipient below if needed.
 */
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');

const NOTIFY_TO = 'hello@displayavenuestudios.com';
const MAIL_FROM = 'website@displayavenuestudios.com';

function out(int $code, array $body): void { http_response_code($code); echo json_encode($body); exit; }

if ($_SERVER['REQUEST_METHOD'] !== 'POST') out(405, ['ok' => false, 'error' => 'POST only']);

$host = parse_url($_SERVER['HTTP_ORIGIN'] ?? ($_SERVER['HTTP_REFERER'] ?? ''), PHP_URL_HOST) ?: '';
if ($host !== '' && !preg_match('/(^|\.)displayavenuestudios\.com$/i', $host) && $host !== 'localhost' && $host !== '127.0.0.1') {
  out(403, ['ok' => false, 'error' => 'Bad origin']);
}

$data = json_decode(file_get_contents('php://input') ?: '', true);
if (!is_array($data)) $data = $_POST;

// Honeypot: real people never fill this hidden field
if (!empty($data['company_website'])) out(200, ['ok' => true]);

$allowed = ['form', 'name', 'phone', 'email', 'city', 'date', 'package', 'service', 'guests', 'venue', 'budget', 'message', 'page'];
$clean = [];
foreach ($allowed as $k) {
  $v = isset($data[$k]) ? trim((string)$data[$k]) : '';
  $v = preg_replace('/[\r\n\t]+/', ' ', $v);
  $clean[$k] = mb_substr($v, 0, $k === 'message' ? 2000 : 200);
}
if ($clean['form'] === '') $clean['form'] = 'website';
if ($clean['form'] !== 'newsletter' && ($clean['name'] === '' || $clean['phone'] === '')) {
  out(422, ['ok' => false, 'error' => 'Name and phone are required']);
}
if ($clean['form'] === 'newsletter' && !filter_var($clean['email'], FILTER_VALIDATE_EMAIL)) {
  out(422, ['ok' => false, 'error' => 'Valid email required']);
}

// Simple rate limit: 5 enquiries per IP per 10 minutes
$dir = __DIR__ . '/admin/leads';
if (!is_dir($dir)) mkdir($dir, 0750, true);
$ip = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? ($_SERVER['REMOTE_ADDR'] ?? '');
$ip = trim(explode(',', $ip)[0]);
$rl = $dir . '/.rate-' . md5($ip);
$hits = array_filter(array_map('intval', is_file($rl) ? explode(',', (string)file_get_contents($rl)) : []), fn($t) => $t > time() - 600);
if (count($hits) >= 5) out(429, ['ok' => false, 'error' => 'Too many requests']);
$hits[] = time();
file_put_contents($rl, implode(',', $hits));

// Save
$csv = $dir . '/enquiries.csv';
$isNew = !is_file($csv);
$fh = fopen($csv, 'a');
if ($fh) {
  if ($isNew) fputcsv($fh, array_merge(['received_at_ist'], $allowed));
  $now = new DateTime('now', new DateTimeZone('Asia/Kolkata'));
  fputcsv($fh, array_merge([$now->format('Y-m-d H:i')], array_map(fn($k) => $clean[$k], $allowed)));
  fclose($fh);
}

// Email
$lines = [];
foreach ($allowed as $k) if ($clean[$k] !== '') $lines[] = ucfirst($k) . ': ' . $clean[$k];
$subject = 'New ' . $clean['form'] . ' enquiry — ' . ($clean['name'] ?: $clean['email']);
$headers = 'From: DisplayAvenue Studios Website <' . MAIL_FROM . ">\r\n";
if (filter_var($clean['email'], FILTER_VALIDATE_EMAIL)) $headers .= 'Reply-To: ' . $clean['email'] . "\r\n";
$headers .= "Content-Type: text/plain; charset=utf-8\r\n";
$mailed = @mail(NOTIFY_TO, '=?UTF-8?B?' . base64_encode($subject) . '?=', implode("\n", $lines), $headers);

out(200, ['ok' => true, 'saved' => (bool)$fh, 'mailed' => (bool)$mailed]);
