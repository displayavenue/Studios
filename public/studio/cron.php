<?php
declare(strict_types=1);
require __DIR__ . '/lib.php';

header('Content-Type: text/plain; charset=utf-8');
header('X-Robots-Tag: noindex');

$S = da_settings();
$key = (string)($_GET['key'] ?? ($argv[1] ?? ''));
if (!hash_equals((string)$S['cron_key'], $key)) { http_response_code(403); echo "forbidden\n"; exit; }

$today = date('Y-m-d');
$bookings = da_bookings();
$crew = [];
foreach (da_crew() as $c) $crew[$c['id']] = $c;
$admin = rtrim($S['site_url'], '/') . '/studio/index.php';

$lines = [];
$verify = array_filter($bookings, fn($b) => $b['status'] === 'payment_claimed');
if ($verify) {
  $lines[] = "PAYMENTS TO VERIFY";
  foreach ($verify as $b) { $c = end($b['claims']); $lines[] = "- {$b['client']['name']} ({$b['id']}): " . da_money($c['amount'] ?? 0) . (!empty($c['utr']) ? " UTR {$c['utr']}" : ''); }
  $lines[] = '';
}

$remind = [];
$unassigned = [];
$clientMails = 0;
foreach ($bookings as $b) {
  if (!in_array($b['status'], DA_CONFIRMED, true)) continue;
  foreach ($b['events'] as $e) {
    $days = (int)round((strtotime($e['date']) - strtotime($today)) / 86400);
    if ($days < 0 || $days > 7) continue;
    if (in_array($days, [1, 7], true)) $remind[] = "- " . ($days === 1 ? 'TOMORROW' : 'In 7 days') . ": " . da_date($e['date'], 'D j M') . " · " . ($e['function'] ?: 'Event') . " · {$b['client']['name']} · " . ($e['venue'] ?: 'venue TBC');
    if (empty($e['crew'])) $unassigned[] = "- " . da_date($e['date'], 'D j M') . " · {$b['client']['name']} · " . ($e['function'] ?: 'Event');
    // free email reminder to the client the day before (WhatsApp is sent from the dashboard)
    $key = $e['id'] . ':email1';
    if ($days === 1 && empty($b['reminders'][$key]) && filter_var($b['client']['email'] ?? '', FILTER_VALIDATE_EMAIL)) {
      $team = [];
      foreach ($e['crew'] ?? [] as $cid) if (isset($crew[$cid])) $team[] = $crew[$cid]['name'] . ' (' . $crew[$cid]['phone'] . ')';
      $body = "Hi {$b['client']['name']},\n\nA quick reminder that your " . ($e['function'] ?: 'event') . " is tomorrow, " . da_date($e['date'], 'l, j F') . ($e['start'] ? " at {$e['start']}" : '') . ($e['venue'] ? ", {$e['venue']}" : '') . ".\n"
        . ($team ? "Your team: " . implode(', ', $team) . ".\n" : '') . "\nPlease share the venue location and a contact person on WhatsApp: {$S['studio_phone']}.\n\nSee you there!\nTeam {$S['studio_name']}";
      if (da_mail($b['client']['email'], 'Reminder: your ' . ($e['function'] ?: 'event') . ' is tomorrow', $body)) {
        $clientMails++;
        da_update('bookings', function (&$all) use ($b, $key) { foreach ($all as &$x) if ($x['id'] === $b['id']) $x['reminders'][$key] = date('Y-m-d H:i'); });
      }
    }
  }
}
if ($remind) { $lines[] = "WHATSAPP REMINDERS TO SEND TODAY (one tap from the dashboard)"; array_push($lines, ...$remind); $lines[] = ''; }
if ($unassigned) { $lines[] = "EVENTS IN THE NEXT 7 DAYS WITH NO CREW"; array_push($lines, ...$unassigned); $lines[] = ''; }

if ($lines) {
  $lines[] = "Open the dashboard: $admin";
  da_mail($S['notify_email'], 'Studio today — ' . date('D j M'), implode("\n", $lines));
}
echo "ok · digest lines: " . count($lines) . " · client emails: $clientMails\n";
