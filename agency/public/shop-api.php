<?php
/**
 * Public shop API — Razorpay checkout for DisplayAvenue services.
 * Actions: create-order, verify-payment
 */
declare(strict_types=1);

header_remove('X-Powered-By');
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');

$https = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
  || ((int)($_SERVER['SERVER_PORT'] ?? 0) === 443)
  || (strtolower((string)($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '')) === 'https');
$host = (string)($_SERVER['HTTP_HOST'] ?? 'displayavenue.com');
$selfOrigin = ($https ? 'https://' : 'http://') . $host;

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(204);
  exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['ok' => false, 'error' => 'POST required']);
  exit;
}

$origin = (string)($_SERVER['HTTP_ORIGIN'] ?? '');
if ($origin !== '' && !hash_equals($selfOrigin, $origin)) {
  http_response_code(403);
  echo json_encode(['ok' => false, 'error' => 'Cross-origin requests are not allowed']);
  exit;
}

function shop_respond(int $code, array $payload): void {
  http_response_code($code);
  echo json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
  exit;
}

function shop_client_ip(): string {
  return (string)($_SERVER['REMOTE_ADDR'] ?? '0.0.0.0');
}

function shop_rate_limited(): bool {
  $ip = shop_client_ip();
  $path = sys_get_temp_dir() . '/da_shop_' . hash('sha256', $ip) . '.json';
  $now = time();
  $state = ['count' => 0, 'window_start' => $now];
  if (is_file($path)) {
    $raw = json_decode((string)file_get_contents($path), true);
    if (is_array($raw)) $state = $raw;
  }
  if (($now - (int)($state['window_start'] ?? $now)) > 600) {
    $state = ['count' => 0, 'window_start' => $now];
  }
  $state['count'] = (int)($state['count'] ?? 0) + 1;
  @file_put_contents($path, json_encode($state));
  return $state['count'] > 20;
}

if (shop_rate_limited()) {
  shop_respond(429, ['ok' => false, 'error' => 'Too many requests. Please try again later.']);
}

$raw = file_get_contents('php://input') ?: '';
$body = json_decode($raw, true);
if (!is_array($body)) $body = $_POST;
$action = (string)($_GET['action'] ?? ($body['action'] ?? ''));

$config = require __DIR__ . '/admin/config.php';
require_once __DIR__ . '/admin/mail-log.php';

$shopPath = rtrim((string)$config['content_dir'], '/\\') . '/shop.json';
$shop = is_file($shopPath) ? json_decode((string)file_get_contents($shopPath), true) : [];
if (!is_array($shop)) $shop = [];
$products = is_array($shop['products'] ?? null) ? $shop['products'] : [];

function shop_orders_path(array $config): string {
  return (string)($config['shop_orders_file'] ?? (__DIR__ . '/admin/data/shop-orders.json'));
}

function shop_read_orders(array $config): array {
  $path = shop_orders_path($config);
  if (!is_file($path)) return ['items' => [], 'updatedAt' => null];
  $data = json_decode((string)file_get_contents($path), true);
  if (!is_array($data)) return ['items' => [], 'updatedAt' => null];
  if (!isset($data['items']) || !is_array($data['items'])) $data['items'] = [];
  return $data;
}

function shop_write_orders(array $config, array $store): bool {
  $path = shop_orders_path($config);
  $dir = dirname($path);
  if (!is_dir($dir) && !@mkdir($dir, 0750, true)) return false;
  $store['updatedAt'] = gmdate('c');
  $json = json_encode($store, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
  $tmp = $path . '.tmp';
  if (@file_put_contents($tmp, $json . "\n") === false) return false;
  return @rename($tmp, $path);
}

function shop_find_product(array $products, string $idOrSlug): ?array {
  foreach ($products as $p) {
    if (!is_array($p)) continue;
    if (($p['enabled'] ?? true) === false) continue;
    $id = (string)($p['id'] ?? '');
    $slug = (string)($p['slug'] ?? $id);
    if ($id === $idOrSlug || $slug === $idOrSlug) return $p;
  }
  return null;
}

function shop_razorpay_request(array $config, string $method, string $path, ?array $payload = null): array {
  $keyId = trim((string)($config['razorpay_key_id'] ?? ''));
  $keySecret = trim((string)($config['razorpay_key_secret'] ?? ''));
  if ($keyId === '' || $keySecret === '') {
    return ['ok' => false, 'error' => 'Razorpay is not configured. Add keys in admin/config.php'];
  }
  $url = 'https://api.razorpay.com/v1/' . ltrim($path, '/');
  $ch = curl_init($url);
  $headers = ['Content-Type: application/json'];
  curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_USERPWD => $keyId . ':' . $keySecret,
    CURLOPT_HTTPHEADER => $headers,
    CURLOPT_TIMEOUT => 30,
  ]);
  if (strtoupper($method) === 'POST') {
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload ?? new stdClass()));
  }
  $resp = curl_exec($ch);
  $code = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
  $err = curl_error($ch);
  curl_close($ch);
  if ($resp === false) {
    return ['ok' => false, 'error' => 'Razorpay connection failed: ' . $err];
  }
  $data = json_decode((string)$resp, true);
  if (!is_array($data)) {
    return ['ok' => false, 'error' => 'Invalid Razorpay response', 'http' => $code];
  }
  if ($code < 200 || $code >= 300) {
    $msg = (string)($data['error']['description'] ?? $data['error']['code'] ?? 'Razorpay error');
    return ['ok' => false, 'error' => $msg, 'http' => $code, 'data' => $data];
  }
  return ['ok' => true, 'data' => $data];
}

