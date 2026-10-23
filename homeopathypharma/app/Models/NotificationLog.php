<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NotificationLog extends Model
{
    protected $fillable = [
        'channel', 'event', 'recipient', 'status', 'message', 'meta',
    ];

    protected function casts(): array
    {
        return ['meta' => 'array'];
    }
}
