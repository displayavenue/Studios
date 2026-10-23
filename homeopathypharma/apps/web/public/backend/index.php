<?php
declare(strict_types=1);
require __DIR__ . '/_bootstrap.php';
require_login();

$homepage = read_json('homepage.json', ['banners' => [], 'categories' => [], 'rails' => []]);
$pages = read_json('pages.json', []);
$menus = read_json('menus.json', ['header' => [], 'footer' => [], 'mobile' => []]);
$media = read_json('media.json', []);
$settings = read_json('settings.json', []);
$catalog = read_json('catalog-snapshot.json', ['products' => [], 'brands' => [], 'doctors' => []]);

$counts = [
    'Products' => count($catalog['products'] ?? []),
    'Brands' => count($catalog['brands'] ?? []),
    'Doctors' => count($catalog['doctors'] ?? []),
    'Pages' => count($pages),
    'Media' => count($media),
    'Banners' => count($homepage['banners'] ?? []),
];
$flash = take_flash();
?><!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Dashboard · HomeopathyPharma Admin</title>
  <link rel="stylesheet" href="/backend/admin.css" />
</head>
<body>
<div class="shell">
  <?php $active = 'dashboard'; include __DIR__ . '/_nav.php'; ?>
  <main class="main">
    <div class="panel">
      <h2>Command center</h2>
      <p class="muted">WordPress-style CMS on Hostinger. Changes under <code>/cms-data/</code> go live on the storefront immediately for banners, menus, and CMS pages.</p>
      <?php if ($flash): ?><div class="flash"><?= h($flash) ?></div><?php endif; ?>
      <div class="grid" style="margin:1rem 0 1.25rem">
        <?php foreach ($counts as $label => $value): ?>
          <div class="card"><span class="muted"><?= h($label) ?></span><strong><?= (int) $value ?></strong></div>
        <?php endforeach; ?>
      </div>
      <ul>
        <li><a href="/backend/homepage.php">Edit homepage banners &amp; rails</a></li>
        <li><a href="/backend/pages.php">Manage pages</a></li>
        <li><a href="/backend/menus.php">Edit menus</a></li>
        <li><a href="/backend/products.php">Manage products</a></li>
        <li><a href="/backend/media.php">Media library</a></li>
        <li><a href="/backend/settings.php">Site settings</a></li>
      </ul>
      <p class="muted">Signed in as <?= h((string) ($_SESSION['hp_admin']['email'] ?? '')) ?> · <a href="https://homeopathypharma.com/" target="_blank" rel="noreferrer">View site</a></p>
    </div>
  </main>
</div>
</body>
</html>
