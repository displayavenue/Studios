<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Product extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'sku',
        'brand_id',
        'short_description',
        'description',
        'benefits',
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
        'is_super_saving',
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
            'is_super_saving' => 'boolean',
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

    public function formattedMarketPrice(): string
    {
        return '₹'.number_format(((int) $this->price_paise) / 100, 2);
    }

    public function hasActiveSale(): bool
    {
        return $this->sale_price_paise !== null
            && $this->sale_price_paise < $this->price_paise
            && $this->currentPricePaise() === (int) $this->sale_price_paise;
    }

    public function discountPercent(): int
    {
        if (! $this->hasActiveSale() || (int) $this->price_paise <= 0) {
            return 0;
        }

        return (int) round((1 - ((int) $this->sale_price_paise / (int) $this->price_paise)) * 100);
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

    /**
     * Bottle/pack/offer line shown under the product title.
     */
    public function packagingLabel(): ?string
    {
        $bits = [];
        $package = trim((string) $this->package_size);
        $haystack = trim($this->name.' '.$package);

        if ($package !== '') {
            $bits[] = $package;
        }

        if (preg_match('/\bpack\s*of\s*(\d+)\b/i', $haystack, $m)
            || preg_match('/\bcombo\s*of\s*(\d+)\b/i', $haystack, $m)
            || preg_match('/\b(\d+)\s*(?:pcs|pieces|nos|bottles)\b/i', $haystack, $m)) {
            $label = 'Pack of '.$m[1];
            if (! collect($bits)->contains(fn ($bit) => str_contains(Str::lower($bit), Str::lower($label)))) {
                $bits[] = $label;
            }
        }

        if (preg_match('/\b(?:buy\s*1\s*get\s*1|bogo|b1g1|buy\s*one\s*get\s*one(?:\s*free)?)\b/i', $haystack)) {
            if (! collect($bits)->contains(fn ($bit) => str_contains(Str::lower($bit), 'buy 1 get 1'))) {
                $bits[] = 'Buy 1 Get 1';
            }
        }

        // Deduplicate overlapping fragments while preserving order.
        $unique = [];
        foreach ($bits as $bit) {
            $normalized = Str::lower(trim($bit));
            if ($normalized === '' || in_array($normalized, array_map(Str::lower(...), $unique), true)) {
                continue;
            }
            $unique[] = trim($bit);
        }

        return $unique === [] ? null : implode(' · ', $unique);
    }
}
