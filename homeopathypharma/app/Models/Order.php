<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Order extends Model
{
    protected $fillable = [
        'number',
        'user_id',
        'customer_name',
        'customer_phone',
        'customer_email',
        'shipping_line1',
        'shipping_line2',
        'shipping_city',
        'shipping_state',
        'shipping_postal_code',
        'shipping_country',
        'notes',
        'currency',
        'subtotal_paise',
        'shipping_paise',
        'tax_paise',
        'total_paise',
        'payment_status',
        'fulfilment_status',
        'idempotency_key',
        'paid_at',
    ];

    protected function casts(): array
    {
        return ['paid_at' => 'datetime'];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function payment(): HasOne
    {
        return $this->hasOne(Payment::class)->latestOfMany();
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    public function shipments(): HasMany
    {
        return $this->hasMany(Shipment::class);
    }

    public function shipment(): HasOne
    {
        return $this->hasOne(Shipment::class)->latestOfMany();
    }

    public function formattedTotal(): string
    {
        return '₹'.number_format($this->total_paise / 100, 2);
    }
}
