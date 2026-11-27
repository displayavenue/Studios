<?php
declare(strict_types=1);
require __DIR__ . '/lib.php';

header('Cache-Control: no-store');
header('X-Robots-Tag: noindex, nofollow');
header('Referrer-Policy: no-referrer');

$S = da_settings();
$token = preg_replace('/[^a-f0-9]/', '', (string)($_GET['t'] ?? ''));
$bookings = $token ? da_bookings() : [];
$b = $token ? da_find_booking($bookings, $token, 'token') : null;

function page_start(string $title): void {
  echo '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex"><title>' . h($title) . '</title>';
  echo '<link rel="icon" href="/favicon.svg"><link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Marcellus&family=Jost:wght@400;500&display=swap" rel="stylesheet"><link rel="stylesheet" href="studio.css"></head><body>';
}

if (!$b) {
  http_response_code(404);
  page_start('Quote not found');
  echo '<div class="public-head"><div class="brand">DisplayAvenue Studios</div><h1>Quote not found</h1></div><main class="public"><div class="card"><p>This link is not valid any more. Please message us on WhatsApp and we will send you a fresh quote.</p><p><a class="btn wa" href="' . h(da_wa_link($S['studio_phone'], 'Hi, my quote link is not working. ')) . '">WhatsApp us</a></p></div></main></body></html>';
  exit;
}

$msg = null;
$teams = (int)$S['teams_per_day'];

if ($_SERVER['REQUEST_METHOD'] === 'POST' && ($_POST['company_website'] ?? '') === '') {
  $action = (string)($_POST['action'] ?? '');
  if ($action === 'accept' && !empty($_POST['agree']) && trim((string)($_POST['name'] ?? '')) !== '') {
    $result = da_update('bookings', function (&$all) use ($token, $teams) {
      foreach ($all as &$x) {
        if ($x['token'] !== $token) continue;
        if (!in_array($x['status'], ['draft', 'sent'], true)) return 'already';
        $load = da_date_load($all, $teams, $x['id']);
        foreach ($x['events'] as $e) if (!empty($load[$e['date']]['full'])) return 'full';
        $x['status'] = 'accepted';
        $x['accepted'] = ['name' => mb_substr(trim((string)$_POST['name']), 0, 80), 'at' => date('Y-m-d H:i'), 'ip' => da_client_ip(), 'terms' => hash('sha256', (string)da_settings()['terms'])];
        $x['terms_snapshot'] = da_settings()['terms'];
        da_log($x, 'Client accepted terms (' . $x['accepted']['name'] . ')');
        return 'ok';
      }
      return 'missing';
    });
    if ($result === 'ok') {
      da_mail($S['notify_email'], 'Terms accepted — ' . $b['client']['name'] . ' (' . $b['id'] . ')', "The client accepted the terms for " . $b['id'] . ". Advance payment is next.\n\n" . rtrim($S['site_url'], '/') . '/studio/index.php?v=b&id=' . $b['id']);
      header('Location: q.php?t=' . $token . '&ok=accepted#pay');
      exit;
    }
    $msg = $result === 'full' ? ['bad', 'Sorry — one of your dates has just been fully booked. Please message us and we will help you right away.'] : null;
  } elseif ($action === 'accept') {
    $msg = ['bad', 'Please type your name and tick the box to accept the terms.'];
  }

  if ($action === 'claim') {
    $amt = (float)preg_replace('/[^\d.]/', '', (string)($_POST['amount'] ?? ''));
    $utr = mb_substr(preg_replace('/[^A-Za-z0-9 \-]/', '', (string)($_POST['utr'] ?? '')), 0, 40);
    if ($amt <= 0) {
      $msg = ['bad', 'Please enter the amount you paid.'];
    } else {
      $result = da_update('bookings', function (&$all) use ($token, $amt, $utr) {
        foreach ($all as &$x) {
          if ($x['token'] !== $token) continue;
          $open = array_filter($x['claims'] ?? [], fn($c) => empty($c['resolved']));
          if (count($x['claims'] ?? []) >= 10) return 'limit';
          if ($open) return 'pending';
          $x['claims'][] = ['amount' => $amt, 'utr' => $utr, 'at' => date('Y-m-d H:i'), 'ip' => da_client_ip()];
          if (in_array($x['status'], ['sent', 'accepted', 'draft'], true)) $x['status'] = 'payment_claimed';
          da_log($x, 'Client reported payment ' . da_money($amt) . ($utr ? ' (UTR ' . $utr . ')' : ''));
          return 'ok';
        }
        return 'missing';
      });
      if ($result === 'ok') {
        da_mail($S['notify_email'], 'Payment to verify — ' . da_money($amt) . ' from ' . $b['client']['name'], "Client " . $b['client']['name'] . " says they paid " . da_money($amt) . ($utr ? " (UTR $utr)" : '') . " for " . $b['id'] . ".\nCheck your bank/UPI app and confirm it here:\n" . rtrim($S['site_url'], '/') . '/studio/index.php?v=b&id=' . $b['id']);
        header('Location: q.php?t=' . $token . '&ok=claimed#pay');
        exit;
      }
      $msg = $result === 'pending' ? ['warn', 'We already have a payment waiting to be checked. We will confirm it shortly.'] : ['bad', 'Something went wrong. Please message us on WhatsApp.'];
    }
  }
  $bookings = da_bookings();
  $b = da_find_booking($bookings, $token, 'token');
}

