<?php
declare(strict_types=1);

/**
 * Meta Conversions API helper for DisplayAvenue.
 * Token must never be exposed to the browser or /content/*.json.
 */

function da_meta_capi_config(array $config): array {
  $secretFile = __DIR__ . '/.meta-capi.secret.php';
  $secret = [];
  if (is_file($secretFile)) {
    $loaded = include $secretFile;
    if (is_array($loaded)) $secret = $loaded;
  }

  $token = trim((string)($secret['access_token']
    ?? $config['meta_capi_access_token']
    ?? getenv('META_CAPI_ACCESS_TOKEN')
    ?: ''));
  $pixelId = trim((string)($secret['pixel_id']
    ?? $config['meta_capi_pixel_id']
    ?? getenv('META_CAPI_PIXEL_ID')
    ?: ''));
  $testCode = trim((string)($secret['test_event_code']
    ?? $config['meta_capi_test_event_code']
    ?? getenv('META_CAPI_TEST_EVENT_CODE')
    ?: ''));

  return [
    'access_token' => $token,
    'pixel_id' => $pixelId,
    'test_event_code' => $testCode,
    'api_version' => (string)($config['meta_capi_api_version'] ?? 'v21.0'),
  ];
}

function da_meta_capi_hash(string $value): string {
  $normalized = strtolower(trim($value));
  if ($normalized === '') return '';
  return hash('sha256', $normalized);
}

function da_meta_capi_normalize_phone(string $phone): string {
  $digits = preg_replace('/\D+/', '', $phone) ?? '';
  if ($digits === '') return '';
  // Indian mobiles often arrive as 10 digits
  if (strlen($digits) === 10) {
    $digits = '91' . $digits;
  }
  return $digits;
}

/**
 * @param array{
 *   event_name:string,
 *   event_id?:string,
 *   event_source_url?:string,
 *   email?:string,
 *   phone?:string,
 *   name?:string,
 *   client_ip_address?:string,
 *   client_user_agent?:string,
 *   fbp?:string,
 *   fbc?:string,
 *   fbclid?:string,
 *   custom_data?:array
 * } $event
 * @return array{ok:bool,http_code?:int,body?:mixed,error?:string,skipped?:bool}
 */
function da_meta_capi_send_event(array $config, array $event): array {
  $capi = da_meta_capi_config($config);
  if ($capi['access_token'] === '' || $capi['pixel_id'] === '') {
    return ['ok' => false, 'skipped' => true, 'error' => 'CAPI token or pixel_id not configured'];
  }

  $eventName = trim((string)($event['event_name'] ?? ''));
  if ($eventName === '') {
    return ['ok' => false, 'error' => 'event_name required'];
  }

  $userData = [];
  $email = trim((string)($event['email'] ?? ''));
  if ($email !== '') {
    $userData['em'] = [da_meta_capi_hash($email)];
  }
  $phone = da_meta_capi_normalize_phone((string)($event['phone'] ?? ''));
  if ($phone !== '') {
    $userData['ph'] = [da_meta_capi_hash($phone)];
  }

  $name = trim((string)($event['name'] ?? ''));
  if ($name !== '') {
    $parts = preg_split('/\s+/', $name) ?: [];
    $first = strtolower((string)($parts[0] ?? ''));
    $last = strtolower((string)(count($parts) > 1 ? $parts[count($parts) - 1] : ''));
    if ($first !== '') $userData['fn'] = [da_meta_capi_hash($first)];
    if ($last !== '' && $last !== $first) $userData['ln'] = [da_meta_capi_hash($last)];
  }

  $ip = trim((string)($event['client_ip_address'] ?? ''));
  if ($ip !== '') $userData['client_ip_address'] = $ip;
  $ua = trim((string)($event['client_user_agent'] ?? ''));
  if ($ua !== '') $userData['client_user_agent'] = $ua;

  $fbp = trim((string)($event['fbp'] ?? ''));
  if ($fbp !== '') $userData['fbp'] = $fbp;

  $fbc = trim((string)($event['fbc'] ?? ''));
  $fbclid = trim((string)($event['fbclid'] ?? ''));
  if ($fbc === '' && $fbclid !== '') {
    $fbc = 'fb.1.' . time() . '.' . $fbclid;
  }
  if ($fbc !== '') $userData['fbc'] = $fbc;

  $payloadEvent = [
    'event_name' => $eventName,
    'event_time' => time(),
    'action_source' => 'website',
    'user_data' => $userData,
  ];

  $eventId = trim((string)($event['event_id'] ?? ''));
  if ($eventId !== '') $payloadEvent['event_id'] = $eventId;

  $sourceUrl = trim((string)($event['event_source_url'] ?? ''));
  if ($sourceUrl !== '') $payloadEvent['event_source_url'] = $sourceUrl;

  if (!empty($event['custom_data']) && is_array($event['custom_data'])) {
    $payloadEvent['custom_data'] = $event['custom_data'];
  }

  $body = ['data' => [$payloadEvent]];
  if ($capi['test_event_code'] !== '') {
    $body['test_event_code'] = $capi['test_event_code'];
  }

  $url = sprintf(
    'https://graph.facebook.com/%s/%s/events',
    rawurlencode($capi['api_version']),
    rawurlencode($capi['pixel_id'])
  );

  $ch = curl_init($url);
  if (!$ch) {
    return ['ok' => false, 'error' => 'curl init failed'];
  }

  curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_HTTPHEADER => [
      'Content-Type: application/json',
      'Authorization: Bearer ' . $capi['access_token'],
    ],
    CURLOPT_POSTFIELDS => json_encode($body, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE),
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 10,
  ]);

  $raw = curl_exec($ch);
  $code = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
  $err = curl_error($ch);
  curl_close($ch);

  if ($raw === false) {
    return ['ok' => false, 'http_code' => $code, 'error' => $err ?: 'network error'];
  }

  $decoded = json_decode((string)$raw, true);
  $ok = $code >= 200 && $code < 300 && is_array($decoded) && empty($decoded['error']);
  return [
    'ok' => $ok,
    'http_code' => $code,
    'body' => $decoded ?? $raw,
    'error' => $ok ? null : (is_array($decoded) ? (string)($decoded['error']['message'] ?? 'CAPI error') : 'CAPI error'),
  ];
}
