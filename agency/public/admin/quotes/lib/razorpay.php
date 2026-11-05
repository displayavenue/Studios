<?php
declare(strict_types=1);

function da_rzp_config(): array {
  $c = da_quotes_config();
  return [
    'key_id' => (string) ($c['razorpay_key_id'] ?? ''),
    'key_secret' => (string) ($c['razorpay_key_secret'] ?? ''),
    'webhook_secret' => (string) ($c['razorpay_webhook_secret'] ?? ''),
  ];
}

function da_rzp_request(string $method, string $path, ?array $body = null): array {
  $cfg = da_rzp_config();
  if ($cfg['key_id'] === '' || $cfg['key_secret'] === '') {
    throw new RuntimeException('Razorpay keys not configured in quotes/local.php');
  }
  $ch = curl_init('https://api.razorpay.com/v1' . $path);
  curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_USERPWD => $cfg['key_id'] . ':' . $cfg['key_secret'],
    CURLOPT_CUSTOMREQUEST => $method,
    CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
    CURLOPT_TIMEOUT => 30,
  ]);
  if ($body !== null) curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($body));
  $raw = curl_exec($ch);
  $code = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
  if ($raw === false) throw new RuntimeException('Razorpay request failed: ' . curl_error($ch));
  $json = json_decode($raw, true);
  if ($code >= 400) {
    $msg = is_array($json) ? ($json['error']['description'] ?? $raw) : $raw;
    throw new RuntimeException('Razorpay error: ' . $msg);
  }
  return is_array($json) ? $json : [];
}

function da_mark_payment_paid(mysqli $db, array $payment, string $rzpPaymentId, string $signature = ''): array {
  require_once __DIR__ . '/numbering.php';
  require_once __DIR__ . '/company.php';

  if (($payment['status'] ?? '') === 'PAID') {
    return $payment;
  }

  $company = da_get_company($db);
  $receiptNo = da_next_doc_number($db, 'receipt_sequences', (string) $company['receipt_prefix']);
  $invoiceNo = da_next_doc_number($db, 'invoice_sequences', (string) $company['invoice_prefix']);
  $now = date('Y-m-d H:i:s');
  $stmt = $db->prepare('UPDATE quote_payments SET status=?, razorpay_payment_id=?, razorpay_signature=?, receipt_number=?, invoice_number=?, paid_at=? WHERE id=?');
  $status = 'PAID';
  $stmt->bind_param('sssssss', $status, $rzpPaymentId, $signature, $receiptNo, $invoiceNo, $now, $payment['id']);
  $stmt->execute();

  $qStmt = $db->prepare('SELECT * FROM quotations WHERE id=?');
  $qStmt->bind_param('s', $payment['quotation_id']);
  $qStmt->execute();
  $quote = $qStmt->get_result()->fetch_assoc();
  if (!$quote) throw new RuntimeException('Quotation missing');

  $paid = ((int) $quote['paid_paise']) + ((int) $payment['amount_paise']);
  $grand = (int) $quote['grand_total_paise'];
  $payStatus = $paid <= 0 ? 'UNPAID' : ($paid >= $grand ? 'PAID' : 'PARTIALLY_PAID');
  $qStatus = $quote['status'];
  if (in_array($qStatus, ['ACCEPTED', 'SENT', 'VIEWED'], true) && $paid > 0) {
    $qStatus = $payStatus === 'PAID' ? 'COMPLETED' : 'PARTIALLY_PAID';
  }
  $upd = $db->prepare('UPDATE quotations SET paid_paise=?, payment_status=?, status=?, updated_at=? WHERE id=?');
  $upd->bind_param('issss', $paid, $payStatus, $qStatus, $now, $quote['id']);
  $upd->execute();

  $payment['status'] = 'PAID';
  $payment['razorpay_payment_id'] = $rzpPaymentId;
  $payment['receipt_number'] = $receiptNo;
  $payment['invoice_number'] = $invoiceNo;
  return $payment;
}
