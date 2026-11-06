<?php

namespace Tests\Feature;

use App\Models\ContactMessage;
use App\Models\NotificationLog;
use App\Models\SiteSetting;
use App\Models\User;
use Database\Seeders\HomepageSectionSeeder;
use Database\Seeders\SiteSettingsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class DoctorLeadTest extends TestCase
{
    use RefreshDatabase;

    public function test_talk_to_doctor_saves_lead_shows_success_and_alerts_admin_inbox(): void
    {
        Mail::fake();
        $this->seed(SiteSettingsSeeder::class);
        $this->seed(HomepageSectionSeeder::class);

        $response = $this->from('/#talk-to-doctor')->post('/contact', [
            'name' => 'Priya Shah',
            'contact' => '9876543210',
            'message' => 'Migraine for two weeks',
            'consent' => '1',
            'context' => 'Homepage doctor lead',
            'lead_form' => 'doctor',
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('lead_success', true);
        $response->assertSessionHas('lead_form', 'doctor');
        $response->assertSessionHas('status', 'Thank you. Our team will connect with you soon.');

        $this->assertDatabaseHas('contact_messages', [
            'name' => 'Priya Shah',
            'contact' => '9876543210',
            'source' => 'doctor',
            'status' => 'new',
        ]);

        $this->assertTrue(
            NotificationLog::query()
                ->where('event', 'lead.received')
                ->where('channel', 'admin_inbox')
                ->exists()
        );
    }

    public function test_talk_to_doctor_emails_notify_address_when_configured(): void
    {
        Mail::fake();
        $this->seed(SiteSettingsSeeder::class);
        $this->seed(HomepageSectionSeeder::class);

        SiteSetting::query()->updateOrCreate(
            ['key' => 'lead_notify_email'],
            ['group' => 'notifications', 'value' => 'leads@homeopathypharma.test', 'type' => 'string']
        );
        SiteSetting::forgetCache();

        $this->post('/contact', [
            'name' => 'Amit',
            'contact' => '9123456780',
            'message' => 'Skin rash',
            'consent' => '1',
            'lead_form' => 'doctor',
        ])->assertRedirect();

        $this->assertTrue(
            NotificationLog::query()
                ->where('event', 'lead.received')
                ->where('channel', 'mail')
                ->where('recipient', 'leads@homeopathypharma.test')
                ->where('status', 'sent')
                ->exists()
        );
    }

    public function test_admin_can_review_leads_inbox(): void
    {
        $this->seed(SiteSettingsSeeder::class);

        $admin = User::factory()->create(['is_admin' => true]);
        $lead = ContactMessage::query()->create([
            'name' => 'Lead User',
            'contact' => '9000000000',
            'message' => 'Need consult',
            'consent' => true,
            'status' => 'new',
            'source' => 'doctor',
            'ip_address' => '127.0.0.1',
        ]);

        $this->actingAs($admin)
            ->get(route('admin.leads.index'))
            ->assertOk()
            ->assertSee('Lead User', false)
            ->assertSee('9000000000', false);

        $this->actingAs($admin)
            ->put(route('admin.leads.update', $lead), ['status' => 'reviewed'])
            ->assertRedirect();

        $this->assertSame('reviewed', $lead->fresh()->status);
    }
}
