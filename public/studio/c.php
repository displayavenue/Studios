<?php
declare(strict_types=1);
require __DIR__ . '/lib.php';

header('Cache-Control: no-store');
header('X-Robots-Tag: noindex, nofollow');
header('Referrer-Policy: no-referrer');

$S = da_settings();
$token = preg_replace('/[^a-f0-9]/', '', (string)($_GET['t'] ?? ''));

function find_by_crew_token(string $token): array {
  if ($token === '') return [null, null];
  foreach (da_bookings() as $b) {
    foreach ($b['crew_tokens'] ?? [] as $cid => $tok) if (hash_equals((string)$tok, $token)) return [$b, (string)$cid];
  }
  return [null, null];
}

[$b, $cid] = find_by_crew_token($token);
$crew = [];
foreach (da_crew() as $c) $crew[$c['id']] = $c;
$me = $cid ? ($crew[$cid] ?? null) : null;

echo '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex"><title>Event details — ' . h($S['studio_name']) . '</title>';
echo '<link rel="icon" href="/favicon.svg"><link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Marcellus&family=Jost:wght@400;500&display=swap" rel="stylesheet"><link rel="stylesheet" href="studio.css"></head><body>';

if (!$b || !$me || in_array($b['status'], ['cancelled'], true)) {
  http_response_code(404);
  echo '<header class="public-head"><div class="brand">' . h($S['studio_name']) . '</div><h1>Link not active</h1></header><main class="public"><div class="card"><p>This event link is not active. Please check with the studio.</p></div></main></body></html>';
  exit;
}

// events this crew member is on
$myEvents = array_values(array_filter($b['events'], fn($e) => in_array($cid, $e['crew'] ?? [], true)));
$role = $me['role'] === 'videographer' || $me['role'] === 'drone' ? 'videographer' : 'photographer';
$items = array_values(array_filter(array_map('trim', explode("\n", (string)$S['checklist_' . $role]))));

$msg = null;
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $eid = (string)($_POST['event'] ?? '');
  $valid = false;
  foreach ($myEvents as $e) if ($e['id'] === $eid) $valid = true;
  if ($valid) {
    $done = array_map('intval', (array)($_POST['done'] ?? []));
    $checkin = !empty($_POST['checkin']);
    da_update('bookings', function (&$all) use ($b, $eid, $cid, $done, $checkin, $items, $me) {
      foreach ($all as &$x) {
        if ($x['id'] !== $b['id']) continue;
        $key = $eid . ':' . $cid;
        $cur = $x['checklists'][$key] ?? ['items' => []];
        $cur['items'] = [];
        foreach ($items as $i => $_) $cur['items'][$i] = in_array($i, $done, true);
        $cur['updated_at'] = date('Y-m-d H:i');
        if ($checkin && empty($cur['checkin_at'])) { $cur['checkin_at'] = date('Y-m-d H:i'); da_log($x, $me['name'] . ' checked in at the venue'); }
        $x['checklists'][$key] = $cur;
      }
    });
    header('Location: c.php?t=' . $token . '&saved=1#e' . rawurlencode($eid));
    exit;
  }
}
$fresh = da_find_booking(da_bookings(), $b['id']);
if ($fresh) $b = $fresh;

echo '<header class="public-head"><div class="brand">' . h($S['studio_name']) . '</div><h1>Hi ' . h($me['name']) . '</h1><p style="margin:0;color:#f3e3d3">' . h($b['client']['name']) . ' · ' . h(ucfirst($me['role'])) . '</p></header><main class="public">';
if (!empty($_GET['saved'])) echo '<div class="notice ok" role="status" style="margin-top:18px">Saved.</div>';

foreach ($myEvents as $e) {
  $ck = $b['checklists'][$e['id'] . ':' . $cid] ?? ['items' => []];
  $team = [];
  foreach ($e['crew'] ?? [] as $other) if ($other !== $cid && isset($crew[$other])) $team[] = $crew[$other]['name'] . ' (' . $crew[$other]['role'] . ', ' . $crew[$other]['phone'] . ')';
  $maps = $e['venue'] ? 'https://www.google.com/maps/search/?api=1&query=' . rawurlencode($e['venue']) : '';
  echo '<section class="card" id="e' . h($e['id']) . '"><h2>' . h($e['function'] ?: 'Event') . ' — ' . h(da_date($e['date'], 'D, j M Y')) . '</h2>';
  echo '<p>' . ($e['start'] ? '<b>Reach by ' . h($e['start']) . '</b>' . ($e['end'] ? ' · until ' . h($e['end']) : '') . '<br>' : '') . h($e['venue'] ?: 'Venue to be confirmed') . '</p>';
  echo '<p class="actions">' . ($maps ? '<a class="btn ghost small" target="_blank" rel="noopener" href="' . h($maps) . '">Open in Maps</a>' : '') . '<a class="btn ghost small" href="tel:' . h(preg_replace('/[^\d+]/', '', $b['client']['phone'])) . '">Call client</a><a class="btn ghost small" href="tel:' . h(preg_replace('/[^\d+]/', '', $S['studio_phone'])) . '">Call studio</a></p>';
  if (!empty($e['notes'])) echo '<div class="notice warn"><b>Note from the studio:</b> ' . h($e['notes']) . '</div>';
  if ($team) echo '<p class="small">Also on this event: ' . h(implode('; ', $team)) . '</p>';
  if (!empty($b['notes'])) echo '<p class="small muted" style="white-space:pre-line">Client notes: ' . h($b['notes']) . '</p>';
  echo '<form method="post"><input type="hidden" name="event" value="' . h($e['id']) . '"><h3 style="margin-top:12px">Checklist</h3><ul class="checklist">';
  foreach ($items as $i => $label) echo '<li><label class="check"><input type="checkbox" name="done[]" value="' . $i . '"' . (!empty($ck['items'][$i]) ? ' checked' : '') . '><span>' . h($label) . '</span></label></li>';
  echo '</ul>';
  if (!empty($ck['checkin_at'])) echo '<p class="small" style="margin-top:12px">Checked in at ' . h(da_date($ck['checkin_at'], 'g:i a, j M')) . '.</p>';
  elseif ($e['date'] === date('Y-m-d')) echo '<label class="check" style="margin-top:12px"><input type="checkbox" name="checkin" value="1"><span>I have reached the venue</span></label>';
  echo '<p style="margin-top:12px"><button class="btn">Save</button></p></form></section>';
}
if (!$myEvents) echo '<div class="card"><p>You are not assigned to any event in this booking any more.</p></div>';
echo '</main></body></html>';
