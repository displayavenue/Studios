<?php

namespace Tests\Feature;

use App\Models\ConsultationRequest;
use App\Models\ContactMessage;
use App\Models\NotificationLog;
use Database\Seeders\HomepageSectionSeeder;
use Database\Seeders\SiteSettingsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ConsultBannerRequestTest extends TestCase
{
    use RefreshDatabase;

    public function test_book_now_creates_consult_request_not_a_lead(): void
    {
        Mail::fake();
        Storage::fake('public');
        $this->seed(SiteSettingsSeeder::class);
        $this->seed(HomepageSectionSeeder::class);

        $response = $this->from('/#consult-doctors')->post('/contact', [
            'name' => 'Neha Rao',
            'contact' => '9988776655',
            'email' => 'neha@example.test',
            'concern' => 'Digestion',
            'side_effects' => 'None',
            'message' => 'Stomach pain after meals',
            'consent' => '1',
            'context' => 'Homepage consult banner',
            'lead_form' => 'consult_banner',
            'attachment' => UploadedFile::fake()->create('report.pdf', 120, 'application/pdf'),
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('lead_success', true);
        $response->assertSessionHas('lead_form', 'consult_banner');

        $this->assertDatabaseCount('contact_messages', 0);
        $this->assertDatabaseHas('consultation_requests', [
            'patient_name' => 'Neha Rao',
            'patient_phone' => '9988776655',
            'patient_email' => 'neha@example.test',
            'source' => 'homepage_banner',
            'status' => 'pending',
            'doctor_profile_id' => null,
        ]);

        $req = ConsultationRequest::query()->latest('id')->first();
        $this->assertNotNull($req);
        $this->assertStringContainsString('Digestion', (string) $req->concern);
        $this->assertStringContainsString('Attachment:', (string) $req->admin_notes);

        $this->assertTrue(
            NotificationLog::query()
                ->where('event', 'consultation.requested')
                ->where('channel', 'admin_inbox')
                ->exists()
        );
    }

    public function test_talk_to_doctor_still_creates_lead_only(): void
    {
        Mail::fake();
        $this->seed(SiteSettingsSeeder::class);
        $this->seed(HomepageSectionSeeder::class);

        $this->post('/contact', [
            'name' => 'Lead Only',
            'contact' => '9000111222',
            'message' => 'Headache',
            'consent' => '1',
            'lead_form' => 'doctor',
        ])->assertRedirect();

        $this->assertDatabaseHas('contact_messages', [
            'name' => 'Lead Only',
            'source' => 'doctor',
        ]);
        $this->assertSame(0, ConsultationRequest::query()->count());
        $this->assertSame(1, ContactMessage::query()->count());
    }
}
