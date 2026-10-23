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
                'title' => 'NATURAL. SAFE. EFFECTIVE.',
                'subtitle' => 'Your Everyday Homeopathy Essentials, Made Easier.',
                'payload' => [
                    'primary_cta_label' => 'Shop Medicines',
                    'primary_cta_href' => '/shop',
                    'secondary_cta_label' => 'Consult a Doctor',
                    'secondary_cta_href' => '/doctors',
                    'image_alt' => 'Homeopathy doctor and medicines',
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
                        ['title' => '100% Genuine Products', 'body' => 'Authentic branded homeopathic medicines.'],
                        ['title' => 'Fast & Secure Delivery', 'body' => 'Careful packing and tracked dispatch.'],
                        ['title' => 'Expert Homeopathic Doctors', 'body' => 'Verified practitioners for online consults.'],
                        ['title' => 'Secure Payments', 'body' => 'Protected checkout when payments are enabled.'],
                        ['title' => 'Easy Returns', 'body' => 'Clear return guidance on eligible orders.'],
                    ],
                ],
                'sort_order' => 20,
            ],
            [
                'key' => 'categories',
                'title' => 'Shop by Health Concern',
                'subtitle' => 'Browse remedies by the concern you care about most.',
                'payload' => [],
                'sort_order' => 30,
            ],
            [
                'key' => 'featured_products',
                'title' => 'Popular Homeopathic Medicines',
                'subtitle' => 'Everyday essentials from trusted brands.',
                'payload' => [],
                'sort_order' => 40,
            ],
            [
                'key' => 'consult',
                'title' => 'Consult Certified Doctors',
                'subtitle' => 'Personalised advice with online Google Meet sessions scheduled by our team.',
                'payload' => [
                    'cta_label' => 'Browse Doctors',
                    'cta_href' => '/doctors',
                    'media_asset_id' => null,
                ],
                'sort_order' => 50,
            ],
            [
                'key' => 'health_library',
                'title' => 'Health Library',
                'subtitle' => 'Guides and educational reading from our team.',
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
