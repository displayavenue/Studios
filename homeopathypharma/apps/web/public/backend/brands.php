<?php
declare(strict_types=1);
require __DIR__ . '/_bootstrap.php';
require_login();

$catalog = read_json('catalog-snapshot.json', ['products' => [], 'brands' => [], 'doctors' => [], 'categories' => []]);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = (string) ($_POST['action'] ?? 'save');
    if ($action === 'create') {
        $name = trim((string) ($_POST['name'] ?? ''));
        $slug = strtolower(trim(preg_replace('/[^a-z0-9]+/i', '-', $name) ?? 'brand', '-'));
        $catalog['brands'][] = [
            'slug' => $slug,
            'name' => $name,
            'manufacturer' => (string) ($_POST['manufacturer'] ?? $name),
            'productCount' => 0,
            'description' => (string) ($_POST['description'] ?? ''),
            'imageUrl' => (string) ($_POST['imageUrl'] ?? ''),
        ];
        write_json('catalog-snapshot.json', $catalog);
        flash('Brand created.');
        header('Location: /backend/brands.php');
        exit;
    }
    $slug = (string) ($_POST['slug'] ?? '');
    foreach ($catalog['brands'] as $i => $brand) {
        if (($brand['slug'] ?? '') !== $slug) {
            continue;
        }
        $catalog['brands'][$i]['name'] = (string) ($_POST['name'] ?? $brand['name']);
        $catalog['brands'][$i]['manufacturer'] = (string) ($_POST['manufacturer'] ?? $brand['manufacturer']);
        $catalog['brands'][$i]['description'] = (string) ($_POST['description'] ?? ($brand['description'] ?? ''));
        $catalog['brands'][$i]['imageUrl'] = (string) ($_POST['imageUrl'] ?? ($brand['imageUrl'] ?? ''));
        break;
    }
    write_json('catalog-snapshot.json', $catalog);
    flash('Brand saved.');
    header('Location: /backend/brands.php');
    exit;
}

$flash = take_flash();
?><!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Brands · Admin</title>
  <link rel="stylesheet" href="/backend/admin.css" />
</head>
<body>
<div class="shell">
  <?php $active = 'brands'; include __DIR__ . '/_nav.php'; ?>
  <main class="main">
    <div class="panel">
      <h2>Brands</h2>
      <?php if ($flash): ?><div class="flash"><?= h($flash) ?></div><?php endif; ?>
      <form method="post" class="fieldset">
        <input type="hidden" name="action" value="create" />
        <label>Name <input name="name" required /></label>
        <label>Manufacturer <input name="manufacturer" /></label>
        <label>Description <textarea name="description"></textarea></label>
        <label>Image URL <input name="imageUrl" placeholder="/images/brands/brand-sbl.png" /></label>
        <button type="submit">Create brand</button>
      </form>
      <?php foreach (($catalog['brands'] ?? []) as $brand): ?>
        <form method="post" class="fieldset">
          <input type="hidden" name="slug" value="<?= h((string) $brand['slug']) ?>" />
          <legend><?= h((string) $brand['name']) ?> · <code><?= h((string) $brand['slug']) ?></code></legend>
          <label>Name <input name="name" value="<?= h((string) $brand['name']) ?>" /></label>
          <label>Manufacturer <input name="manufacturer" value="<?= h((string) ($brand['manufacturer'] ?? '')) ?>" /></label>
          <label>Description <textarea name="description"><?= h((string) ($brand['description'] ?? '')) ?></textarea></label>
          <label>Image URL <input name="imageUrl" value="<?= h((string) ($brand['imageUrl'] ?? '')) ?>" /></label>
          <button type="submit">Save brand</button>
        </form>
      <?php endforeach; ?>
    </div>
  </main>
</div>
</body>
</html>
