<?php
declare(strict_types=1);
require __DIR__ . '/_bootstrap.php';
require_login();

$homepage = read_json('homepage.json', [
    'searchPlaceholder' => '',
    'banners' => [],
    'categories' => [],
    'rails' => [
        'bestsellersTitle' => '',
        'consultTitle' => '',
        'consultBody' => '',
        'brandsTitle' => '',
        'doctorsTitle' => '',
    ],
]);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = (string) ($_POST['action'] ?? 'save');
    if ($action === 'add_banner') {
        $homepage['banners'][] = [
            'id' => 'banner-' . bin2hex(random_bytes(3)),
            'eyebrow' => '',
            'title' => 'New banner',
            'subtitle' => '',
            'ctaLabel' => 'Shop now',
            'ctaHref' => '/shop/',
            'tone' => 'teal',
            'imageUrl' => '/images/banners/banner-medicines.png',
        ];
        write_json('homepage.json', $homepage);
        flash('Banner added.');
        header('Location: /backend/homepage.php');
        exit;
    }
    if ($action === 'remove_banner') {
        $idx = (int) ($_POST['index'] ?? -1);
        if (isset($homepage['banners'][$idx])) {
            array_splice($homepage['banners'], $idx, 1);
            write_json('homepage.json', $homepage);
            flash('Banner removed.');
        }
        header('Location: /backend/homepage.php');
        exit;
    }

    $homepage['searchPlaceholder'] = trim((string) ($_POST['searchPlaceholder'] ?? ''));
    $banners = [];
    foreach (($_POST['banner'] ?? []) as $row) {
        if (!is_array($row)) {
            continue;
        }
        $banners[] = [
            'id' => (string) ($row['id'] ?? ('banner-' . bin2hex(random_bytes(3)))),
            'eyebrow' => (string) ($row['eyebrow'] ?? ''),
            'title' => (string) ($row['title'] ?? ''),
            'subtitle' => (string) ($row['subtitle'] ?? ''),
            'ctaLabel' => (string) ($row['ctaLabel'] ?? ''),
            'ctaHref' => (string) ($row['ctaHref'] ?? '/'),
            'tone' => in_array(($row['tone'] ?? 'teal'), ['teal', 'amber', 'sage'], true) ? $row['tone'] : 'teal',
            'imageUrl' => (string) ($row['imageUrl'] ?? ''),
        ];
    }
    $homepage['banners'] = $banners;
    $homepage['rails'] = [
        'bestsellersTitle' => (string) ($_POST['bestsellersTitle'] ?? ''),
        'consultTitle' => (string) ($_POST['consultTitle'] ?? ''),
        'consultBody' => (string) ($_POST['consultBody'] ?? ''),
        'brandsTitle' => (string) ($_POST['brandsTitle'] ?? ''),
        'doctorsTitle' => (string) ($_POST['doctorsTitle'] ?? ''),
    ];
    write_json('homepage.json', $homepage);
    flash('Homepage saved — live on the storefront.');
    header('Location: /backend/homepage.php');
    exit;
}

$flash = take_flash();
?><!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Homepage · Admin</title>
  <link rel="stylesheet" href="/backend/admin.css" />
</head>
<body>
<div class="shell">
  <?php $active = 'homepage'; include __DIR__ . '/_nav.php'; ?>
  <main class="main">
    <div class="panel">
      <h2>Homepage</h2>
      <p class="muted">Hero banners and section titles. Saved to <code>/cms-data/homepage.json</code>.</p>
      <?php if ($flash): ?><div class="flash"><?= h($flash) ?></div><?php endif; ?>

      <form method="post" class="row" style="margin-bottom:1rem">
        <input type="hidden" name="action" value="add_banner" />
        <button class="secondary" type="submit">Add banner</button>
      </form>

      <form method="post">
        <input type="hidden" name="action" value="save" />
        <label>Search placeholder
          <input name="searchPlaceholder" value="<?= h((string) ($homepage['searchPlaceholder'] ?? '')) ?>" />
        </label>

        <?php foreach (($homepage['banners'] ?? []) as $i => $banner): ?>
          <fieldset class="fieldset">
            <legend>Banner <?= $i + 1 ?></legend>
            <input type="hidden" name="banner[<?= $i ?>][id]" value="<?= h((string) $banner['id']) ?>" />
            <label>Title <input name="banner[<?= $i ?>][title]" value="<?= h((string) ($banner['title'] ?? '')) ?>" /></label>
            <label>Subtitle <textarea name="banner[<?= $i ?>][subtitle]"><?= h((string) ($banner['subtitle'] ?? '')) ?></textarea></label>
            <label>Image URL <input name="banner[<?= $i ?>][imageUrl]" value="<?= h((string) ($banner['imageUrl'] ?? '')) ?>" /></label>
            <label>CTA label <input name="banner[<?= $i ?>][ctaLabel]" value="<?= h((string) ($banner['ctaLabel'] ?? '')) ?>" /></label>
            <label>CTA link <input name="banner[<?= $i ?>][ctaHref]" value="<?= h((string) ($banner['ctaHref'] ?? '')) ?>" /></label>
            <label>Tone
              <select name="banner[<?= $i ?>][tone]">
                <?php foreach (['teal', 'amber', 'sage'] as $tone): ?>
                  <option value="<?= $tone ?>" <?= (($banner['tone'] ?? '') === $tone) ? 'selected' : '' ?>><?= $tone ?></option>
                <?php endforeach; ?>
              </select>
            </label>
          </fieldset>
        <?php endforeach; ?>

        <h3>Section titles</h3>
        <label>Bestsellers title <input name="bestsellersTitle" value="<?= h((string) ($homepage['rails']['bestsellersTitle'] ?? '')) ?>" /></label>
        <label>Consult title <input name="consultTitle" value="<?= h((string) ($homepage['rails']['consultTitle'] ?? '')) ?>" /></label>
        <label>Consult body <textarea name="consultBody"><?= h((string) ($homepage['rails']['consultBody'] ?? '')) ?></textarea></label>
        <label>Brands title <input name="brandsTitle" value="<?= h((string) ($homepage['rails']['brandsTitle'] ?? '')) ?>" /></label>
        <label>Doctors title <input name="doctorsTitle" value="<?= h((string) ($homepage['rails']['doctorsTitle'] ?? '')) ?>" /></label>
        <button type="submit">Save homepage</button>
      </form>

      <?php foreach (($homepage['banners'] ?? []) as $i => $_banner): ?>
        <form method="post" style="margin-top:0.5rem">
          <input type="hidden" name="action" value="remove_banner" />
          <input type="hidden" name="index" value="<?= $i ?>" />
          <button class="secondary" type="submit">Remove banner <?= $i + 1 ?></button>
        </form>
      <?php endforeach; ?>
    </div>
  </main>
</div>
</body>
</html>
