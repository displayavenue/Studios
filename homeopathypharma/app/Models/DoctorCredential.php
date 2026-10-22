<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DoctorCredential extends Model
{
    protected $fillable = [
        'doctor_profile_id',
        'credential_type',
        'credential_number',
        'issuing_body',
        'issued_on',
        'expires_on',
        'review_status',
        'reviewed_at',
        'reviewed_by',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'issued_on' => 'date',
            'expires_on' => 'date',
            'reviewed_at' => 'datetime',
        ];
    }

    public function doctor(): BelongsTo
    {
        return $this->belongsTo(DoctorProfile::class, 'doctor_profile_id');
    }
}
