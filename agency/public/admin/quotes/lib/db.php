<?php
declare(strict_types=1);

function da_quotes_config(): array {
  static $cfg = null;
  if ($cfg !== null) return $cfg;
  $path = dirname(__DIR__) . '/local.php';
  if (!is_file($path)) {
    throw new RuntimeException('Missing quotes/local.php — copy local.example.php and fill DB + Razorpay keys.');
  }
  $cfg = require $path;
  return $cfg;
}

function da_db(): mysqli {
  static $db = null;
  if ($db instanceof mysqli) return $db;
  $c = da_quotes_config();
  mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
  $db = new mysqli(
    (string) ($c['db_host'] ?? 'localhost'),
    (string) $c['db_user'],
    (string) $c['db_pass'],
    (string) $c['db_name'],
    (int) ($c['db_port'] ?? 3306),
  );
  $db->set_charset('utf8mb4');
  return $db;
}

function da_json_out(int $code, array $payload): void {
  http_response_code($code);
  header('Content-Type: application/json; charset=utf-8');
  echo json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
  exit;
}
