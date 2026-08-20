<?php
require __DIR__ . '/_bootstrap.php';
jk_cors();

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
  jk_json(['error' => 'Method not allowed'], 405);
}

$cfg = jk_config();
if (empty($cfg['configured'])) {
  jk_json(['error' => 'Razorpay is not configured yet', 'code' => 'not_configured'], 503);
}

$body = jk_read_json_body();
$amountInr = (int)($body['amountInr'] ?? 0);
$receipt = preg_replace('/[^A-Za-z0-9_\-]/', '', (string)($body['receipt'] ?? ''));
$product = preg_replace('/[^a-z_]/', '', strtolower((string)($body['product'] ?? 'kundali')));
$notes = is_array($body['notes'] ?? null) ? $body['notes'] : [];

if ($amountInr < 1 || $amountInr > 500000) {
  jk_json(['error' => 'Invalid amount'], 400);
}
if ($receipt === '') {
  $receipt = 'jk_' . time();
}
// Razorpay receipt max 40 chars
$receipt = substr($receipt, 0, 40);

$amountPaise = $amountInr * 100;
$payload = [
  'amount' => $amountPaise,
  'currency' => $cfg['currency'] ?? 'INR',
  'receipt' => $receipt,
  'notes' => array_merge([
    'product' => $product,
    'source' => 'jyotishkundali.com',
  ], $notes),
];

$res = jk_razorpay_request('POST', 'orders', $cfg, $payload);
if (!$res['ok']) {
  jk_json([
    'error' => 'Could not create Razorpay order',
    'details' => $res['data'] ?? null,
  ], 502);
}

$order = $res['data'];
jk_json([
  'orderId' => $order['id'] ?? null,
  'amount' => $order['amount'] ?? $amountPaise,
  'currency' => $order['currency'] ?? 'INR',
  'keyId' => $cfg['key_id'],
  'receipt' => $order['receipt'] ?? $receipt,
]);
