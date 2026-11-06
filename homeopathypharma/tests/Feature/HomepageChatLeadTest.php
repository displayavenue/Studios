<?php

namespace Tests\Feature;

use App\Models\ContactMessage;
use App\Models\NotificationLog;
use Database\Seeders\HomepageSectionSeeder;
use Database\Seeders\SiteSettingsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class HomepageChatLeadTest extends TestCase
{
    use RefreshDatabase;

    public function test_homepage_chat_creates_chat_lead_and_returns_json(): void
    {
        Mail::fake();
        $this->seed(SiteSettingsSeeder::class);
        $this->seed(HomepageSectionSeeder::class);

        $response = $this->from('/')->postJson('/contact', [
            'name' => 'Asha Verma',
            'contact' => '9876501234',
            'message' => 'Is Arnica available in 30C? Also shipping to Pune?',
            'consent' => '1',
            'context' => 'Homepage chat',
            'lead_form' => 'homepage_chat',
        ]);

        $response->assertOk()
            ->assertJsonPath('ok', true)
            ->assertJsonPath('lead_form', 'homepage_chat');

        $this->assertDatabaseHas('contact_messages', [
            'name' => 'Asha Verma',
            'contact' => '9876501234',
            'source' => 'chat',
            'status' => 'new',
        ]);

        $lead = ContactMessage::query()->latest('id')->first();
        $this->assertNotNull($lead);
        $this->assertStringContainsString('Arnica', (string) $lead->message);

        $this->assertTrue(
            NotificationLog::query()
                ->where('event', 'lead.received')
                ->where('channel', 'admin_inbox')
                ->exists()
        );
    }

    public function test_homepage_includes_chat_widget(): void
    {
        $this->seed(SiteSettingsSeeder::class);
        $this->seed(HomepageSectionSeeder::class);

        $this->get('/')
            ->assertOk()
            ->assertSee('data-hp-chat', false)
            ->assertSee('Ask about a product', false)
            ->assertSee('homepage_chat', false);
    }
}
