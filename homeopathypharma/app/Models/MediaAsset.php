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
     */
    public function publicUrl(): string
    {
        if ($this->path && is_file(public_path('uploads/'.$this->path))) {
            return asset('uploads/'.$this->path);
        }

        // Sibling document root used on Hostinger (laravel/ + public_html/).
        $publicHtml = base_path('../public_html/uploads/'.$this->path);
        if ($this->path && is_file($publicHtml)) {
            return url('uploads/'.$this->path);
        }

        return asset('storage/'.$this->path);
    }
}
