<?php
declare(strict_types=1);

function da_inr_to_paise($inr): int {
  return (int) round(((float) $inr) * 100);
}

function da_paise_to_inr(int $paise): float {
  return round($paise) / 100;
}

function da_format_inr(int $paise): string {
  $inr = da_paise_to_inr($paise);
  return '₹' . number_format($inr, 2, '.', ',');
}

function da_same_state(?string $a, ?string $b): bool {
  $norm = static function (?string $s): string {
    return preg_replace('/\s+/', ' ', strtolower(trim((string) $s))) ?? '';
  };
  $left = $norm($a);
  $right = $norm($b);
  if ($left === '' || $right === '') return true;
  return $left === $right;
}

/** @return array{quantity:float,unit_price_paise:int,discount_paise:int,taxable_paise:int,gst_paise:int,total_paise:int,gst_percent:float} */
function da_calc_line(array $input): array {
  $qty = max(0.0, (float) ($input['quantity'] ?? 0));
  $unit = da_inr_to_paise($input['unit_price_inr'] ?? 0);
  $gross = (int) round($qty * $unit);
  $discount = 0;
  if (!empty($input['discount_amount_inr'])) {
    $discount = da_inr_to_paise($input['discount_amount_inr']);
  } elseif (!empty($input['discount_percent'])) {
    $discount = (int) round(($gross * (float) $input['discount_percent']) / 100);
  }
  $discount = min($discount, $gross);
  $taxable = $gross - $discount;
  $gstPercent = max(0.0, (float) ($input['gst_percent'] ?? 18));
  $gst = (int) round(($taxable * $gstPercent) / 100);
  return [
    'quantity' => $qty,
    'unit_price_paise' => $unit,
    'discount_paise' => $discount,
    'taxable_paise' => $taxable,
    'gst_paise' => $gst,
    'total_paise' => $taxable + $gst,
    'gst_percent' => $gstPercent,
  ];
}

/** @param list<array> $lines */
function da_calc_quote_totals(array $lines, ?string $companyState, ?string $clientState): array {
  $subtotal = 0;
  $discount = 0;
  $taxable = 0;
  $totalGst = 0;
  foreach ($lines as $l) {
    $subtotal += ((int) $l['taxable_paise']) + ((int) $l['discount_paise']);
    $discount += (int) $l['discount_paise'];
    $taxable += (int) $l['taxable_paise'];
    $totalGst += (int) $l['gst_paise'];
  }
  $intra = da_same_state($companyState, $clientState);
  $mode = $totalGst === 0 ? 'NONE' : ($intra ? 'CGST_SGST' : 'IGST');
  $cgst = 0;
  $sgst = 0;
  $igst = 0;
  if ($mode === 'CGST_SGST') {
    $cgst = (int) ceil($totalGst / 2);
    $sgst = $totalGst - $cgst;
  } elseif ($mode === 'IGST') {
    $igst = $totalGst;
  }
  return [
    'subtotal_paise' => $subtotal,
    'discount_paise' => $discount,
    'taxable_paise' => $taxable,
    'cgst_paise' => $cgst,
    'sgst_paise' => $sgst,
    'igst_paise' => $igst,
    'total_gst_paise' => $totalGst,
    'grand_total_paise' => $taxable + $totalGst,
    'gst_mode' => $mode,
  ];
}

function da_calc_advance(int $grandTotalPaise, float $advancePercent): array {
  $pct = min(100.0, max(0.0, $advancePercent));
  $advance = (int) round(($grandTotalPaise * $pct) / 100);
  return [
    'advance_paise' => $advance,
    'balance_paise' => $grandTotalPaise - $advance,
  ];
}

function da_default_terms(): string {
  $lines = [
    'This quotation is valid until the date specified in the quotation.',
    'Work will commence after receipt of the applicable advance payment and required client inputs.',
    'The standard payment structure is 60% advance and 40% balance unless otherwise specified in the quotation.',
    'Acceptance of the quotation confirms the client\'s approval of the stated scope, pricing and payment terms.',
    'Any work outside the agreed scope will be treated as additional work and may be charged separately.',
    'Advertising spend, third-party platform fees, domain registration, hosting, software subscriptions, paid plugins, stock assets, influencer fees and other third-party costs are excluded unless specifically mentioned.',
    'GST and other applicable statutory taxes will be charged as applicable.',
    'Digital marketing results depend on external platforms and market conditions; specific lead volumes are not guaranteed unless expressly stated in writing.',
    'Advance payments are generally non-refundable after commencement of work, except where otherwise agreed in writing.',
    'Any disputes shall be handled under applicable Indian law.',
  ];
  return implode("\n", array_map(static fn($l, $i) => ($i + 1) . '. ' . $l, $lines, array_keys($lines)));
}
