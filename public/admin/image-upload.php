<?php
declare(strict_types=1);

/**
 * Convert an uploaded image to WebP and save it under /content/uploads.
 */
function da_process_image_upload(string $tmpPath, string $mime, string $destPath, array $cfg): array {
  if (!is_file($tmpPath)) {
    return ['ok' => false, 'error' => 'Uploaded file not found'];
  }
  if (!function_exists('imagewebp')) {
    return ['ok' => false, 'error' => 'WebP conversion is not available — enable PHP GD with WebP support on the server'];
  }

  $quality = max(1, min(100, (int)($cfg['webp_quality'] ?? 82)));
  $maxEdge = max(0, (int)($cfg['max_edge_px'] ?? 0));

  $image = da_image_from_upload($tmpPath, $mime);
  if ($image === false) {
    return ['ok' => false, 'error' => 'Could not read image — file may be corrupted or unsupported'];
  }

  if ($maxEdge > 0) {
    $resized = da_image_resize_to_max_edge($image, $maxEdge);
    if ($resized !== $image) {
      imagedestroy($image);
      $image = $resized;
    }
  }

  if (!imagewebp($image, $destPath, $quality)) {
    imagedestroy($image);
    return ['ok' => false, 'error' => 'Could not save WebP image — check /content/uploads permissions'];
  }

  imagedestroy($image);
  @chmod($destPath, 0644);

  return [
    'ok' => true,
    'bytes' => (int)(@filesize($destPath) ?: 0),
  ];
}

function da_image_from_upload(string $path, string $mime) {
  return match ($mime) {
    'image/jpeg' => @imagecreatefromjpeg($path),
    'image/png' => da_image_from_png($path),
    'image/gif' => @imagecreatefromgif($path),
    'image/webp' => @imagecreatefromwebp($path),
    default => false,
  };
}

function da_image_from_png(string $path) {
  $image = @imagecreatefrompng($path);
  if ($image === false) {
    return false;
  }
  if (!imageistruecolor($image)) {
    imagepalettetotruecolor($image);
  }
  imagealphablending($image, false);
  imagesavealpha($image, true);
  return $image;
}

function da_image_resize_to_max_edge($image, int $maxEdge) {
  $width = imagesx($image);
  $height = imagesy($image);
  $longest = max($width, $height);
  if ($longest <= $maxEdge) {
    return $image;
  }

  $scale = $maxEdge / $longest;
  $newWidth = max(1, (int)round($width * $scale));
  $newHeight = max(1, (int)round($height * $scale));

  $resized = imagecreatetruecolor($newWidth, $newHeight);
  if ($resized === false) {
    return $image;
  }

  imagealphablending($resized, false);
  imagesavealpha($resized, true);
  imagecopyresampled($resized, $image, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);

  return $resized;
}

function da_upload_error_message(int $code): string {
  return match ($code) {
    UPLOAD_ERR_INI_SIZE, UPLOAD_ERR_FORM_SIZE =>
      'File exceeds the server upload limit — ask your host to raise upload_max_filesize and post_max_size',
    UPLOAD_ERR_PARTIAL => 'Upload was interrupted — please try again',
    UPLOAD_ERR_NO_FILE => 'No file uploaded',
    default => 'Upload failed — please try again',
  };
}
