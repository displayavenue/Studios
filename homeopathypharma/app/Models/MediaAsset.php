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

    public function publicUrl(): string
    {
        return asset('storage/'.$this->path);
    }
}
