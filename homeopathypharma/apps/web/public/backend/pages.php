<?php
declare(strict_types=1);
require __DIR__ . '/_bootstrap.php';
require_login();

$pages = read_json('pages.json', []);
$editing = null;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = (string) ($_POST['action'] ?? 'save');
    if ($action === 'delete') {
        $id = (string) ($_POST['id'] ?? '');
        $pages = array_values(array_filter($pages, static fn($p) => ($p['id'] ?? '') !== $id));
        write_json('pages.json', $pages);
        flash('Page deleted.');
        header('Location: /backend/pages.php');
        exit;
    }

    $id = trim((string) ($_POST['id'] ?? ''));
    if ($id === '') {
        $id = 'page-' . bin2hex(random_bytes(4));
    }
    $title = trim((string) ($_POST['title'] ?? ''));
    $slug = trim((string) ($_POST['slug'] ?? ''));
    if ($slug === '' && $title !== '') {
        $slug = strtolower(preg_replace('/[^a-z0-9]+/i', '-', $title) ?? 'page');
        $slug = trim($slug, '-');
    }
    $page = [
        'id' => $id,
        'slug' => $slug,
        'title' => $title,
        'excerpt' => (string) ($_POST['excerpt'] ?? ''),
        'bodyHtml' => (string) ($_POST['bodyHtml'] ?? ''),
        'status' => (($_POST['status'] ?? 'draft') === 'published') ? 'published' : 'draft',
        'seoTitle' => (string) ($_POST['seoTitle'] ?? ''),
        'seoDescription' => (string) ($_POST['seoDescription'] ?? ''),
        'updatedAt' => gmdate('c'),
    ];
    $found = false;
    foreach ($pages as $i => $existing) {
        if (($existing['id'] ?? '') === $id) {
            $pages[$i] = $page;
            $found = true;
            break;
        }
    }
    if (!$found) {
        $pages[] = $page;
    }
    write_json('pages.json', $pages);
    flash('Page saved. Live at /p/' . $slug . '/ when published.');
    header('Location: /backend/pages.php');
    exit;
}

if (isset($_GET['edit'])) {
    foreach ($pages as $page) {
        if (($page['id'] ?? '') === $_GET['edit']) {
            $editing = $page;
            break;
        }
    }
}
if (isset($_GET['new'])) {
    $editing = [
        'id' => '',
        'slug' => '',
        'title' => '',
        'excerpt' => '',
        'bodyHtml' => '',
        'status' => 'draft',
        'seoTitle' => '',
        'seoDescription' => '',
    ];
}

$flash = take_flash();
?><!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Pages · Admin</title>
  <link rel="stylesheet" href="/backend/admin.css" />
</head>
<body>
<div class="shell">
  <?php $active = 'pages'; include __DIR__ . '/_nav.php'; ?>
  <main class="main">
    <div class="panel">
      <div class="row" style="justify-content:space-between">
        <h2 style="margin:0">Pages</h2>
        <a class="btn" href="/backend/pages.php?new=1">Add page</a>
      </div>
      <p class="muted">Published pages are served at <code>/p/{slug}/</code>.</p>
      <?php if ($flash): ?><div class="flash"><?= h($flash) ?></div><?php endif; ?>

      <?php if ($editing !== null): ?>
        <form method="post" class="fieldset">
          <h3><?= $editing['id'] ? 'Edit page' : 'New page' ?></h3>
          <input type="hidden" name="id" value="<?= h((string) ($editing['id'] ?? '')) ?>" />
          <label>Title <input name="title" required value="<?= h((string) ($editing['title'] ?? '')) ?>" /></label>
          <label>Slug <input name="slug" value="<?= h((string) ($editing['slug'] ?? '')) ?>" placeholder="about" /></label>
          <label>Excerpt <input name="excerpt" value="<?= h((string) ($editing['excerpt'] ?? '')) ?>" /></label>
          <label>Body HTML <textarea name="bodyHtml" style="min-height:10rem"><?= h((string) ($editing['bodyHtml'] ?? '')) ?></textarea></label>
          <label>Status
            <select name="status">
              <option value="draft" <?= (($editing['status'] ?? '') === 'draft') ? 'selected' : '' ?>>Draft</option>
              <option value="published" <?= (($editing['status'] ?? '') === 'published') ? 'selected' : '' ?>>Published</option>
            </select>
          </label>
          <label>SEO title <input name="seoTitle" value="<?= h((string) ($editing['seoTitle'] ?? '')) ?>" /></label>
          <label>SEO description <textarea name="seoDescription"><?= h((string) ($editing['seoDescription'] ?? '')) ?></textarea></label>
          <div class="row">
            <button type="submit">Save page</button>
            <a class="btn secondary" href="/backend/pages.php">Cancel</a>
          </div>
        </form>
      <?php endif; ?>

      <table>
        <thead><tr><th>Title</th><th>Slug</th><th>Status</th><th></th></tr></thead>
        <tbody>
        <?php foreach ($pages as $page): ?>
          <tr>
            <td><strong><?= h((string) ($page['title'] ?? '')) ?></strong></td>
            <td><code><?= h((string) ($page['slug'] ?? '')) ?></code></td>
            <td><?= h((string) ($page['status'] ?? '')) ?></td>
            <td class="row">
              <a class="btn secondary" href="/backend/pages.php?edit=<?= urlencode((string) $page['id']) ?>">Edit</a>
              <form method="post" onsubmit="return confirm('Delete this page?')">
                <input type="hidden" name="action" value="delete" />
                <input type="hidden" name="id" value="<?= h((string) $page['id']) ?>" />
                <button class="secondary" type="submit">Delete</button>
              </form>
            </td>
          </tr>
        <?php endforeach; ?>
        </tbody>
      </table>
    </div>
  </main>
</div>
</body>
</html>
