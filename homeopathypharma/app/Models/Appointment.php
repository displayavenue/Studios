<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Appointment extends Model
{
    protected $fillable = [
        'reference',
        'doctor_profile_id',
        'user_id',
        'patient_name',
        'patient_phone',
        'patient_email',
        'consultation_mode',
        'starts_at',
        'ends_at',
        'timezone',
        'fee_paise',
        'status',
        'notes',
        'terms_accepted',
        'meeting_provider',
        'meeting_url',
        'meeting_access_token',
        'cancelled_at',
        'cancellation_reason',
    ];

    protected function casts(): array
    {
        return [
            'starts_at' => 'datetime',
            'ends_at' => 'datetime',
            'cancelled_at' => 'datetime',
            'terms_accepted' => 'boolean',
        ];
    }

    public function doctor(): BelongsTo
    {
        return $this->belongsTo(DoctorProfile::class, 'doctor_profile_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function isActive(): bool
    {
        return in_array($this->status, ['pending', 'confirmed'], true);
    }
}