// first view
if (empty($b['viewed_at'])) {
  da_update('bookings', function (&$all) use ($token) {
    foreach ($all as &$x) if ($x['token'] === $token && empty($x['viewed_at'])) { $x['viewed_at'] = date('Y-m-d H:i'); da_log($x, 'Client opened the quote'); }
  });
}

$ok = (string)($_GET['ok'] ?? '');
if ($ok === 'accepted') $msg = ['ok', 'Thank you! Terms accepted. Pay the advance below to confirm your date.'];
if ($ok === 'claimed') $msg = ['ok', 'Thank you! We will check the payment and confirm your booking on WhatsApp shortly.'];

$t = da_totals($b);
$load = da_date_load($bookings, $teams, $b['id']);
$status = $b['status'];
$confirmed = in_array($status, DA_CONFIRMED, true);
$expired = !$confirmed && !empty($b['valid_until']) && $b['valid_until'] < date('Y-m-d') && in_array($status, ['draft', 'sent'], true);
$anyFull = false;
foreach ($b['events'] as $e) if (!empty($load[$e['date']]['full'])) $anyFull = true;

$payAmount = 0;
$payLabel = '';
if (in_array($status, ['accepted', 'payment_claimed'], true) || ($confirmed && $t['balance'] > 0)) {
  if ($t['advance_due'] > 0 && !$confirmed) { $payAmount = $t['advance_due']; $payLabel = 'Advance to confirm your date'; }
  else { $payAmount = $t['balance']; $payLabel = 'Balance due'; }
}
$openClaim = null;
foreach ($b['claims'] ?? [] as $c) if (empty($c['resolved'])) $openClaim = $c;

page_start(($confirmed ? 'Your booking' : 'Your quote') . ' — ' . $S['studio_name']);
echo da_quote_head($b, $S, $confirmed) . '<main class="public">';
if ($msg) echo '<div class="notice ' . h($msg[0]) . '" role="status" style="margin-top:18px">' . h($msg[1]) . '</div>';
if ($status === 'cancelled') { echo '<div class="card"><p>This quote has been cancelled. Message us if you would like a new one.</p></div></main></body></html>'; exit; }

echo da_quote_sections($b, $S, $load, $confirmed);

