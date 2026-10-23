<?php
declare(strict_types=1);
require __DIR__ . '/_bootstrap.php';
require_login();

$media = read_json('media.json', []);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = (string) ($_POST['action'] ?? 'add');
    if ($action === 'delete') {
        $id = (string) ($_POST['id'] ?? '');
        $media = array_values(array_filter($media, static fn($m) => ($m['id'] ?? '') !== $id));
        write_json('media.json', $media);
        flash('Media removed.');
        header('Location: /backend/media.php');
        exit;
    }

    if (!empty($_FILES['file']['tmp_name']) && is_uploaded_file($_FILES['file']['tmp_name'])) {
        $uploadDir = dirname(__DIR__) . '/images/uploads';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }
        $orig = (string) ($_FILES['file']['name'] ?? 'upload.bin');
        $safe = strtolower(preg_replace('/[^a-zA-Z0-9._-]/', '_', $orig) ?? 'upload.bin');
        $filename = bin2hex(random_bytes(4)) . '-' . $safe;
        $dest = $uploadDir . '/' . $filename;
        if (move_uploaded_file($_FILES['file']['tmp_name'], $dest)) {
            array_unshift($media, [
                'id' => 'media-' . bin2hex(random_bytes(3)),
                'url' => '/images/uploads/' . $filename,
                'alt' => (string) ($_POST['alt'] ?? $orig),
                'filename' => $filename,
                'mimeType' => (string) ($_FILES['file']['type'] ?? 'application/octet-stream'),
                'uploadedAt' => gmdate('c'),
            ]);
            write_json('media.json', $media);
            flash('Upload saved.');
            header('Location: /backend/media.php');
            exit;
        }
    }

    $url = trim((string) ($_POST['url'] ?? ''));
    if ($url !== '') {
        array_unshift($media, [
            'id' => 'media-' . bin2hex(random_bytes(3)),
            'url' => $url,
            'alt' => (string) ($_POST['alt'] ?? ''),
            'filename' => basename(parse_url($url, PHP_URL_PATH) ?: 'asset'),
            'mimeType' => 'image/*',
            'uploadedAt' => gmdate('c'),
        ]);
        write_json('media.json', $media);
        flash('Media registered.');
    }
    header('Location: /backend/media.php');
    exit;
}

$flash = take_flash();
?><!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Media · Admin</title>
  <link rel="stylesheet" href="/backend/admin.css" />
</head>
<body>
<div class="shell">
  <?php $active = 'media'; include __DIR__ . '/_nav.php'; ?>
  <main class="main">
    <div class="panel">
      <h2>Media library</h2>
      <?php if ($flash): ?><div class="flash"><?= h($flash) ?></div><?php endif; ?>
      <form method="post" enctype="multipart/form-data" class="fieldset">
        <label>Upload image <input type="file" name="file" accept="image/*" /></label>
        <label>Or register URL <input name="url" placeholder="/images/banners/banner-medicines.png" /></label>
        <label>Alt text <input name="alt" /></label>
        <button type="submit">Add media</button>
      </form>
      <div class="grid">
        <?php foreach ($media as $item): ?>
          <figure class="card" style="margin:0">
            <img src="<?= h((string) $item['url']) ?>" alt="<?= h((string) ($item['alt'] ?? '')) ?>" style="width:100%;aspect-ratio:1;object-fit:cover;border-radius:0.4rem" onerror="this.style.display='none'" />
            <figcaption style="font-size:0.78rem;margin-top:0.45rem">
              <code><?= h((string) ($item['url'] ?? '')) ?></code>
              <form method="post" style="margin-top:0.4rem">
                <input type="hidden" name="action" value="delete" />
                <input type="hidden" name="id" value="<?= h((string) $item['id']) ?>" />
                <button class="secondary" type="submit">Remove</button>
              </form>
            </figcaption>
          </figure>
        <?php endforeach; ?>
      </div>
    </div>
  </main>
</div>
</body>
</html>
