<?php
declare(strict_types=1);

/**
 * Reuse the Live Content Editor session/token.
 */
function da_quotes_require_admin(): void {
  $agencyConfig = require dirname(__DIR__, 2) . '/config.php';
  $secure = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
    || (($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https')
    || (($_SERVER['SERVER_PORT'] ?? '') === '443');

  session_name((string) ($agencyConfig['session_name'] ?? 'da_agency_admin'));
  if (session_status() !== PHP_SESSION_ACTIVE) {
    session_set_cookie_params([
      'lifetime' => (int) ($agencyConfig['session_ttl'] ?? 28800),
      'path' => '/',
      'secure' => $secure,
      'httponly' => true,
      'samesite' => 'Lax',
    ]);
    session_start();
  }

  $ttl = (int) ($agencyConfig['session_ttl'] ?? 28800);
  $now = time();
  $ok = false;

  if (!empty($_SESSION['da_auth'])) {
    $at = (int) ($_SESSION['da_auth_at'] ?? 0);
    if ($at && ($now - $at) <= $ttl) {
      $_SESSION['da_auth_at'] = $now;
      $ok = true;
    }
  }

  $hdr = $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '';
  $token = '';
  if (preg_match('/Bearer\s+(\S+)/i', $hdr, $m)) $token = trim($m[1]);
  if ($token === '') $token = trim((string) ($_SERVER['HTTP_X_DA_ADMIN_TOKEN'] ?? ''));

  if (!$ok && $token !== '' && !empty($_SESSION['da_token']) && hash_equals((string) $_SESSION['da_token'], $token)) {
    $at = (int) ($_SESSION['da_auth_at'] ?? 0);
    if ($at && ($now - $at) <= $ttl) $ok = true;
  }

  if (!$ok && $token !== '') {
    $tokenFile = dirname(__DIR__, 2) . '/.sessions/token.json';
    if (is_file($tokenFile)) {
      $data = json_decode((string) file_get_contents($tokenFile), true);
      if (is_array($data) && !empty($data['token']) && hash_equals((string) $data['token'], $token)) {
        $at = (int) ($data['at'] ?? 0);
        if ($at && ($now - $at) <= $ttl) $ok = true;
      }
    }
  }

  if (!$ok) {
    da_json_out(401, ['ok' => false, 'error' => 'Login required', 'code' => 'auth']);
  }
}
