<?php
declare(strict_types=1);
require __DIR__ . '/lib.php';

header('Cache-Control: no-store');
header('X-Robots-Tag: noindex, nofollow');
header('X-Frame-Options: SAMEORIGIN');

$adminConfig = require dirname(__DIR__) . '/admin/config.php';
session_name('da_admin');
session_start([
  'cookie_httponly' => true,
  'cookie_samesite' => 'Lax',
  'cookie_secure' => (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off'),
  'cookie_path' => '/',
]);

function da_authed(array $cfg): bool {
  if (empty($_SESSION['da_auth'])) return false;
  $ttl = (int)($cfg['session_ttl'] ?? 28800);
  return !empty($_SESSION['da_auth_at']) && (time() - (int)$_SESSION['da_auth_at']) <= $ttl;
}

if (!da_authed($adminConfig)) {
  http_response_code(401);
  echo '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Studio bookings — sign in</title><link rel="stylesheet" href="studio.css"></head><body><div class="wrap"><div class="card"><h1>Studio bookings</h1><p>Please sign in to the website admin first, then come back to this page.</p><p class="actions"><a class="btn" href="/admin/">Go to admin sign-in</a> <a class="btn ghost" href="/studio/">I have signed in — reload</a></p></div></div></body></html>';
  exit;
}

if (empty($_SESSION['studio_csrf'])) $_SESSION['studio_csrf'] = bin2hex(random_bytes(16));
$CSRF = $_SESSION['studio_csrf'];

$S = da_settings();
$flash = $_SESSION['studio_flash'] ?? null;
unset($_SESSION['studio_flash']);

function flash(string $msg, string $kind = 'ok'): void { $_SESSION['studio_flash'] = [$kind, $msg]; }
function go(string $qs): void { header('Location: index.php' . ($qs ? '?' . $qs : '')); exit; }
function post(string $k, $d = '') { return $_POST[$k] ?? $d; }
function csrf_field(string $t): string { return '<input type="hidden" name="csrf" value="' . h($t) . '">'; }

/* =================== ACTIONS =================== */
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  if (!hash_equals($CSRF, (string)post('csrf'))) { flash('Your session expired. Please try again.', 'bad'); go(''); }
  $action = (string)post('action');

  if ($action === 'save_booking') {
    $id = (string)post('id');
    $events = [];
    foreach ((array)post('events', []) as $e) {
      $date = trim((string)($e['date'] ?? ''));
      if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) continue;
      $events[] = [
        'id' => (string)($e['id'] ?? '') ?: substr(da_token(), 0, 8),
        'date' => $date,
        'function' => trim((string)($e['function'] ?? '')),
        'venue' => trim((string)($e['venue'] ?? '')),
        'start' => trim((string)($e['start'] ?? '')),
        'end' => trim((string)($e['end'] ?? '')),
      ];
    }
    usort($events, fn($a, $b) => strcmp($a['date'] . $a['start'], $b['date'] . $b['start']));
    $items = [];
    foreach ((array)post('items', []) as $it) {
      $desc = trim((string)($it['desc'] ?? ''));
      $amt = (float)preg_replace('/[^\d.]/', '', (string)($it['amount'] ?? ''));
      if ($desc === '' && $amt == 0.0) continue;
      $items[] = ['desc' => $desc, 'amount' => $amt];
    }
    $client = [
      'name' => trim((string)post('client_name')),
      'phone' => trim((string)post('client_phone')),
      'email' => trim((string)post('client_email')),
      'city' => trim((string)post('client_city')),
    ];
    if ($client['name'] === '' || $client['phone'] === '') { flash('Client name and phone are required.', 'bad'); go($id ? 'v=edit&id=' . rawurlencode($id) : 'v=edit'); }

    $savedId = da_update('bookings', function (&$all) use ($id, $events, $items, $client, $S) {
      if ($id) {
        foreach ($all as &$b) {
          if ($b['id'] !== $id) continue;
          // keep crew already assigned to events that still exist
          $old = [];
          foreach ($b['events'] ?? [] as $oe) $old[$oe['id']] = $oe['crew'] ?? [];
          foreach ($events as &$ne) $ne['crew'] = $old[$ne['id']] ?? [];
          unset($ne);
          $b['client'] = $client;
          $b['events'] = $events;
          $b['items'] = $items;
          $b['discount'] = (float)post('discount', 0);
          $b['advance_percent'] = (float)post('advance_percent', $S['advance_percent']);
          $b['notes'] = trim((string)post('notes'));
          $b['valid_until'] = (string)post('valid_until') ?: $b['valid_until'];
          $b['updated_at'] = date('Y-m-d H:i');
          da_log($b, 'Quote edited');
          return $b['id'];
        }
        return null;
      }
      foreach ($events as &$ne) $ne['crew'] = [];
      unset($ne);
      $b = [
        'id' => da_next_id($all),
        'token' => da_token(),
        'status' => 'draft',
        'created_at' => date('Y-m-d H:i'),
        'updated_at' => date('Y-m-d H:i'),
        'client' => $client,
        'events' => $events,
        'items' => $items,
        'discount' => (float)post('discount', 0),
        'advance_percent' => (float)post('advance_percent', $S['advance_percent']),
        'notes' => trim((string)post('notes')),
        'valid_until' => (string)post('valid_until') ?: date('Y-m-d', strtotime('+' . (int)$S['quote_valid_days'] . ' days')),
        'source' => (string)post('source'),
        'payments' => [], 'claims' => [], 'crew_tokens' => [], 'checklists' => [], 'reminders' => [], 'log' => [],
      ];
      da_log($b, 'Quote created');
      $all[] = $b;
      return $b['id'];
    });
    if (!$savedId) { flash('Booking not found.', 'bad'); go('v=list'); }
    flash('Quote saved.');
    go('v=b&id=' . rawurlencode($savedId));
  }

  $id = (string)post('id');

  if ($action === 'set_status') {
    $to = (string)post('status');
    if (!isset(DA_STATUSES[$to])) go('v=b&id=' . rawurlencode($id));
    da_update('bookings', function (&$all) use ($id, $to) {
      foreach ($all as &$b) if ($b['id'] === $id) { $b['status'] = $to; da_log($b, 'Status set to ' . DA_STATUSES[$to]); }
    });
    flash('Status updated to ' . DA_STATUSES[$to] . '.');
    go('v=b&id=' . rawurlencode($id));
  }

  if ($action === 'add_payment') {
    $amt = (float)preg_replace('/[^\d.]/', '', (string)post('amount'));
    if ($amt <= 0) { flash('Enter the amount received.', 'bad'); go('v=b&id=' . rawurlencode($id)); }
    $warn = '';
    da_update('bookings', function (&$all) use ($id, $amt, $S, &$warn) {
      foreach ($all as &$b) {
        if ($b['id'] !== $id) continue;
        $b['payments'][] = [
          'amount' => $amt,
          'method' => (string)post('method', 'UPI'),
          'ref' => trim((string)post('ref')),
          'at' => (string)post('paid_on') ?: date('Y-m-d'),
          'note' => trim((string)post('note')),
        ];
        foreach ($b['claims'] as &$c) if (empty($c['resolved'])) $c['resolved'] = date('Y-m-d H:i');
        unset($c);
        da_log($b, 'Payment recorded: ' . da_money($amt));
        $t = da_totals($b);
        if (in_array($b['status'], ['draft', 'sent', 'accepted', 'payment_claimed'], true) && $t['paid'] > 0) {
          // confirm date(s) unless already full
          $load = da_date_load($all, (int)$S['teams_per_day'], $b['id']);
          foreach ($b['events'] as $e) if (!empty($load[$e['date']]['full'])) $warn .= da_date($e['date']) . ' ';
          $b['status'] = 'booked';
          $b['booked_at'] = date('Y-m-d H:i');
          da_log($b, 'Booking confirmed');
        }
      }
    });
    flash('Payment recorded.' . ($warn ? ' Warning: these dates were already full: ' . trim($warn) . ' — check crew.' : ''), $warn ? 'warn' : 'ok');
    go('v=b&id=' . rawurlencode($id));
  }

  if ($action === 'reject_claim') {
    da_update('bookings', function (&$all) use ($id) {
      foreach ($all as &$b) {
        if ($b['id'] !== $id) continue;
        foreach ($b['claims'] as &$c) if (empty($c['resolved'])) { $c['resolved'] = date('Y-m-d H:i'); $c['rejected'] = true; }
        unset($c);
        if ($b['status'] === 'payment_claimed') $b['status'] = 'accepted';
        da_log($b, 'Payment claim marked not received');
      }
    });
    flash('Marked as not received. The client can submit the payment again.', 'warn');
    go('v=b&id=' . rawurlencode($id));
  }

  if ($action === 'assign_crew') {
    $map = (array)post('crew', []);
    da_update('bookings', function (&$all) use ($id, $map) {
      foreach ($all as &$b) {
        if ($b['id'] !== $id) continue;
        foreach ($b['events'] as &$e) {
          $e['crew'] = array_values(array_filter(array_map('strval', (array)($map[$e['id']] ?? []))));
          foreach ($e['crew'] as $cid) if (empty($b['crew_tokens'][$cid])) $b['crew_tokens'][$cid] = da_token();
        }
        unset($e);
        da_log($b, 'Crew updated');
      }
    });
    flash('Crew saved. Use the WhatsApp buttons to notify each person.');
    go('v=b&id=' . rawurlencode($id) . '#crew');
  }

  if ($action === 'mark_reminder') {
    $key = (string)post('key');
    da_update('bookings', function (&$all) use ($id, $key) {
      foreach ($all as &$b) if ($b['id'] === $id) { $b['reminders'][$key] = date('Y-m-d H:i'); }
    });
    go((string)post('back', ''));
  }

  if ($action === 'save_crew') {
    $cid = (string)post('cid');
    $row = [
      'name' => trim((string)post('name')),
      'role' => (string)post('role', 'photographer'),
      'phone' => trim((string)post('phone')),
      'active' => post('active', '1') === '1',
    ];
    if ($row['name'] === '' || $row['phone'] === '') { flash('Name and phone are required.', 'bad'); go('v=crew'); }
    da_update('crew', function (&$all) use ($cid, $row) {
      if ($cid) { foreach ($all as &$c) if ($c['id'] === $cid) $c = array_merge($c, $row); return; }
      $row['id'] = substr(da_token(), 0, 10);
      $all[] = $row;
    });
    flash('Crew saved.');
    go('v=crew');
  }

  if ($action === 'save_settings') {
    $keys = ['upi_id', 'payee_name', 'studio_phone', 'notify_email', 'teams_per_day', 'advance_percent', 'quote_valid_days', 'terms', 'checklist_photographer', 'checklist_videographer'];
    da_update('settings', function (&$d) use ($keys, $S) {
      $d = array_merge($S, $d);
      foreach ($keys as $k) {
        $v = trim((string)post($k));
        if (in_array($k, ['teams_per_day', 'advance_percent', 'quote_valid_days'], true)) $v = max(0, (int)$v);
        $d[$k] = $v;
      }
      if ($d['teams_per_day'] < 1) $d['teams_per_day'] = 1;
    });
    flash('Settings saved.');
    go('v=settings');
  }

  go('');
}

