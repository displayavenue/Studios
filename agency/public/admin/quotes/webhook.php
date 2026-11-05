<?php
declare(strict_types=1);

require_once __DIR__ . '/lib/db.php';
require_once __DIR__ . '/lib/razorpay.php';

$raw = file_get_contents('php://input') ?: '';
$sig = $_SERVER['HTTP_X_RAZORPAY_SIGNATURE'] ?? '';

try {
  $cfg = da_rzp_config();
  if ($cfg['webhook_secret'] !== '') {
    $expected = hash_hmac('sha256', $raw, $cfg['webhook_secret']);
    if (!hash_equals($expected, (string) $sig)) {
      da_json_out(400, ['ok' => false, 'error' => 'Invalid webhook signature']);
    }
  }
  $payload = json_decode($raw, true);
  if (!is_array($payload)) da_json_out(400, ['ok' => false, 'error' => 'Invalid JSON']);

  $db = da_db();
  $eventId = (string) ($payload['event'] ?? '') . ':' . (string) ($payload['id'] ?? md5($raw));
  $eventType = (string) ($payload['event'] ?? '');
  $id = bin2hex(random_bytes(13));
  $stmt = $db->prepare('INSERT IGNORE INTO quote_webhook_events (id, event_id, event_type, payload_json) VALUES (?,?,?,?)');
  $stmt->bind_param('ssss', $id, $eventId, $eventType, $raw);
  $stmt->execute();
  if ($stmt->affected_rows === 0) {
    da_json_out(200, ['ok' => true, 'duplicate' => true]);
  }

  if ($eventType === 'payment.captured') {
    $entity = $payload['payload']['payment']['entity'] ?? [];
    $orderId = (string) ($entity['order_id'] ?? '');
    $paymentId = (string) ($entity['id'] ?? '');
    if ($orderId && $paymentId) {
      $st = $db->prepare('SELECT * FROM quote_payments WHERE razorpay_order_id=? LIMIT 1');
      $st->bind_param('s', $orderId);
      $st->execute();
      $payment = $st->get_result()->fetch_assoc();
      if ($payment && ($payment['status'] ?? '') !== 'PAID') {
        $db->begin_transaction();
        try {
          da_mark_payment_paid($db, $payment, $paymentId, (string) $sig);
          $db->commit();
        } catch (Throwable $e) {
          $db->rollback();
          throw $e;
        }
      }
    }
  }

  $db->query("UPDATE quote_webhook_events SET processed=1 WHERE event_id='" . $db->real_escape_string($eventId) . "'");
  da_json_out(200, ['ok' => true]);
} catch (Throwable $e) {
  da_json_out(500, ['ok' => false, 'error' => $e->getMessage()]);
}
