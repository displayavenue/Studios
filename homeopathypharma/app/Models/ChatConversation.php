<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ChatConversation extends Model
{
    protected $fillable = [
        'uuid',
        'visitor_name',
        'visitor_phone',
        'status',
        'lead_notified',
        'ip_address',
        'last_message_at',
    ];

    protected function casts(): array
    {
        return [
            'last_message_at' => 'datetime',
            'lead_notified' => 'boolean',
        ];
    }

    public function messages(): HasMany
    {
        return $this->hasMany(ChatMessage::class)->orderBy('id');
    }

    public function displayName(): string
    {
        $name = trim((string) $this->visitor_name);
        if ($name !== '') {
            return $name;
        }

        return 'Visitor '.substr((string) $this->uuid, 0, 8);
    }
}
