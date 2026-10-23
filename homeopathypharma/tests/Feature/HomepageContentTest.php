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
        $response->assertSee('Founder', false);
        $response->assertSee('Case studies', false);
        $response->assertSee('Allergic rhinitis', false);
        $response->assertSee('Blog', false);
        $response->assertSee('Testimonials', false);
    }

    public function test_consultation_request_creates_pending_meet_booking(): void
    {
        $this->seed(SiteSettingsSeeder::class);
        $this->seed(HomepageContentSeeder::class);

        $this->post(route('consultations.store', 'dr-kavita-deshmukh'), [
            'patient_name' => 'Test Patient',
            'patient_phone' => '9999999999',
            'preferred_window' => 'Weekend morning',
            'terms' => '1',
        ])->assertRedirect();

        $this->assertDatabaseHas('consultation_requests', [
            'patient_name' => 'Test Patient',
            'status' => 'pending',
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
