<?php
declare(strict_types=1);

require_once __DIR__ . '/ids.php';
require_once __DIR__ . '/money.php';
require_once __DIR__ . '/numbering.php';
require_once __DIR__ . '/company.php';

/** Ensure tax invoice tables exist (safe to call repeatedly). */
function da_ensure_invoice_tables(mysqli $db): void {
  $db->query("CREATE TABLE IF NOT EXISTS tax_invoices (
    id CHAR(26) PRIMARY KEY,
    client_id CHAR(26) NULL,
    invoice_number VARCHAR(64) NOT NULL UNIQUE,
    secure_token VARCHAR(64) NOT NULL UNIQUE,
    status VARCHAR(32) NOT NULL DEFAULT 'DRAFT',
    invoice_date DATE NOT NULL,
    company_legal_name VARCHAR(255) NOT NULL DEFAULT 'MediaShouter-Digital Transformation& Marketing Firm',
    company_address TEXT NULL,
    company_gstin VARCHAR(32) NOT NULL DEFAULT '27ALJPY9454C1ZJ',
    company_state VARCHAR(64) NOT NULL DEFAULT 'Maharashtra',
    company_state_code VARCHAR(8) NOT NULL DEFAULT '27',
    company_email VARCHAR(191) NULL,
    buyer_name VARCHAR(255) NOT NULL,
    buyer_address TEXT NULL,
    buyer_gstin VARCHAR(32) NULL,
    buyer_state VARCHAR(64) NULL,
    buyer_state_code VARCHAR(8) NULL,
    ship_name VARCHAR(255) NULL,
    ship_address TEXT NULL,
    ship_gstin VARCHAR(32) NULL,
    ship_state VARCHAR(64) NULL,
    ship_state_code VARCHAR(8) NULL,
    delivery_note VARCHAR(191) NULL,
    mode_of_payment VARCHAR(191) NULL,
    reference_no VARCHAR(191) NULL,
    other_references VARCHAR(191) NULL,
    buyer_order_no VARCHAR(191) NULL,
    buyer_order_date DATE NULL,
    dispatch_doc_no VARCHAR(191) NULL,
    delivery_note_date DATE NULL,
    dispatched_through VARCHAR(191) NULL,
    destination VARCHAR(191) NULL,
    terms_of_delivery TEXT NULL,
    gst_mode VARCHAR(16) NOT NULL DEFAULT 'CGST_SGST',
    taxable_paise INT NOT NULL DEFAULT 0,
    cgst_paise INT NOT NULL DEFAULT 0,
    sgst_paise INT NOT NULL DEFAULT 0,
    igst_paise INT NOT NULL DEFAULT 0,
    total_gst_paise INT NOT NULL DEFAULT 0,
    grand_total_paise INT NOT NULL DEFAULT 0,
    amount_in_words VARCHAR(512) NULL,
    tax_in_words VARCHAR(512) NULL,
    notes TEXT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_tax_inv_client (client_id),
    INDEX idx_tax_inv_date (invoice_date)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

  $db->query("CREATE TABLE IF NOT EXISTS tax_invoice_items (
    id CHAR(26) PRIMARY KEY,
    invoice_id CHAR(26) NOT NULL,
    sort_order INT NOT NULL DEFAULT 0,
    particulars VARCHAR(255) NOT NULL,
    description TEXT NULL,
    hsn_sac VARCHAR(32) NOT NULL DEFAULT '998314',
    quantity DECIMAL(12,3) NULL,
    rate_paise INT NOT NULL DEFAULT 0,
    unit_label VARCHAR(32) NULL,
    amount_paise INT NOT NULL DEFAULT 0,
    is_tax_row TINYINT(1) NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_tax_items_inv (invoice_id, sort_order),
    CONSTRAINT fk_tax_item_inv FOREIGN KEY (invoice_id) REFERENCES tax_invoices(id) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
}

function da_next_tax_invoice_number(mysqli $db): string {
  // Tally-style plain numbers: 1, 2, 10…
  $prefix = 'NUM';
  $fy = da_indian_fy_label();
  $db->begin_transaction();
  try {
    $stmt = $db->prepare('SELECT id, last_number FROM invoice_sequences WHERE prefix=? AND fy_label=? FOR UPDATE');
    $stmt->bind_param('ss', $prefix, $fy);
    $stmt->execute();
    $row = $stmt->get_result()->fetch_assoc();
    if ($row) {
      $num = ((int) $row['last_number']) + 1;
      $upd = $db->prepare('UPDATE invoice_sequences SET last_number=? WHERE id=?');
      $upd->bind_param('is', $num, $row['id']);
      $upd->execute();
    } else {
      // Start near sample invoice (#10) so first live invoice feels familiar
      $num = 10;
      $id = da_id();
      $ins = $db->prepare('INSERT INTO invoice_sequences (id, prefix, fy_label, last_number) VALUES (?,?,?,?)');
      $ins->bind_param('sssi', $id, $prefix, $fy, $num);
      $ins->execute();
    }
    $db->commit();
  } catch (Throwable $e) {
    $db->rollback();
    throw $e;
  }
  return (string) $num;
}

function da_amount_in_words(int $paise): string {
  $rupees = (int) floor(abs($paise) / 100);
  $words = da_number_to_words_indian($rupees);
  if ($words === '') $words = 'Zero';
  return 'INR ' . $words . ' Only';
}

function da_number_to_words_indian(int $n): string {
  if ($n === 0) return 'Zero';
  $ones = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
    'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen',
  ];
  $tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  $two = static function (int $x) use ($ones, $tens): string {
    if ($x < 20) return $ones[$x];
    return trim($tens[(int) floor($x / 10)] . ' ' . $ones[$x % 10]);
  };
  $parts = [];
  $crore = (int) floor($n / 10000000);
  $n %= 10000000;
  $lakh = (int) floor($n / 100000);
  $n %= 100000;
  $thousand = (int) floor($n / 1000);
  $n %= 1000;
  $hundred = (int) floor($n / 100);
  $rest = $n % 100;
  if ($crore) $parts[] = $two($crore) . ' Crore';
  if ($lakh) $parts[] = $two($lakh) . ' Lakh';
  if ($thousand) $parts[] = $two($thousand) . ' Thousand';
  if ($hundred) $parts[] = $ones[$hundred] . ' Hundred';
  if ($rest) $parts[] = $two($rest);
  return trim(implode(' ', $parts));
}

function da_invoice_company_defaults(mysqli $db): array {
  $c = da_get_company($db);
  $addr = trim((string) ($c['registered_address'] ?? ''));
  if ($addr === '') {
    $addr = "4A, 1408, Elara , JP North Garden City ,\nVinay Nagar , Mira Bhayandar";
  }
  $legal = trim((string) ($c['legal_name'] ?? ''));
  if ($legal === '' || strcasecmp($legal, 'Mediashouter') === 0) {
    $legal = 'MediaShouter-Digital Transformation& Marketing Firm';
  }
  return [
    'legal_name' => $legal,
    'address' => $addr,
    'gstin' => (string) ($c['gstin'] ?? '27ALJPY9454C1ZJ'),
    'state' => (string) ($c['state'] ?? 'Maharashtra'),
    'state_code' => '27',
    'email' => (string) ($c['email'] ?? 'aakashyadav322@gmail.com'),
    'bank_name' => (string) ($c['bank_name'] ?? ''),
    'account_number' => (string) ($c['account_number'] ?? ''),
    'ifsc' => (string) ($c['ifsc'] ?? ''),
  ];
}

function da_fetch_tax_invoice(mysqli $db, string $id): ?array {
  $st = $db->prepare('SELECT * FROM tax_invoices WHERE id=?');
  $st->bind_param('s', $id);
  $st->execute();
  $row = $st->get_result()->fetch_assoc();
  return $row ?: null;
}

function da_fetch_tax_invoice_public(mysqli $db, string $number, string $token): ?array {
  $st = $db->prepare('SELECT * FROM tax_invoices WHERE invoice_number=? AND secure_token=?');
  $st->bind_param('ss', $number, $token);
  $st->execute();
  $row = $st->get_result()->fetch_assoc();
  return $row ?: null;
}

function da_fetch_tax_invoice_items(mysqli $db, string $invoiceId): array {
  $st = $db->prepare('SELECT * FROM tax_invoice_items WHERE invoice_id=? ORDER BY sort_order ASC');
  $st->bind_param('s', $invoiceId);
  $st->execute();
  $res = $st->get_result();
  $rows = [];
  while ($r = $res->fetch_assoc()) $rows[] = $r;
  return $rows;
}

function da_tax_invoice_public_url(array $inv): string {
  return 'https://displayavenue.com/invoice/' . rawurlencode($inv['invoice_number']) . '/' . rawurlencode($inv['secure_token']);
}

function da_tax_invoice_payload(mysqli $db, array $inv): array {
  $items = da_fetch_tax_invoice_items($db, $inv['id']);
  $lineItems = [];
  foreach ($items as $it) {
    if ((int) $it['is_tax_row'] === 1) continue;
    $lineItems[] = [
      'particulars' => $it['particulars'],
      'description' => $it['description'],
      'hsnSac' => $it['hsn_sac'],
      'quantity' => $it['quantity'],
      'ratePaise' => (int) $it['rate_paise'],
      'unitLabel' => $it['unit_label'],
      'amountPaise' => (int) $it['amount_paise'],
    ];
  }
  $hsnMap = [];
  foreach ($lineItems as $li) {
    $hsn = $li['hsnSac'] ?: '998314';
    if (!isset($hsnMap[$hsn])) $hsnMap[$hsn] = 0;
    $hsnMap[$hsn] += $li['amountPaise'];
  }
  $hsnRows = [];
  foreach ($hsnMap as $hsn => $taxable) {
    $share = $inv['taxable_paise'] > 0 ? ($taxable / (int) $inv['taxable_paise']) : 0;
    $hsnRows[] = [
      'hsnSac' => $hsn,
      'taxablePaise' => $taxable,
      'cgstPaise' => (int) round(((int) $inv['cgst_paise']) * $share),
      'sgstPaise' => (int) round(((int) $inv['sgst_paise']) * $share),
      'igstPaise' => (int) round(((int) $inv['igst_paise']) * $share),
      'totalTaxPaise' => (int) round(((int) $inv['total_gst_paise']) * $share),
    ];
  }
  return [
    'id' => $inv['id'],
    'invoiceNumber' => $inv['invoice_number'],
    'invoiceDate' => $inv['invoice_date'],
    'status' => $inv['status'],
    'publicUrl' => da_tax_invoice_public_url($inv),
    'company' => [
      'legalName' => $inv['company_legal_name'],
      'address' => $inv['company_address'],
      'gstin' => $inv['company_gstin'],
      'state' => $inv['company_state'],
      'stateCode' => $inv['company_state_code'],
      'email' => $inv['company_email'],
    ],
    'buyer' => [
      'name' => $inv['buyer_name'],
      'address' => $inv['buyer_address'],
      'gstin' => $inv['buyer_gstin'],
      'state' => $inv['buyer_state'],
      'stateCode' => $inv['buyer_state_code'],
    ],
    'ship' => [
      'name' => $inv['ship_name'] ?: $inv['buyer_name'],
      'address' => $inv['ship_address'] ?: $inv['buyer_address'],
      'gstin' => $inv['ship_gstin'] ?: $inv['buyer_gstin'],
      'state' => $inv['ship_state'] ?: $inv['buyer_state'],
      'stateCode' => $inv['ship_state_code'] ?: $inv['buyer_state_code'],
    ],
    'meta' => [
      'deliveryNote' => $inv['delivery_note'],
      'modeOfPayment' => $inv['mode_of_payment'],
      'referenceNo' => $inv['reference_no'],
      'otherReferences' => $inv['other_references'],
      'buyerOrderNo' => $inv['buyer_order_no'],
      'buyerOrderDate' => $inv['buyer_order_date'],
      'dispatchDocNo' => $inv['dispatch_doc_no'],
      'deliveryNoteDate' => $inv['delivery_note_date'],
      'dispatchedThrough' => $inv['dispatched_through'],
      'destination' => $inv['destination'],
      'termsOfDelivery' => $inv['terms_of_delivery'],
    ],
    'gstMode' => $inv['gst_mode'],
    'taxablePaise' => (int) $inv['taxable_paise'],
    'cgstPaise' => (int) $inv['cgst_paise'],
    'sgstPaise' => (int) $inv['sgst_paise'],
    'igstPaise' => (int) $inv['igst_paise'],
    'totalGstPaise' => (int) $inv['total_gst_paise'],
    'grandTotalPaise' => (int) $inv['grand_total_paise'],
    'amountInWords' => $inv['amount_in_words'],
    'taxInWords' => $inv['tax_in_words'],
    'items' => $lineItems,
    'hsnSummary' => $hsnRows,
    'notes' => $inv['notes'],
  ];
}

function da_format_invoice_date(string $ymd): string {
  $t = strtotime($ymd);
  if (!$t) return $ymd;
  return date('d-M-y', $t);
}

function da_format_money_plain(int $paise): string {
  return number_format(da_paise_to_inr($paise), 2, '.', ',');
}
