<?php

namespace Tests\Feature;

use App\Models\DoctorAvailability;
use App\Models\DoctorProfile;
use App\Services\AppointmentBookingService;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class Phase4AppointmentsTest extends TestCase
{
    use RefreshDatabase;

    private function verifiedDoctor(): DoctorProfile
    {
        return DoctorProfile::query()->create([
            'full_name' => 'Dr Example Verified',
            'slug' => 'dr-example-verified',
            'designation' => 'BHMS',
            'consultation_modes' => ['online'],
            'fee_paise' => 50000,
            'verification_status' => 'verified',
            'verified_at' => now(),
            'status' => 'published',
            'published_at' => now(),
            'languages' => ['English'],
            'specializations' => ['General'],
        ]);
    }

    public function test_unverified_doctors_are_hidden_from_directory(): void
    {
        DoctorProfile::query()->create([
            'full_name' => 'Dr Draft',
            'slug' => 'dr-draft',
            'verification_status' => 'unverified',
            'status' => 'draft',
            'consultation_modes' => ['online'],
        ]);

        $this->verifiedDoctor();

        $response = $this->get('/doctors');
        $response->assertOk();
        $response->assertSee('Dr Example Verified', false);
        $response->assertDontSee('Dr Draft', false);
    }

    public function test_cannot_publish_unverified_doctor_via_admin_rules(): void
    {
        $admin = \App\Models\User::factory()->create(['is_admin' => true]);

        $this->actingAs($admin)->post(route('admin.doctors.store'), [
            'full_name' => 'Dr Not Ready',
            'verification_status' => 'pending',
            'status' => 'published',
            'consultation_modes' => ['online'],
        ])->assertSessionHasErrors('status');
    }

    public function test_double_booking_same_slot_is_rejected(): void
    {
        Carbon::setTestNow(Carbon::parse('2026-11-02 08:00:00', 'Asia/Kolkata')); // Monday

        $doctor = $this->verifiedDoctor();
        DoctorAvailability::query()->create([
            'doctor_profile_id' => $doctor->id,
            'weekday' => 1, // Monday
            'start_time' => '10:00',
            'end_time' => '12:00',
            'slot_minutes' => 30,
            'mode' => 'online',
            'timezone' => 'Asia/Kolkata',
            'is_active' => true,
        ]);

        $booking = app(AppointmentBookingService::class);
        $starts = Carbon::parse('2026-11-02 10:00:00', 'Asia/Kolkata');

        $first = $booking->book($doctor, [
            'patient_name' => 'Patient A',
            'patient_phone' => '9000000001',
            'consultation_mode' => 'online',
            'starts_at' => $starts->toIso8601String(),
            'terms' => true,
        ]);

        $this->assertSame('confirmed', $first->status);

        $this->expectException(\Illuminate\Validation\ValidationException::class);
        $booking->book($doctor, [
            'patient_name' => 'Patient B',
            'patient_phone' => '9000000002',
            'consultation_mode' => 'online',
            'starts_at' => $starts->toIso8601String(),
            'terms' => true,
        ]);
    }

    public function test_doctors_page_empty_state_when_none_published(): void
    {
        $this->get('/doctors')
            ->assertOk()
            ->assertSee('No practitioner profiles are available', false);
    }
}
