<?php

namespace Database\Seeders;

use App\Models\PolicyPage;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class PolicyPageSeeder extends Seeder
{
    public function run(): void
    {
        $pages = [
            'privacy' => 'Privacy Policy',
            'terms' => 'Terms and Conditions',
            'shipping' => 'Shipping Policy',
            'returns' => 'Returns and Refunds',
            'cancellation' => 'Cancellation Policy',
            'consultation' => 'Consultation Terms',
            'medical-disclaimer' => 'Medical Disclaimer',
            'faq' => 'Frequently Asked Questions',
        ];

        foreach ($pages as $key => $title) {
            PolicyPage::query()->updateOrCreate(
                ['key' => $key],
                [
                    'title' => $title,
                    'slug' => Str::slug($title),
                    'body' => "Draft placeholder for {$title}.\n\nThis text is a template for legal review and is not legal advice. It will remain unpublished until an administrator reviews and publishes it.",
                    'status' => 'draft',
                    'seo_title' => $title,
                    'seo_description' => "Draft {$title} for HOMEOPATHY PHARMA.",
                ]
            );
        }
    }
}
