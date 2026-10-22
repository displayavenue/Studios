<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'sku',
        'brand_id',
        'short_description',
        'description',
        'price_paise',
        'sale_price_paise',
        'sale_starts_at',
        'sale_ends_at',
        'stock_qty',
        'stock_status',
        'package_size',
        'ingredients',
        'directions',
        'warnings',
        'manufacturer',
        'status',
        'is_featured',
        'seo_title',
        'seo_description',
        'published_at',
    ];

    protected function casts(): array
    {
        return [
            'sale_starts_at' => 'datetime',
            'sale_ends_at' => 'datetime',
            'published_at' => 'datetime',
            'is_featured' => 'boolean',
        ];
    }

    public function brand(): BelongsTo
    {
        return $this->belongsTo(Brand::class);
    }

    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(Category::class)->withTimestamps();
    }

    public function images(): HasMany
    {
        return $this->hasMany(ProductImage::class)->orderBy('sort_order');
    }

    public function scopePublished(Builder $query): Builder
    {
        return $query->where('status', 'published');
    }

    public function currentPricePaise(): int
    {
        if ($this->sale_price_paise === null) {
            return (int) $this->price_paise;
        }

        $now = now();
        $startsOk = $this->sale_starts_at === null || $this->sale_starts_at->lte($now);
        $endsOk = $this->sale_ends_at === null || $this->sale_ends_at->gte($now);

        if ($startsOk && $endsOk && $this->sale_price_paise < $this->price_paise) {
            return (int) $this->sale_price_paise;
        }

        return (int) $this->price_paise;
    }

    public function formattedPrice(): string
    {
        return '₹'.number_format($this->currentPricePaise() / 100, 2);
    }

    public function isPurchasable(): bool
    {
        return $this->status === 'published'
            && $this->stock_status !== 'out_of_stock'
            && $this->stock_qty > 0;
    }

    public function primaryImage(): ?MediaAsset
    {
        $primary = $this->images->firstWhere('is_primary', true) ?? $this->images->first();

        return $primary?->media;
    }
}
