<?php
declare(strict_types=1);

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/ids.php';
require_once __DIR__ . '/money.php';

function da_get_company(mysqli $db): array {
  $res = $db->query('SELECT * FROM company_profile ORDER BY created_at ASC LIMIT 1');
  $row = $res->fetch_assoc();
  if ($row) return $row;
  $id = da_id();
  $why = json_encode([
    'Strategy-focused execution',
    'Transparent scope',
    'Professional reporting',
    'Dedicated support',
    'Technology-driven marketing',
  ], JSON_UNESCAPED_UNICODE);
  $trust = json_encode([
    'GST Registered Business',
    'Secure Online Payment',
    'Transparent Pricing',
    'Defined Scope',
    'Professional Documentation',
  ], JSON_UNESCAPED_UNICODE);
  $wa = "Hello {{client_name}},\n\nPlease find your quotation from DisplayAvenue.\n\nQuotation No: {{quotation_number}}\nTotal: {{grand_total}}\nAdvance: {{advance}}\n\nReview & accept:\n{{secure_link}}\n\nRegards,\nDisplayAvenue\nMediashouter";
  $stmt = $db->prepare('INSERT INTO company_profile (id, why_choose_json, trust_json, whatsapp_template, email_subject_template, email_body_template) VALUES (?,?,?,?,?,?)');
  $subj = 'Quotation {{quotation_number}} from DisplayAvenue';
  $body = "Hello {{client_name}},\n\nPlease find your quotation.\n\nNumber: {{quotation_number}}\nValue: {{grand_total}}\nAdvance: {{advance}}\nValid until: {{valid_until}}\n\n{{secure_link}}\n\nRegards,\nDisplayAvenue";
  $stmt->bind_param('ssssss', $id, $why, $trust, $wa, $subj, $body);
  $stmt->execute();
  $res = $db->query('SELECT * FROM company_profile WHERE id=\'' . $db->real_escape_string($id) . '\'');
  return $res->fetch_assoc();
}

function da_seed_services(mysqli $db): void {
  $res = $db->query('SELECT COUNT(*) c FROM quote_services');
  if ((int) $res->fetch_assoc()['c'] > 0) return;
  $items = [
    ['SEO', 'Local SEO Setup', 'GMB + on-page foundation', 25000, 18],
    ['SEO', 'Monthly SEO Retainer', 'Ongoing SEO management', 20000, 18],
    ['Ads', 'Google Ads Setup', 'Campaign structure + tracking', 15000, 18],
    ['Ads', 'Meta Ads Management', 'Monthly ad management', 18000, 18],
    ['Web', 'Business Website', '5-page marketing site', 45000, 18],
    ['Brand', 'Brand Identity Starter', 'Logo + basic kit', 22000, 18],
  ];
  $stmt = $db->prepare('INSERT INTO quote_services (id, category, name, description, unit_price_paise, gst_percent, sort_order) VALUES (?,?,?,?,?,?,?)');
  foreach ($items as $i => $it) {
    $id = da_id();
    $paise = da_inr_to_paise($it[3]);
    $gst = (float) $it[4];
    $stmt->bind_param('ssssidi', $id, $it[0], $it[1], $it[2], $paise, $gst, $i);
    $stmt->execute();
  }
}
