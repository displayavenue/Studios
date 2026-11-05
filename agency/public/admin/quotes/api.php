<?php
declare(strict_types=1);

require_once __DIR__ . '/lib/db.php';
require_once __DIR__ . '/lib/ids.php';
require_once __DIR__ . '/lib/money.php';
require_once __DIR__ . '/lib/numbering.php';
require_once __DIR__ . '/lib/company.php';
require_once __DIR__ . '/lib/auth.php';
require_once __DIR__ . '/lib/razorpay.php';

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$host = $_SERVER['HTTP_HOST'] ?? '';
$scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
$self = $scheme . '://' . $host;
if ($origin && (str_starts_with($origin, 'https://displayavenue.com') || str_starts_with($origin, 'https://www.displayavenue.com') || $origin === $self)) {
  header('Access-Control-Allow-Origin: ' . $origin);
  header('Vary: Origin');
}
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-DA-Admin-Token');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(204);
  exit;
}

$body = [];
$raw = file_get_contents('php://input') ?: '';
if ($raw !== '') {
  $decoded = json_decode($raw, true);
  if (is_array($decoded)) $body = $decoded;
}
$action = (string) ($_GET['action'] ?? $body['action'] ?? '');

try {
  $db = da_db();

  // Public endpoints (token-gated)
  if ($action === 'public_get') {
    $number = (string) ($_GET['number'] ?? $body['number'] ?? '');
    $token = (string) ($_GET['token'] ?? $body['token'] ?? '');
    $quote = da_fetch_public_quote($db, $number, $token);
    if (!$quote) da_json_out(404, ['ok' => false, 'error' => 'Quotation not found']);
    if (empty($quote['viewed_at']) && $quote['status'] === 'SENT') {
      $now = date('Y-m-d H:i:s');
      $st = $db->prepare("UPDATE quotations SET viewed_at=?, status='VIEWED' WHERE id=?");
      $st->bind_param('ss', $now, $quote['id']);
      $st->execute();
      $quote['viewed_at'] = $now;
      $quote['status'] = 'VIEWED';
    }
    da_json_out(200, ['ok' => true, 'data' => da_public_payload($db, $quote)]);
  }

  if ($action === 'public_accept') {
    $number = (string) ($body['number'] ?? '');
    $token = (string) ($body['token'] ?? '');
    $quote = da_fetch_public_quote($db, $number, $token);
    if (!$quote) da_json_out(404, ['ok' => false, 'error' => 'Quotation not found']);
    if (!in_array($quote['status'], ['SENT', 'VIEWED', 'ACCEPTED', 'PARTIALLY_PAID'], true)) {
      da_json_out(400, ['ok' => false, 'error' => 'Quotation cannot be accepted in status ' . $quote['status']]);
    }
    $name = trim((string) ($body['name'] ?? ''));
    $email = trim((string) ($body['email'] ?? ''));
    $now = date('Y-m-d H:i:s');
    $st = $db->prepare("UPDATE quotations SET status='ACCEPTED', accepted_at=?, accepted_name=?, accepted_email=? WHERE id=?");
    $st->bind_param('ssss', $now, $name, $email, $quote['id']);
    $st->execute();
    $quote = da_fetch_quote($db, $quote['id']);
    da_json_out(200, ['ok' => true, 'data' => da_public_payload($db, $quote)]);
  }

  if ($action === 'public_pay') {
    $number = (string) ($body['number'] ?? '');
    $token = (string) ($body['token'] ?? '');
    $kind = strtoupper((string) ($body['kind'] ?? 'ADVANCE'));
    $quote = da_fetch_public_quote($db, $number, $token);
    if (!$quote) da_json_out(404, ['ok' => false, 'error' => 'Quotation not found']);
    if (!in_array($quote['status'], ['ACCEPTED', 'PARTIALLY_PAID', 'VIEWED', 'SENT'], true)) {
      da_json_out(400, ['ok' => false, 'error' => 'Accept the quotation before paying']);
    }
    $amount = $kind === 'BALANCE' ? (int) $quote['balance_paise'] - max(0, (int) $quote['paid_paise'] - (int) $quote['advance_paise']) : (int) $quote['advance_paise'];
    // simpler: pay remaining toward advance first, else remaining balance
    $remaining = max(0, (int) $quote['grand_total_paise'] - (int) $quote['paid_paise']);
    if ($kind === 'ADVANCE') {
      $amount = min((int) $quote['advance_paise'], $remaining);
      if ((int) $quote['paid_paise'] >= (int) $quote['advance_paise']) {
        $amount = $remaining; // already advanced — treat as balance
        $kind = 'BALANCE';
      }
    } else {
      $amount = $remaining;
    }
    if ($amount < 100) da_json_out(400, ['ok' => false, 'error' => 'Nothing due']);

    $payId = da_id();
    $receipt = 'DA-' . substr($quote['quotation_number'], -8) . '-' . substr($payId, -6);
    $order = da_rzp_request('POST', '/orders', [
      'amount' => $amount,
      'currency' => 'INR',
      'receipt' => $receipt,
      'notes' => [
        'quotation_number' => $quote['quotation_number'],
        'quotation_id' => $quote['id'],
        'kind' => $kind,
      ],
    ]);
    $orderId = (string) ($order['id'] ?? '');
    $st = $db->prepare('INSERT INTO quote_payments (id, quotation_id, client_id, kind, status, amount_paise, razorpay_order_id) VALUES (?,?,?,?,?,?,?)');
    $status = 'CREATED';
    $st->bind_param('sssssis', $payId, $quote['id'], $quote['client_id'], $kind, $status, $amount, $orderId);
    $st->execute();
    $rzp = da_rzp_config();
    da_json_out(200, [
      'ok' => true,
      'data' => [
        'paymentId' => $payId,
        'orderId' => $orderId,
        'amountPaise' => $amount,
        'currency' => 'INR',
        'keyId' => $rzp['key_id'],
        'quotationNumber' => $quote['quotation_number'],
        'name' => 'DisplayAvenue',
        'description' => $quote['quotation_number'] . ' · ' . $kind,
      ],
    ]);
  }

  if ($action === 'public_verify') {
    $number = (string) ($body['number'] ?? '');
    $token = (string) ($body['token'] ?? '');
    $quote = da_fetch_public_quote($db, $number, $token);
    if (!$quote) da_json_out(404, ['ok' => false, 'error' => 'Quotation not found']);
    $orderId = (string) ($body['razorpay_order_id'] ?? '');
    $paymentId = (string) ($body['razorpay_payment_id'] ?? '');
    $signature = (string) ($body['razorpay_signature'] ?? '');
    $cfg = da_rzp_config();
    $expected = hash_hmac('sha256', $orderId . '|' . $paymentId, $cfg['key_secret']);
    if (!hash_equals($expected, $signature)) {
      da_json_out(400, ['ok' => false, 'error' => 'Invalid payment signature']);
    }
    $st = $db->prepare('SELECT * FROM quote_payments WHERE razorpay_order_id=? AND quotation_id=? LIMIT 1');
    $st->bind_param('ss', $orderId, $quote['id']);
    $st->execute();
    $payment = $st->get_result()->fetch_assoc();
    if (!$payment) da_json_out(404, ['ok' => false, 'error' => 'Payment not found']);
    $db->begin_transaction();
    try {
      da_mark_payment_paid($db, $payment, $paymentId, $signature);
      $db->commit();
    } catch (Throwable $e) {
      $db->rollback();
      throw $e;
    }
    $quote = da_fetch_quote($db, $quote['id']);
    da_json_out(200, ['ok' => true, 'data' => da_public_payload($db, $quote)]);
  }

  // Staff endpoints
  da_quotes_require_admin();

  if ($action === 'dashboard') {
    $metrics = [
      'totalQuoteCount' => (int) $db->query("SELECT COUNT(*) c FROM quotations")->fetch_assoc()['c'],
      'totalQuoteValuePaise' => (int) $db->query("SELECT COALESCE(SUM(grand_total_paise),0) s FROM quotations")->fetch_assoc()['s'],
      'acceptedCount' => (int) $db->query("SELECT COUNT(*) c FROM quotations WHERE status IN ('ACCEPTED','PARTIALLY_PAID','COMPLETED')")->fetch_assoc()['c'],
      'acceptedValuePaise' => (int) $db->query("SELECT COALESCE(SUM(grand_total_paise),0) s FROM quotations WHERE status IN ('ACCEPTED','PARTIALLY_PAID','COMPLETED')")->fetch_assoc()['s'],
      'collectedPaise' => (int) $db->query("SELECT COALESCE(SUM(paid_paise),0) s FROM quotations")->fetch_assoc()['s'],
      'outstandingPaise' => (int) $db->query("SELECT COALESCE(SUM(grand_total_paise - paid_paise),0) s FROM quotations WHERE payment_status IN ('UNPAID','PARTIALLY_PAID')")->fetch_assoc()['s'],
      'pendingPaymentCount' => (int) $db->query("SELECT COUNT(*) c FROM quotations WHERE payment_status IN ('UNPAID','PARTIALLY_PAID') AND status IN ('ACCEPTED','PARTIALLY_PAID','SENT','VIEWED')")->fetch_assoc()['c'],
    ];
    $list = [];
    $res = $db->query("SELECT q.*, c.company_name FROM quotations q JOIN quote_clients c ON c.id=q.client_id ORDER BY q.created_at DESC LIMIT 50");
    while ($row = $res->fetch_assoc()) $list[] = da_map_quote_list($row);
    da_json_out(200, ['ok' => true, 'metrics' => $metrics, 'quotations' => $list]);
  }

  if ($action === 'company_get') {
    da_json_out(200, ['ok' => true, 'data' => da_map_company(da_get_company($db))]);
  }

  if ($action === 'company_save') {
    $c = da_get_company($db);
    $fields = [
      'legal_name' => 'legalName', 'brand_name' => 'brandName', 'gstin' => 'gstin', 'pan' => 'pan',
      'phone' => 'phone', 'whatsapp' => 'whatsapp', 'email' => 'email', 'website' => 'website',
      'registered_address' => 'registeredAddress', 'billing_address' => 'billingAddress',
      'state' => 'state', 'city' => 'city', 'pincode' => 'pincode',
      'authorized_person' => 'authorizedPerson', 'designation' => 'designation',
      'bank_name' => 'bankName', 'account_name' => 'accountName', 'account_number' => 'accountNumber',
      'ifsc' => 'ifsc', 'upi_id' => 'upiId',
    ];
    $sets = [];
    $vals = [];
    $types = '';
    foreach ($fields as $col => $js) {
      if (array_key_exists($js, $body) || array_key_exists($col, $body)) {
        $sets[] = "$col=?";
        $vals[] = (string) ($body[$js] ?? $body[$col] ?? '');
        $types .= 's';
      }
    }
    foreach (['default_gst_percent' => 'defaultGstPercent', 'default_advance_pct' => 'defaultAdvancePct', 'default_validity_days' => 'defaultValidityDays'] as $col => $js) {
      if (array_key_exists($js, $body) || array_key_exists($col, $body)) {
        $sets[] = "$col=?";
        $vals[] = $body[$js] ?? $body[$col];
        $types .= is_int($body[$js] ?? $body[$col] ?? null) ? 'i' : 'd';
      }
    }
    if ($sets) {
      $sql = 'UPDATE company_profile SET ' . implode(',', $sets) . ' WHERE id=?';
      $types .= 's';
      $vals[] = $c['id'];
      $stmt = $db->prepare($sql);
      $stmt->bind_param($types, ...$vals);
      $stmt->execute();
    }
    da_json_out(200, ['ok' => true, 'data' => da_map_company(da_get_company($db))]);
  }

  if ($action === 'clients_list') {
    $rows = [];
    $res = $db->query('SELECT * FROM quote_clients ORDER BY created_at DESC');
    while ($r = $res->fetch_assoc()) $rows[] = da_map_client($r);
    da_json_out(200, ['ok' => true, 'data' => $rows]);
  }

  if ($action === 'clients_save') {
    $id = (string) ($body['id'] ?? '');
    $isNew = $id === '';
    if ($isNew) $id = da_id();
    $code = (string) ($body['clientCode'] ?? '');
    if ($code === '') $code = da_next_client_code($db);
    $company = trim((string) ($body['companyName'] ?? ''));
    if ($company === '') da_json_out(400, ['ok' => false, 'error' => 'Company name required']);
    $contact = (string) ($body['contactPerson'] ?? '');
    $email = (string) ($body['email'] ?? '');
    $mobile = (string) ($body['mobile'] ?? '');
    $whatsapp = (string) ($body['whatsapp'] ?? '');
    $gstin = (string) ($body['gstin'] ?? '');
    $address = (string) ($body['address'] ?? '');
    $city = (string) ($body['city'] ?? '');
    $state = (string) ($body['state'] ?? '');
    $pincode = (string) ($body['pincode'] ?? '');
    $notes = (string) ($body['notes'] ?? '');
    if ($isNew) {
      $stmt = $db->prepare('INSERT INTO quote_clients (id, client_code, company_name, contact_person, email, mobile, whatsapp, gstin, address, city, state, pincode, notes) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)');
      $stmt->bind_param('sssssssssssss', $id, $code, $company, $contact, $email, $mobile, $whatsapp, $gstin, $address, $city, $state, $pincode, $notes);
    } else {
      $stmt = $db->prepare('UPDATE quote_clients SET company_name=?, contact_person=?, email=?, mobile=?, whatsapp=?, gstin=?, address=?, city=?, state=?, pincode=?, notes=? WHERE id=?');
      $stmt->bind_param('ssssssssssss', $company, $contact, $email, $mobile, $whatsapp, $gstin, $address, $city, $state, $pincode, $notes, $id);
    }
    $stmt->execute();
    $st = $db->prepare('SELECT * FROM quote_clients WHERE id=?');
    $st->bind_param('s', $id);
    $st->execute();
    da_json_out(200, ['ok' => true, 'data' => da_map_client($st->get_result()->fetch_assoc())]);
  }

  if ($action === 'services_list') {
    $rows = [];
    $res = $db->query('SELECT * FROM quote_services ORDER BY sort_order ASC, name ASC');
    while ($r = $res->fetch_assoc()) $rows[] = da_map_service($r);
    da_json_out(200, ['ok' => true, 'data' => $rows]);
  }

  if ($action === 'services_save') {
    $id = (string) ($body['id'] ?? '');
    $isNew = $id === '';
    if ($isNew) $id = da_id();
    $category = (string) ($body['category'] ?? 'General');
    $name = trim((string) ($body['name'] ?? ''));
    if ($name === '') da_json_out(400, ['ok' => false, 'error' => 'Service name required']);
    $desc = (string) ($body['description'] ?? '');
    $paise = isset($body['unitPricePaise']) ? (int) $body['unitPricePaise'] : da_inr_to_paise($body['unitPriceInr'] ?? 0);
    $gst = (float) ($body['gstPercent'] ?? 18);
    $billing = (string) ($body['billingType'] ?? 'one_time');
    $active = !empty($body['isActive']) || !array_key_exists('isActive', $body) ? 1 : 0;
    if ($isNew) {
      $stmt = $db->prepare('INSERT INTO quote_services (id, category, name, description, unit_price_paise, gst_percent, billing_type, is_active) VALUES (?,?,?,?,?,?,?,?)');
      $stmt->bind_param('ssssidsi', $id, $category, $name, $desc, $paise, $gst, $billing, $active);
    } else {
      $stmt = $db->prepare('UPDATE quote_services SET category=?, name=?, description=?, unit_price_paise=?, gst_percent=?, billing_type=?, is_active=? WHERE id=?');
      $stmt->bind_param('sssidsis', $category, $name, $desc, $paise, $gst, $billing, $active, $id);
    }
    $stmt->execute();
    $st = $db->prepare('SELECT * FROM quote_services WHERE id=?');
    $st->bind_param('s', $id);
    $st->execute();
    da_json_out(200, ['ok' => true, 'data' => da_map_service($st->get_result()->fetch_assoc())]);
  }

  if ($action === 'quotation_get') {
    $id = (string) ($_GET['id'] ?? $body['id'] ?? '');
    $quote = da_fetch_quote($db, $id);
    if (!$quote) da_json_out(404, ['ok' => false, 'error' => 'Not found']);
    da_json_out(200, ['ok' => true, 'data' => da_staff_payload($db, $quote)]);
  }

  if ($action === 'quotation_create' || $action === 'quotation_update') {
    $company = da_get_company($db);
    $clientId = (string) ($body['clientId'] ?? '');
    if ($clientId === '') da_json_out(400, ['ok' => false, 'error' => 'Client required']);
    $cSt = $db->prepare('SELECT * FROM quote_clients WHERE id=?');
    $cSt->bind_param('s', $clientId);
    $cSt->execute();
    $client = $cSt->get_result()->fetch_assoc();
    if (!$client) da_json_out(400, ['ok' => false, 'error' => 'Client not found']);

    $itemsIn = $body['items'] ?? [];
    if (!is_array($itemsIn) || !$itemsIn) da_json_out(400, ['ok' => false, 'error' => 'Add at least one line item']);
    $calcLines = [];
    $storeLines = [];
    foreach ($itemsIn as $i => $it) {
      $calc = da_calc_line([
        'quantity' => $it['quantity'] ?? 1,
        'unit_price_inr' => $it['unitPriceInr'] ?? (($it['unitPricePaise'] ?? 0) / 100),
        'discount_percent' => $it['discountPercent'] ?? 0,
        'gst_percent' => $it['gstPercent'] ?? $company['default_gst_percent'],
      ]);
      $calcLines[] = $calc;
      $storeLines[] = [
        'service_name' => (string) ($it['serviceName'] ?? 'Service'),
        'category' => (string) ($it['category'] ?? ''),
        'description' => (string) ($it['description'] ?? ''),
        'quantity' => $calc['quantity'],
        'unit_price_paise' => $calc['unit_price_paise'],
        'discount_percent' => (float) ($it['discountPercent'] ?? 0),
        'discount_paise' => $calc['discount_paise'],
        'gst_percent' => $calc['gst_percent'],
        'taxable_paise' => $calc['taxable_paise'],
        'gst_paise' => $calc['gst_paise'],
        'total_paise' => $calc['total_paise'],
        'billing_type' => (string) ($it['billingType'] ?? 'one_time'),
        'sort_order' => (int) $i,
      ];
    }
    $totals = da_calc_quote_totals($calcLines, $company['state'], $client['state']);
    $advancePct = (float) ($body['advancePercent'] ?? $company['default_advance_pct']);
    $adv = da_calc_advance($totals['grand_total_paise'], $advancePct);
    $validityDays = (int) ($body['validityDays'] ?? $company['default_validity_days']);
    $qDate = (string) ($body['quotationDate'] ?? date('Y-m-d'));
    $validUntil = (string) ($body['validUntil'] ?? date('Y-m-d', strtotime($qDate . " +{$validityDays} days")));
    $title = (string) ($body['title'] ?? '');
    $notes = (string) ($body['notes'] ?? '');
    $terms = (string) ($body['termsSnapshot'] ?? da_default_terms());

    $isUpdate = $action === 'quotation_update';
    $id = (string) ($body['id'] ?? '');
    if ($isUpdate) {
      $existing = da_fetch_quote($db, $id);
      if (!$existing) da_json_out(404, ['ok' => false, 'error' => 'Not found']);
      if ($existing['status'] !== 'DRAFT') da_json_out(400, ['ok' => false, 'error' => 'Only drafts can be edited']);
    } else {
      $id = da_id();
    }

    $esc = static function (mysqli $db, string $v): string {
      return "'" . $db->real_escape_string($v) . "'";
    };
    $db->begin_transaction();
    try {
      if ($isUpdate) {
        $sql = sprintf(
          "UPDATE quotations SET client_id=%s, title=%s, notes=%s, quotation_date=%s, valid_until=%s, company_state=%s, client_state=%s, gst_mode=%s, subtotal_paise=%d, discount_paise=%d, taxable_paise=%d, cgst_paise=%d, sgst_paise=%d, igst_paise=%d, total_gst_paise=%d, grand_total_paise=%d, advance_percent=%F, advance_paise=%d, balance_paise=%d, terms_snapshot=%s WHERE id=%s",
          $esc($db, $clientId), $esc($db, $title), $esc($db, $notes), $esc($db, $qDate), $esc($db, $validUntil),
          $esc($db, (string) $company['state']), $esc($db, (string) ($client['state'] ?? '')), $esc($db, $totals['gst_mode']),
          $totals['subtotal_paise'], $totals['discount_paise'], $totals['taxable_paise'], $totals['cgst_paise'], $totals['sgst_paise'], $totals['igst_paise'], $totals['total_gst_paise'], $totals['grand_total_paise'],
          $advancePct, $adv['advance_paise'], $adv['balance_paise'], $esc($db, $terms), $esc($db, $id)
        );
        $db->query($sql);
        $db->query('DELETE FROM quotation_items WHERE quotation_id=' . $esc($db, $id));
      } else {
        $number = da_next_quotation_number($db, (string) $company['quotation_prefix'], (int) $company['quotation_digits']);
        $token = da_token();
        $sql = sprintf(
          "INSERT INTO quotations (id, client_id, quotation_number, secure_token, status, payment_status, quotation_date, valid_until, title, notes, company_state, client_state, gst_mode, subtotal_paise, discount_paise, taxable_paise, cgst_paise, sgst_paise, igst_paise, total_gst_paise, grand_total_paise, advance_percent, advance_paise, balance_paise, terms_snapshot) VALUES (%s,%s,%s,%s,'DRAFT','UNPAID',%s,%s,%s,%s,%s,%s,%s,%d,%d,%d,%d,%d,%d,%d,%d,%F,%d,%d,%s)",
          $esc($db, $id), $esc($db, $clientId), $esc($db, $number), $esc($db, $token),
          $esc($db, $qDate), $esc($db, $validUntil), $esc($db, $title), $esc($db, $notes),
          $esc($db, (string) $company['state']), $esc($db, (string) ($client['state'] ?? '')), $esc($db, $totals['gst_mode']),
          $totals['subtotal_paise'], $totals['discount_paise'], $totals['taxable_paise'], $totals['cgst_paise'], $totals['sgst_paise'], $totals['igst_paise'], $totals['total_gst_paise'], $totals['grand_total_paise'],
          $advancePct, $adv['advance_paise'], $adv['balance_paise'], $esc($db, $terms)
        );
        $db->query($sql);
      }

      foreach ($storeLines as $line) {
        $itemId = da_id();
        $sql = sprintf(
          "INSERT INTO quotation_items (id, quotation_id, sort_order, service_name, category, description, quantity, unit_price_paise, discount_percent, discount_paise, gst_percent, taxable_paise, gst_paise, total_paise, billing_type) VALUES (%s,%s,%d,%s,%s,%s,%F,%d,%F,%d,%F,%d,%d,%d,%s)",
          $esc($db, $itemId), $esc($db, $id), $line['sort_order'],
          $esc($db, $line['service_name']), $esc($db, $line['category']), $esc($db, $line['description']),
          $line['quantity'], $line['unit_price_paise'], $line['discount_percent'], $line['discount_paise'],
          $line['gst_percent'], $line['taxable_paise'], $line['gst_paise'], $line['total_paise'],
          $esc($db, $line['billing_type'])
        );
        $db->query($sql);
      }
      $db->commit();
    } catch (Throwable $e) {
      $db->rollback();
      throw $e;
    }
    $quote = da_fetch_quote($db, $id);
    da_json_out(200, ['ok' => true, 'data' => da_staff_payload($db, $quote)]);
  }

  if ($action === 'quotation_send') {
    $id = (string) ($body['id'] ?? '');
    $quote = da_fetch_quote($db, $id);
    if (!$quote) da_json_out(404, ['ok' => false, 'error' => 'Not found']);
    if (!in_array($quote['status'], ['DRAFT', 'SENT', 'VIEWED'], true)) {
      da_json_out(400, ['ok' => false, 'error' => 'Cannot send in status ' . $quote['status']]);
    }
    $now = date('Y-m-d H:i:s');
    $st = $db->prepare("UPDATE quotations SET status='SENT', sent_at=? WHERE id=?");
    $st->bind_param('ss', $now, $id);
    $st->execute();
    $quote = da_fetch_quote($db, $id);
    $payload = da_staff_payload($db, $quote);
    da_json_out(200, ['ok' => true, 'data' => $payload, 'publicUrl' => $payload['publicUrl']]);
  }

  da_json_out(400, ['ok' => false, 'error' => 'Unknown action']);
} catch (Throwable $e) {
  da_json_out(500, ['ok' => false, 'error' => $e->getMessage()]);
}

