<?php
declare(strict_types=1);
require __DIR__ . '/_bootstrap.php';
require_login();

$catalog = read_json('catalog-snapshot.json', ['products' => [], 'brands' => [], 'doctors' => [], 'categories' => []]);
$q = strtolower(trim((string) ($_GET['q'] ?? '')));
$products = $catalog['products'] ?? [];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = (string) ($_POST['action'] ?? 'save');
    if ($action === 'create') {
        $name = trim((string) ($_POST['name'] ?? ''));
        $brandSlug = trim((string) ($_POST['brandSlug'] ?? 'sbl'));
        $brand = null;
        foreach (($catalog['brands'] ?? []) as $b) {
            if (($b['slug'] ?? '') === $brandSlug) {
                $brand = $b;
                break;
            }
        }
        $slug = strtolower(trim(preg_replace('/[^a-z0-9]+/i', '-', $name) ?? 'product', '-'));
        $product = [
            'id' => 'cms-' . bin2hex(random_bytes(4)),
            'slug' => $slug,
            'name' => $name,
            'brandSlug' => $brandSlug,
            'brandName' => (string) ($brand['name'] ?? $brandSlug),
            'form' => (string) ($_POST['form'] ?? 'Dilution'),
            'potency' => (string) ($_POST['potency'] ?? ''),
            'packSize' => (string) ($_POST['packSize'] ?? ''),
            'mrpInr' => (float) ($_POST['mrpInr'] ?? 0),
            'priceInr' => (float) ($_POST['priceInr'] ?? 0),
            'inStock' => true,
            'category' => (string) ($_POST['category'] ?? 'General'),
            'remedySlug' => $slug,
            'remedyName' => $name,
            'healthAreas' => [],
            'manufacturer' => (string) ($brand['manufacturer'] ?? $brandSlug),
            'description' => (string) ($_POST['description'] ?? ''),
            'imageUrl' => (string) ($_POST['imageUrl'] ?? '/images/products/product-dilution.png'),
            'listed' => true,
        ];
        array_unshift($catalog['products'], $product);
        write_json('catalog-snapshot.json', $catalog);
        flash('Product created.');
        header('Location: /backend/products.php');
        exit;
    }

    $id = (string) ($_POST['id'] ?? '');
    foreach ($catalog['products'] as $i => $product) {
        if (($product['id'] ?? '') !== $id) {
            continue;
        }
        if ($action === 'unlist') {
            $catalog['products'][$i]['listed'] = false;
        } else {
            $catalog['products'][$i]['priceInr'] = (float) ($_POST['priceInr'] ?? $product['priceInr']);
            $catalog['products'][$i]['mrpInr'] = (float) ($_POST['mrpInr'] ?? $product['mrpInr']);
            $catalog['products'][$i]['inStock'] = isset($_POST['inStock']);
            $catalog['products'][$i]['imageUrl'] = (string) ($_POST['imageUrl'] ?? ($product['imageUrl'] ?? ''));
            $catalog['products'][$i]['listed'] = true;
        }
        break;
    }
    write_json('catalog-snapshot.json', $catalog);
    flash('Product updated.');
    header('Location: /backend/products.php?q=' . urlencode($q));
    exit;
}

if ($q !== '') {
    $products = array_values(array_filter($products, static function ($p) use ($q) {
        $hay = strtolower(($p['name'] ?? '') . ' ' . ($p['brandName'] ?? '') . ' ' . ($p['slug'] ?? ''));
        return str_contains($hay, $q);
    }));
}
$products = array_slice($products, 0, 80);
$flash = take_flash();
?><!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Products · Admin</title>
  <link rel="stylesheet" href="/backend/admin.css" />
</head>
<body>
<div class="shell">
  <?php $active = 'products'; include __DIR__ . '/_nav.php'; ?>
  <main class="main">
    <div class="panel">
      <h2>Products</h2>
      <p class="muted">Create and edit catalogue products in <code>catalog-snapshot.json</code>.</p>
      <?php if ($flash): ?><div class="flash"><?= h($flash) ?></div><?php endif; ?>

      <form method="get" class="row" style="margin-bottom:1rem">
        <input name="q" value="<?= h($q) ?>" placeholder="Search products…" style="max-width:18rem" />
        <button class="secondary" type="submit">Search</button>
      </form>

      <form method="post" class="fieldset">
        <legend style="font-weight:700">Add product</legend>
        <input type="hidden" name="action" value="create" />
        <label>Name <input name="name" required /></label>
        <label>Brand
          <select name="brandSlug">
            <?php foreach (($catalog['brands'] ?? []) as $brand): ?>
              <option value="<?= h((string) $brand['slug']) ?>"><?= h((string) $brand['name']) ?></option>
            <?php endforeach; ?>
          </select>
        </label>
        <div class="row">
          <label style="flex:1">Price <input type="number" step="0.01" name="priceInr" value="99" /></label>
          <label style="flex:1">MRP <input type="number" step="0.01" name="mrpInr" value="120" /></label>
        </div>
        <div class="row">
          <label style="flex:1">Form <input name="form" value="Dilution" /></label>
          <label style="flex:1">Potency <input name="potency" value="30C" /></label>
          <label style="flex:1">Pack <input name="packSize" value="30 ml" /></label>
        </div>
        <label>Category <input name="category" value="General" /></label>
        <label>Image URL <input name="imageUrl" value="/images/products/product-dilution.png" /></label>
        <button type="submit">Create product</button>
      </form>

      <table>
        <thead><tr><th>Product</th><th>Brand</th><th>Price</th><th>Stock</th><th></th></tr></thead>
        <tbody>
        <?php foreach ($products as $p): ?>
          <tr style="<?= (($p['listed'] ?? true) === false) ? 'opacity:0.55' : '' ?>">
            <td>
              <strong><?= h((string) ($p['name'] ?? '')) ?></strong>
              <div class="muted" style="font-size:0.78rem"><?= h((string) ($p['category'] ?? '')) ?><?= (($p['listed'] ?? true) === false) ? ' · unlisted' : '' ?></div>
            </td>
            <td><?= h((string) ($p['brandName'] ?? '')) ?></td>
            <td>
              <form method="post" class="row">
                <input type="hidden" name="id" value="<?= h((string) $p['id']) ?>" />
                <input type="number" step="0.01" name="priceInr" value="<?= h((string) ($p['priceInr'] ?? 0)) ?>" style="width:5.5rem" />
                <input type="number" step="0.01" name="mrpInr" value="<?= h((string) ($p['mrpInr'] ?? 0)) ?>" style="width:5.5rem" />
                <input name="imageUrl" value="<?= h((string) ($p['imageUrl'] ?? '')) ?>" placeholder="Image URL" style="min-width:10rem" />
                <label style="font-weight:500;display:flex;gap:0.3rem;align-items:center">
                  <input type="checkbox" name="inStock" <?= !empty($p['inStock']) ? 'checked' : '' ?> /> In stock
                </label>
                <button type="submit">Save</button>
                <button class="secondary" type="submit" name="action" value="unlist">Unlist</button>
              </form>
            </td>
            <td><?= !empty($p['inStock']) ? 'Yes' : 'No' ?></td>
            <td></td>
          </tr>
        <?php endforeach; ?>
        </tbody>
      </table>
    </div>
  </main>
</div>
</body>
</html>