// terms / accept
$terms = $b['terms_snapshot'] ?? $S['terms'];
echo '<section class="card" id="terms"><h2>Terms</h2><div class="terms" tabindex="0">' . h($terms) . '</div>';
if (!empty($b['accepted'])) {
  echo '<p class="small" style="margin-top:12px">Accepted by ' . h($b['accepted']['name']) . ' on ' . h(da_date($b['accepted']['at'], 'j M Y, g:i a')) . '.</p>';
} elseif ($expired) {
  echo '<p style="margin-top:12px">This quote has expired. <a href="' . h(da_wa_link($S['studio_phone'], 'Hi, my quote ' . $b['id'] . ' has expired. Can you send me an updated one?')) . '">Ask us for an updated quote</a>.</p>';
} elseif ($anyFull) {
  echo '<p style="margin-top:12px">One of your dates is now fully booked. <a href="' . h(da_wa_link($S['studio_phone'], 'Hi, about quote ' . $b['id'] . ' — one of my dates shows fully booked.')) . '">Message us</a> and we will help you.</p>';
} else {
  echo '<form method="post" class="stack" style="margin-top:14px"><input type="hidden" name="action" value="accept"><div style="position:absolute;left:-9999px" aria-hidden="true"><label for="cw">Leave empty</label><input id="cw" name="company_website" tabindex="-1" autocomplete="off"></div>'
    . '<div><label for="an">Your full name</label><input id="an" name="name" autocomplete="name" required value="' . h($b['client']['name']) . '"></div>'
    . '<label class="check"><input type="checkbox" name="agree" value="1" required><span>I have read and agree to the terms above and the price in this quote.</span></label>'
    . '<button class="btn gold">Accept and continue to payment</button></form>';
}
echo '</section>';

// payment
if ($payAmount > 0) {
  echo '<section class="card" id="pay"><h2>' . h($payLabel) . ': ' . da_money($payAmount) . '</h2>';
  if ($openClaim) {
    echo '<p>We have received your payment details (' . da_money($openClaim['amount']) . ($openClaim['utr'] ? ', UTR ' . h($openClaim['utr']) : '') . ') and are checking it. We will confirm on WhatsApp shortly.</p>';
  } elseif (empty($S['upi_id'])) {
    echo '<p>We will share payment details with you on WhatsApp.</p><p><a class="btn wa" href="' . h(da_wa_link($S['studio_phone'], 'Hi, I accepted quote ' . $b['id'] . '. Please share payment details for ' . da_money($payAmount) . '.')) . '">Get payment details on WhatsApp</a></p>';
  } else {
    $upi = da_upi_link($S, $payAmount, $b['id'] . ' ' . ($confirmed ? 'balance' : 'advance'));
    echo '<p>Pay with any UPI app — Google Pay, PhonePe, Paytm or your bank app.</p>';
    echo '<p><a class="btn gold" href="' . h($upi) . '">Pay ' . da_money($payAmount) . ' with a UPI app</a></p>';
    echo '<p class="small muted">On a computer? Scan this QR code with your phone:</p><div class="qr" id="qr" data-upi="' . h($upi) . '" role="img" aria-label="UPI QR code for ' . h(da_money($payAmount)) . '"></div>';
    echo '<p class="small">UPI ID: <b>' . h($S['upi_id']) . '</b> · Name: ' . h($S['payee_name']) . '</p>';
    echo '<h3 style="margin-top:18px">After paying</h3><form method="post" class="stack"><input type="hidden" name="action" value="claim"><div style="position:absolute;left:-9999px" aria-hidden="true"><label for="cw2">Leave empty</label><input id="cw2" name="company_website" tabindex="-1" autocomplete="off"></div>'
      . '<div class="fields"><div><label for="pa">Amount paid (₹)</label><input id="pa" name="amount" inputmode="numeric" value="' . h((string)(int)$payAmount) . '" required></div>'
      . '<div><label for="ut">UPI transaction ID / UTR (12 digits)</label><input id="ut" name="utr" inputmode="numeric" placeholder="e.g. 4123 5678 9012"></div></div>'
      . '<button class="btn">I have paid</button><p class="small muted" style="margin:0">Your date is confirmed once we see the payment. We will message you on WhatsApp.</p></form>';
    echo '<script src="qrcode.js"></script><script>(function(){var el=document.getElementById("qr");if(!el||typeof qrcode!=="function")return;var q=qrcode(0,"M");q.addData(el.getAttribute("data-upi"));q.make();el.innerHTML=q.createSvgTag({cellSize:5,margin:2,scalable:true});})();</script>';
  }
  echo '</section>';
} elseif ($confirmed) {
  echo '<section class="card"><h2>All paid</h2><p>Thank you — nothing is due. We look forward to your celebration!</p></section>';
}

echo '<section class="card"><h2>Questions?</h2><p>Message us any time and we will help.</p><p><a class="btn wa" href="' . h(da_wa_link($S['studio_phone'], 'Hi, I have a question about ' . $b['id'] . '.')) . '">WhatsApp ' . h($S['studio_name']) . '</a></p></section>';
echo '</main></body></html>';
