<?php
declare(strict_types=1);

require_once __DIR__ . '/ids.php';

function da_indian_fy_label(?DateTimeInterface $date = null): string {
  $d = $date ? DateTimeImmutable::createFromInterface($date) : new DateTimeImmutable('now');
  $y = (int) $d->format('Y');
  $m = (int) $d->format('n');
  $start = $m >= 4 ? $y : $y - 1;
  $end = substr((string) ($start + 1), -2);
  return $start . '-' . $end;
}

function da_next_quotation_number(mysqli $db, string $prefix = 'DA', int $digits = 5): string {
  $year = (int) date('Y');
  $db->begin_transaction();
  try {
    $stmt = $db->prepare('SELECT id, last_number FROM quotation_sequences WHERE prefix=? AND year=? FOR UPDATE');
    $stmt->bind_param('si', $prefix, $year);
    $stmt->execute();
    $row = $stmt->get_result()->fetch_assoc();
    if ($row) {
      $num = ((int) $row['last_number']) + 1;
      $upd = $db->prepare('UPDATE quotation_sequences SET last_number=? WHERE id=?');
      $upd->bind_param('is', $num, $row['id']);
      $upd->execute();
    } else {
      $num = 1;
      $id = da_id();
      $ins = $db->prepare('INSERT INTO quotation_sequences (id, prefix, year, last_number) VALUES (?,?,?,?)');
      $ins->bind_param('ssii', $id, $prefix, $year, $num);
      $ins->execute();
    }
    $db->commit();
  } catch (Throwable $e) {
    $db->rollback();
    throw $e;
  }
  return $prefix . '-' . $year . '-' . str_pad((string) $num, $digits, '0', STR_PAD_LEFT);
}

function da_next_doc_number(mysqli $db, string $table, string $prefix, int $digits = 5): string {
  $fy = da_indian_fy_label();
  $db->begin_transaction();
  try {
    $stmt = $db->prepare("SELECT id, last_number FROM {$table} WHERE prefix=? AND fy_label=? FOR UPDATE");
    $stmt->bind_param('ss', $prefix, $fy);
    $stmt->execute();
    $row = $stmt->get_result()->fetch_assoc();
    if ($row) {
      $num = ((int) $row['last_number']) + 1;
      $upd = $db->prepare("UPDATE {$table} SET last_number=? WHERE id=?");
      $upd->bind_param('is', $num, $row['id']);
      $upd->execute();
    } else {
      $num = 1;
      $id = da_id();
      $ins = $db->prepare("INSERT INTO {$table} (id, prefix, fy_label, last_number) VALUES (?,?,?,?)");
      $ins->bind_param('sssi', $id, $prefix, $fy, $num);
      $ins->execute();
    }
    $db->commit();
  } catch (Throwable $e) {
    $db->rollback();
    throw $e;
  }
  return $prefix . '/' . $fy . '/' . str_pad((string) $num, $digits, '0', STR_PAD_LEFT);
}

function da_next_client_code(mysqli $db): string {
  $res = $db->query('SELECT COUNT(*) AS c FROM quote_clients');
  $c = (int) ($res->fetch_assoc()['c'] ?? 0);
  return 'CL-' . str_pad((string) ($c + 1), 5, '0', STR_PAD_LEFT);
}
