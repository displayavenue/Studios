<?php
declare(strict_types=1);

require_once dirname(__DIR__) . '/admin/quotes/lib/db.php';
require_once dirname(__DIR__) . '/admin/quotes/lib/invoice.php';

$number = (string) ($_GET['number'] ?? '');
$token = (string) ($_GET['token'] ?? '');
$error = '';
$data = null;

try {
  $db = da_db();
  da_ensure_invoice_tables($db);
  $inv = da_fetch_tax_invoice_public($db, $number, $token);
  if (!$inv) {
    $error = 'Invoice not found';
  } else {
    $data = da_tax_invoice_payload($db, $inv);
  }
} catch (Throwable $e) {
  $error = $e->getMessage();
}

function h(?string $s): string {
  return htmlspecialchars((string) $s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}
function money(int $paise): string {
  return number_format($paise / 100, 2, '.', ',');
}
function nl(?string $s): string {
  return nl2br(h($s));
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="robots" content="noindex,nofollow" />
  <title><?= $data ? 'Tax Invoice #' . h($data['invoiceNumber']) : 'Invoice' ?> · MediaShouter</title>
  <style>
    :root { --ink:#111; --line:#222; --muted:#444; --bg:#f4f4f4; }
    * { box-sizing: border-box; }
    body { margin:0; background:var(--bg); color:var(--ink); font-family:"Times New Roman", Times, Georgia, serif; font-size:12.5px; line-height:1.35; }
    .toolbar { position:sticky; top:0; z-index:5; display:flex; gap:.6rem; flex-wrap:wrap; align-items:center; justify-content:space-between; padding:.75rem 1rem; background:#0b1b3a; color:#fff; font-family:system-ui,sans-serif; font-size:14px; }
    .toolbar button { appearance:none; border:0; border-radius:8px; padding:.55rem .9rem; font-weight:700; cursor:pointer; background:#1f6feb; color:#fff; }
    .sheet-wrap { padding:1.25rem 1rem 2.5rem; }
    .sheet { width:min(900px,100%); margin:0 auto; background:#fff; border:1px solid #bbb; box-shadow:0 10px 30px rgba(0,0,0,.08); }
    table { border-collapse:collapse; width:100%; }
    .inv { border:1.5px solid var(--line); }
    .inv td, .inv th { border:1px solid var(--line); vertical-align:top; padding:5px 7px; }
    .center { text-align:center; } .right { text-align:right; } .bold { font-weight:700; }
    .title { font-size:18px; font-weight:700; margin:0 0 4px; }
    .company { font-size:15px; font-weight:700; margin:0 0 4px; }
    .small { font-size:11.5px; color:var(--muted); }
    .section-label { font-size:11px; font-weight:700; text-decoration:underline; margin-bottom:3px; }
    .meta-label { font-size:11px; color:var(--muted); }
    .meta-value { font-weight:700; }
    .items th { background:#f7f7f7; font-size:11.5px; font-weight:700; }
    .sign { min-height:70px; text-align:right; padding-top:2.2rem !important; }
    .footer-note { text-align:center; font-size:11px; padding:6px; border-top:1px solid var(--line); }
    .words { font-style:italic; }
    .err { max-width:640px; margin:3rem auto; background:#fff; padding:1.5rem; border-radius:12px; font-family:system-ui,sans-serif; }
    @media print {
      body { background:#fff; }
      .toolbar { display:none !important; }
      .sheet-wrap { padding:0; }
      .sheet { width:100%; border:0; box-shadow:none; }
      @page { margin:12mm; size:A4; }
    }
  </style>
</head>
<body>
<?php if ($error || !$data): ?>
  <div class="err">
    <h1>Invoice unavailable</h1>
    <p><?= h($error ?: 'Not found') ?></p>
  </div>
<?php else:
  $c = $data['company'];
  $b = $data['buyer'];
  $s = $data['ship'];
  $m = $data['meta'];
  $halfRate = $data['gstMode'] === 'CGST_SGST' ? 9 : ($data['gstMode'] === 'IGST' ? 18 : 0);
?>
  <div class="toolbar">
    <div><strong>Tax Invoice #<?= h($data['invoiceNumber']) ?></strong> · MediaShouter</div>
    <button type="button" onclick="window.print()">Print / Save PDF</button>
  </div>
  <div class="sheet-wrap">
    <div class="sheet">
      <table class="inv">
        <tr><td colspan="4" class="center"><div class="title">Tax Invoice</div></td></tr>
        <tr>
          <td colspan="2" rowspan="3" style="width:55%">
            <div class="company"><?= h($c['legalName']) ?></div>
            <div><?= nl($c['address']) ?></div>
            <div>GSTIN/UIN: <strong><?= h($c['gstin']) ?></strong></div>
            <div>State Name : <?= h($c['state']) ?>, Code : <?= h($c['stateCode']) ?></div>
            <?php if ($c['email']): ?><div>E-Mail : <?= h($c['email']) ?></div><?php endif; ?>
          </td>
          <td style="width:22.5%"><div class="meta-label">Invoice No.</div><div class="meta-value"><?= h($data['invoiceNumber']) ?></div></td>
          <td style="width:22.5%"><div class="meta-label">Dated</div><div class="meta-value"><?= h(da_format_invoice_date($data['invoiceDate'])) ?></div></td>
        </tr>
        <tr>
          <td><div class="meta-label">Delivery Note</div><div><?= h($m['deliveryNote'] ?: ' ') ?></div></td>
          <td><div class="meta-label">Mode/Terms of Payment</div><div><?= h($m['modeOfPayment'] ?: ' ') ?></div></td>
        </tr>
        <tr>
          <td><div class="meta-label">Reference No. &amp; Date.</div><div><?= h($m['referenceNo'] ?: ' ') ?></div></td>
          <td><div class="meta-label">Other References</div><div><?= h($m['otherReferences'] ?: ' ') ?></div></td>
        </tr>
        <tr>
          <td rowspan="3">
            <div class="section-label">Consignee (Ship to)</div>
            <div class="bold"><?= h($s['name']) ?></div>
            <div><?= nl($s['address']) ?></div>
            <?php if ($s['gstin']): ?><div>GSTIN/UIN : <?= h($s['gstin']) ?></div><?php endif; ?>
            <div>State Name : <?= h($s['state']) ?>, Code : <?= h($s['stateCode']) ?></div>
          </td>
          <td rowspan="3">
            <div class="section-label">Buyer (Bill to)</div>
            <div class="bold"><?= h($b['name']) ?></div>
            <div><?= nl($b['address']) ?></div>
            <?php if ($b['gstin']): ?><div>GSTIN/UIN : <?= h($b['gstin']) ?></div><?php endif; ?>
            <div>State Name : <?= h($b['state']) ?>, Code : <?= h($b['stateCode']) ?></div>
          </td>
          <td><div class="meta-label">Buyer’s Order No.</div><div><?= h($m['buyerOrderNo'] ?: ' ') ?></div></td>
          <td><div class="meta-label">Dated</div><div><?= h($m['buyerOrderDate'] ? da_format_invoice_date($m['buyerOrderDate']) : ' ') ?></div></td>
        </tr>
        <tr>
          <td><div class="meta-label">Dispatch Doc No.</div><div><?= h($m['dispatchDocNo'] ?: ' ') ?></div></td>
          <td><div class="meta-label">Delivery Note Date</div><div><?= h($m['deliveryNoteDate'] ? da_format_invoice_date($m['deliveryNoteDate']) : ' ') ?></div></td>
        </tr>
        <tr>
          <td><div class="meta-label">Dispatched through</div><div><?= h($m['dispatchedThrough'] ?: ' ') ?></div></td>
          <td><div class="meta-label">Destination</div><div><?= h($m['destination'] ?: ' ') ?></div></td>
        </tr>
        <tr>
          <td colspan="2"><div class="meta-label">Terms of Delivery</div><div><?= h($m['termsOfDelivery'] ?: ' ') ?></div></td>
          <td colspan="2">&nbsp;</td>
        </tr>
      </table>

      <table class="inv items" style="border-top:0">
        <thead>
          <tr>
            <th class="center" style="width:6%">Sl<br />No.</th>
            <th style="width:38%">Particulars</th>
            <th class="center" style="width:12%">HSN/SAC</th>
            <th class="center" style="width:10%">Quantity</th>
            <th class="right" style="width:12%">Rate</th>
            <th class="center" style="width:8%">per</th>
            <th class="right" style="width:14%">Amount</th>
          </tr>
        </thead>
        <tbody>
          <?php foreach ($data['items'] as $i => $it): ?>
          <tr>
            <td class="center"><?= $i + 1 ?></td>
            <td>
              <strong><?= h($it['particulars']) ?></strong>
              <?php if ($it['description']): ?><br /><span class="small"><?= h($it['description']) ?></span><?php endif; ?>
            </td>
            <td class="center"><?= h($it['hsnSac']) ?></td>
            <td class="center"><?= $it['quantity'] !== null && $it['quantity'] !== '' ? h((string)$it['quantity']) : '' ?></td>
            <td class="right"><?= $it['ratePaise'] ? money((int)$it['ratePaise']) : '' ?></td>
            <td class="center"><?= h($it['unitLabel'] ?: '') ?></td>
            <td class="right"><?= money((int)$it['amountPaise']) ?></td>
          </tr>
          <?php endforeach; ?>

          <?php if ($data['gstMode'] === 'CGST_SGST'): ?>
          <tr>
            <td></td>
            <td class="right">SGST @ <?= (int)$halfRate ?>% Output</td>
            <td></td><td></td>
            <td class="right"><?= (int)$halfRate ?></td>
            <td class="center">%</td>
            <td class="right"><?= money((int)$data['sgstPaise']) ?></td>
          </tr>
          <tr>
            <td></td>
            <td class="right">CGST @ <?= (int)$halfRate ?>% Output</td>
            <td></td><td></td>
            <td class="right"><?= (int)$halfRate ?></td>
            <td class="center">%</td>
            <td class="right"><?= money((int)$data['cgstPaise']) ?></td>
          </tr>
          <?php elseif ($data['gstMode'] === 'IGST'): ?>
          <tr>
            <td></td>
            <td class="right">IGST @ 18% Output</td>
            <td></td><td></td>
            <td class="right">18</td>
            <td class="center">%</td>
            <td class="right"><?= money((int)$data['igstPaise']) ?></td>
          </tr>
          <?php endif; ?>

          <tr>
            <td></td>
            <td class="right bold">Total</td>
            <td colspan="4"></td>
            <td class="right bold">₹ <?= money((int)$data['grandTotalPaise']) ?></td>
          </tr>
        </tbody>
      </table>

      <table class="inv" style="border-top:0">
        <tr>
          <td colspan="2">
            <div>Amount Chargeable (in words) <span style="float:right">E. &amp; O.E</span></div>
            <div class="bold words"><?= h($data['amountInWords']) ?></div>
          </td>
        </tr>
        <tr>
          <td style="width:55%;padding:0">
            <table class="inv" style="border:0">
              <tr>
                <th>HSN/SAC</th>
                <th class="right">Taxable Value</th>
                <?php if ($data['gstMode'] === 'IGST'): ?>
                <th class="right">IGST</th>
                <?php else: ?>
                <th class="right">CGST 9%</th>
                <th class="right">SGST 9%</th>
                <?php endif; ?>
                <th class="right">Total Tax</th>
              </tr>
              <?php foreach ($data['hsnSummary'] as $row): ?>
              <tr>
                <td class="center"><?= h($row['hsnSac']) ?></td>
                <td class="right"><?= money((int)$row['taxablePaise']) ?></td>
                <?php if ($data['gstMode'] === 'IGST'): ?>
                <td class="right"><?= money((int)$row['igstPaise']) ?></td>
                <?php else: ?>
                <td class="right"><?= money((int)$row['cgstPaise']) ?></td>
                <td class="right"><?= money((int)$row['sgstPaise']) ?></td>
                <?php endif; ?>
                <td class="right"><?= money((int)$row['totalTaxPaise']) ?></td>
              </tr>
              <?php endforeach; ?>
              <tr>
                <td class="bold center">Total</td>
                <td class="right bold"><?= money((int)$data['taxablePaise']) ?></td>
                <?php if ($data['gstMode'] === 'IGST'): ?>
                <td class="right bold"><?= money((int)$data['igstPaise']) ?></td>
                <?php else: ?>
                <td class="right bold"><?= money((int)$data['cgstPaise']) ?></td>
                <td class="right bold"><?= money((int)$data['sgstPaise']) ?></td>
                <?php endif; ?>
                <td class="right bold"><?= money((int)$data['totalGstPaise']) ?></td>
              </tr>
            </table>
          </td>
          <td style="width:45%">
            <div>Tax Amount (in words) :</div>
            <div class="bold words"><?= h($data['taxInWords']) ?></div>
          </td>
        </tr>
        <tr>
          <td>
            <div class="small">Company’s Bank Details</div>
            <div>Configured in Admin → Quotations → Company &amp; GST</div>
          </td>
          <td class="sign">
            <div>for <strong><?= h($c['legalName']) ?></strong></div>
            <div style="margin-top:2.5rem">Authorised Signatory</div>
          </td>
        </tr>
      </table>
      <div class="footer-note">This is a Computer Generated Invoice</div>
    </div>
  </div>
<?php endif; ?>
</body>
</html>
