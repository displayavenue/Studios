<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class SiteSetting extends Model
{
    protected $fillable = [
        'group',
        'key',
        'value',
        'type',
    ];

    public static function getValue(string $key, mixed $default = null): mixed
    {
        $settings = static::allCached();

        if (! array_key_exists($key, $settings)) {
            return $default;
        }

        return $settings[$key];
    }

    /**
     * @return array<string, mixed>
     */
    public static function allCached(): array
    {
        return Cache::remember('site_settings.map', 60, function () {
            $map = [];
            foreach (static::query()->get(['key', 'value', 'type']) as $row) {
                $map[$row->key] = static::castValue($row->value, $row->type);
            }

            return $map;
        });
    }

    public static function forgetCache(): void
    {
        Cache::forget('site_settings.map');
    }

    protected static function castValue(?string $value, string $type): mixed
    {
        return match ($type) {
            'boolean' => filter_var($value, FILTER_VALIDATE_BOOLEAN),
            'json' => json_decode($value ?? 'null', true),
            default => $value,
        };
    }

    protected static function booted(): void
    {
        static::saved(fn () => static::forgetCache());
        static::deleted(fn () => static::forgetCache());
    }
}