if (($shop['enabled'] ?? true) === false && $action !== '') {
  // still allow verify for in-flight payments
}

switch ($action) {
  case 'create-order': {
    if (($shop['enabled'] ?? true) === false) {
      shop_respond(403, ['ok' => false, 'error' => 'Shop is temporarily unavailable']);
    }
    $productId = trim((string)($body['productId'] ?? $body['slug'] ?? ''));
    $qty = max(1, min(10, (int)($body['quantity'] ?? 1)));
    $name = trim((string)($body['name'] ?? ''));
    $email = trim((string)($body['email'] ?? ''));
    $phone = trim((string)($body['phone'] ?? ''));

    if ($productId === '') shop_respond(400, ['ok' => false, 'error' => 'Select a product']);
    if ($name === '') shop_respond(400, ['ok' => false, 'error' => 'Name is required']);
    if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
      shop_respond(400, ['ok' => false, 'error' => 'A valid email is required']);
    }

    $product = shop_find_product($products, $productId);
    if (!$product) shop_respond(404, ['ok' => false, 'error' => 'Product not found']);

    $unitPrice = (float)($product['price'] ?? 0);
    if ($unitPrice <= 0) shop_respond(400, ['ok' => false, 'error' => 'Product price is invalid']);

    $amountInr = round($unitPrice * $qty, 2);
    $amountPaise = (int)round($amountInr * 100);
    if ($amountPaise < 100) shop_respond(400, ['ok' => false, 'error' => 'Minimum amount is ₹1']);

    $receipt = 'da_' . bin2hex(random_bytes(6));
    $rz = shop_razorpay_request($config, 'POST', 'orders', [
      'amount' => $amountPaise,
      'currency' => (string)($shop['currency'] ?? 'INR'),
      'receipt' => $receipt,
      'notes' => [
        'product_id' => (string)($product['id'] ?? ''),
        'product_title' => (string)($product['title'] ?? ''),
        'customer_email' => $email,
      ],
    ]);
    if (!$rz['ok']) shop_respond(502, ['ok' => false, 'error' => $rz['error'] ?? 'Could not create payment order']);

    $rzOrder = $rz['data'];
    $orderId = bin2hex(random_bytes(8));
    $order = [
      'id' => $orderId,
      'status' => 'created',
      'createdAt' => gmdate('c'),
      'updatedAt' => gmdate('c'),
      'productId' => (string)($product['id'] ?? ''),
      'productSlug' => (string)($product['slug'] ?? $product['id'] ?? ''),
      'productTitle' => (string)($product['title'] ?? ''),
      'quantity' => $qty,
      'unitPrice' => $unitPrice,
      'amountInr' => $amountInr,
      'amountPaise' => $amountPaise,
      'currency' => (string)($shop['currency'] ?? 'INR'),
      'customer' => [
        'name' => mb_substr($name, 0, 120),
        'email' => mb_substr($email, 0, 180),
        'phone' => mb_substr($phone, 0, 40),
      ],
      'razorpayOrderId' => (string)($rzOrder['id'] ?? ''),
      'razorpayPaymentId' => null,
      'razorpaySignature' => null,
      'receipt' => $receipt,
      'ip' => shop_client_ip(),
    ];

    $store = shop_read_orders($config);
    array_unshift($store['items'], $order);
    if (count($store['items']) > 2000) $store['items'] = array_slice($store['items'], 0, 2000);
    if (!shop_write_orders($config, $store)) {
      shop_respond(500, ['ok' => false, 'error' => 'Could not save order']);
    }

    shop_respond(200, [
      'ok' => true,
      'orderId' => $orderId,
      'razorpayOrderId' => $order['razorpayOrderId'],
      'amount' => $amountPaise,
      'currency' => $order['currency'],
      'keyId' => trim((string)($config['razorpay_key_id'] ?? '')),
      'product' => [
        'id' => $order['productId'],
        'title' => $order['productTitle'],
      ],
      'customer' => $order['customer'],
      'prefill' => [
        'name' => $order['customer']['name'],
        'email' => $order['customer']['email'],
        'contact' => $order['customer']['phone'],
      ],
    ]);
  }

  case 'verify-payment': {
    $orderId = trim((string)($body['orderId'] ?? ''));
    $rzOrderId = trim((string)($body['razorpay_order_id'] ?? ''));
    $rzPaymentId = trim((string)($body['razorpay_payment_id'] ?? ''));
    $rzSignature = trim((string)($body['razorpay_signature'] ?? ''));

    if ($orderId === '' || $rzOrderId === '' || $rzPaymentId === '' || $rzSignature === '') {
      shop_respond(400, ['ok' => false, 'error' => 'Missing payment verification fields']);
    }

    $keySecret = trim((string)($config['razorpay_key_secret'] ?? ''));
    if ($keySecret === '') {
      shop_respond(500, ['ok' => false, 'error' => 'Razorpay is not configured']);
    }

    $expected = hash_hmac('sha256', $rzOrderId . '|' . $rzPaymentId, $keySecret);
    if (!hash_equals($expected, $rzSignature)) {
      shop_respond(400, ['ok' => false, 'error' => 'Payment signature verification failed']);
    }

    $store = shop_read_orders($config);
    $found = null;
    foreach ($store['items'] as &$item) {
      if (($item['id'] ?? '') === $orderId) {
        if (($item['razorpayOrderId'] ?? '') !== $rzOrderId) {
          shop_respond(400, ['ok' => false, 'error' => 'Order mismatch']);
        }
        $item['status'] = 'paid';
        $item['razorpayPaymentId'] = $rzPaymentId;
        $item['razorpaySignature'] = $rzSignature;
        $item['paidAt'] = gmdate('c');
        $item['updatedAt'] = gmdate('c');
        $found = $item;
        break;
      }
    }
    unset($item);

    if (!$found) shop_respond(404, ['ok' => false, 'error' => 'Order not found']);
    shop_write_orders($config, $store);

    $notifyTo = (string)($config['notify_email'] ?? 'info@displayavenue.com');
    $cust = $found['customer'] ?? [];
    $subject = '[DisplayAvenue Shop] Paid order — ' . ($found['productTitle'] ?? 'Service');
    $bodyText = "New paid shop order\n\n"
      . "Order ID: {$found['id']}\n"
      . "Product: " . ($found['productTitle'] ?? '') . "\n"
      . "Qty: " . ($found['quantity'] ?? 1) . "\n"
      . "Amount: ₹" . number_format((float)($found['amountInr'] ?? 0), 2) . "\n"
      . "Razorpay payment: {$rzPaymentId}\n"
      . "Razorpay order: {$rzOrderId}\n\n"
      . "Customer: " . ($cust['name'] ?? '') . "\n"
      . "Email: " . ($cust['email'] ?? '') . "\n"
      . "Phone: " . ($cust['phone'] ?? '') . "\n\n"
      . "View in CMS: https://displayavenue.com/admin/\n";

    da_send_tracked_mail($config, [
      'to' => $notifyTo,
      'subject' => $subject,
      'body' => $bodyText,
      'headers' => [
        'MIME-Version: 1.0',
        'Content-Type: text/plain; charset=UTF-8',
        'From: DisplayAvenue Shop <noreply@displayavenue.com>',
        'Reply-To: ' . ($cust['name'] ?? 'Customer') . ' <' . ($cust['email'] ?? $notifyTo) . '>',
        'X-Mailer: DisplayAvenue-Shop',
      ],
      'type' => 'shop-order',
      'meta' => [
        'orderId' => $found['id'],
        'paymentId' => $rzPaymentId,
      ],
    ]);

    shop_respond(200, [
      'ok' => true,
      'paid' => true,
      'orderId' => $found['id'],
      'message' => (string)($shop['successMessage'] ?? 'Payment successful. We will contact you shortly.'),
    ]);
  }

  default:
    shop_respond(400, ['ok' => false, 'error' => 'Unknown action']);
}
