<?php

namespace App\Services;

use App\Models\Appointment;
use App\Models\DoctorAvailability;
use App\Models\DoctorLeave;
use App\Models\DoctorProfile;
use App\Services\Video\NullVideoMeetingProvider;
use App\Services\Video\VideoMeetingProvider;
use Carbon\Carbon;
use Carbon\CarbonInterface;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class AppointmentBookingService
{
    public function __construct(
        private ?VideoMeetingProvider $video = null,
    ) {
        $this->video ??= app(NullVideoMeetingProvider::class);
    }

    /**
     * @return list<array{starts_at:string,ends_at:string,label:string}>
     */
    public function availableSlots(DoctorProfile $doctor, CarbonInterface $date, string $mode): array
    {
        if ($doctor->status !== 'published' || $doctor->verification_status !== 'verified') {
            return [];
        }

        $tz = 'Asia/Kolkata';
        $day = Carbon::parse($date->format('Y-m-d'), $tz);
        if (DoctorLeave::query()->where('doctor_profile_id', $doctor->id)->whereDate('leave_date', $day->toDateString())->exists()) {
            return [];
        }

        $weekday = (int) $day->dayOfWeek;
        $windows = DoctorAvailability::query()
            ->where('doctor_profile_id', $doctor->id)
            ->where('is_active', true)
            ->where('weekday', $weekday)
            ->where('mode', $mode)
            ->get();

        $booked = Appointment::query()
            ->where('doctor_profile_id', $doctor->id)
            ->whereIn('status', ['pending', 'confirmed'])
            ->whereDate('starts_at', $day->toDateString())
            ->pluck('starts_at')
            ->map(fn ($dt) => Carbon::parse($dt)->timezone($tz)->format('Y-m-d H:i:s'))
            ->all();

        $slots = [];
        $now = now($tz);

        foreach ($windows as $window) {
            $start = Carbon::parse($day->toDateString().' '.$window->start_time, $tz);
            $end = Carbon::parse($day->toDateString().' '.$window->end_time, $tz);
            $minutes = max(15, (int) $window->slot_minutes);

            for ($cursor = $start->copy(); $cursor->copy()->addMinutes($minutes)->lte($end); $cursor->addMinutes($minutes)) {
                $slotEnd = $cursor->copy()->addMinutes($minutes);
                if ($cursor->lt($now)) {
                    continue;
                }
                $key = $cursor->format('Y-m-d H:i:s');
                if (in_array($key, $booked, true)) {
                    continue;
                }
                $slots[] = [
                    'starts_at' => $cursor->toIso8601String(),
                    'ends_at' => $slotEnd->toIso8601String(),
                    'label' => $cursor->format('h:i A').' – '.$slotEnd->format('h:i A'),
                ];
            }
        }

        return $slots;
    }

    /**
     * @param  array<string, mixed>  $payload
     */
    public function book(DoctorProfile $doctor, array $payload): Appointment
    {
        if ($doctor->status !== 'published' || $doctor->verification_status !== 'verified') {
            throw ValidationException::withMessages([
                'doctor' => 'This practitioner is not available for booking.',
            ]);
        }

        $mode = $payload['consultation_mode'];
        $modes = $doctor->consultation_modes ?? [];
        if ($modes && ! in_array($mode, $modes, true)) {
            throw ValidationException::withMessages([
                'consultation_mode' => 'Selected consultation mode is not offered.',
            ]);
        }

        $tz = 'Asia/Kolkata';
        $startsAt = Carbon::parse($payload['starts_at'])->timezone($tz);
        $slotMinutes = 30;
        $availability = DoctorAvailability::query()
            ->where('doctor_profile_id', $doctor->id)
            ->where('is_active', true)
            ->where('weekday', $startsAt->dayOfWeek)
            ->where('mode', $mode)
            ->get()
            ->first(function (DoctorAvailability $window) use ($startsAt, $tz) {
                $start = Carbon::parse($startsAt->toDateString().' '.$window->start_time, $tz);
                $end = Carbon::parse($startsAt->toDateString().' '.$window->end_time, $tz);

                return $startsAt->betweenIncluded($start, $end->copy()->subMinute());
            });

        if (! $availability) {
            throw ValidationException::withMessages([
                'starts_at' => 'Selected time is outside published availability.',
            ]);
        }

        $slotMinutes = (int) $availability->slot_minutes;
        $endsAt = $startsAt->copy()->addMinutes($slotMinutes);

        if (DoctorLeave::query()->where('doctor_profile_id', $doctor->id)->whereDate('leave_date', $startsAt->toDateString())->exists()) {
            throw ValidationException::withMessages([
                'starts_at' => 'Practitioner is unavailable on this date.',
            ]);
        }

        // Re-check live slot list
        $open = collect($this->availableSlots($doctor, $startsAt, $mode))
            ->contains(fn ($slot) => Carbon::parse($slot['starts_at'])->equalTo($startsAt));
        if (! $open) {
            throw ValidationException::withMessages([
                'starts_at' => 'That time slot is no longer available.',
            ]);
        }

        try {
            return DB::transaction(function () use ($doctor, $payload, $startsAt, $endsAt, $tz, $mode) {
                // Lock doctor row then attempt unique slot insert
                DoctorProfile::query()->whereKey($doctor->id)->lockForUpdate()->first();

                $conflict = Appointment::query()
                    ->where('doctor_profile_id', $doctor->id)
                    ->where('starts_at', $startsAt)
                    ->whereIn('status', ['pending', 'confirmed'])
                    ->lockForUpdate()
                    ->exists();

                if ($conflict) {
                    throw ValidationException::withMessages([
                        'starts_at' => 'That time slot was just booked by someone else.',
                    ]);
                }

                $appointment = Appointment::query()->create([
                    'reference' => 'APT'.now()->format('ymd').Str::upper(Str::random(6)),
                    'doctor_profile_id' => $doctor->id,
                    'user_id' => $payload['user_id'] ?? null,
                    'patient_name' => $payload['patient_name'],
                    'patient_phone' => $payload['patient_phone'],
                    'patient_email' => $payload['patient_email'] ?? null,
                    'consultation_mode' => $mode,
                    'starts_at' => $startsAt,
                    'ends_at' => $endsAt,
                    'timezone' => $tz,
                    'fee_paise' => $doctor->fee_paise,
                    'status' => 'confirmed',
                    'notes' => $payload['notes'] ?? null,
                    'terms_accepted' => true,
                ]);

                if ($mode === 'online') {
                    $meeting = $this->video->createMeeting($appointment);
                    $appointment->update([
                        'meeting_provider' => $this->video->name(),
                        'meeting_url' => $meeting['url'],
                        'meeting_access_token' => $meeting['token'],
                    ]);
                }

                return $appointment->fresh(['doctor']);
            });
        } catch (\Illuminate\Database\QueryException $e) {
            if (str_contains(strtolower($e->getMessage()), 'unique')) {
                throw ValidationException::withMessages([
                    'starts_at' => 'That time slot was just booked by someone else.',
                ]);
            }
            throw $e;
        }
    }

    public function cancel(Appointment $appointment, ?string $reason = null): Appointment
    {
        if (in_array($appointment->status, ['cancelled', 'completed'], true)) {
            return $appointment;
        }

        $appointment->update([
            'status' => 'cancelled',
            'cancelled_at' => now(),
            'cancellation_reason' => $reason,
            'meeting_access_token' => null,
        ]);

        return $appointment->fresh();
    }
}
