<?php
declare(strict_types=1);
require __DIR__ . '/_bootstrap.php';
require_login();

$menus = read_json('menus.json', ['header' => [], 'footer' => [], 'mobile' => []]);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $normalize = static function (array $rows): array {
        $out = [];
        $order = 1;
        foreach ($rows as $row) {
            if (!is_array($row)) {
                continue;
            }
            $label = trim((string) ($row['label'] ?? ''));
            $href = trim((string) ($row['href'] ?? ''));
            if ($label === '' && $href === '') {
                continue;
            }
            $out[] = [
                'id' => (string) ($row['id'] ?? ('menu-' . bin2hex(random_bytes(3)))),
                'label' => $label,
                'href' => $href,
                'order' => $order++,
            ];
        }
        return $out;
    };
    $menus = [
        'header' => $normalize($_POST['header'] ?? []),
        'footer' => $normalize($_POST['footer'] ?? []),
        'mobile' => $normalize($_POST['mobile'] ?? []),
    ];
    write_json('menus.json', $menus);
    flash('Menus saved.');
    header('Location: /backend/menus.php');
    exit;
}

$flash = take_flash();
function render_menu_editor(string $key, array $items): void {
    ?>
    <fieldset class="fieldset">
      <legend><?= h(ucfirst($key)) ?> menu</legend>
      <?php foreach ($items as $i => $item): ?>
        <div class="row" style="margin-bottom:0.45rem">
          <input type="hidden" name="<?= h($key) ?>[<?= $i ?>][id]" value="<?= h((string) ($item['id'] ?? '')) ?>" />
          <input name="<?= h($key) ?>[<?= $i ?>][label]" value="<?= h((string) ($item['label'] ?? '')) ?>" placeholder="Label" style="flex:1" />
          <input name="<?= h($key) ?>[<?= $i ?>][href]" value="<?= h((string) ($item['href'] ?? '')) ?>" placeholder="/shop/" style="flex:1.4" />
        </div>
      <?php endforeach; ?>
      <?php $n = count($items); ?>
      <div class="row">
        <input name="<?= h($key) ?>[<?= $n ?>][id]" type="hidden" value="menu-<?= h($key) ?>-<?= $n ?>" />
        <input name="<?= h($key) ?>[<?= $n ?>][label]" placeholder="New label" style="flex:1" />
        <input name="<?= h($key) ?>[<?= $n ?>][href]" placeholder="/new/" style="flex:1.4" />
      </div>
    </fieldset>
    <?php
}
?><!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Menus · Admin</title>
  <link rel="stylesheet" href="/backend/admin.css" />
</head>
<body>
<div class="shell">
  <?php $active = 'menus'; include __DIR__ . '/_nav.php'; ?>
  <main class="main">
    <div class="panel">
      <h2>Menus</h2>
      <p class="muted">Header, footer, and mobile bottom navigation.</p>
      <?php if ($flash): ?><div class="flash"><?= h($flash) ?></div><?php endif; ?>
      <form method="post">
        <?php
          render_menu_editor('header', $menus['header'] ?? []);
          render_menu_editor('footer', $menus['footer'] ?? []);
          render_menu_editor('mobile', $menus['mobile'] ?? []);
        ?>
        <button type="submit">Save menus</button>
      </form>
    </div>
  </main>
</div>
</body>
</html>
