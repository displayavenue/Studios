<?php

namespace Tests\Feature;

use App\Models\HealthCondition;
use App\Models\User;
use Database\Seeders\SiteSettingsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminConditionsLetterFilterTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_filter_diseases_by_letter_and_session_persists(): void
    {
        $this->seed(SiteSettingsSeeder::class);
        $admin = User::factory()->create(['is_admin' => true]);

        HealthCondition::query()->create($this->conditionAttrs('Acne', 'acne', 'Skin'));
        HealthCondition::query()->create($this->conditionAttrs('Migraine', 'migraine', 'Neurology'));
        HealthCondition::query()->create($this->conditionAttrs('Allergy', 'allergy', 'Respiratory'));

        $this->actingAs($admin)
            ->get(route('admin.conditions.index', ['letter' => 'A']))
            ->assertOk()
            ->assertSee('Acne', false)
            ->assertSee('Allergy', false)
            ->assertDontSee('Migraine', false)
            ->assertSee('Showing', false);

        // Without letter query, session should keep A
        $this->actingAs($admin)
            ->get(route('admin.conditions.index'))
            ->assertOk()
            ->assertSee('Acne', false)
            ->assertDontSee('Migraine', false);

        $migraine = HealthCondition::query()->where('slug', 'migraine')->firstOrFail();

        $this->actingAs($admin)
            ->get(route('admin.conditions.edit', ['condition' => $migraine, 'letter' => 'M']))
            ->assertOk()
            ->assertSee('Back to M', false);

        $this->actingAs($admin)
            ->put(route('admin.conditions.update', $migraine), [
                'title' => 'Migraine',
                'slug' => 'migraine',
                'category' => 'Neurology',
                'snippet' => 'Headache support guide.',
                'short_description' => 'Short description for migraine care.',
                'long_description' => 'Long description for migraine educational content.',
                'status' => 'published',
                'is_indexed' => '1',
                'sort_order' => 0,
            ])
            ->assertRedirect(route('admin.conditions.index', ['letter' => 'M']));

        $this->actingAs($admin)
            ->get(route('admin.conditions.index'))
            ->assertOk()
            ->assertSee('Migraine', false)
            ->assertDontSee('Acne', false);
    }

    public function test_all_letter_clears_filter(): void
    {
        $this->seed(SiteSettingsSeeder::class);
        $admin = User::factory()->create(['is_admin' => true]);

        HealthCondition::query()->create($this->conditionAttrs('Acne', 'acne', 'Skin'));
        HealthCondition::query()->create($this->conditionAttrs('Migraine', 'migraine', 'Neurology'));

        $this->actingAs($admin)->get(route('admin.conditions.index', ['letter' => 'A']))->assertOk();

        $this->actingAs($admin)
            ->get(route('admin.conditions.index', ['letter' => '']))
            ->assertOk()
            ->assertSee('Acne', false)
            ->assertSee('Migraine', false);
    }

    /**
     * @return array<string, mixed>
     */
    private function conditionAttrs(string $title, string $slug, string $category): array
    {
        return [
            'title' => $title,
            'slug' => $slug,
            'category' => $category,
            'snippet' => $title.' snippet',
            'short_description' => $title.' short description',
            'long_description' => $title.' long description',
            'seo_title' => $title.' — HOMEOPATHY PHARMA',
            'seo_description' => $title.' seo',
            'image_url' => '/images/brand/logo-hp.png',
            'image_alt' => $title,
            'status' => 'published',
            'is_indexed' => true,
            'sort_order' => 0,
            'published_at' => now(),
            'faqs' => [],
            'reviews' => [],
            'seo_keywords' => [$title],
        ];
    }
}
