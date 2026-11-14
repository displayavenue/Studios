<?php
/**
 * Forward leads to free CRM destinations:
 * - HubSpot Forms API (free CRM)
 * - Google Sheets via Apps Script webhook
 * - Generic JSON webhook
 */
declare(strict_types=1);

function da_crm_load_config(string $contentDir, array $phpConfig = []): array
{
  $path = rtrim($contentDir, '/\\') . '/crm.json';
  $cfg = is_file($path) ? (json_decode((string)file_get_contents($path), true) ?: []) : [];
  if (!is_array($cfg)) $cfg = [];

  $secretPath = dirname(__DIR__) . '/.crm.secret.php';
  $secret = is_file($secretPath) ? (include $secretPath) : [];
  if (!is_array($secret)) $secret = [];

  $hubspot = is_array($cfg['hubspot'] ?? null) ? $cfg['hubspot'] : [];
  $sheets = is_array($cfg['sheets'] ?? null) ? $cfg['sheets'] : [];

  return [
    'enabled' => !empty($cfg['enabled']),
    'hubspot' => [
      'enabled' => !empty($hubspot['enabled']),
      'portalId' => trim((string)($hubspot['portalId'] ?? '')),
      'formGuid' => trim((string)($hubspot['formGuid'] ?? '')),
      'accessToken' => trim((string)(
        $secret['hubspot_access_token']
        ?? $phpConfig['hubspot_access_token']
        ?? getenv('HUBSPOT_ACCESS_TOKEN')
        ?: ($hubspot['accessToken'] ?? '')
      )),
    ],
    'sheets' => [
      'enabled' => !empty($sheets['enabled']),
      'webhookUrl' => trim((string)($sheets['webhookUrl'] ?? '')),
    ],
    'webhookUrl' => trim((string)($cfg['webhookUrl'] ?? '')),
  ];
}

/**
 * Normalize lead payload for CRM sinks.
 *
 * @param array<string,mixed> $lead
 * @return array<string,mixed>
 */
function da_crm_normalize_lead(array $lead): array
{
  $name = trim((string)($lead['name'] ?? ''));
  $parts = preg_split('/\s+/', $name, 2) ?: [];
  $first = $parts[0] ?? $name;
  $last = $parts[1] ?? '';

  $created = (string)($lead['created_at'] ?? $lead['createdAt'] ?? gmdate('c'));
  $source = (string)($lead['source'] ?? $lead['page'] ?? 'website');
  $phone = (string)($lead['phone'] ?? '');
  $email = (string)($lead['email'] ?? '');
  $business = (string)($lead['business_name'] ?? $lead['business'] ?? '');
  $message = (string)($lead['message'] ?? $lead['business_description'] ?? '');

  return [
    'id' => (string)($lead['id'] ?? ''),
    'created_at' => $created,
    'source' => $source,
    'channel' => (string)($lead['channel'] ?? 'form'),
    'name' => $name,
    'firstname' => $first,
    'lastname' => $last,
    'phone' => $phone,
    'email' => $email,
    'business' => $business,
    'industry' => (string)($lead['industry'] ?? ''),
    'message' => $message,
    'services' => $lead['services_required'] ?? [],
    'budget' => (string)($lead['monthly_marketing_budget'] ?? ''),
    'plan' => (string)($lead['selected_plan'] ?? ''),
    'timeline' => (string)($lead['timeline'] ?? ''),
    'lead_score' => (int)($lead['lead_score'] ?? 0),
    'lead_temperature' => (string)($lead['lead_temperature'] ?? ''),
    'page' => (string)($lead['page'] ?? $lead['landing_page'] ?? ''),
    'utm_source' => (string)($lead['last_utm_source'] ?? $lead['first_utm_source'] ?? ''),
    'utm_campaign' => (string)($lead['last_utm_campaign'] ?? $lead['first_utm_campaign'] ?? ''),
    'whatsapp_url' => $phone !== ''
      ? 'https://wa.me/' . preg_replace('/\D+/', '', $phone)
      : '',
    'raw' => $lead,
  ];
}

/**
 * @param array<string,mixed> $lead
 * @return array{ok:bool,hubspot:?array,sheets:?array,webhook:?array}
 */
function da_crm_forward(array $lead, string $contentDir, array $phpConfig = []): array
{
  $cfg = da_crm_load_config($contentDir, $phpConfig);
  $out = [
    'ok' => true,
    'hubspot' => null,
    'sheets' => null,
    'webhook' => null,
  ];

  if (empty($cfg['enabled'])) {
    return $out + ['skipped' => true];
  }

  $n = da_crm_normalize_lead($lead);

  if (!empty($cfg['hubspot']['enabled'])) {
    $out['hubspot'] = da_crm_send_hubspot($n, $cfg['hubspot']);
    if (empty($out['hubspot']['ok'])) $out['ok'] = false;
  }

  if (!empty($cfg['sheets']['enabled']) && $cfg['sheets']['webhookUrl'] !== '') {
    $out['sheets'] = da_crm_post_json($cfg['sheets']['webhookUrl'], $n);
    if (empty($out['sheets']['ok'])) $out['ok'] = false;
  }

  if ($cfg['webhookUrl'] !== '') {
    $out['webhook'] = da_crm_post_json($cfg['webhookUrl'], $n);
    if (empty($out['webhook']['ok'])) $out['ok'] = false;
  }

  return $out;
}

