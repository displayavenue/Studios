<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Cart extends Model
{
    protected $fillable = [
        'user_id',
        'session_token',
        'currency',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(CartItem::class);
    }

    public function subtotalPaise(): int
    {
        return (int) $this->items->sum(function (CartItem $item) {
            return $item->lineTotalPaise();
        });
    }

    public function itemCount(): int
    {
        return (int) $this->items->sum('quantity');
    }
}
