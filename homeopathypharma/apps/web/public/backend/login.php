<?php
declare(strict_types=1);
require __DIR__ . '/_bootstrap.php';

$error = null;
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = trim((string) ($_POST['email'] ?? ''));
    $password = (string) ($_POST['password'] ?? '');
    if ($email === ADMIN_USER && hash_equals(admin_password(), $password)) {
        $_SESSION['hp_admin'] = ['email' => $email, 'at' => time()];
        header('Location: /backend/');
        exit;
    }
    $error = 'Invalid email or password.';
}

if (!empty($_SESSION['hp_admin'])) {
    header('Location: /backend/');
    exit;
}
?><!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Admin sign in · HomeopathyPharma</title>
  <link rel="stylesheet" href="/backend/admin.css" />
</head>
<body class="login-body">
  <form class="login-card" method="post" action="/backend/login.php">
    <h1>HomeopathyPharma Admin</h1>
    <p>WordPress-style CMS on Hostinger. Edit homepage, pages, menus, products &amp; settings.</p>
    <?php if ($error): ?><p class="error"><?= h($error) ?></p><?php endif; ?>
    <label>Email
      <input type="email" name="email" value="admin@homeopathypharma.com" required autocomplete="username" />
    </label>
    <label>Password
      <input type="password" name="password" required autocomplete="current-password" />
    </label>
    <button type="submit">Sign in</button>
  </form>
</body>
</html>