function da_fetch_quote(mysqli $db, string $id): ?array {
  $st = $db->prepare('SELECT * FROM quotations WHERE id=?');
  $st->bind_param('s', $id);
  $st->execute();
  $row = $st->get_result()->fetch_assoc();
  return $row ?: null;
}

function da_fetch_public_quote(mysqli $db, string $number, string $token): ?array {
  $st = $db->prepare('SELECT * FROM quotations WHERE quotation_number=? AND secure_token=?');
  $st->bind_param('ss', $number, $token);
  $st->execute();
  $row = $st->get_result()->fetch_assoc();
  return $row ?: null;
}

function da_quote_items(mysqli $db, string $quoteId): array {
  $st = $db->prepare('SELECT * FROM quotation_items WHERE quotation_id=? ORDER BY sort_order ASC');
  $st->bind_param('s', $quoteId);
  $st->execute();
  $res = $st->get_result();
  $items = [];
  while ($r = $res->fetch_assoc()) {
    $items[] = [
      'id' => $r['id'],
      'serviceName' => $r['service_name'],
      'category' => $r['category'],
      'description' => $r['description'],
      'quantity' => (float) $r['quantity'],
      'unitPricePaise' => (int) $r['unit_price_paise'],
      'discountPercent' => (float) $r['discount_percent'],
      'gstPercent' => (float) $r['gst_percent'],
      'taxablePaise' => (int) $r['taxable_paise'],
      'gstPaise' => (int) $r['gst_paise'],
      'totalPaise' => (int) $r['total_paise'],
      'billingType' => $r['billing_type'],
    ];
  }
  return $items;
}

