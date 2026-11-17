<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MediaAsset extends Model
{
    protected $fillable = [
        'disk',
        'path',
        'filename',
        'original_name',
        'mime_type',
        'size_bytes',
        'width',
        'height',
        'alt_text',
        'caption',
        'uploaded_by',
    ];

    public function uploader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }

    /**
     * Public URL for this asset.
     *
     * Hostinger often cannot serve storage/ symlinks (Apache treats them as
     * missing and Laravel returns 404). Prefer real files under /uploads/.
     * Appends ?v=updated_at so frontend caches refresh after crop/adjust.
     */
    public function publicUrl(bool $cacheBust = true): string
    {
        if ($this->path && is_file(public_path('uploads/'.$this->path))) {
            $url = asset('uploads/'.$this->path);
        } else {
            // Sibling document root used on Hostinger (laravel/ + public_html/).
            $publicHtml = base_path('../public_html/uploads/'.$this->path);
            if ($this->path && is_file($publicHtml)) {
                $url = url('uploads/'.$this->path);
            } else {
                $url = asset('storage/'.$this->path);
            }
        }

        if (! $cacheBust) {
            return $url;
        }

        $version = $this->updated_at?->getTimestamp() ?: $this->id;

        return $url.(str_contains($url, '?') ? '&' : '?').'v='.$version;
    }
}
