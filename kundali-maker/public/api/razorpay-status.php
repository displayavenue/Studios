<?php
require __DIR__ . '/_bootstrap.php';
jk_cors();

$cfg = jk_config();
jk_json([
  'configured' => (bool)($cfg['configured'] ?? false),
  'allow_demo' => (bool)($cfg['allow_demo'] ?? false),
  'key_id' => $cfg['configured'] ? $cfg['key_id'] : '',
  'currency' => $cfg['currency'] ?? 'INR',
  'mode' => !empty($cfg['configured']) && strpos((string)$cfg['key_id'], 'rzp_live_') === 0
    ? 'live'
    : (!empty($cfg['configured']) ? 'test' : 'unset'),
]);