/* =================== VIEW HELPERS =================== */
$view = (string)($_GET['v'] ?? 'home');
$bookings = da_bookings();
$crew = da_crew();
$crewById = [];
foreach ($crew as $c) $crewById[$c['id']] = $c;
$teams = (int)$S['teams_per_day'];
$load = da_date_load($bookings, $teams);

function pill(string $status): string { return '<span class="pill ' . h($status) . '">' . h(DA_STATUSES[$status] ?? $status) . '</span>'; }

function head(string $title, string $view): void {
  $nav = ['home' => 'Today', 'list' => 'Bookings', 'cal' => 'Calendar', 'crew' => 'Crew', 'settings' => 'Settings'];
  echo '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex"><title>' . h($title) . ' — Studio bookings</title>';
  echo '<link rel="icon" href="/favicon.svg"><link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Marcellus&family=Jost:wght@400;500&display=swap" rel="stylesheet"><link rel="stylesheet" href="studio.css"></head><body>';
  echo '<header class="topbar"><a class="brand" href="index.php">DisplayAvenue Studios · Bookings</a><nav aria-label="Studio">';
  foreach ($nav as $k => $label) echo '<a href="index.php' . ($k === 'home' ? '' : '?v=' . $k) . '"' . ($view === $k ? ' class="on" aria-current="page"' : '') . '>' . h($label) . '</a>';
  echo '<a href="index.php?v=edit">+ New quote</a><a href="/admin/">Website admin</a></nav></header><main class="wrap">';
  global $flash;
  if ($flash) echo '<div class="notice ' . h($flash[0]) . '" role="status">' . h($flash[1]) . '</div>';
}
function foot(): void { echo '</main></body></html>'; }

function crew_names(array $ids, array $crewById): string {
  $n = [];
  foreach ($ids as $id) if (isset($crewById[$id])) $n[] = $crewById[$id]['name'];
  return implode(', ', $n);
}

function wa_quote_msg(array $S, array $b): string {
  $first = $b['events'][0]['date'] ?? '';
  return "Hi " . $b['client']['name'] . ", thank you for considering " . $S['studio_name'] . "!\n\n"
    . "Here is your quote" . ($first ? " for " . da_date($first, 'j M Y') : '') . ":\n" . da_quote_url($S, $b) . "\n\n"
    . "Please review it, accept the terms and pay the advance to confirm your date. Dates are confirmed on a first-paid basis.\n\n— Team " . $S['studio_name'];
}

