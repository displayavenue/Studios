<?php

namespace Database\Seeders;

use App\Models\HomepageSection;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class HomepageSectionSeeder extends Seeder
{
    public function run(): void
    {
        $now = Carbon::now();

        $sections = [
            [
                'key' => 'hero',
                'title' => 'Natural wellness. Expert guidance.',
                'subtitle' => 'Explore homeopathy products and connect with qualified practitioners in one convenient place.',
                'payload' => [
                    'primary_cta_label' => 'Shop Products',
                    'primary_cta_href' => '/shop',
                    'secondary_cta_label' => 'Consult a Doctor',
                    'secondary_cta_href' => '/doctors',
                    'image_alt' => 'Natural wellness products and botanical ingredients',
                    // No product claims; hero image set via media library in Phase 2.
                    'media_asset_id' => null,
                ],
                'sort_order' => 10,
            ],
            [
                'key' => 'trust',
                'title' => 'Why shop with us',
                'subtitle' => null,
                'payload' => [
                    'items' => [
                        ['title' => 'Product information', 'body' => 'Clear labelling and catalogue details managed by our team.'],
                        ['title' => 'Practitioner profiles', 'body' => 'Browse approved homeopathic practitioner profiles when published.'],
                        ['title' => 'Secure checkout', 'body' => 'Checkout will use a verified payment provider once configured.'],
                        ['title' => 'Customer support', 'body' => 'Reach us by phone during published business hours.'],
                    ],
                ],
                'sort_order' => 20,
            ],
            [
                'key' => 'categories',
                'title' => 'Shop by category',
                'subtitle' => 'Categories appear here once published in the admin catalogue.',
                'payload' => [],
                'sort_order' => 30,
            ],
            [
                'key' => 'featured_products',
                'title' => 'Featured products',
                'subtitle' => 'Featured products will appear when an administrator selects them.',
                'payload' => [],
                'sort_order' => 40,
            ],
            [
                'key' => 'consult',
                'title' => 'Consult a qualified practitioner',
                'subtitle' => 'Find published practitioner profiles and request a consultation when availability is configured.',
                'payload' => [
                    'cta_label' => 'Find a Doctor',
                    'cta_href' => '/doctors',
                    'media_asset_id' => null,
                ],
                'sort_order' => 50,
            ],
            [
                'key' => 'health_library',
                'title' => 'Health Library',
                'subtitle' => 'Educational articles will appear here after editorial review and publication.',
                'payload' => [],
                'sort_order' => 60,
            ],
        ];

        foreach ($sections as $section) {
            HomepageSection::query()->updateOrCreate(
                ['key' => $section['key']],
                [
                    ...$section,
                    'is_enabled' => true,
                    'status' => 'published',
                    'published_at' => $now,
                ]
            );
        }
    }
}
