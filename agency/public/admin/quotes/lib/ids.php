<?php
declare(strict_types=1);

function da_id(): string {
  // 26-char Crockford-ish id (time + random)
  $t = base_convert((string) (int) (microtime(true) * 1000), 10, 36);
  $r = bin2hex(random_bytes(10));
  $raw = strtoupper($t . $r);
  return substr(str_pad($raw, 26, '0'), 0, 26);
}

function da_token(int $bytes = 24): string {
  return rtrim(strtr(base64_encode(random_bytes($bytes)), '+/', '-_'), '=');
}