/**
 * @param array<string,mixed> $n
 * @param array<string,string> $hs
 * @return array{ok:bool,http_code?:int,error?:string,skipped?:bool}
 */
function da_crm_send_hubspot(array $n, array $hs): array
{
  $portal = $hs['portalId'] ?? '';
  $form = $hs['formGuid'] ?? '';
  if ($portal === '' || $form === '') {
    return ['ok' => false, 'skipped' => true, 'error' => 'HubSpot portalId/formGuid missing'];
  }

  $fields = [
    ['name' => 'email', 'value' => $n['email'] !== '' ? $n['email'] : ('lead+' . preg_replace('/\W+/', '', (string)$n['id']) . '@displayavenue.leads')],
    ['name' => 'firstname', 'value' => $n['firstname']],
    ['name' => 'lastname', 'value' => $n['lastname']],
    ['name' => 'phone', 'value' => $n['phone']],
    ['name' => 'company', 'value' => $n['business']],
    ['name' => 'message', 'value' => trim(
      ($n['message'] !== '' ? $n['message'] . "\n\n" : '') .
      'Source: ' . $n['source'] . ' / ' . $n['channel'] . "\n" .
      'Page: ' . $n['page'] . "\n" .
      'Industry: ' . $n['industry'] . "\n" .
      'Plan: ' . $n['plan'] . "\n" .
      'Budget: ' . $n['budget'] . "\n" .
      'Timeline: ' . $n['timeline'] . "\n" .
      'Score: ' . $n['lead_score'] . ' ' . $n['lead_temperature'] . "\n" .
      'UTM: ' . $n['utm_source'] . ' / ' . $n['utm_campaign']
    )],
  ];

  // Drop empty optional fields HubSpot may reject on required-only forms
  $fields = array_values(array_filter($fields, static function ($f) {
    if ($f['name'] === 'email') return true;
    return trim((string)$f['value']) !== '';
  }));

  $payload = [
    'fields' => $fields,
    'context' => [
      'pageUri' => 'https://displayavenue.com' . ($n['page'] !== '' ? $n['page'] : '/'),
      'pageName' => 'DisplayAvenue Lead · ' . $n['source'],
    ],
  ];

  $url = 'https://api.hsforms.com/submissions/v3/integration/submit/' .
    rawurlencode($portal) . '/' . rawurlencode($form);

  return da_crm_post_json($url, $payload);
}

/**
 * @param array<string,mixed> $payload
 * @return array{ok:bool,http_code:int,error?:string,body?:string}
 */
function da_crm_post_json(string $url, array $payload): array
{
  if (!filter_var($url, FILTER_VALIDATE_URL)) {
    return ['ok' => false, 'http_code' => 0, 'error' => 'Invalid webhook URL'];
  }
  if (!function_exists('curl_init')) {
    return ['ok' => false, 'http_code' => 0, 'error' => 'curl missing'];
  }

  $ch = curl_init($url);
  if (!$ch) {
    return ['ok' => false, 'http_code' => 0, 'error' => 'curl_init failed'];
  }

  curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
    CURLOPT_POSTFIELDS => json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE),
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 10,
  ]);
  $body = (string)curl_exec($ch);
  $code = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
  $err = curl_error($ch);
  curl_close($ch);

  $ok = $code >= 200 && $code < 300;
  return [
    'ok' => $ok,
    'http_code' => $code,
    'error' => $ok ? null : ($err !== '' ? $err : ('HTTP ' . $code)),
    'body' => mb_substr($body, 0, 500),
  ];
}

/**
 * Persist lead locally (shared by form + WhatsApp endpoints).
 *
 * @param array<string,mixed> $lead
 * @return array{saved:bool,file:string}
 */
function da_crm_save_local(array $lead): array
{
  $leadsDir = dirname(__DIR__) . '/.leads';
  if (!is_dir($leadsDir)) {
    @mkdir($leadsDir, 0755, true);
  }
  $id = (string)($lead['id'] ?? ('lead_' . date('Ymd_His') . '_' . bin2hex(random_bytes(3))));
  $lead['id'] = $id;
  $file = $leadsDir . '/' . $id . '.json';
  $written = @file_put_contents(
    $file,
    json_encode($lead, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT)
  );

  $indexPath = $leadsDir . '/index.json';
  $index = [];
  if (is_file($indexPath)) {
    $index = json_decode((string)file_get_contents($indexPath), true) ?: [];
  }
  if (!is_array($index)) $index = [];
  array_unshift($index, [
    'id' => $id,
    'createdAt' => (string)($lead['created_at'] ?? $lead['createdAt'] ?? gmdate('c')),
    'name' => (string)($lead['name'] ?? ''),
    'phone' => (string)($lead['phone'] ?? ''),
    'email' => (string)($lead['email'] ?? ''),
    'business' => (string)($lead['business_name'] ?? $lead['business'] ?? ''),
    'page' => (string)($lead['page'] ?? $lead['landing_page'] ?? ''),
    'source' => (string)($lead['source'] ?? ''),
    'channel' => (string)($lead['channel'] ?? 'form'),
    'lead_temperature' => (string)($lead['lead_temperature'] ?? ''),
    'lead_score' => (int)($lead['lead_score'] ?? 0),
  ]);
  $index = array_slice($index, 0, 500);
  @file_put_contents($indexPath, json_encode($index, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));

  return ['saved' => (bool)$written, 'file' => $file, 'id' => $id];
}
