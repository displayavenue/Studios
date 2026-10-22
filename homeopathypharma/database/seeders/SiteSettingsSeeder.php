<?php

namespace Database\Seeders;

use App\Models\SiteSetting;
use Illuminate\Database\Seeder;

class SiteSettingsSeeder extends Seeder
{
    public function run(): void
    {
        $rows = [
            ['group' => 'brand', 'key' => 'brand_name', 'value' => 'HOMEOPATHY PHARMA', 'type' => 'string'],
            ['group' => 'brand', 'key' => 'tagline', 'value' => 'Natural wellness. Expert guidance.', 'type' => 'string'],
            ['group' => 'contact', 'key' => 'phone_display', 'value' => '+91 8169 122333', 'type' => 'string'],
            ['group' => 'contact', 'key' => 'phone_tel', 'value' => '+918169122333', 'type' => 'string'],
            ['group' => 'contact', 'key' => 'address', 'value' => 'No. 44, D Wing, Shree Sharanam CHS, Kanakia, Near Fire Station, Unique Garden, Mira Road East, Mumbai – 401107, Maharashtra, India.', 'type' => 'text'],
            ['group' => 'commerce', 'key' => 'currency', 'value' => 'INR', 'type' => 'string'],
            ['group' => 'commerce', 'key' => 'locale', 'value' => 'en-IN', 'type' => 'string'],
            ['group' => 'commerce', 'key' => 'timezone', 'value' => 'Asia/Kolkata', 'type' => 'string'],
            ['group' => 'homepage', 'key' => 'announcement_enabled', 'value' => '0', 'type' => 'boolean'],
            ['group' => 'homepage', 'key' => 'announcement_text', 'value' => null, 'type' => 'text'],
            ['group' => 'commerce', 'key' => 'consultation_fee_paise', 'value' => '99900', 'type' => 'string'],
            ['group' => 'social', 'key' => 'facebook_url', 'value' => '', 'type' => 'string'],
            ['group' => 'social', 'key' => 'instagram_url', 'value' => '', 'type' => 'string'],
            // Support email intentionally omitted until confirmed by the business.
        ];

        foreach ($rows as $row) {
            SiteSetting::query()->updateOrCreate(
                ['key' => $row['key']],
                $row
            );
        }

        SiteSetting::forgetCache();
    }
}
