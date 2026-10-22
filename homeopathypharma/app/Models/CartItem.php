<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CartItem extends Model
{
    protected $fillable = [
        'cart_id',
        'product_id',
        'quantity',
    ];

    public function cart(): BelongsTo
    {
        return $this->belongsTo(Cart::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function unitPricePaise(): int
    {
        return $this->product?->currentPricePaise() ?? 0;
    }

    public function lineTotalPaise(): int
    {
        return $this->unitPricePaise() * (int) $this->quantity;
    }
}
