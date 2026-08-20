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
$orderId = (string)($body['razorpay_order_id'] ?? '');
$paymentId = (string)($body['razorpay_payment_id'] ?? '');
$signature = (string)($body['razorpay_signature'] ?? '');

if ($orderId === '' || $paymentId === '' || $signature === '') {
  jk_json(['error' => 'Missing payment fields'], 400);
}

$expected = hash_hmac('sha256', $orderId . '|' . $paymentId, (string)$cfg['key_secret']);
if (!hash_equals($expected, $signature)) {
  jk_json(['error' => 'Invalid payment signature', 'verified' => false], 400);
}

jk_json([
  'verified' => true,
  'razorpay_order_id' => $orderId,
  'razorpay_payment_id' => $paymentId,
]);