function da_public_url(array $quote): string {
  return 'https://displayavenue.com/q/' . rawurlencode($quote['quotation_number']) . '/' . rawurlencode($quote['secure_token']);
}

function da_map_quote_list(array $q): array {
  return [
    'id' => $q['id'],
    'quotationNumber' => $q['quotation_number'],
    'companyName' => $q['company_name'] ?? null,
    'status' => $q['status'],
    'paymentStatus' => $q['payment_status'],
    'grandTotalPaise' => (int) $q['grand_total_paise'],
    'paidPaise' => (int) $q['paid_paise'],
    'advancePaise' => (int) $q['advance_paise'],
    'quotationDate' => $q['quotation_date'],
    'validUntil' => $q['valid_until'],
    'publicUrl' => da_public_url($q),
  ];
}

function da_map_client(array $c): array {
  return [
    'id' => $c['id'],
    'clientCode' => $c['client_code'],
    'companyName' => $c['company_name'],
    'contactPerson' => $c['contact_person'],
    'email' => $c['email'],
    'mobile' => $c['mobile'],
    'whatsapp' => $c['whatsapp'],
    'gstin' => $c['gstin'],
    'address' => $c['address'],
    'city' => $c['city'],
    'state' => $c['state'],
    'pincode' => $c['pincode'],
    'notes' => $c['notes'],
  ];
}

