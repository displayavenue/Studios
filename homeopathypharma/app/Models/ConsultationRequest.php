<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class ConsultationRequest extends Model
{
    protected $fillable = [
        'number', 'doctor_profile_id', 'user_id', 'patient_name', 'patient_phone',
        'patient_email', 'concern', 'preferred_window', 'fee_paise', 'payment_status',
        'paid_at', 'status', 'source', 'meeting_url', 'scheduled_at', 'admin_notes',
    ];

    /** @return list<string> */
    public static function bookingTimeSlots(): array
    {
        return ['10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];
    }

    protected function casts(): array
    {
        return [
            'scheduled_at' => 'datetime',
            'paid_at' => 'datetime',
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

    public function payment(): HasOne
    {
        return $this->hasOne(Payment::class)->latestOfMany();
    }

    public function isPaid(): bool
    {
        return $this->payment_status === 'paid';
    }

    public function formattedFee(): string
    {
        return '₹'.number_format($this->fee_paise / 100, 0);
    }
}
