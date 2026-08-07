<?php
/**
 * Tracked outbound mail helper for DisplayAvenue website.
 * Every mail() call from the site should go through da_send_tracked_mail()
 * so totals and a recent log are stored under admin/data/mail-log.json.
 */
declare(strict_types=1);

if (PHP_SAPI !== 'cli') {
  $script = realpath((string)($_SERVER['SCRIPT_FILENAME'] ?? '')) ?: '';
  if ($script !== '' && realpath(__FILE__) === $script) {
    http_response_code(403);
    header('Content-Type: text/plain; charset=utf-8');
    echo 'Forbidden';
    exit;
  }
}

function da_mail_log_path(array $config): string {
  $leads = (string)($config['leads_file'] ?? (__DIR__ . '/data/leads.json'));
  return dirname($leads) . '/mail-log.json';
}

function da_default_mail_log(): array {
  return [
    'totals' => [
      'sent' => 0,
      'failed' => 0,
      'attempted' => 0,
    ],
    'byType' => new stdClass(),
    'items' => [],
    'updatedAt' => null,
  ];
}

function da_read_mail_log(array $config): array {
  $path = da_mail_log_path($config);
  if (!is_file($path)) {
    $empty = da_default_mail_log();
    $empty['byType'] = [];
    return $empty;
  }
  $data = json_decode((string)file_get_contents($path), true);
  if (!is_array($data)) {
    $empty = da_default_mail_log();
    $empty['byType'] = [];
    return $empty;
  }
  if (!isset($data['totals']) || !is_array($data['totals'])) {
    $data['totals'] = ['sent' => 0, 'failed' => 0, 'attempted' => 0];
  }
  foreach (['sent', 'failed', 'attempted'] as $k) {
    $data['totals'][$k] = (int)($data['totals'][$k] ?? 0);
  }
  if (!isset($data['byType']) || !is_array($data['byType'])) {
    $data['byType'] = [];
  }
  if (!isset($data['items']) || !is_array($data['items'])) {
    $data['items'] = [];
  }
  return $data;
}

function da_write_mail_log(array $config, array $log): bool {
  $path = da_mail_log_path($config);
  $dir = dirname($path);
  if (!is_dir($dir) && !@mkdir($dir, 0750, true)) {
    return false;
  }
  $log['updatedAt'] = gmdate('c');
  $json = json_encode($log, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
  $tmp = $path . '.tmp';
  if (@file_put_contents($tmp, $json . "\n") === false) return false;
  return @rename($tmp, $path);
}

/**
 * Send an email and record it in the backend mail log.
 *
 * @param array $opts keys: to, subject, body, headers (string[]), type, meta (array)
 * @return array{ok:bool,id:string,to:string,type:string,at:string}
 */
function da_send_tracked_mail(array $config, array $opts): array {
  $to = trim((string)($opts['to'] ?? ''));
  $subject = (string)($opts['subject'] ?? '');
  $body = (string)($opts['body'] ?? '');
  $type = preg_replace('/[^a-z0-9_-]+/i', '-', (string)($opts['type'] ?? 'website')) ?: 'website';
  $headers = $opts['headers'] ?? [];
  if (!is_array($headers)) $headers = [];
  $meta = is_array($opts['meta'] ?? null) ? $opts['meta'] : [];

  $at = gmdate('c');
  $id = bin2hex(random_bytes(8));
  $ok = false;

  if ($to !== '' && filter_var($to, FILTER_VALIDATE_EMAIL)) {
    $headerStr = implode("\r\n", array_map('strval', $headers));
    $encodedSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';
    $ok = @mail($to, $encodedSubject, $body, $headerStr);
  }

  $log = da_read_mail_log($config);
  $log['totals']['attempted'] = (int)$log['totals']['attempted'] + 1;
  if ($ok) {
    $log['totals']['sent'] = (int)$log['totals']['sent'] + 1;
  } else {
    $log['totals']['failed'] = (int)$log['totals']['failed'] + 1;
  }

  if (!isset($log['byType'][$type]) || !is_array($log['byType'][$type])) {
    $log['byType'][$type] = ['sent' => 0, 'failed' => 0, 'attempted' => 0];
  }
  $log['byType'][$type]['attempted'] = (int)$log['byType'][$type]['attempted'] + 1;
  if ($ok) {
    $log['byType'][$type]['sent'] = (int)$log['byType'][$type]['sent'] + 1;
  } else {
    $log['byType'][$type]['failed'] = (int)$log['byType'][$type]['failed'] + 1;
  }

  $entry = [
    'id' => $id,
    'at' => $at,
    'ok' => (bool)$ok,
    'to' => $to,
    'subject' => mb_substr($subject, 0, 200),
    'type' => $type,
    'meta' => $meta,
  ];
  array_unshift($log['items'], $entry);
  if (count($log['items']) > 1000) {
    $log['items'] = array_slice($log['items'], 0, 1000);
  }
  da_write_mail_log($config, $log);

  return [
    'ok' => (bool)$ok,
    'id' => $id,
    'to' => $to,
    'type' => $type,
    'at' => $at,
  ];
}

function da_mail_stats(array $config): array {
  $log = da_read_mail_log($config);
  return [
    'sent' => (int)($log['totals']['sent'] ?? 0),
    'failed' => (int)($log['totals']['failed'] ?? 0),
    'attempted' => (int)($log['totals']['attempted'] ?? 0),
    'byType' => $log['byType'] ?? [],
    'updatedAt' => $log['updatedAt'] ?? null,
    'recent' => array_slice($log['items'] ?? [], 0, 25),
  ];
}
