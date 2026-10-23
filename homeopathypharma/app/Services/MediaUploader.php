<?php

namespace App\Services;

use App\Models\MediaAsset;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class MediaUploader
{
    /** @var list<string> */
    private array $allowedMimes = [
        'image/jpeg',
        'image/png',
        'image/webp',
        'image/gif',
    ];

    private int $maxBytes = 5_242_880; // 5 MB

    public function upload(UploadedFile $file, ?int $userId = null, ?string $altText = null): MediaAsset
    {
        if ($file->getSize() > $this->maxBytes) {
            throw ValidationException::withMessages([
                'file' => 'Image must be 5 MB or smaller.',
            ]);
        }

        $mime = $file->getMimeType() ?: '';
        if (! in_array($mime, $this->allowedMimes, true)) {
            throw ValidationException::withMessages([
                'file' => 'Only JPEG, PNG, WebP, and GIF images are allowed.',
            ]);
        }

        $extension = strtolower($file->getClientOriginalExtension() ?: 'bin');
        $safeExtensions = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
        if (! in_array($extension, $safeExtensions, true)) {
            $extension = match ($mime) {
                'image/jpeg' => 'jpg',
                'image/png' => 'png',
                'image/webp' => 'webp',
                'image/gif' => 'gif',
                default => 'bin',
            };
        }

        $filename = Str::uuid()->toString().'.'.$extension;
        $path = $file->storeAs('media/'.now()->format('Y/m'), $filename, 'public');

        $width = null;
        $height = null;
        $realPath = $file->getRealPath();
        if ($realPath) {
            $size = @getimagesize($realPath);
            if (is_array($size)) {
                $width = $size[0] ?? null;
                $height = $size[1] ?? null;
            }
        }

        return MediaAsset::query()->create([
            'disk' => 'public',
            'path' => $path,
            'filename' => $filename,
            'original_name' => $file->getClientOriginalName(),
            'mime_type' => $mime,
            'size_bytes' => (int) $file->getSize(),
            'width' => $width,
            'height' => $height,
            'alt_text' => $altText,
            'uploaded_by' => $userId,
        ]);
    }

    public function deleteIfUnused(MediaAsset $asset): bool
    {
        $inUse = $asset->id && (
            \App\Models\Brand::query()->where('logo_media_id', $asset->id)->exists()
            || \App\Models\Category::query()->where('image_media_id', $asset->id)->exists()
            || \App\Models\ProductImage::query()->where('media_asset_id', $asset->id)->exists()
            || \App\Models\TeamMember::query()->where('photo_media_id', $asset->id)->exists()
        );

        if ($inUse) {
            return false;
        }

        Storage::disk($asset->disk)->delete($asset->path);
        $asset->delete();

        return true;
    }
}
