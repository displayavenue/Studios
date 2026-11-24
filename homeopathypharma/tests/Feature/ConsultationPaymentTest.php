<?php

namespace Tests\Feature;

use App\Models\ConsultationRequest;
use Database\Seeders\HomepageContentSeeder;
use Database\Seeders\SiteSettingsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ConsultationPaymentTest extends TestCase
{
    use RefreshDatabase;

    public function test_consultation_request_redirects_to_payment_page(): void
    {
        $this->seed(SiteSettingsSeeder::class);
        $this->seed(HomepageContentSeeder::class);

        $response = $this->post(route('consultations.store', 'dr-kavita-deshmukh'), [
            'patient_name' => 'Pay Patient',
            'patient_phone' => '9888888888',
            'terms' => '1',
        ]);

        $consultation = ConsultationRequest::query()->where('patient_name', 'Pay Patient')->firstOrFail();
        $response->assertRedirect(route('consultations.pay', $consultation));

        $pay = $this->get(route('consultations.pay', $consultation));
        $pay->assertOk();
        $pay->assertSee('Pay consultation fee', false);
        $pay->assertSee('₹999', false);
        $pay->assertSee('Pay ₹999 (test)', false);

        $this->assertSame('pending', $consultation->fresh()->payment_status);
        $this->assertDatabaseHas('payments', [
            'consultation_request_id' => $consultation->id,
            'amount_paise' => 99900,
            'provider' => 'test',
            'status' => 'pending',
        ]);
    }

    public function test_test_payment_marks_consultation_paid_and_shows_confirmation(): void
    {
        $this->seed(SiteSettingsSeeder::class);
        $this->seed(HomepageContentSeeder::class);

        $this->post(route('consultations.store', 'dr-kavita-deshmukh'), [
            'patient_name' => 'Paid Patient',
            'patient_phone' => '9777777777',
            'terms' => '1',
        ]);

        $consultation = ConsultationRequest::query()->where('patient_name', 'Paid Patient')->firstOrFail();
        $this->get(route('consultations.pay', $consultation))->assertOk();

        $this->post(route('consultations.confirm-test', $consultation))
            ->assertRedirect();

        $this->assertSame('paid', $consultation->fresh()->payment_status);
        $this->assertNotNull($consultation->fresh()->paid_at);

        $this->get(route('consultations.confirmation', $consultation))
            ->assertOk()
            ->assertSee('Booking confirmed', false)
            ->assertSee('paid', false);
    }
}