function wa_confirm_msg(array $S, array $b): string {
  $t = da_totals($b);
  $dates = implode(', ', array_unique(array_map(fn($e) => da_date($e['date'], 'j M Y'), $b['events'])));
  return "Hi " . $b['client']['name'] . ", we've received your payment of " . da_money($t['paid']) . ". Your booking " . $b['id'] . " is confirmed for " . $dates . "! 🎉\n\n"
    . "Balance due before delivery: " . da_money($t['balance']) . ".\nYour booking page: " . da_quote_url($S, $b) . "\n\n— Team " . $S['studio_name'];
}

function wa_client_reminder(array $S, array $b, array $e, array $crewById, int $days): string {
  $team = [];
  foreach ($e['crew'] ?? [] as $cid) if (isset($crewById[$cid])) $team[] = $crewById[$cid]['name'] . ' (' . $crewById[$cid]['phone'] . ')';
  $when = $days <= 1 ? 'tomorrow' : 'in ' . $days . ' days';
  return "Hi " . $b['client']['name'] . ", a quick reminder: your " . ($e['function'] ?: 'event') . " is " . $when . " — " . da_date($e['date'], 'D, j M') . ($e['start'] ? ' at ' . $e['start'] : '') . ($e['venue'] ? ', ' . $e['venue'] : '') . ".\n"
    . ($team ? "Your team: " . implode(', ', $team) . ".\n" : '')
    . "Please share the venue location pin and a contact person on the day. See you there!\n\n— Team " . $S['studio_name'];
}

function wa_crew_msg(array $S, array $b, array $e, array $c, string $kind = 'assign'): string {
  $head = $kind === 'assign' ? "Hi " . $c['name'] . ", you're booked for an event:" : "Hi " . $c['name'] . ", reminder for tomorrow's event:";
  return $head . "\n\n" . ($e['function'] ?: 'Event') . " — " . $b['client']['name'] . "\n📅 " . da_date($e['date'], 'D, j M Y') . ($e['start'] ? ', reach by ' . $e['start'] : '') . "\n📍 " . ($e['venue'] ?: 'Venue TBC') . "\n📞 Client: " . $b['client']['phone'] . "\n\n"
    . "Event details & your checklist: " . da_crew_url($S, $b, $c['id']) . "\n\n— " . $S['studio_name'];
}

/* =================== VIEWS =================== */

if ($view === 'home') {
  head('Today', $view);
  $today = date('Y-m-d');
  $in30 = date('Y-m-d', strtotime('+30 days'));
  $claims = array_filter($bookings, fn($b) => $b['status'] === 'payment_claimed');
  $open = array_filter($bookings, fn($b) => in_array($b['status'], ['draft', 'sent', 'accepted'], true));
  $upcoming = [];
  $balanceDue = 0;
  foreach ($bookings as $b) {
    if (!in_array($b['status'], DA_CONFIRMED, true)) continue;
    $balanceDue += da_totals($b)['balance'];
    foreach ($b['events'] as $e) if ($e['date'] >= $today && $e['date'] <= $in30) $upcoming[] = [$e, $b];
  }
  usort($upcoming, fn($x, $y) => strcmp($x[0]['date'] . $x[0]['start'], $y[0]['date'] . $y[0]['start']));

  echo '<h1>Today</h1><div class="row">';
  echo '<div class="card stat"><b>' . count($claims) . '</b><span>Payments to verify</span></div>';
  echo '<div class="card stat"><b>' . count($open) . '</b><span>Open quotes</span></div>';
  echo '<div class="card stat"><b>' . count($upcoming) . '</b><span>Events in the next 30 days</span></div>';
  echo '<div class="card stat"><b>' . da_money($balanceDue) . '</b><span>Balance still due</span></div>';
  echo '</div>';
  if (empty($S['upi_id'])) echo '<div class="notice warn" style="margin-top:16px">Add your UPI ID in <a href="index.php?v=settings">Settings</a> so clients can pay from the quote page.</div>';

  echo '<div class="row" style="margin-top:16px"><div class="grow stack">';

  // payments to verify
  echo '<section class="card"><h2>Payments to verify</h2>';
  if (!$claims) echo '<p class="muted">Nothing to verify. When a client says they have paid, it shows up here.</p>';
  foreach ($claims as $b) {
    $c = end($b['claims']);
    echo '<p><a href="index.php?v=b&id=' . h(rawurlencode($b['id'])) . '"><b>' . h($b['client']['name']) . '</b></a> says they paid <b>' . da_money($c['amount'] ?? 0) . '</b>' . (!empty($c['utr']) ? ' · UTR ' . h($c['utr']) : '') . ' <span class="muted small">' . h($c['at'] ?? '') . '</span><br><span class="small muted">Check your bank/UPI app, then confirm it on the booking.</span></p>';
  }
  echo '</section>';

  // reminders
  echo '<section class="card"><h2>Reminders to send</h2>';
  $any = false;
  foreach ($upcoming as [$e, $b]) {
    $days = (int)round((strtotime($e['date']) - strtotime($today)) / 86400);
    if (!in_array($days, [0, 1, 7, 6], true)) continue;
    $any = true;
    $tag = $days <= 1 ? 'd1' : 'd7';
    $key = $e['id'] . ':' . $tag;
    $sent = $b['reminders'][$key] ?? null;
    echo '<div style="padding:10px 0;border-bottom:1px solid var(--line)"><b>' . h(da_date($e['date'], 'D, j M')) . '</b> · ' . h($e['function'] ?: 'Event') . ' · ' . h($b['client']['name']) . ($sent ? ' <span class="pill booked">Sent ' . h($sent) . '</span>' : '') . '<div class="actions" style="margin-top:6px">';
    echo '<a class="btn wa small" target="_blank" rel="noopener" href="' . h(da_wa_link($b['client']['phone'], wa_client_reminder($S, $b, $e, $crewById, max(1, $days)))) . '">WhatsApp client</a>';
    foreach ($e['crew'] ?? [] as $cid) if (isset($crewById[$cid])) echo '<a class="btn wa small" target="_blank" rel="noopener" href="' . h(da_wa_link($crewById[$cid]['phone'], wa_crew_msg($S, $b, $e, $crewById[$cid], 'remind'))) . '">WhatsApp ' . h($crewById[$cid]['name']) . '</a>';
    if (!$sent) echo '<form method="post" style="display:inline">' . csrf_field($CSRF) . '<input type="hidden" name="action" value="mark_reminder"><input type="hidden" name="id" value="' . h($b['id']) . '"><input type="hidden" name="key" value="' . h($key) . '"><input type="hidden" name="back" value=""><button class="btn ghost small">Mark sent</button></form>';
    echo '</div></div>';
  }
  if (!$any) echo '<p class="muted">No reminders due today. Reminders appear 7 days and 1 day before each booked event.</p>';
  echo '</section>';

  // upcoming
  echo '<section class="card"><h2>Next 30 days</h2>';
  if (!$upcoming) echo '<p class="muted">No booked events in the next 30 days.</p>';
  else {
    echo '<div class="tablebox"><table><thead><tr><th>Date</th><th>Event</th><th>Client</th><th>Crew</th></tr></thead><tbody>';
    foreach ($upcoming as [$e, $b]) echo '<tr><td>' . h(da_date($e['date'], 'D, j M')) . '</td><td>' . h($e['function']) . '<br><span class="small muted">' . h($e['venue']) . '</span></td><td><a href="index.php?v=b&id=' . h(rawurlencode($b['id'])) . '">' . h($b['client']['name']) . '</a></td><td>' . (crew_names($e['crew'] ?? [], $crewById) ? h(crew_names($e['crew'], $crewById)) : '<span class="pill partial">Not assigned</span>') . '</td></tr>';
    echo '</tbody></table></div>';
  }
  echo '</section></div>';

  // enquiries
  echo '<div class="grow stack"><section class="card"><h2>New website enquiries</h2>';
  $csv = dirname(__DIR__) . '/admin/leads/enquiries.csv';
  $rows = [];
  if (is_file($csv) && ($fh = fopen($csv, 'r'))) {
    $hdr = fgetcsv($fh, 0, ',', '"', '\\');
    while (($r = fgetcsv($fh, 0, ',', '"', '\\')) !== false) if ($hdr && count($r) === count($hdr)) $rows[] = array_combine($hdr, $r);
    fclose($fh);
  }
  $rows = array_reverse($rows);
  $quotedPhones = [];
  foreach ($bookings as $b) $quotedPhones[da_phone_digits($b['client']['phone'] ?? '')] = $b['id'];
  if (!$rows) echo '<p class="muted">No enquiries yet.</p>';
  foreach (array_slice($rows, 0, 15) as $i => $r) {
    $ph = da_phone_digits($r['phone'] ?? '');
    echo '<div style="padding:10px 0;border-bottom:1px solid var(--line)"><b>' . h($r['name'] ?? '') . '</b> <span class="muted small">' . h($r['received_at_ist'] ?? '') . '</span><br><span class="small">' . h(trim(($r['date'] ?? '') . ' · ' . ($r['city'] ?? '') . ' · ' . ($r['package'] ?: ($r['service'] ?? '')), ' ·')) . '</span>';
    if (!empty($r['message'])) echo '<br><span class="small muted">' . h(mb_substr($r['message'], 0, 140)) . '</span>';
    echo '<div class="actions" style="margin-top:6px">';
    if (isset($quotedPhones[$ph]) && $ph) echo '<a class="btn ghost small" href="index.php?v=b&id=' . h(rawurlencode($quotedPhones[$ph])) . '">Open quote</a>';
    else echo '<a class="btn small" href="index.php?v=edit&lead=' . h(rawurlencode(base64_encode(json_encode($r)))) . '">Create quote</a>';
    if (!empty($r['phone'])) echo '<a class="btn wa small" target="_blank" rel="noopener" href="' . h(da_wa_link($r['phone'], 'Hi ' . ($r['name'] ?? '') . ', thank you for your enquiry with ' . $S['studio_name'] . '! ')) . '">WhatsApp</a>';
    echo '</div></div>';
  }
  echo '</section>';

  echo '<section class="card"><h2>Open quotes</h2>';
  if (!$open) echo '<p class="muted">No open quotes.</p>';
  foreach ($open as $b) echo '<p><a href="index.php?v=b&id=' . h(rawurlencode($b['id'])) . '">' . h($b['client']['name']) . '</a> ' . pill($b['status']) . ' <span class="small muted">' . h(da_money(da_totals($b)['total'])) . ($b['events'] ? ' · ' . h(da_date($b['events'][0]['date'], 'j M Y')) : '') . '</span></p>';
  echo '</section></div></div>';
  foot();
  exit;
}

