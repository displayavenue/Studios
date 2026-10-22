<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContactMessage extends Model
{
    protected $fillable = [
        'name', 'contact', 'message', 'consent', 'status', 'ip_address',
    ];

    protected function casts(): array
    {
        return ['consent' => 'boolean'];
    }
}
