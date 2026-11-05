<?php
/**
 * DisplayAvenue Data — industry lead extract API
 * Pulls public OpenStreetMap businesses near a city (Overpass).
 */
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(204);
  exit;
}

function da_json_input(): array {
  $raw = file_get_contents('php://input');
  $json = json_decode($raw ?: '[]', true);
  if (is_array($json) && $json) return $json;
  return $_POST ?: $_GET;
}

function da_fail(string $msg, int $code = 400): void {
  http_response_code($code);
  echo json_encode(['error' => $msg]);
  exit;
}

function da_http_get(string $url, int $timeout = 28): string {
  if (function_exists('curl_init')) {
    $ch = curl_init($url);
    curl_setopt_array($ch, [
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_FOLLOWLOCATION => true,
      CURLOPT_TIMEOUT => $timeout,
      CURLOPT_CONNECTTIMEOUT => 10,
      CURLOPT_USERAGENT => 'DisplayAvenueData/1.0 (lead-research; https://data.displayavenue.com; info@displayavenue.com)',
      CURLOPT_HTTPHEADER => ['Accept: application/json'],
    ]);
    $body = curl_exec($ch);
    $err = curl_error($ch);
    $status = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    if ($body === false || $status >= 400) {
      throw new RuntimeException($err ?: ("HTTP $status"));
    }
    return $body;
  }

  $ctx = stream_context_create([
    'http' => [
      'method' => 'GET',
      'timeout' => $timeout,
      'header' => "User-Agent: DisplayAvenueData/1.0\r\nAccept: application/json\r\n",
    ],
  ]);
  $body = @file_get_contents($url, false, $ctx);
  if ($body === false) {
    throw new RuntimeException('HTTP request failed');
  }
  return $body;
}

function da_http_post(string $url, string $payload, int $timeout = 22): string {
  if (function_exists('curl_init')) {
    $ch = curl_init($url);
    curl_setopt_array($ch, [
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_FOLLOWLOCATION => true,
      CURLOPT_TIMEOUT => $timeout,
      CURLOPT_CONNECTTIMEOUT => 8,
      CURLOPT_POST => true,
      CURLOPT_POSTFIELDS => $payload,
      CURLOPT_USERAGENT => 'DisplayAvenueData/1.0 (lead-research; https://data.displayavenue.com; info@displayavenue.com)',
      CURLOPT_HTTPHEADER => ['Content-Type: application/x-www-form-urlencoded'],
    ]);
    $body = curl_exec($ch);
    $err = curl_error($ch);
    $status = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    if ($body === false || $status >= 400) {
      throw new RuntimeException($err ?: ("HTTP $status"));
    }
    return $body;
  }

  $ctx = stream_context_create([
    'http' => [
      'method' => 'POST',
      'timeout' => $timeout,
      'header' => "Content-Type: application/x-www-form-urlencoded\r\nUser-Agent: DisplayAvenueData/1.0\r\n",
      'content' => $payload,
    ],
  ]);
  $body = @file_get_contents($url, false, $ctx);
  if ($body === false) {
    throw new RuntimeException('HTTP request failed');
  }
  return $body;
}

function da_addr(array $tags): string {
  $parts = array_filter([
    $tags['addr:housenumber'] ?? null,
    $tags['addr:street'] ?? null,
    $tags['addr:suburb'] ?? ($tags['addr:neighbourhood'] ?? null),
    $tags['addr:city'] ?? null,
    $tags['addr:postcode'] ?? null,
  ]);
  return implode(', ', $parts);
}

$input = da_json_input();
$lat = isset($input['lat']) ? (float) $input['lat'] : 0.0;
$lon = isset($input['lon']) ? (float) $input['lon'] : 0.0;
$radiusKm = isset($input['radiusKm']) ? (float) $input['radiusKm'] : 10.0;
$radiusKm = max(2.0, min(30.0, $radiusKm));
$radiusM = (int) round($radiusKm * 1000);
$osm = trim((string) ($input['osm'] ?? 'nwr["shop"]'));
$city = trim((string) ($input['city'] ?? ''));
$industry = trim((string) ($input['industry'] ?? ''));

if ($lat === 0.0 || $lon === 0.0) {
  da_fail('lat/lon required');
}

// Only allow nwr[...] style filters to avoid query injection.
if (!preg_match('/^nwr\[[^\]]+\]$/', $osm)) {
  da_fail('Invalid industry filter');
}

$query = <<<QL
[out:json][timeout:40];
(
  {$osm}(around:{$radiusM},{$lat},{$lon});
);
out center tags 80;
QL;

$endpoints = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
];

$raw = null;
$lastErr = null;
foreach ($endpoints as $endpoint) {
  try {
    $raw = da_http_post($endpoint, http_build_query(['data' => $query]));
    break;
  } catch (Throwable $e) {
    $lastErr = $e->getMessage();
  }
}

if ($raw === null) {
  da_fail('Overpass unavailable: ' . ($lastErr ?: 'unknown'), 502);
}

$data = json_decode($raw, true);
if (!is_array($data)) {
  da_fail('Bad Overpass response', 502);
}

$leads = [];
$seen = [];
foreach (($data['elements'] ?? []) as $el) {
  $tags = $el['tags'] ?? [];
  $name = trim((string) ($tags['name'] ?? ''));
  if ($name === '') continue;

  $key = strtolower($name);
  if (isset($seen[$key])) continue;
  $seen[$key] = true;

  $latEl = $el['lat'] ?? ($el['center']['lat'] ?? null);
  $lonEl = $el['lon'] ?? ($el['center']['lon'] ?? null);
  $phone = $tags['phone'] ?? ($tags['contact:phone'] ?? ($tags['mobile'] ?? ''));
  $website = $tags['website'] ?? ($tags['contact:website'] ?? ($tags['url'] ?? ''));

  $leads[] = [
    'name' => $name,
    'phone' => is_string($phone) ? $phone : '',
    'website' => is_string($website) ? $website : '',
    'address' => da_addr($tags) ?: $city,
    'lat' => $latEl,
    'lon' => $lonEl,
    'source' => 'OpenStreetMap',
    'industry' => $industry,
  ];
}

echo json_encode([
  'ok' => true,
  'provider' => 'OpenStreetMap / Overpass',
  'count' => count($leads),
  'city' => $city,
  'industry' => $industry,
  'radiusKm' => $radiusKm,
  'leads' => $leads,
], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