function da_map_service(array $s): array {
  return [
    'id' => $s['id'],
    'category' => $s['category'],
    'name' => $s['name'],
    'description' => $s['description'],
    'unitPricePaise' => (int) $s['unit_price_paise'],
    'unitPriceInr' => da_paise_to_inr((int) $s['unit_price_paise']),
    'gstPercent' => (float) $s['gst_percent'],
    'billingType' => $s['billing_type'],
    'isActive' => (bool) $s['is_active'],
  ];
}

function da_map_company(array $c): array {
  return [
    'id' => $c['id'],
    'legalName' => $c['legal_name'],
    'brandName' => $c['brand_name'],
    'gstin' => $c['gstin'],
    'pan' => $c['pan'],
    'phone' => $c['phone'],
    'whatsapp' => $c['whatsapp'],
    'email' => $c['email'],
    'website' => $c['website'],
    'registeredAddress' => $c['registered_address'],
    'billingAddress' => $c['billing_address'],
    'state' => $c['state'],
    'city' => $c['city'],
    'pincode' => $c['pincode'],
    'authorizedPerson' => $c['authorized_person'],
    'designation' => $c['designation'],
    'bankName' => $c['bank_name'],
    'accountName' => $c['account_name'],
    'accountNumber' => $c['account_number'],
    'ifsc' => $c['ifsc'],
    'upiId' => $c['upi_id'],
    'defaultGstPercent' => (float) $c['default_gst_percent'],
    'defaultAdvancePct' => (float) $c['default_advance_pct'],
    'defaultValidityDays' => (int) $c['default_validity_days'],
  ];
}

