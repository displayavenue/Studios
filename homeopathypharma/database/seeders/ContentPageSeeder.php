<?php

namespace Database\Seeders;

use App\Models\ContentPage;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class ContentPageSeeder extends Seeder
{
    public function run(): void
    {
        $now = Carbon::now();

        $pages = [
            [
                'slug' => 'about',
                'title' => 'About',
                'seo_title' => 'About Homeopathy Pharma',
                'seo_description' => 'Learn about Homeopathy Pharma — natural, safe homeopathic medicines and online doctor consults.',
                'body' => <<<'HTML'
<p>Homeopathy Pharma is building an online homeopathy product store and practitioner discovery platform.</p>
<p>We focus on genuine medicines, thoughtful consultations, and clear guidance for everyday wellness.</p>
<p><a href="/about/founders">Meet our founders &amp; team</a></p>
HTML,
            ],
            [
                'slug' => 'consult',
                'title' => 'Consult a doctor',
                'seo_title' => 'Consult a homeopathic doctor online',
                'seo_description' => 'Browse verified practitioner profiles and request an online consultation.',
                'body' => <<<'HTML'
<p>Browse verified practitioner profiles and request a consultation when availability is published. Outcomes are not guaranteed.</p>
<p><a class="hp-btn hp-btn--primary" href="/doctors">Find a Doctor</a></p>
HTML,
            ],
            [
                'slug' => 'contact',
                'title' => 'Contact us',
                'seo_title' => 'Contact Homeopathy Pharma',
                'seo_description' => 'Reach Homeopathy Pharma for product or consult enquiries.',
                'body' => <<<'HTML'
<p>Share your enquiry and our team will get back to you. This is not emergency care.</p>
HTML,
            ],
            [
                'slug' => 'founders',
                'title' => 'Founders & team',
                'seo_title' => 'Founders & team — Homeopathy Pharma',
                'seo_description' => 'Meet the people behind Homeopathy Pharma.',
                'body' => <<<'HTML'
<p>The people building Homeopathy Pharma — bringing homeopathy to more homes with care and clarity.</p>
HTML,
            ],
        ];

        foreach ($pages as $page) {
            ContentPage::query()->updateOrCreate(
                ['slug' => $page['slug']],
                [
                    ...$page,
                    'status' => 'published',
                    'published_at' => $now,
                ]
            );
        }
    }
}
