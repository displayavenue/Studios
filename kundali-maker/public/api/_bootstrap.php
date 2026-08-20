<?php
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

function jk_cors(): void {
  $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
  $allowed = [
    'https://jyotishkundali.com',
    'https://www.jyotishkundali.com',
    'http://localhost:5173',
    'http://127.0.0.1:5173',
  ];
  if ($origin && in_array($origin, $allowed, true)) {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Access-Control-Allow-Credentials: true');
  }
  header('Access-Control-Allow-Headers: Content-Type');
  header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
  if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    http_response_code(204);
    exit;
  }
}

function jk_json($data, int $code = 200): void {
  http_response_code($code);
  echo json_encode($data, JSON_UNESCAPED_UNICODE);
  exit;
}

function jk_config(): array {
  $path = __DIR__ . '/config.php';
  if (!is_file($path)) {
    return [
      'key_id' => '',
      'key_secret' => '',
      'currency' => 'INR',
      'allow_demo' => true,
      'configured' => false,
    ];
  }
  /** @var array $cfg */
  $cfg = require $path;
  $cfg['configured'] = !empty($cfg['key_id'])
    && !empty($cfg['key_secret'])
    && strpos((string)$cfg['key_id'], 'REPLACE') === false
    && strpos((string)$cfg['key_secret'], 'REPLACE') === false;
  return $cfg;
}

function jk_read_json_body(): array {
  $raw = file_get_contents('php://input');
  if (!$raw) return [];
  $data = json_decode($raw, true);
  return is_array($data) ? $data : [];
}

function jk_razorpay_request(string $method, string $path, array $cfg, ?array $body = null): array {
  $url = 'https://api.razorpay.com/v1/' . ltrim($path, '/');
  $ch = curl_init($url);
  $headers = ['Content-Type: application/json'];
  curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_USERPWD => $cfg['key_id'] . ':' . $cfg['key_secret'],
    CURLOPT_CUSTOMREQUEST => strtoupper($method),
    CURLOPT_HTTPHEADER => $headers,
    CURLOPT_TIMEOUT => 30,
  ]);
  if ($body !== null) {
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($body));
  }
  $res = curl_exec($ch);
  $err = curl_error($ch);
  $code = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
  curl_close($ch);
  if ($res === false) {
    return ['ok' => false, 'status' => 0, 'error' => $err ?: 'curl failed'];
  }
  $json = json_decode($res, true);
  return [
    'ok' => $code >= 200 && $code < 300,
    'status' => $code,
    'data' => is_array($json) ? $json : ['raw' => $res],
  ];
}