function da_staff_payload(mysqli $db, array $quote): array {
  $cSt = $db->prepare('SELECT * FROM quote_clients WHERE id=?');
  $cSt->bind_param('s', $quote['client_id']);
  $cSt->execute();
  $client = $cSt->get_result()->fetch_assoc();
  return [
    'id' => $quote['id'],
    'quotationNumber' => $quote['quotation_number'],
    'secureToken' => $quote['secure_token'],
    'status' => $quote['status'],
    'paymentStatus' => $quote['payment_status'],
    'quotationDate' => $quote['quotation_date'],
    'validUntil' => $quote['valid_until'],
    'title' => $quote['title'],
    'notes' => $quote['notes'],
    'gstMode' => $quote['gst_mode'],
    'subtotalPaise' => (int) $quote['subtotal_paise'],
    'discountPaise' => (int) $quote['discount_paise'],
    'taxablePaise' => (int) $quote['taxable_paise'],
    'cgstPaise' => (int) $quote['cgst_paise'],
    'sgstPaise' => (int) $quote['sgst_paise'],
    'igstPaise' => (int) $quote['igst_paise'],
    'totalGstPaise' => (int) $quote['total_gst_paise'],
    'grandTotalPaise' => (int) $quote['grand_total_paise'],
    'advancePercent' => (float) $quote['advance_percent'],
    'advancePaise' => (int) $quote['advance_paise'],
    'balancePaise' => (int) $quote['balance_paise'],
    'paidPaise' => (int) $quote['paid_paise'],
    'termsSnapshot' => $quote['terms_snapshot'],
    'publicUrl' => da_public_url($quote),
    'client' => $client ? da_map_client($client) : null,
    'items' => da_quote_items($db, $quote['id']),
  ];
}

function da_public_payload(mysqli $db, array $quote): array {
  $company = da_map_company(da_get_company($db));
  $staff = da_staff_payload($db, $quote);
  unset($staff['secureToken']);
  $staff['company'] = [
    'brandName' => $company['brandName'],
    'legalName' => $company['legalName'],
    'gstin' => $company['gstin'],
    'phone' => $company['phone'],
    'email' => $company['email'],
    'website' => $company['website'],
    'state' => $company['state'],
  ];
  return $staff;
}