if ($view === 'list') {
  head('Bookings', $view);
  $f = (string)($_GET['s'] ?? '');
  echo '<h1>Bookings</h1><p class="actions">';
  echo '<a class="btn ' . ($f === '' ? '' : 'ghost') . ' small" href="index.php?v=list">All</a>';
  foreach (DA_STATUSES as $k => $l) echo '<a class="btn ' . ($f === $k ? '' : 'ghost') . ' small" href="index.php?v=list&s=' . h($k) . '">' . h($l) . '</a>';
  echo '</p><div class="card tablebox"><table><thead><tr><th>ID</th><th>Client</th><th>First date</th><th>Status</th><th class="num">Total</th><th class="num">Paid</th><th class="num">Balance</th></tr></thead><tbody>';
  $list = array_reverse($bookings);
  $n = 0;
  foreach ($list as $b) {
    if ($f && $b['status'] !== $f) continue;
    $n++;
    $t = da_totals($b);
    echo '<tr><td><a href="index.php?v=b&id=' . h(rawurlencode($b['id'])) . '">' . h($b['id']) . '</a></td><td>' . h($b['client']['name']) . '<br><span class="small muted">' . h($b['client']['phone']) . '</span></td><td>' . h($b['events'] ? da_date($b['events'][0]['date'], 'j M Y') : '—') . '</td><td>' . pill($b['status']) . '</td><td class="num">' . da_money($t['total']) . '</td><td class="num">' . da_money($t['paid']) . '</td><td class="num">' . da_money($t['balance']) . '</td></tr>';
  }
  if (!$n) echo '<tr><td colspan="7" class="muted">No bookings here yet. <a href="index.php?v=edit">Create a quote</a>.</td></tr>';
  echo '</tbody></table></div>';
  foot();
  exit;
}

