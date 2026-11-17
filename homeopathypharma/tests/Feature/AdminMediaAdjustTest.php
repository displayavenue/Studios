<?php

namespace Tests\Feature;

use App\Models\MediaAsset;
use App\Models\User;
use Database\Seeders\SiteSettingsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class AdminMediaAdjustTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_adjust_existing_media_with_cropped_upload(): void
    {
        Storage::fake('public');
        $this->seed(SiteSettingsSeeder::class);
        $admin = User::factory()->create(['is_admin' => true]);

        $original = UploadedFile::fake()->image('before.jpg', 800, 600);
        $asset = MediaAsset::query()->create([
            'disk' => 'public',
            'path' => $original->storeAs('media/test', 'before.jpg', 'public'),
            'filename' => 'before.jpg',
            'original_name' => 'before.jpg',
            'mime_type' => 'image/jpeg',
            'size_bytes' => $original->getSize() ?: 1000,
            'width' => 800,
            'height' => 600,
            'uploaded_by' => $admin->id,
        ]);

        $cropped = UploadedFile::fake()->image('after.jpg', 400, 333);

        $this->actingAs($admin)
            ->postJson(route('admin.media.adjust', $asset), [
                'file' => $cropped,
            ])
            ->assertOk()
            ->assertJsonPath('ok', true)
            ->assertJsonPath('media.id', $asset->id);

        $asset->refresh();
        $this->assertNotSame('before.jpg', $asset->filename);
        $this->assertTrue(Storage::disk('public')->exists($asset->path));
    }

    public function test_admin_media_show_returns_public_url(): void
    {
        Storage::fake('public');
        $this->seed(SiteSettingsSeeder::class);
        $admin = User::factory()->create(['is_admin' => true]);

        $file = UploadedFile::fake()->image('logo.png', 120, 120);
        $asset = MediaAsset::query()->create([
            'disk' => 'public',
            'path' => $file->storeAs('media/test', 'logo.png', 'public'),
            'filename' => 'logo.png',
            'original_name' => 'logo.png',
            'mime_type' => 'image/png',
            'size_bytes' => 500,
            'width' => 120,
            'height' => 120,
            'uploaded_by' => $admin->id,
        ]);

        $this->actingAs($admin)
            ->getJson(route('admin.media.show', $asset))
            ->assertOk()
            ->assertJsonPath('ok', true)
            ->assertJsonPath('media.id', $asset->id);
    }

    public function test_media_library_page_includes_image_adjuster(): void
    {
        $this->seed(SiteSettingsSeeder::class);
        $admin = User::factory()->create(['is_admin' => true]);

        $this->actingAs($admin)
            ->get(route('admin.media.index'))
            ->assertOk()
            ->assertSee('Adjust image', false)
            ->assertSee('admin-image-adjust.js', false)
            ->assertSee('data-hp-imgadj', false);
    }
}
