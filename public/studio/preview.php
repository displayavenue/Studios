<?php
declare(strict_types=1);
require __DIR__ . '/lib.php';

// Live preview of the client quote page, rendered from the unsaved quote form.
header('Content-Type: text/html; charset=utf-8');
header('Cache-Control: no-store');
header('X-Robots-Tag: noindex, nofollow');

$adminConfig = require dirname(__DIR__) . '/admin/config.php';
session_name('da_admin');
session_start([
  'cookie_httponly' => true,
  'cookie_samesite' => 'Lax',
  'cookie_secure' => (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off'),
  'cookie_path' => '/',
]);
$ttl = (int)($adminConfig['session_ttl'] ?? 28800);
$authed = !empty($_SESSION['da_auth']) && !empty($_SESSION['da_auth_at']) && (time() - (int)$_SESSION['da_auth_at']) <= $ttl;
session_write_close();
if (!$authed || $_SERVER['REQUEST_METHOD'] !== 'POST' || !hash_equals((string)($_SESSION['studio_csrf'] ?? ''), (string)($_POST['csrf'] ?? ''))) {
  http_response_code(403);
  echo '<p style="font-family:sans-serif;padding:20px">Preview unavailable — please reload the page.</p>';
  exit;
}

$S = da_settings();
$bookings = da_bookings();
$id = (string)($_POST['id'] ?? '');
$existing = $id ? da_find_booking($bookings, $id) : null;
$parsed = da_parse_booking_post($_POST);

$b = [
  'id' => $existing['id'] ?? 'DAS-' . date('Y') . '-XXXX',
  'status' => $existing['status'] ?? 'sent',
  'client' => $parsed['client'],
  'events' => $parsed['events'],
  'items' => $parsed['items'],
  'discount' => (float)preg_replace('/[^\d.]/', '', (string)($_POST['discount'] ?? '0')),
  'advance_percent' => (float)($_POST['advance_percent'] ?? $S['advance_percent']),
  'notes' => trim((string)($_POST['notes'] ?? '')),
  'valid_until' => (string)($_POST['valid_until'] ?? ''),
  'payments' => $existing['payments'] ?? [],
];
if ($b['client']['name'] === '') $b['client']['name'] = 'Client name';
$confirmed = in_array($b['status'], DA_CONFIRMED, true);
$load = da_date_load($bookings, (int)$S['teams_per_day'], $existing['id'] ?? null);
$t = da_totals($b);

echo '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><base href="/studio/"><link href="https://fonts.googleapis.com/css2?family=Marcellus&family=Jost:wght@400;500&display=swap" rel="stylesheet"><link rel="stylesheet" href="studio.css">'
  . '<style>.pv-flag{position:sticky;top:0;z-index:5;background:#c99a2e;color:#2a0f16;text-align:center;font-size:.85rem;padding:6px 10px}button[disabled]{opacity:.85;cursor:default}</style></head><body>';
echo '<div class="pv-flag">Preview — this is what your client will see</div>';
echo da_quote_head($b, $S, $confirmed) . '<main class="public">';
if (!$b['events'] && !$b['items']) echo '<div class="notice warn" style="margin-top:18px">Add a date and a price in the quote form to fill this in.</div>';
echo da_quote_sections($b, $S, $load, $confirmed);

echo '<section class="card"><h2>Terms</h2><div class="terms">' . h($S['terms']) . '</div>';
if (!$confirmed) {
  echo '<div class="stack" style="margin-top:14px"><div><label>Your full name</label><input value="' . h($b['client']['name']) . '" disabled></div><label class="check"><input type="checkbox" disabled><span>I have read and agree to the terms above and the price in this quote.</span></label><button class="btn gold" disabled>Accept and continue to payment</button></div>';
}
echo '</section>';

$pay = $confirmed ? $t['balance'] : $t['advance'];
if ($pay > 0) {
  echo '<section class="card"><h2>' . ($confirmed ? 'Balance due' : 'Advance to confirm your date') . ': ' . da_money($pay) . '</h2>';
  if (empty($S['upi_id'])) echo '<p class="notice warn">Add your UPI ID in Settings — until then clients are asked to get payment details on WhatsApp.</p>';
  else echo '<p>Pay with any UPI app — Google Pay, PhonePe, Paytm or your bank app.</p><p><button class="btn gold" disabled>Pay ' . da_money($pay) . ' with a UPI app</button></p><p class="small muted">The UPI QR code and "I have paid" form appear here after the client accepts the terms.</p><p class="small">UPI ID: <b>' . h($S['upi_id']) . '</b></p>';
  echo '</section>';
}
echo '<section class="card"><h2>Questions?</h2><p>Message us any time and we will help.</p><p><button class="btn wa" disabled>WhatsApp ' . h($S['studio_name']) . '</button></p></section>';
echo '</main></body></html>';
