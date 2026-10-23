<?php
declare(strict_types=1);
require __DIR__ . '/_bootstrap.php';
require_login();

$settings = read_json('settings.json', [
    'siteName' => 'HomeopathyPharma',
    'tagline' => '',
    'supportEmail' => '',
    'supportPhone' => '',
    'defaultSeoTitle' => '',
    'defaultSeoDescription' => '',
    'currency' => 'INR',
    'timezone' => 'Asia/Kolkata',
]);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    foreach (array_keys($settings) as $key) {
        if (isset($_POST[$key])) {
            $settings[$key] = (string) $_POST[$key];
        }
    }
    write_json('settings.json', $settings);
    flash('Settings saved.');
    header('Location: /backend/settings.php');
    exit;
}

$flash = take_flash();
?><!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Settings · Admin</title>
  <link rel="stylesheet" href="/backend/admin.css" />
</head>
<body>
<div class="shell">
  <?php $active = 'settings'; include __DIR__ . '/_nav.php'; ?>
  <main class="main">
    <div class="panel">
      <h2>Site settings</h2>
      <?php if ($flash): ?><div class="flash"><?= h($flash) ?></div><?php endif; ?>
      <form method="post">
        <?php foreach ($settings as $key => $value): ?>
          <label><?= h($key) ?>
            <?php if (str_contains(strtolower($key), 'description') || $key === 'tagline'): ?>
              <textarea name="<?= h($key) ?>"><?= h((string) $value) ?></textarea>
            <?php else: ?>
              <input name="<?= h($key) ?>" value="<?= h((string) $value) ?>" />
            <?php endif; ?>
          </label>
        <?php endforeach; ?>
        <button type="submit">Save settings</button>
      </form>
    </div>
  </main>
</div>
</body>
</html>
