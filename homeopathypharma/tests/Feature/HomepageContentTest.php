<?php

namespace Tests\Feature;

use Database\Seeders\HomepageContentSeeder;
use Database\Seeders\HomepageSectionSeeder;
use Database\Seeders\SiteSettingsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class HomepageContentTest extends TestCase
{
    use RefreshDatabase;

    public function test_homepage_shows_doctors_founders_case_studies_and_blog(): void
    {
        $this->seed(SiteSettingsSeeder::class);
        $this->seed(HomepageSectionSeeder::class);
        $this->seed(HomepageContentSeeder::class);

        $response = $this->get('/');
        $response->assertOk();
        $response->assertSee('Dr. Kavita Deshmukh', false);
        $response->assertSee('₹999', false);
        $response->assertSee('Google Meet', false);
        $response->assertSee('Our Founder', false);
        $response->assertSee('Ananya S.', false);
        $response->assertSee('Health Library', false);
        $response->assertSee('When to seek urgent medical care', false);
        $response->assertSee('What Our Customers Say', false);
    }

    public function test_consultation_request_creates_pending_meet_booking(): void
    {
        $this->seed(SiteSettingsSeeder::class);
        $this->seed(HomepageContentSeeder::class);

        $response = $this->post(route('consultations.store', 'dr-kavita-deshmukh'), [
            'patient_name' => 'Test Patient',
            'patient_phone' => '9999999999',
            'concern' => 'Seasonal allergy',
            'terms' => '1',
        ]);

        $consultation = \App\Models\ConsultationRequest::query()->where('patient_name', 'Test Patient')->firstOrFail();
        $response->assertRedirect(route('consultations.schedule', $consultation));

        $this->assertDatabaseHas('consultation_requests', [
            'patient_name' => 'Test Patient',
            'status' => 'pending',
            'payment_status' => 'unpaid',
            'fee_paise' => 99900,
        ]);
    }

    public function test_gallery_and_blog_pages_load(): void
    {
        $this->seed(SiteSettingsSeeder::class);
        $this->seed(HomepageContentSeeder::class);

        $this->get('/blog')->assertOk();
        $this->get('/gallery')->assertOk();
    }
}
