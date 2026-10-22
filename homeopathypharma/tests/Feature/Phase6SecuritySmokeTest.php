<?php

namespace Tests\Feature;

use App\Models\Article;
use App\Models\User;
use App\Services\Payments\PaymentGatewayManager;
use App\Services\Payments\RazorpayGateway;
use App\Services\Payments\TestPaymentGateway;
use Database\Seeders\SiteSettingsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Artisan;
use Tests\TestCase;

class Phase6SecuritySmokeTest extends TestCase
{
    use RefreshDatabase;

    public function test_security_headers_are_present_on_public_pages(): void
    {
        $this->seed(SiteSettingsSeeder::class);

        $response = $this->get('/');

        $response->assertOk();
        $response->assertHeader('X-Frame-Options', 'SAMEORIGIN');
        $response->assertHeader('X-Content-Type-Options', 'nosniff');
        $this->assertNotEmpty($response->headers->get('Content-Security-Policy'));
        $this->assertNotEmpty($response->headers->get('Referrer-Policy'));
    }

    public function test_guest_cannot_access_admin_dashboard(): void
    {
        $this->get('/admin')->assertRedirect(route('admin.login'));
    }

    public function test_non_admin_user_is_forbidden_from_admin(): void
    {
        $user = User::factory()->create(['is_admin' => false]);

        $this->actingAs($user)->get('/admin')->assertForbidden();
    }

    public function test_health_endpoint_and_seo_basics_work(): void
    {
        $this->seed(SiteSettingsSeeder::class);

        $this->get('/up')->assertOk();
        $this->get('/robots.txt')->assertOk()->assertSee('Disallow: /admin', false);
        $this->get('/sitemap.xml')->assertOk()->assertSee('urlset', false);
    }

    public function test_draft_article_stays_private(): void
    {
        Article::query()->create([
            'title' => 'Secret Draft',
            'slug' => 'secret-draft',
            'status' => 'draft',
            'body' => 'hidden',
        ]);

        $this->get('/health-library/secret-draft')->assertNotFound();
    }

    public function test_test_payment_gateway_is_blocked_in_production(): void
    {
        $this->app->detectEnvironment(fn () => 'production');
        config(['app.env' => 'production']);

        $this->mock(RazorpayGateway::class, function ($mock) {
            $mock->shouldReceive('isConfigured')->andReturn(false);
        });

        $this->expectException(\RuntimeException::class);
        $this->expectExceptionMessage('No live payment gateway is configured');

        app(PaymentGatewayManager::class)->gateway();
    }

    public function test_test_confirm_is_forbidden_in_production(): void
    {
        $this->app->detectEnvironment(fn () => 'production');
        config(['app.env' => 'production']);

        $this->withoutMiddleware(\Illuminate\Foundation\Http\Middleware\PreventRequestForgery::class)
            ->post('/checkout/confirm-test', ['order_id' => 1])
            ->assertForbidden();
    }

    public function test_preflight_command_runs_in_local(): void
    {
        $exit = Artisan::call('hp:preflight');
        $this->assertContains($exit, [0, 1]); // warnings may yield 0; errors 1
        $this->assertStringContainsString('preflight', Artisan::output());
    }

    public function test_local_environment_may_use_test_gateway(): void
    {
        $this->mock(RazorpayGateway::class, function ($mock) {
            $mock->shouldReceive('isConfigured')->andReturn(false);
        });

        $gateway = app(PaymentGatewayManager::class)->gateway();
        $this->assertInstanceOf(TestPaymentGateway::class, $gateway);
    }
}
