<?php
/**
 * DisplayAvenue Live Chat API
 * Public: start / send / poll
 * Admin: list / get / reply / close (session or bearer token)
 */
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$host = $_SERVER['HTTP_HOST'] ?? '';
$scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
$self = $scheme . '://' . $host;
if ($origin && (str_starts_with($origin, 'https://displayavenue.com') || str_starts_with($origin, 'https://www.displayavenue.com') || $origin === $self)) {
  header('Access-Control-Allow-Origin: ' . $origin);
  header('Vary: Origin');
} else {
  header('Access-Control-Allow-Origin: ' . $self);
}
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-DA-Admin-Token');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(204);
  exit;
}

$config = require __DIR__ . '/config.php';
require_once __DIR__ . '/lib/chat-bot.php';

$secure = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
  || (($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https')
  || (($_SERVER['SERVER_PORT'] ?? '') === '443');

session_name((string)($config['session_name'] ?? 'da_agency_admin'));
session_set_cookie_params([
  'lifetime' => (int)($config['session_ttl'] ?? 28800),
  'path' => '/',
  'secure' => $secure,
  'httponly' => true,
  'samesite' => 'Lax',
]);
session_start();

function chat_respond(int $code, array $payload): void {
  http_response_code($code);
  echo json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
  exit;
}

function chat_bearer(): string {
  $hdr = $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '';
  if (preg_match('/Bearer\s+(\S+)/i', $hdr, $m)) return trim($m[1]);
  $alt = $_SERVER['HTTP_X_DA_ADMIN_TOKEN'] ?? '';
  return is_string($alt) ? trim($alt) : '';
}

function chat_is_admin(array $config): bool {
  $ttl = (int)($config['session_ttl'] ?? 28800);
  $now = time();
  if (!empty($_SESSION['da_auth'])) {
    $at = (int)($_SESSION['da_auth_at'] ?? 0);
    if ($at && ($now - $at) <= $ttl) {
      $_SESSION['da_auth_at'] = $now;
      return true;
    }
  }
  $token = chat_bearer();
  if ($token !== '' && !empty($_SESSION['da_token']) && hash_equals((string)$_SESSION['da_token'], $token)) {
    $at = (int)($_SESSION['da_auth_at'] ?? 0);
    if ($at && ($now - $at) <= $ttl) {
      $_SESSION['da_auth'] = true;
      $_SESSION['da_auth_at'] = $now;
      return true;
    }
  }
  return false;
}

function chat_dir(): string {
  $dir = __DIR__ . '/.chats';
  if (!is_dir($dir)) {
    @mkdir($dir, 0750, true);
  }
  return $dir;
}

function chat_path(string $id): string {
  if (!preg_match('/^chat_[a-zA-Z0-9_]+$/', $id)) {
    chat_respond(400, ['ok' => false, 'error' => 'Invalid chat id']);
  }
  return chat_dir() . '/' . $id . '.json';
}

function chat_load(string $id): ?array {
  $path = chat_path($id);
  if (!is_file($path)) return null;
  $data = json_decode((string)file_get_contents($path), true);
  return is_array($data) ? $data : null;
}

function chat_save(array $chat): void {
  $path = chat_path((string)$chat['id']);
  $tmp = $path . '.tmp';
  file_put_contents($tmp, json_encode($chat, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
  rename($tmp, $path);
}

function chat_input(): array {
  $raw = file_get_contents('php://input') ?: '';
  $json = json_decode($raw, true);
  if (is_array($json)) return $json;
  return array_merge($_GET, $_POST);
}

function chat_public_view(array $chat): array {
  $msgs = array_map(static function ($m) {
    return [
      'id' => $m['id'],
      'role' => $m['role'],
      'text' => $m['text'],
      'at' => $m['at'],
      'ctas' => $m['ctas'] ?? [],
      'provider' => $m['provider'] ?? null,
    ];
  }, $chat['messages'] ?? []);
  return [
    'id' => $chat['id'],
    'status' => $chat['status'] ?? 'open',
    'visitor' => [
      'name' => $chat['visitor']['name'] ?? '',
      'phone' => $chat['visitor']['phone'] ?? '',
    ],
    'messages' => $msgs,
    'lead' => [
      'stage' => $chat['lead']['stage'] ?? null,
      'industry' => $chat['lead']['industry'] ?? null,
      'goal' => $chat['lead']['goal'] ?? null,
      'interest' => $chat['lead']['interest'] ?? null,
    ],
    'bot' => 'DA Growth AI',
  ];
}

function chat_add_message(array &$chat, string $role, string $text, array $extra = []): array {
  $msg = [
    'id' => 'm_' . bin2hex(random_bytes(4)),
    'role' => $role,
    'text' => $text,
    'at' => gmdate('c'),
  ];
  if (!empty($extra['ctas'])) $msg['ctas'] = $extra['ctas'];
  if (!empty($extra['provider'])) $msg['provider'] = $extra['provider'];
  $chat['messages'][] = $msg;
  $chat['updatedAt'] = $msg['at'];
  if ($role === 'visitor') {
    $chat['unreadAdmin'] = (int)($chat['unreadAdmin'] ?? 0) + 1;
  } else {
    $chat['unreadAdmin'] = 0;
  }
  return $msg;
}

function chat_notify_admin(array $chat, string $text): void {
  require_once __DIR__ . '/lib/automation.php';
  $name = $chat['visitor']['name'] ?? 'Visitor';
  $phone = $chat['visitor']['phone'] ?? '';
  $visitorId = (string)($chat['visitor']['visitorId'] ?? '');
  $page = (string)($chat['visitor']['page'] ?? '/');
  $body = "Hot live-chat lead on displayavenue.com\n\n"
    . "Name: {$name}\nPhone: {$phone}\nChat: {$chat['id']}\nPage: {$page}\n\n"
    . "Message:\n{$text}\n\n"
    . "Reply in Admin → Live Chat\nhttps://displayavenue.com/admin/\n";
  da_automation_notify([
    'event' => 'chat_hot_lead',
    'subject' => '[Live Chat] Hot lead: ' . $name,
    'text' => $body,
    'summary' => $name . ' · chat ' . $chat['id'],
    'visitorId' => $visitorId,
    'leadId' => $chat['id'],
  ]);
}

$input = chat_input();
$action = (string)($input['action'] ?? $_GET['action'] ?? '');

if ($action === 'start') {
  $name = trim((string)($input['name'] ?? 'Visitor'));
  $phone = trim((string)($input['phone'] ?? ''));
  $email = trim((string)($input['email'] ?? ''));
  $page = trim((string)($input['page'] ?? '/'));
  $visitorId = preg_replace('/[^a-zA-Z0-9_\-]/', '', (string)($input['visitorId'] ?? '')) ?? '';
  if (strlen($name) > 80) $name = substr($name, 0, 80);
  if (strlen($phone) > 40) $phone = substr($phone, 0, 40);
  if (strlen($email) > 120) $email = substr($email, 0, 120);
  if (strlen($page) > 200) $page = substr($page, 0, 200);

  $id = 'chat_' . date('Ymd_His') . '_' . bin2hex(random_bytes(3));
  $token = bin2hex(random_bytes(16));
  $now = gmdate('c');
  $displayName = $name !== '' ? $name : 'Visitor';
  $chat = [
    'id' => $id,
    'visitorToken' => $token,
    'status' => 'open',
    'createdAt' => $now,
    'updatedAt' => $now,
    'unreadAdmin' => 0,
    'lead' => ['stage' => 'goal'],
    'visitor' => [
      'name' => $displayName,
      'phone' => $phone,
      'email' => $email,
      'page' => $page,
      'visitorId' => $visitorId,
      'ip' => $_SERVER['REMOTE_ADDR'] ?? '',
      'ua' => substr((string)($_SERVER['HTTP_USER_AGENT'] ?? ''), 0, 200),
    ],
    'messages' => [],
  ];
  $greet = da_chat_bot_greeting($chat, da_chat_bot_config());
  chat_add_message($chat, 'agent', $greet['text'], [
    'ctas' => $greet['ctas'] ?? [],
    'provider' => $greet['provider'] ?? 'rules',
  ]);
  chat_save($chat);
  chat_respond(200, [
    'ok' => true,
    'conversationId' => $id,
    'visitorToken' => $token,
    'chat' => chat_public_view($chat),
  ]);
}

if ($action === 'send') {
  $id = (string)($input['conversationId'] ?? '');
  $token = (string)($input['visitorToken'] ?? '');
  $text = trim((string)($input['text'] ?? ''));
  if ($text === '' || strlen($text) > 2000) {
    chat_respond(400, ['ok' => false, 'error' => 'Message required (max 2000 chars)']);
  }
  // Quick-intent chips from UI
  if (str_starts_with($text, '#intent:')) {
    $intent = substr($text, 8);
    $map = [
      'google-ads' => 'I need Google Ads help',
      'meta-ads' => 'I need Meta Ads / Instagram ads help',
      'seo' => 'I need SEO help',
      'website' => 'I need a website / landing page',
    ];
    $text = $map[$intent] ?? ('I need help with ' . $intent);
  }
  $chat = chat_load($id);
  if (!$chat || !hash_equals((string)($chat['visitorToken'] ?? ''), $token)) {
    chat_respond(403, ['ok' => false, 'error' => 'Chat not found']);
  }
  if (($chat['status'] ?? '') === 'closed') {
    chat_respond(400, ['ok' => false, 'error' => 'Chat is closed. Start a new chat.']);
  }
  chat_add_message($chat, 'visitor', $text);

  // AI bot handles the conversation and conversion
  $reply = da_chat_bot_reply($chat, $text);
  chat_add_message($chat, 'agent', (string)$reply['text'], [
    'ctas' => $reply['ctas'] ?? [],
    'provider' => $reply['provider'] ?? 'rules',
  ]);
  if (!empty($reply['hot'])) {
    da_chat_save_lead_file($chat);
  }
  chat_save($chat);
  // Soft notify only for hot/ready leads to avoid email spam
  if (!empty($reply['hot'])) {
    chat_notify_admin($chat, $text . "\n\nAI: " . $reply['text']);
  }
  chat_respond(200, ['ok' => true, 'chat' => chat_public_view($chat), 'ai' => true]);
}

if ($action === 'poll') {
  $id = (string)($input['conversationId'] ?? $_GET['conversationId'] ?? '');
  $token = (string)($input['visitorToken'] ?? $_GET['visitorToken'] ?? '');
  $chat = chat_load($id);
  if (!$chat || !hash_equals((string)($chat['visitorToken'] ?? ''), $token)) {
    chat_respond(403, ['ok' => false, 'error' => 'Chat not found']);
  }
  chat_respond(200, ['ok' => true, 'chat' => chat_public_view($chat)]);
}

// ---- Admin actions ----
if (!chat_is_admin($config)) {
  if (in_array($action, ['list', 'get', 'reply', 'close', 'unread_count'], true)) {
    chat_respond(401, ['ok' => false, 'error' => 'Unauthorized', 'code' => 'auth']);
  }
  chat_respond(400, ['ok' => false, 'error' => 'Unknown action']);
}

if ($action === 'unread_count') {
  $count = 0;
  foreach (glob(chat_dir() . '/chat_*.json') ?: [] as $file) {
    $c = json_decode((string)file_get_contents($file), true);
    if (is_array($c)) $count += (int)($c['unreadAdmin'] ?? 0);
  }
  chat_respond(200, ['ok' => true, 'unread' => $count]);
}

if ($action === 'list') {
  $items = [];
  foreach (glob(chat_dir() . '/chat_*.json') ?: [] as $file) {
    $c = json_decode((string)file_get_contents($file), true);
    if (!is_array($c)) continue;
    $msgs = $c['messages'] ?? [];
    $last = $msgs ? $msgs[count($msgs) - 1] : null;
    $items[] = [
      'id' => $c['id'],
      'status' => $c['status'] ?? 'open',
      'updatedAt' => $c['updatedAt'] ?? '',
      'createdAt' => $c['createdAt'] ?? '',
      'unreadAdmin' => (int)($c['unreadAdmin'] ?? 0),
      'visitor' => $c['visitor'] ?? [],
      'lastMessage' => $last ? ['role' => $last['role'], 'text' => $last['text'], 'at' => $last['at']] : null,
    ];
  }
  usort($items, static fn($a, $b) => strcmp((string)$b['updatedAt'], (string)$a['updatedAt']));
  chat_respond(200, ['ok' => true, 'chats' => array_slice($items, 0, 100)]);
}

if ($action === 'get') {
  $id = (string)($input['conversationId'] ?? $_GET['conversationId'] ?? '');
  $chat = chat_load($id);
  if (!$chat) chat_respond(404, ['ok' => false, 'error' => 'Not found']);
  $chat['unreadAdmin'] = 0;
  chat_save($chat);
  unset($chat['visitorToken']);
  chat_respond(200, ['ok' => true, 'chat' => $chat]);
}

if ($action === 'reply') {
  $id = (string)($input['conversationId'] ?? '');
  $text = trim((string)($input['text'] ?? ''));
  if ($text === '' || strlen($text) > 4000) {
    chat_respond(400, ['ok' => false, 'error' => 'Reply required']);
  }
  $chat = chat_load($id);
  if (!$chat) chat_respond(404, ['ok' => false, 'error' => 'Not found']);
  if (($chat['status'] ?? '') === 'closed') {
    $chat['status'] = 'open';
  }
  chat_add_message($chat, 'agent', $text);
  $chat['unreadAdmin'] = 0;
  chat_save($chat);
  unset($chat['visitorToken']);
  chat_respond(200, ['ok' => true, 'chat' => $chat]);
}

if ($action === 'close') {
  $id = (string)($input['conversationId'] ?? '');
  $chat = chat_load($id);
  if (!$chat) chat_respond(404, ['ok' => false, 'error' => 'Not found']);
  $chat['status'] = 'closed';
  $chat['updatedAt'] = gmdate('c');
  chat_add_message($chat, 'agent', 'This chat was closed by DisplayAvenue. Start a new chat anytime.');
  chat_save($chat);
  unset($chat['visitorToken']);
  chat_respond(200, ['ok' => true, 'chat' => $chat]);
}

chat_respond(400, ['ok' => false, 'error' => 'Unknown action']);
