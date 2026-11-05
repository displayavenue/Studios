<?php
declare(strict_types=1);

/**
 * One-time installer: creates tables + seeds company/services.
 * Protected by the same admin session as the Live Editor.
 */
require_once __DIR__ . '/lib/db.php';
require_once __DIR__ . '/lib/auth.php';
require_once __DIR__ . '/lib/company.php';

header('Content-Type: application/json; charset=utf-8');

try {
  da_quotes_require_admin();
  $db = da_db();
  $sql = file_get_contents(__DIR__ . '/schema.sql');
  if ($sql === false) throw new RuntimeException('schema.sql missing');
  if (!$db->multi_query($sql)) throw new RuntimeException($db->error);
  while ($db->more_results() && $db->next_result()) { /* drain */ }
  da_get_company($db);
  da_seed_services($db);
  da_json_out(200, ['ok' => true, 'message' => 'Quotations database ready on Hostinger']);
} catch (Throwable $e) {
  da_json_out(500, ['ok' => false, 'error' => $e->getMessage()]);
}
