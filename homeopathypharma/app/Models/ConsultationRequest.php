<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ConsultationRequest extends Model
{
    protected $fillable = [
        'number', 'doctor_profile_id', 'user_id', 'patient_name', 'patient_phone',
        'patient_email', 'concern', 'preferred_window', 'fee_paise', 'status',
        'meeting_url', 'scheduled_at', 'admin_notes',
    ];

    protected function casts(): array
    {
        return ['scheduled_at' => 'datetime'];
    }

    public function doctor(): BelongsTo
    {
        return $this->belongsTo(DoctorProfile::class, 'doctor_profile_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function formattedFee(): string
    {
        return '₹'.number_format($this->fee_paise / 100, 0);
    }
}
