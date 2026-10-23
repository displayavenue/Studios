<?php
declare(strict_types=1);
/** @var string $active */
$email = (string) ($_SESSION['hp_admin']['email'] ?? '');
$items = [
    'dashboard' => ['/', 'Dashboard'],
    'homepage' => ['/homepage.php', 'Homepage'],
    'pages' => ['/pages.php', 'Pages'],
    'media' => ['/media.php', 'Media'],
    'menus' => ['/menus.php', 'Menus'],
    'products' => ['/products.php', 'Products'],
    'brands' => ['/brands.php', 'Brands'],
    'settings' => ['/settings.php', 'Settings'],
];
?>
<aside class="nav">
  <h1>HP Admin</h1>
  <?php foreach ($items as $key => [$href, $label]): ?>
    <a class="<?= $active === $key ? 'active' : '' ?>" href="/backend<?= h($href) ?>"><?= h($label) ?></a>
  <?php endforeach; ?>
  <hr style="border-color:rgb(255 255 255 / 12%); margin:1rem 0" />
  <p style="font-size:0.78rem;color:#a8c4b8;margin:0 0 0.5rem"><?= h($email) ?></p>
  <form method="post" action="/backend/logout.php"><button class="secondary" type="submit">Sign out</button></form>
</aside>
