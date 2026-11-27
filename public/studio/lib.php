<?php
declare(strict_types=1);

/**
 * DisplayAvenue Studios — booking system core.
 * Data lives in /studio/data/*.json (never served: see data/.htaccess).
 * Deploys must NOT overwrite /studio/data/*.json.
 */

date_default_timezone_set('Asia/Kolkata');

const DA_DATA_DIR = __DIR__ . '/data';
const DA_CONFIRMED = ['booked', 'completed'];
const DA_HELD = ['accepted', 'payment_claimed'];
const DA_STATUSES = [
  'draft' => 'Draft',
  'sent' => 'Quote sent',
  'accepted' => 'Terms accepted',
  'payment_claimed' => 'Payment to verify',
  'booked' => 'Booked',
  'completed' => 'Completed',
  'cancelled' => 'Cancelled',
];

function da_default_settings(): array {
  return [
    'studio_name' => 'DisplayAvenue Studios',
    'upi_id' => '',
    'payee_name' => 'DisplayAvenue Studios',
    'studio_phone' => '+91 7400303493',
    'notify_email' => 'hello@displayavenuestudios.com',
    'teams_per_day' => 2,
    'advance_percent' => 30,
    'quote_valid_days' => 7,
    'site_url' => 'https://displayavenuestudios.com',
    'cron_key' => bin2hex(random_bytes(12)),
    'terms' => "1. Your date is confirmed only after the advance payment is received and verified by us. Until then the date may be offered to other couples.\n"
      . "2. The balance amount is due before the final photos and films are delivered.\n"
      . "3. Date or venue changes are subject to our availability. Extra travel, stay or overtime beyond the booked hours is charged at actuals or as agreed in writing.\n"
      . "4. Cancellation: [STUDIO TO FILL — e.g. how much of the advance is refundable and up to when].\n"
      . "5. Delivery timelines: [STUDIO TO FILL — e.g. edited photos in X weeks, highlight film in Y weeks, full film in Z weeks].\n"
      . "6. We may use selected photos and films in our portfolio and social media unless you ask us not to in writing.\n"
      . "7. Raw/unedited files are not part of the deliverables unless listed in this quote.\n"
      . "8. Venue entry fees, permissions for drones or monuments, and travel/stay for outstation events are paid by the client unless included above.",
    'checklist_photographer' => "Batteries charged + spares packed\nMemory cards formatted + spares\nBoth camera bodies tested\nLenses cleaned (wide, 50mm/85mm, telephoto)\nFlash/speedlights + triggers + spare batteries\nRead the shot list and the family's key rituals\nReached venue 45 minutes early and met the coordinator\nGroup photos list confirmed with the family\nCards backed up to laptop/drive before leaving\nCards handed over / uploaded at studio",
    'checklist_videographer' => "Batteries charged + spares packed\nMemory cards formatted + spares\nCamera settings set (frame rate, resolution, picture profile)\nGimbal balanced and charged\nLapel/audio recorder tested, fresh batteries\nDrone batteries charged and permission checked (if booked)\nRead the shot list and the family's key rituals\nReached venue 45 minutes early and met the coordinator\nAll footage backed up before leaving\nCards handed over / uploaded at studio",
  ];
}

/* ---------- storage ---------- */

function da_data_path(string $name): string {
  if (!is_dir(DA_DATA_DIR)) mkdir(DA_DATA_DIR, 0750, true);
  $ht = DA_DATA_DIR . '/.htaccess';
  if (!is_file($ht)) file_put_contents($ht, "Require all denied\nDeny from all\n");
  return DA_DATA_DIR . '/' . $name . '.json';
}

function da_load(string $name, $default = []) {
  $path = da_data_path($name);
  if (!is_file($path)) return $default;
  $fh = fopen($path, 'r');
  if (!$fh) return $default;
  flock($fh, LOCK_SH);
  $raw = stream_get_contents($fh);
  flock($fh, LOCK_UN);
  fclose($fh);
  $data = json_decode($raw ?: 'null', true);
  return is_array($data) ? $data : $default;
}