if ($view === 'cal') {
  head('Calendar', $view);
  $m = preg_match('/^\d{4}-\d{2}$/', (string)($_GET['m'] ?? '')) ? $_GET['m'] : date('Y-m');
  $first = strtotime($m . '-01');
  $prev = date('Y-m', strtotime('-1 month', $first));
  $next = date('Y-m', strtotime('+1 month', $first));
  echo '<div class="row" style="align-items:center;margin-bottom:12px"><h1 style="margin:0;margin-right:auto">' . h(date('F Y', $first)) . '</h1><a class="btn ghost small" href="index.php?v=cal&m=' . h($prev) . '">Previous</a><a class="btn ghost small" href="index.php?v=cal">This month</a><a class="btn ghost small" href="index.php?v=cal&m=' . h($next) . '">Next</a></div>';
  echo '<p class="small muted">' . (int)$teams . ' team(s) per day. <span class="pill partial">Some bookings / on hold</span> <span class="pill full">Slot full</span></p>';
  echo '<div class="cal" role="grid" aria-label="Bookings calendar">';
  foreach (['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as $d) echo '<div class="dow">' . $d . '</div>';
  $startDow = (int)date('N', $first);
  for ($i = 1; $i < $startDow; $i++) echo '<div class="day out" aria-hidden="true"></div>';
  $days = (int)date('t', $first);
  for ($d = 1; $d <= $days; $d++) {
    $date = sprintf('%s-%02d', $m, $d);
    $st = da_date_state($load, $date);
    $l = $load[$date] ?? null;
    echo '<div class="day ' . h($st) . '"><b>' . $d . '</b>';
    if ($l) {
      echo '<span class="small">' . ($l['full'] ? 'Full' : $l['confirmed'] . '/' . $teams . ' booked' . ($l['held'] ? ', ' . $l['held'] . ' held' : '')) . '</span>';
      foreach ($l['who'] as $w) echo '<a href="index.php?v=b&id=' . h(rawurlencode($w['id'])) . '">' . h($w['name']) . '</a>';
    }
    echo '</div>';
  }
  echo '</div>';
  foot();
  exit;
}

if ($view === 'crew') {
  head('Crew', $view);
  echo '<h1>Crew</h1><div class="row"><div class="grow card tablebox"><table><thead><tr><th>Name</th><th>Role</th><th>WhatsApp</th><th>Status</th><th></th></tr></thead><tbody>';
  if (!$crew) echo '<tr><td colspan="5" class="muted">Add your photographers and videographers on the right.</td></tr>';
  foreach ($crew as $c) {
    echo '<tr><td>' . h($c['name']) . '</td><td>' . h(ucfirst($c['role'])) . '</td><td>' . h($c['phone']) . '</td><td>' . (!empty($c['active']) ? '<span class="pill booked">Active</span>' : '<span class="pill">Inactive</span>') . '</td><td><details><summary class="small">Edit</summary><form method="post" class="stack" style="margin-top:8px">' . csrf_field($CSRF) . '<input type="hidden" name="action" value="save_crew"><input type="hidden" name="cid" value="' . h($c['id']) . '">'
      . '<div><label for="n' . h($c['id']) . '">Name</label><input id="n' . h($c['id']) . '" name="name" value="' . h($c['name']) . '" required></div>'
      . '<div><label for="r' . h($c['id']) . '">Role</label><select id="r' . h($c['id']) . '" name="role">';
    foreach (['photographer', 'videographer', 'drone', 'assistant', 'editor'] as $r) echo '<option value="' . $r . '"' . ($c['role'] === $r ? ' selected' : '') . '>' . ucfirst($r) . '</option>';
    echo '</select></div><div><label for="p' . h($c['id']) . '">WhatsApp number</label><input id="p' . h($c['id']) . '" name="phone" value="' . h($c['phone']) . '" required></div>'
      . '<div><label for="a' . h($c['id']) . '">Status</label><select id="a' . h($c['id']) . '" name="active"><option value="1"' . (!empty($c['active']) ? ' selected' : '') . '>Active</option><option value="0"' . (empty($c['active']) ? ' selected' : '') . '>Inactive</option></select></div><button class="btn small">Save</button></form></details></td></tr>';
  }
  echo '</tbody></table></div><div class="card" style="flex:0 1 340px"><h2>Add crew member</h2><form method="post" class="stack">' . csrf_field($CSRF) . '<input type="hidden" name="action" value="save_crew">'
    . '<div><label for="cn">Name</label><input id="cn" name="name" required></div><div><label for="cr">Role</label><select id="cr" name="role"><option value="photographer">Photographer</option><option value="videographer">Videographer</option><option value="drone">Drone</option><option value="assistant">Assistant</option><option value="editor">Editor</option></select></div>'
    . '<div><label for="cp">WhatsApp number</label><input id="cp" name="phone" inputmode="tel" placeholder="98xxxxxxxx" required></div><button class="btn">Add</button></form></div></div>';
  foot();
  exit;
}

if ($view === 'settings') {
  head('Settings', $view);
  $f = fn($k, $label, $type = 'text', $extra = '') => '<div><label for="s_' . $k . '">' . h($label) . '</label><input id="s_' . $k . '" name="' . $k . '" type="' . $type . '" value="' . h($S[$k]) . '" ' . $extra . '></div>';
  echo '<h1>Settings</h1><form method="post" class="stack">' . csrf_field($CSRF) . '<input type="hidden" name="action" value="save_settings">';
  echo '<section class="card"><h2>Payments</h2><div class="fields">' . $f('upi_id', 'UPI ID (e.g. studio@okhdfcbank)', 'text', 'placeholder="yourname@bank"') . $f('payee_name', 'Name shown in UPI apps') . $f('advance_percent', 'Advance to confirm (%)', 'number', 'min="0" max="100"') . $f('quote_valid_days', 'Quote valid for (days)', 'number', 'min="1"') . '</div></section>';
  echo '<section class="card"><h2>Studio</h2><div class="fields">' . $f('teams_per_day', 'Teams available per day (slot full after this)', 'number', 'min="1"') . $f('studio_phone', 'Studio phone') . $f('notify_email', 'Email for payment alerts and daily digest', 'email') . '</div></section>';
  echo '<section class="card"><h2>Terms shown on every quote</h2><p class="small muted">Clients must accept these before paying. Fill in the [STUDIO TO FILL] parts and have your lawyer or CA check them.</p><label for="s_terms" class="sr">Terms</label><textarea id="s_terms" name="terms" rows="14">' . h($S['terms']) . '</textarea></section>';
  echo '<section class="card"><h2>Event-day checklists</h2><p class="small muted">One item per line. Crew see these on their event page.</p><div class="fields"><div><label for="s_cp">Photographer</label><textarea id="s_cp" name="checklist_photographer" rows="12">' . h($S['checklist_photographer']) . '</textarea></div><div><label for="s_cv">Videographer</label><textarea id="s_cv" name="checklist_videographer" rows="12">' . h($S['checklist_videographer']) . '</textarea></div></div></section>';
  echo '<p><button class="btn">Save settings</button></p></form>';
  echo '<section class="card"><h2>Daily email digest</h2><p class="small">To get a morning email of reminders and payments to verify, add this as a daily cron job in Hostinger (Advanced → Cron Jobs):</p><code style="word-break:break-all">' . h(rtrim($S['site_url'], '/') . '/studio/cron.php?key=' . $S['cron_key']) . '</code></section>';
  foot();
  exit;
}

if ($view === 'edit') {
  $id = (string)($_GET['id'] ?? '');
  $b = $id ? da_find_booking($bookings, $id) : null;
  $lead = [];
  if (!$b && !empty($_GET['lead'])) $lead = json_decode((string)base64_decode((string)$_GET['lead']), true) ?: [];
  $b = $b ?: [
    'id' => '', 'client' => ['name' => $lead['name'] ?? '', 'phone' => $lead['phone'] ?? '', 'email' => $lead['email'] ?? '', 'city' => $lead['city'] ?? ''],
    'events' => preg_match('/^\d{4}-\d{2}-\d{2}$/', (string)($lead['date'] ?? '')) ? [['id' => '', 'date' => $lead['date'], 'function' => 'Wedding', 'venue' => $lead['venue'] ?? '', 'start' => '', 'end' => '']] : [],
    'items' => [], 'discount' => 0, 'advance_percent' => $S['advance_percent'], 'notes' => trim(($lead['message'] ?? '') ? 'Enquiry: ' . $lead['message'] : ''),
    'valid_until' => date('Y-m-d', strtotime('+' . (int)$S['quote_valid_days'] . ' days')), 'source' => $lead ? 'website' : '',
  ];
  head($b['id'] ? 'Edit ' . $b['id'] : 'New quote', 'edit');
  $loadEx = da_date_load($bookings, $teams, $b['id'] ?: null);
  echo '<h1>' . ($b['id'] ? 'Edit quote ' . h($b['id']) : 'New quote') . '</h1>';
  echo '<form method="post" class="stack" id="qform">' . csrf_field($CSRF) . '<input type="hidden" name="action" value="save_booking"><input type="hidden" name="id" value="' . h($b['id']) . '"><input type="hidden" name="source" value="' . h($b['source'] ?? '') . '">';
  echo '<section class="card"><h2>Client</h2><div class="fields">'
    . '<div><label for="cn">Name</label><input id="cn" name="client_name" value="' . h($b['client']['name']) . '" required></div>'
    . '<div><label for="cph">WhatsApp number</label><input id="cph" name="client_phone" inputmode="tel" value="' . h($b['client']['phone']) . '" required></div>'
    . '<div><label for="ce">Email (optional)</label><input id="ce" name="client_email" type="email" value="' . h($b['client']['email']) . '"></div>'
    . '<div><label for="cc">City</label><input id="cc" name="client_city" value="' . h($b['client']['city']) . '"></div></div></section>';

  echo '<section class="card"><h2>Events</h2><p class="small muted">Add each function (haldi, mehendi, wedding, reception…). Availability updates as you pick dates.</p><div id="events" class="stack">';
  $evs = $b['events'];
  $evs[] = ['id' => '', 'date' => '', 'function' => '', 'venue' => '', 'start' => '', 'end' => ''];
  foreach ($evs as $i => $e) {
    echo '<div class="fields ev" style="padding-bottom:12px;border-bottom:1px solid var(--line)"><input type="hidden" name="events[' . $i . '][id]" value="' . h($e['id']) . '">'
      . '<div><label for="ed' . $i . '">Date</label><input id="ed' . $i . '" type="date" name="events[' . $i . '][date]" value="' . h($e['date']) . '" class="evdate"><span class="small avail" aria-live="polite"></span></div>'
      . '<div><label for="ef' . $i . '">Function</label><input id="ef' . $i . '" name="events[' . $i . '][function]" value="' . h($e['function']) . '" list="fnlist" placeholder="Wedding"></div>'
      . '<div><label for="ev' . $i . '">Venue</label><input id="ev' . $i . '" name="events[' . $i . '][venue]" value="' . h($e['venue']) . '"></div>'
      . '<div><label for="es' . $i . '">Start time</label><input id="es' . $i . '" type="time" name="events[' . $i . '][start]" value="' . h($e['start']) . '"></div>'
      . '<div><label for="ee' . $i . '">End time</label><input id="ee' . $i . '" type="time" name="events[' . $i . '][end]" value="' . h($e['end']) . '"></div></div>';
  }
  echo '</div><datalist id="fnlist"><option value="Wedding"><option value="Reception"><option value="Haldi"><option value="Mehendi"><option value="Sangeet"><option value="Engagement"><option value="Pre-wedding shoot"><option value="Nikah"><option value="Walima"><option value="Church wedding"><option value="Anand Karaj"></datalist>'
    . '<p><button type="button" class="btn ghost small" id="addev">+ Add another event</button></p></section>';

  echo '<section class="card"><h2>Price</h2>';
  $pk = da_packages();
  if ($pk) {
    echo '<div style="max-width:520px"><label for="pk">Add a package from your price list</label><select id="pk"><option value="">Choose a package…</option>';
    foreach ($pk as $p) echo '<option value="' . h((string)$p['amount']) . '" data-desc="' . h($p['desc']) . '">' . h($p['label']) . ' (' . h(da_money($p['amount'])) . ')</option>';
    echo '</select></div>';
  }
  echo '<div id="items" class="stack" style="margin-top:12px">';
  $its = $b['items'];
  for ($k = 0; $k < 2; $k++) $its[] = ['desc' => '', 'amount' => ''];
  foreach ($its as $i => $it) echo '<div class="fields it"><div style="grid-column:span 2"><label for="id' . $i . '">Item</label><input id="id' . $i . '" name="items[' . $i . '][desc]" value="' . h($it['desc']) . '"></div><div><label for="ia' . $i . '">Amount (₹)</label><input id="ia' . $i . '" name="items[' . $i . '][amount]" inputmode="numeric" value="' . h($it['amount'] === '' ? '' : (string)(int)$it['amount']) . '" class="amt"></div></div>';
  echo '</div><p><button type="button" class="btn ghost small" id="additem">+ Add item</button></p><div class="fields">'
    . '<div><label for="dc">Discount (₹)</label><input id="dc" name="discount" inputmode="numeric" value="' . h((string)(int)$b['discount']) . '" class="amt"></div>'
    . '<div><label for="ap">Advance to confirm (%)</label><input id="ap" name="advance_percent" type="number" min="0" max="100" value="' . h((string)$b['advance_percent']) . '"></div>'
    . '<div><label for="vu">Quote valid until</label><input id="vu" name="valid_until" type="date" value="' . h($b['valid_until']) . '"></div></div>'
    . '<p class="small" id="calc" aria-live="polite"></p></section>';

  echo '<section class="card"><h2>Notes for the client</h2><label for="nt">Shown on the quote page</label><textarea id="nt" name="notes">' . h($b['notes']) . '</textarea></section>';
  echo '<p class="actions"><button class="btn">Save quote</button>' . ($b['id'] ? '<a class="btn ghost" href="index.php?v=b&id=' . h(rawurlencode($b['id'])) . '">Cancel</a>' : '') . '</p></form>';
  echo '<script>window.DA_LOAD=' . json_encode($loadEx) . ';window.DA_TEAMS=' . $teams . ';</script>';
  ?>
<script>
(function(){
  function availText(d){
    if(!d) return '';
    var l = window.DA_LOAD[d];
    if(!l) return 'Available';
    if(l.full) return 'Slot full — ' + l.confirmed + '/' + window.DA_TEAMS + ' teams booked';
    return (window.DA_TEAMS - l.confirmed) + ' of ' + window.DA_TEAMS + ' teams free' + (l.held ? ' (' + l.held + ' on hold)' : '');
  }
  function paint(inp){
    var s = inp.parentNode.querySelector('.avail'); if(!s) return;
    var l = window.DA_LOAD[inp.value];
    s.textContent = availText(inp.value);
    s.style.color = l && l.full ? '#9b1c1c' : (l ? '#8a5a00' : '#1f6b45');
  }
  document.querySelectorAll('.evdate').forEach(function(i){ paint(i); i.addEventListener('change', function(){ paint(i); }); });
  function cloneLast(boxId, cls){
    var box = document.getElementById(boxId), rows = box.querySelectorAll('.' + cls), last = rows[rows.length-1];
    var n = last.cloneNode(true), idx = rows.length;
    n.querySelectorAll('input').forEach(function(inp){
      inp.name = inp.name.replace(/\[\d+\]/, '[' + idx + ']');
      if(inp.id){ inp.id = inp.id.replace(/\d+$/, '') + idx; }
      if(inp.type !== 'hidden') inp.value = ''; else inp.value = '';
    });
    n.querySelectorAll('label').forEach(function(l){ var f = l.getAttribute('for'); if(f) l.setAttribute('for', f.replace(/\d+$/, '') + idx); });
    n.querySelectorAll('.avail').forEach(function(s){ s.textContent=''; });
    box.appendChild(n);
    var d = n.querySelector('.evdate'); if(d) d.addEventListener('change', function(){ paint(d); });
    n.querySelectorAll('.amt').forEach(function(a){ a.addEventListener('input', calc); });
    return n;
  }
  document.getElementById('addev').addEventListener('click', function(){ cloneLast('events','ev').querySelector('input[type=date]').focus(); });
  document.getElementById('additem').addEventListener('click', function(){ cloneLast('items','it').querySelector('input').focus(); });
  function num(v){ return parseFloat(String(v).replace(/[^\d.]/g,'')) || 0; }
  function inr(n){ return '₹' + Math.round(n).toLocaleString('en-IN'); }
  function calc(){
    var sub = 0; document.querySelectorAll('#items .amt').forEach(function(a){ sub += num(a.value); });
    var tot = Math.max(0, sub - num(document.getElementById('dc').value));
    var adv = Math.round(tot * num(document.getElementById('ap').value) / 100);
    document.getElementById('calc').textContent = 'Total ' + inr(tot) + ' · Advance ' + inr(adv) + ' · Balance ' + inr(tot - adv);
  }
  document.querySelectorAll('.amt, #ap').forEach(function(a){ a.addEventListener('input', calc); }); calc();
  var pk = document.getElementById('pk');
  if(pk) pk.addEventListener('change', function(){
    if(!pk.value) return;
    var opt = pk.options[pk.selectedIndex], rows = document.querySelectorAll('#items .it'), target = null;
    rows.forEach(function(r){ if(!target && !r.querySelector('input').value) target = r; });
    if(!target) target = cloneLast('items','it');
    var ins = target.querySelectorAll('input'); ins[0].value = opt.getAttribute('data-desc'); ins[1].value = pk.value;
    pk.value = ''; calc();
  });
})();
</script>
<?php
  foot();
  exit;
}

if ($view === 'b') {
  $id = (string)($_GET['id'] ?? '');
  $b = da_find_booking($bookings, $id);
  if (!$b) { head('Not found', 'list'); echo '<p>Booking not found. <a href="index.php?v=list">Back to bookings</a></p>'; foot(); exit; }
  $t = da_totals($b);
  $loadEx = da_date_load($bookings, $teams, $b['id']);
  head($b['client']['name'], 'list');
  echo '<div class="row" style="align-items:center"><h1 style="margin:0;margin-right:auto">' . h($b['client']['name']) . ' <span class="muted small">' . h($b['id']) . '</span></h1>' . pill($b['status']) . '</div>';
  echo '<p class="muted">' . h($b['client']['phone']) . ($b['client']['email'] ? ' · ' . h($b['client']['email']) : '') . ($b['client']['city'] ? ' · ' . h($b['client']['city']) : '') . '</p>';

  // next step box
  echo '<section class="card"><h2>Next step</h2><div class="actions">';
  $qurl = da_quote_url($S, $b);
  if (in_array($b['status'], ['draft', 'sent'], true)) {
    echo '<a class="btn wa" target="_blank" rel="noopener" href="' . h(da_wa_link($b['client']['phone'], wa_quote_msg($S, $b))) . '">Send quote on WhatsApp</a>';
    if ($b['status'] === 'draft') echo '<form method="post">' . csrf_field($CSRF) . '<input type="hidden" name="action" value="set_status"><input type="hidden" name="id" value="' . h($b['id']) . '"><input type="hidden" name="status" value="sent"><button class="btn ghost">Mark as sent</button></form>';
  }
  if ($b['status'] === 'payment_claimed') {
    $c = end($b['claims']);
    echo '<p style="flex-basis:100%;margin:0 0 8px">Client says they paid <b>' . da_money($c['amount'] ?? 0) . '</b>' . (!empty($c['utr']) ? ' (UTR ' . h($c['utr']) . ')' : '') . '. Check your bank/UPI app, then record it below.</p>';
    echo '<form method="post">' . csrf_field($CSRF) . '<input type="hidden" name="action" value="reject_claim"><input type="hidden" name="id" value="' . h($b['id']) . '"><button class="btn danger">Not received</button></form>';
  }
  if (in_array($b['status'], DA_CONFIRMED, true)) echo '<a class="btn wa" target="_blank" rel="noopener" href="' . h(da_wa_link($b['client']['phone'], wa_confirm_msg($S, $b))) . '">Send confirmation on WhatsApp</a>';
  echo '<a class="btn ghost" target="_blank" rel="noopener" href="' . h($qurl) . '">Open client page</a><a class="btn ghost" href="index.php?v=edit&id=' . h(rawurlencode($b['id'])) . '">Edit quote</a>';
  echo '</div>';
  if (!empty($b['accepted'])) echo '<p class="small muted" style="margin-top:10px">Terms accepted by ' . h($b['accepted']['name']) . ' on ' . h($b['accepted']['at']) . '.</p>';
  echo '</section>';

  echo '<div class="row" style="margin-top:16px"><div class="grow stack">';
  // events + crew
  echo '<section class="card" id="crew"><h2>Events and crew</h2><form method="post">' . csrf_field($CSRF) . '<input type="hidden" name="action" value="assign_crew"><input type="hidden" name="id" value="' . h($b['id']) . '">';
  if (!$b['events']) echo '<p class="muted">No events yet. <a href="index.php?v=edit&id=' . h(rawurlencode($b['id'])) . '">Add dates</a>.</p>';
  $active = array_filter($crew, fn($c) => !empty($c['active']));
  foreach ($b['events'] as $e) {
    $st = da_date_state($loadEx, $e['date']);
    $busy = da_crew_busy($bookings, $e['date'], $b['id']);
    echo '<div style="padding:12px 0;border-bottom:1px solid var(--line)"><b>' . h(da_date($e['date'])) . '</b> · ' . h($e['function'] ?: 'Event') . ($e['start'] ? ' · ' . h($e['start']) : '') . ' <span class="pill ' . h($st) . '">' . ($st === 'full' ? 'Date full' : ($st === 'partial' ? 'Other bookings this day' : 'Date free')) . '</span><br><span class="small muted">' . h($e['venue']) . '</span>';
    if ($active) {
      echo '<fieldset style="border:0;padding:0;margin:8px 0 0"><legend class="small muted">Assign crew</legend><div class="fields">';
      foreach ($active as $c) {
        $on = in_array($c['id'], $e['crew'] ?? [], true);
        echo '<label class="check" style="margin:0"><input type="checkbox" name="crew[' . h($e['id']) . '][]" value="' . h($c['id']) . '"' . ($on ? ' checked' : '') . '><span>' . h($c['name']) . ' <span class="small muted">' . h($c['role']) . (isset($busy[$c['id']]) ? ' · busy with ' . h($busy[$c['id']]) : '') . '</span></span></label>';
      }
      echo '</div></fieldset>';
    }
    if (!empty($e['crew'])) {
      echo '<div class="actions" style="margin-top:8px">';
      foreach ($e['crew'] as $cid) if (isset($crewById[$cid])) {
        $ck = $b['checklists'][$e['id'] . ':' . $cid] ?? [];
        $done = count(array_filter($ck['items'] ?? []));
        echo '<a class="btn wa small" target="_blank" rel="noopener" href="' . h(da_wa_link($crewById[$cid]['phone'], wa_crew_msg($S, $b, $e, $crewById[$cid]))) . '">Notify ' . h($crewById[$cid]['name']) . '</a>';
        echo '<span class="small muted" style="align-self:center">' . ($done ? $done . ' checklist items done' : '') . (!empty($ck['checkin_at']) ? ' · checked in ' . h($ck['checkin_at']) : '') . '</span>';
      }
      echo '</div>';
    }
    echo '</div>';
  }
  if ($b['events'] && $active) echo '<p style="margin-top:12px"><button class="btn small">Save crew</button></p>';
  if (!$active) echo '<p class="small muted">Add crew in the <a href="index.php?v=crew">Crew</a> tab to assign them.</p>';
  echo '</form></section>';

  // log
  echo '<section class="card"><h2>History</h2><ul class="small" style="padding-left:18px;margin:0">';
  foreach (array_reverse($b['log'] ?? []) as $l) echo '<li>' . h($l['at']) . ' — ' . h($l['msg']) . '</li>';
  echo '</ul></section></div>';

  // money column
  echo '<div class="grow stack" style="flex-basis:300px"><section class="card"><h2>Money</h2><table><tbody>';
  foreach ($b['items'] as $it) echo '<tr><td>' . h($it['desc']) . '</td><td class="num">' . da_money($it['amount']) . '</td></tr>';
  if ($t['discount']) echo '<tr><td>Discount</td><td class="num">-' . da_money($t['discount']) . '</td></tr>';
  echo '<tr class="total-row"><td>Total</td><td class="num">' . da_money($t['total']) . '</td></tr><tr><td>Advance (' . h((string)$b['advance_percent']) . '%)</td><td class="num">' . da_money($t['advance']) . '</td></tr><tr><td>Received</td><td class="num">' . da_money($t['paid']) . '</td></tr><tr class="total-row"><td>Balance</td><td class="num">' . da_money($t['balance']) . '</td></tr></tbody></table>';
  if ($b['payments']) {
    echo '<h3 style="margin-top:14px">Payments</h3><ul class="small" style="padding-left:18px">';
    foreach ($b['payments'] as $p) echo '<li>' . h($p['at']) . ' · ' . da_money($p['amount']) . ' · ' . h($p['method']) . ($p['ref'] ? ' · ' . h($p['ref']) : '') . '</li>';
    echo '</ul>';
  }
  $claim = $b['status'] === 'payment_claimed' ? end($b['claims']) : null;
  echo '<h3 style="margin-top:14px">Record a payment</h3><form method="post" class="stack">' . csrf_field($CSRF) . '<input type="hidden" name="action" value="add_payment"><input type="hidden" name="id" value="' . h($b['id']) . '">'
    . '<div><label for="pa">Amount received (₹)</label><input id="pa" name="amount" inputmode="numeric" value="' . h($claim ? (string)(int)$claim['amount'] : '') . '" required></div>'
    . '<div><label for="pm">Method</label><select id="pm" name="method"><option>UPI</option><option>Bank transfer</option><option>Cash</option><option>Cheque</option></select></div>'
    . '<div><label for="pr">UTR / reference</label><input id="pr" name="ref" value="' . h($claim['utr'] ?? '') . '"></div>'
    . '<div><label for="pd">Received on</label><input id="pd" type="date" name="paid_on" value="' . date('Y-m-d') . '"></div>'
    . '<button class="btn gold">' . (in_array($b['status'], DA_CONFIRMED, true) ? 'Record payment' : 'Record payment & confirm booking') . '</button></form>';
  if ($t['balance'] > 0 && in_array($b['status'], DA_CONFIRMED, true)) echo '<p style="margin-top:12px"><a class="btn wa small" target="_blank" rel="noopener" href="' . h(da_wa_link($b['client']['phone'], 'Hi ' . $b['client']['name'] . ', a gentle reminder that the balance of ' . da_money($t['balance']) . ' for booking ' . $b['id'] . ' is due. You can pay here: ' . $qurl . "\n\n— Team " . $S['studio_name'])) . '">Send balance reminder</a></p>';
  echo '</section>';
  echo '<section class="card"><h2>Change status</h2><form method="post" class="actions">' . csrf_field($CSRF) . '<input type="hidden" name="action" value="set_status"><input type="hidden" name="id" value="' . h($b['id']) . '"><label for="ss" class="sr" style="position:absolute;left:-9999px">Status</label><select id="ss" name="status" style="flex:1">';
  foreach (DA_STATUSES as $k => $l) echo '<option value="' . h($k) . '"' . ($b['status'] === $k ? ' selected' : '') . '>' . h($l) . '</option>';
  echo '</select><button class="btn ghost">Update</button></form></section></div></div>';
  foot();
  exit;
}

go('');
