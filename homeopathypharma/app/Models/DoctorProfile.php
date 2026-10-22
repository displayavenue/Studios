<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class DoctorProfile extends Model
{
    protected $fillable = [
        'user_id',
        'full_name',
        'slug',
        'designation',
        'photo_media_id',
        'years_experience',
        'languages',
        'specializations',
        'consultation_modes',
        'fee_paise',
        'city',
        'locality',
        'bio',
        'verification_status',
        'verified_at',
        'status',
        'published_at',
    ];

    protected function casts(): array
    {
        return [
            'languages' => 'array',
            'specializations' => 'array',
            'consultation_modes' => 'array',
            'verified_at' => 'datetime',
            'published_at' => 'datetime',
        ];
    }

    public function photo(): BelongsTo
    {
        return $this->belongsTo(MediaAsset::class, 'photo_media_id');
    }

    public function credentials(): HasMany
    {
        return $this->hasMany(DoctorCredential::class);
    }

    public function availabilities(): HasMany
    {
        return $this->hasMany(DoctorAvailability::class);
    }

    public function leaves(): HasMany
    {
        return $this->hasMany(DoctorLeave::class);
    }

    public function appointments(): HasMany
    {
        return $this->hasMany(Appointment::class);
    }

    public function scopePubliclyListed(Builder $query): Builder
    {
        return $query
            ->where('status', 'published')
            ->where('verification_status', 'verified');
    }

    public function formattedFee(): ?string
    {
        if ($this->fee_paise === null) {
            return null;
        }

        return '₹'.number_format($this->fee_paise / 100, 2);
    }
}
