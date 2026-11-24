<?php

namespace Tests\Feature;

use App\Models\ConsultationRequest;
use Carbon\Carbon;
use Database\Seeders\HomepageContentSeeder;
use Database\Seeders\SiteSettingsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ConsultationPaymentTest extends TestCase
{
    use RefreshDatabase;

    public function test_consultation_request_goes_to_schedule_then_payment(): void
    {
        Carbon::setTestNow(Carbon::parse('2026-11-24 10:00:00', 'Asia/Kolkata'));

        $this->seed(SiteSettingsSeeder::class);
        $this->seed(HomepageContentSeeder::class);

        $response = $this->post(route('consultations.store', 'dr-kavita-deshmukh'), [
            'patient_name' => 'Pay Patient',
            'patient_phone' => '9888888888',
            'concern' => 'Ongoing cough',
            'terms' => '1',
        ]);

        $consultation = ConsultationRequest::query()->where('patient_name', 'Pay Patient')->firstOrFail();
        $response->assertRedirect(route('consultations.schedule', $consultation));

        $schedule = $this->get(route('consultations.schedule', $consultation));
        $schedule->assertOk();
        $schedule->assertSee('Choose your preferred slot', false);
        $schedule->assertSee('1 Dec', false); // 7 days after 24 Nov
        $schedule->assertSee('Continue to payment', false);

        $this->post(route('consultations.schedule.save', $consultation), [
            'preferred_date' => '2026-11-28',
            'preferred_time' => '16:00',
        ])->assertRedirect(route('consultations.pay', $consultation));

        $this->assertStringContainsString('28 Nov 2026', (string) $consultation->fresh()->preferred_window);
        $this->assertStringContainsString('4:00 PM', (string) $consultation->fresh()->preferred_window);

        $pay = $this->get(route('consultations.pay', $consultation));
        $pay->assertOk();
        $pay->assertSee('Pay consultation fee', false);
        $pay->assertSee('₹999', false);
        $pay->assertSee('4:00 PM', false);
        $pay->assertSee('Pay ₹999 (test)', false);

        $this->assertSame('pending', $consultation->fresh()->payment_status);
        $this->assertDatabaseHas('payments', [
            'consultation_request_id' => $consultation->id,
            'amount_paise' => 99900,
            'provider' => 'test',
            'status' => 'pending',
        ]);
    }

    public function test_homepage_book_now_redirects_to_schedule(): void
    {
        $this->seed(SiteSettingsSeeder::class);

        $response = $this->post(route('contact.store'), [
            'name' => 'Banner Patient',
            'contact' => '9876501234',
            'email' => 'banner@example.com',
            'concern' => 'Migraine',
            'side_effects' => 'None',
            'message' => 'Need help with headaches',
            'consent' => '1',
            'context' => 'Homepage consult banner',
            'lead_form' => 'consult_banner',
        ]);

        $consultation = ConsultationRequest::query()->where('patient_name', 'Banner Patient')->firstOrFail();
        $response->assertRedirect(route('consultations.schedule', $consultation));
        $this->assertSame('homepage_banner', $consultation->source);
        $this->assertSame('unpaid', $consultation->payment_status);
        $this->assertNull($consultation->doctor_profile_id);
    }

    public function test_test_payment_marks_consultation_paid_and_shows_confirmation(): void
    {
        Carbon::setTestNow(Carbon::parse('2026-11-24 10:00:00', 'Asia/Kolkata'));

        $this->seed(SiteSettingsSeeder::class);
        $this->seed(HomepageContentSeeder::class);

        $this->post(route('consultations.store', 'dr-kavita-deshmukh'), [
            'patient_name' => 'Paid Patient',
            'patient_phone' => '9777777777',
            'concern' => 'Skin rash',
            'terms' => '1',
        ]);

        $consultation = ConsultationRequest::query()->where('patient_name', 'Paid Patient')->firstOrFail();

        $this->post(route('consultations.schedule.save', $consultation), [
            'preferred_date' => '2026-11-26',
            'preferred_time' => '11:00',
        ])->assertRedirect(route('consultations.pay', $consultation));

        $this->get(route('consultations.pay', $consultation))->assertOk();

        $this->post(route('consultations.confirm-test', $consultation))
            ->assertRedirect();

        $this->assertSame('paid', $consultation->fresh()->payment_status);
        $this->assertNotNull($consultation->fresh()->paid_at);

        $this->get(route('consultations.confirmation', $consultation))
            ->assertOk()
            ->assertSee('Booking confirmed', false)
            ->assertSee('paid', false)
            ->assertSee('11:00 AM', false);
    }
}