/** Atomically load-modify-save under an exclusive lock. */
function da_update(string $name, callable $fn, $default = []) {
  $path = da_data_path($name);
  $fh = fopen($path, 'c+');
  if (!$fh) throw new RuntimeException('Cannot open data file');
  flock($fh, LOCK_EX);
  $raw = stream_get_contents($fh);
  $data = json_decode($raw ?: 'null', true);
  if (!is_array($data)) $data = $default;
  $result = $fn($data);
  $json = json_encode($data, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
  ftruncate($fh, 0);
  rewind($fh);
  fwrite($fh, $json . "\n");
  fflush($fh);
  flock($fh, LOCK_UN);
  fclose($fh);
  return $result;
}

function da_settings(): array {
  $s = da_load('settings', []);
  $merged = array_merge(da_default_settings(), $s);
  if (empty($s)) {
    da_update('settings', function (&$d) use ($merged) { $d = $merged; });
  }
  return $merged;
}

function da_bookings(): array { return da_load('bookings', []); }
function da_crew(): array { return da_load('crew', []); }

function da_find_booking(array $bookings, string $key, string $field = 'id'): ?array {
  foreach ($bookings as $b) if (($b[$field] ?? '') === $key) return $b;
  return null;
}

function da_token(): string { return bin2hex(random_bytes(12)); }

/* ---------- helpers ---------- */

function h($v): string { return htmlspecialchars((string)$v, ENT_QUOTES, 'UTF-8'); }

function da_money($n): string {
  $n = (int)round((float)$n);
  $neg = $n < 0; $n = abs($n);
  $s = (string)$n;
  if (strlen($s) > 3) {
    $last3 = substr($s, -3);
    $rest = substr($s, 0, -3);
    $rest = preg_replace('/\B(?=(\d{2})+(?!\d))/', ',', $rest);
    $s = $rest . ',' . $last3;
  }
  return ($neg ? '-' : '') . '₹' . $s;
}

function da_date($ymd, string $fmt = 'D, j M Y'): string {
  $t = strtotime((string)$ymd);
  return $t ? date($fmt, $t) : (string)$ymd;
}

function da_phone_digits(string $phone): string {
  $d = preg_replace('/\D+/', '', $phone);
  if (strlen($d) === 10) $d = '91' . $d;
  if (strlen($d) === 11 && $d[0] === '0') $d = '91' . substr($d, 1);
  return $d;
}

function da_wa_link(string $phone, string $text): string {
  return 'https://wa.me/' . da_phone_digits($phone) . '?text=' . rawurlencode($text);
}

function da_totals(array $b): array {
  $sub = 0;
  foreach ($b['items'] ?? [] as $it) $sub += (float)($it['amount'] ?? 0);
  $discount = (float)($b['discount'] ?? 0);
  $total = max(0, $sub - $discount);
  $advPct = (float)($b['advance_percent'] ?? 30);
  $advance = (int)round($total * $advPct / 100);
  $paid = 0;
  foreach ($b['payments'] ?? [] as $p) $paid += (float)($p['amount'] ?? 0);
  return [
    'subtotal' => $sub,
    'discount' => $discount,
    'total' => $total,
    'advance' => $advance,
    'paid' => $paid,
    'balance' => max(0, $total - $paid),
    'advance_due' => max(0, $advance - $paid),
  ];
}

function da_upi_link(array $settings, float $amount, string $note): string {
  $q = [
    'pa' => $settings['upi_id'],
    'pn' => $settings['payee_name'],
    'am' => number_format($amount, 2, '.', ''),
    'cu' => 'INR',
    'tn' => mb_substr($note, 0, 60),
  ];
  return 'upi://pay?' . http_build_query($q, '', '&', PHP_QUERY_RFC3986);
}

/** Per-date load: confirmed events, held events, and capacity. */
function da_date_load(array $bookings, int $teams, ?string $excludeBookingId = null): array {
  $load = [];
  foreach ($bookings as $b) {
    if ($excludeBookingId && $b['id'] === $excludeBookingId) continue;
    $st = $b['status'] ?? 'draft';
    $isConf = in_array($st, DA_CONFIRMED, true);
    $isHeld = in_array($st, DA_HELD, true);
    if (!$isConf && !$isHeld) continue;
    $seen = [];
    foreach ($b['events'] ?? [] as $e) {
      $d = $e['date'] ?? '';
      if (!$d || isset($seen[$d])) continue; // one team-day per booking per date
      $seen[$d] = true;
      $load[$d] = $load[$d] ?? ['confirmed' => 0, 'held' => 0, 'who' => []];
      if ($isConf) $load[$d]['confirmed']++; else $load[$d]['held']++;
      $load[$d]['who'][] = ['id' => $b['id'], 'name' => $b['client']['name'] ?? '', 'status' => $st];
    }
  }
  foreach ($load as $d => &$l) {
    $l['full'] = $l['confirmed'] >= $teams;
    $l['left'] = max(0, $teams - $l['confirmed']);
  }
  return $load;
}

function da_date_state(array $load, string $date): string {
  if (!isset($load[$date])) return 'free';
  if ($load[$date]['full']) return 'full';
  if ($load[$date]['confirmed'] + $load[$date]['held'] > 0) return 'partial';
  return 'free';
}

/** Crew already booked on a date in another confirmed/held booking. */
function da_crew_busy(array $bookings, string $date, string $excludeBookingId): array {
  $busy = [];
  foreach ($bookings as $b) {
    if ($b['id'] === $excludeBookingId) continue;
    $st = $b['status'] ?? '';
    if (!in_array($st, array_merge(DA_CONFIRMED, DA_HELD), true)) continue;
    foreach ($b['events'] ?? [] as $e) {
      if (($e['date'] ?? '') !== $date) continue;
      foreach ($e['crew'] ?? [] as $cid) $busy[$cid] = $b['client']['name'] ?? $b['id'];
    }
  }
  return $busy;
}

function da_next_id(array $bookings): string {
  $year = date('Y');
  $max = 0;
  foreach ($bookings as $b) {
    if (preg_match('/^DAS-' . $year . '-(\d+)$/', $b['id'] ?? '', $m)) $max = max($max, (int)$m[1]);
  }
  return sprintf('DAS-%s-%04d', $year, $max + 1);
}

function da_log(array &$b, string $msg): void {
  $b['log'] = $b['log'] ?? [];
  $b['log'][] = ['at' => date('Y-m-d H:i'), 'msg' => $msg];
}

function da_mail(string $to, string $subject, string $body): bool {
  if (!filter_var($to, FILTER_VALIDATE_EMAIL)) return false;
  $headers = "From: DisplayAvenue Studios <website@displayavenuestudios.com>\r\n";
  $headers .= "Content-Type: text/plain; charset=utf-8\r\n";
  return @mail($to, '=?UTF-8?B?' . base64_encode($subject) . '?=', $body, $headers);
}

function da_client_ip(): string {
  return (string)($_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? '');
}

function da_quote_url(array $s, array $b): string {
  return rtrim($s['site_url'], '/') . '/studio/q.php?t=' . $b['token'];
}

function da_crew_url(array $s, array $b, string $crewId): string {
  $tok = $b['crew_tokens'][$crewId] ?? '';
  return rtrim($s['site_url'], '/') . '/studio/c.php?t=' . $tok;
}

function da_packages(): array {
  $path = dirname(__DIR__) . '/content/packages.json';
  $out = [];
  if (!is_file($path)) return $out;
  $data = json_decode((string)file_get_contents($path), true);
  foreach (($data['packageGroups'] ?? []) as $g) {
    foreach (($g['tiers'] ?? []) as $t) {
      $price = (int)preg_replace('/\D+/', '', (string)($t['priceLabel'] ?? ''));
      $out[] = [
        'label' => ($g['title'] ?? '') . ' — ' . ($t['name'] ?? ''),
        'desc' => trim(($t['name'] ?? '') . ' package: ' . implode(', ', array_slice($t['features'] ?? [], 0, 4))),
        'amount' => $price,
      ];
    }
  }
  return $out;
}
