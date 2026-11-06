<?php

namespace App\Support;

/**
 * Single source of truth for homepage section keys + editable fields.
 * When the storefront gains a new content section, add it here and wire Blade to $sections[$key].
 */
class HomepageSectionCatalog
{
    /**
     * @return array<string, array{
     *   label: string,
     *   title: ?string,
     *   subtitle: ?string,
     *   sort_order: int,
     *   payload: array<string, mixed>,
     *   fields: array<string, array{label: string, type: string, help?: string, rows?: int}>
     * }>
     */
    public static function definitions(): array
    {
        return [
            'hero' => [
                'label' => 'Hero banner',
                'title' => 'A More Personal Approach to Healthcare.',
                'subtitle' => 'Thoughtful consultations, quality-focused products and care centred around you.',
                'sort_order' => 10,
                'payload' => [
                    'image_path' => 'images/home/hero-personal-doctors-v3.jpg',
                    'image_alt' => 'Homeopathy Pharma — A More Personal Approach to Healthcare.',
                    'image_version' => '20261104-doctors-v3',
                    'primary_cta_label' => 'Consult a Doctor',
                    'primary_cta_href' => '/doctors',
                    'secondary_cta_label' => 'Explore Remedies',
                    'secondary_cta_href' => '/shop',
                ],
                'fields' => [
                    'media_asset_id' => ['label' => 'Hero image (from Media Library)', 'type' => 'media', 'help' => 'Upload in Media Library first, then select it here. This is what the homepage shows.'],
                    'image_path' => ['label' => 'Fallback image path (optional)', 'type' => 'text', 'help' => 'Used only if no Media Library image is selected. Example: images/home/hero.jpg'],
                    'image_alt' => ['label' => 'Image alt text', 'type' => 'text'],
                    'image_version' => ['label' => 'Cache-bust version', 'type' => 'text'],
                    'primary_cta_label' => ['label' => 'Primary CTA label', 'type' => 'text'],
                    'primary_cta_href' => ['label' => 'Primary CTA URL', 'type' => 'text'],
                    'secondary_cta_label' => ['label' => 'Secondary CTA label', 'type' => 'text'],
                    'secondary_cta_href' => ['label' => 'Secondary CTA URL', 'type' => 'text'],
                ],
            ],
            'trust' => [
                'label' => 'Trust strip (top)',
                'title' => 'Why shop with us',
                'subtitle' => null,
                'sort_order' => 20,
                'payload' => [
                    'items_text' => "100% Genuine Products|Authentic branded homeopathic medicines.\nFast & Secure Delivery|Careful packing and tracked dispatch.\nExpert Homeopathic Doctors|Verified practitioners for online consults.\nSecure Payments|Protected checkout when payments are enabled.\nEasy Returns|Clear return guidance on eligible orders.",
                ],
                'fields' => [
                    'items_text' => [
                        'label' => 'Trust items',
                        'type' => 'textarea',
                        'rows' => 8,
                        'help' => 'One per line: Title|Body',
                    ],
                ],
            ],
            'doctor_lead' => [
                'label' => 'Talk to a Doctor lead form',
                'title' => 'Talk to a Doctor, Understand Your Health Better',
                'subtitle' => 'Personalised guidance, thoughtful care.',
                'sort_order' => 25,
                'payload' => [
                    'image_path' => 'img-raw.php?f=doctor-lead-banner.jpg&v=20261106-doctor-lead-exact2',
                    'image_alt' => 'Talk to a doctor banner',
                    'media_asset_id' => null,
                    'name_placeholder' => 'Your Full Name',
                    'mobile_placeholder' => 'Mobile Number',
                    'concern_placeholder' => 'Your Health Concern',
                    'submit_label' => 'Talk to a Doctor',
                    'consent_text' => 'I agree to be contacted about this enquiry. This is not emergency care.',
                    'success_message' => 'Thank you. Our team will connect with you soon.',
                ],
                'fields' => [
                    'media_asset_id' => ['label' => 'Background art (from Media Library)', 'type' => 'media', 'help' => 'Optional. Overrides the default organic green banner.'],
                    'image_path' => ['label' => 'Fallback background path', 'type' => 'text'],
                    'name_placeholder' => ['label' => 'Name field placeholder', 'type' => 'text'],
                    'mobile_placeholder' => ['label' => 'Mobile field placeholder', 'type' => 'text'],
                    'concern_placeholder' => ['label' => 'Concern field placeholder', 'type' => 'text'],
                    'submit_label' => ['label' => 'Submit button label', 'type' => 'text'],
                    'consent_text' => ['label' => 'Consent checkbox text', 'type' => 'textarea', 'rows' => 2],
                    'success_message' => [
                        'label' => 'Success message after submit',
                        'type' => 'textarea',
                        'rows' => 2,
                        'help' => 'Shown to the user after they click Talk to a Doctor.',
                    ],
                ],
            ],
            'categories' => [
                'label' => 'Shop by Health Concern',
                'title' => 'Shop by Health Concern',
                'subtitle' => 'Browse remedies by the concern you care about most.',
                'sort_order' => 30,
                'payload' => [],
                'fields' => [],
            ],
            'brands' => [
                'label' => 'Trusted Brands',
                'title' => 'Our Trusted Brands',
                'subtitle' => 'Quality names families already know — curated in one place.',
                'sort_order' => 35,
                'payload' => [],
                'fields' => [],
            ],
            'featured_products' => [
                'label' => 'Popular Medicines',
                'title' => 'Popular Homeopathic Medicines',
                'subtitle' => 'Everyday essentials from trusted brands.',
                'sort_order' => 40,
                'payload' => [
                    'view_all_label' => 'View all',
                    'view_all_href' => '/shop',
                ],
                'fields' => [
                    'view_all_label' => ['label' => 'View-all link label', 'type' => 'text'],
                    'view_all_href' => ['label' => 'View-all link URL', 'type' => 'text'],
                ],
            ],
            'consult' => [
                'label' => 'Consult booking banner',
                'title' => 'Book a Consultation',
                'subtitle' => 'Share your details and our team will get in touch to schedule your online consultation.',
                'sort_order' => 50,
                'payload' => [
                    'image_path' => 'img-raw.php?f=consult-banner-visual-2x.jpg&v=20261105-consult-one-card',
                    'image_alt' => 'Online consultation — clipboard, stethoscope, and homeopathy checklist.',
                    'doctors_cta_label' => 'Browse Doctors',
                    'doctors_cta_href' => '/doctors',
                    'whatsapp_cta_label' => 'Chat on WhatsApp',
                    'whatsapp_prefill' => 'Hi, I want to book a doctor consult',
                    'form_title' => 'Book a Consultation',
                    'form_lead' => 'Share your details and our team will get in touch to schedule your online consultation.',
                    'submit_label' => 'Book Now',
                    'upload_title' => 'Add Medical Report or Diseased Photo',
                    'upload_hint' => 'JPG, PNG or PDF (Max 10 MB)',
                    'concerns_text' => "Head & Hair\nFace & Skin\nDigestion\nWomen's Care\nChild Care\nImmunity\nStress & Sleep\nOther",
                    'success_message' => 'Thank you. Our team will connect with you soon.',
                ],
                'fields' => [
                    'media_asset_id' => ['label' => 'Consult visual (from Media Library)', 'type' => 'media', 'help' => 'Upload in Media Library first, then select it here.'],
                    'image_path' => ['label' => 'Fallback visual path (optional)', 'type' => 'text', 'help' => 'Used only if no Media Library image is selected.'],
                    'image_alt' => ['label' => 'Visual alt text', 'type' => 'text'],
                    'doctors_cta_label' => ['label' => 'Browse Doctors label', 'type' => 'text'],
                    'doctors_cta_href' => ['label' => 'Browse Doctors URL', 'type' => 'text'],
                    'whatsapp_cta_label' => ['label' => 'WhatsApp CTA label', 'type' => 'text'],
                    'whatsapp_prefill' => ['label' => 'WhatsApp prefilled message', 'type' => 'text'],
                    'form_title' => ['label' => 'Form card title', 'type' => 'text'],
                    'form_lead' => ['label' => 'Form card lead', 'type' => 'textarea', 'rows' => 3],
                    'submit_label' => ['label' => 'Submit button label', 'type' => 'text'],
                    'upload_title' => ['label' => 'Upload title', 'type' => 'text'],
                    'upload_hint' => ['label' => 'Upload hint', 'type' => 'text'],
                    'concerns_text' => [
                        'label' => 'Concern dropdown options',
                        'type' => 'textarea',
                        'rows' => 8,
                        'help' => 'One concern per line',
                    ],
                    'success_message' => [
                        'label' => 'Success message after submit',
                        'type' => 'textarea',
                        'rows' => 2,
                    ],
                ],
            ],
            'founders' => [
                'label' => 'Founders & mission',
                'title' => 'Our Founder & Co-Founder',
                'subtitle' => 'The people behind Homeopathy Pharma.',
                'sort_order' => 55,
                'payload' => [
                    'mission_quote' => 'To bring the goodness of homeopathy to every home and help people live healthier, happier lives naturally.',
                    'mission_attribution' => 'Homeopathy Pharma',
                ],
                'fields' => [
                    'mission_quote' => ['label' => 'Mission quote', 'type' => 'textarea', 'rows' => 3],
                    'mission_attribution' => ['label' => 'Mission attribution', 'type' => 'text'],
                ],
            ],
            'deals' => [
                'label' => 'Super Saving Deals',
                'title' => 'Super Saving Deals',
                'subtitle' => 'Limited-time savings on selected medicines.',
                'sort_order' => 60,
                'payload' => [
                    'view_all_label' => 'See deals',
                    'view_all_href' => '/shop?sort=price_asc',
                ],
                'fields' => [
                    'view_all_label' => ['label' => 'View-all link label', 'type' => 'text'],
                    'view_all_href' => ['label' => 'View-all link URL', 'type' => 'text'],
                ],
            ],
            'health_library' => [
                'label' => 'Health Library',
                'title' => 'Health Library',
                'subtitle' => 'Guides and educational reading from our team.',
                'sort_order' => 70,
                'payload' => [
                    'view_all_label' => 'View all posts',
                    'view_all_href' => '/blog',
                ],
                'fields' => [
                    'view_all_label' => ['label' => 'View-all link label', 'type' => 'text'],
                    'view_all_href' => ['label' => 'View-all link URL', 'type' => 'text'],
                ],
            ],
            'testimonials' => [
                'label' => 'Testimonials',
                'title' => 'What Our Customers Say',
                'subtitle' => 'Real words from people who booked through Homeopathy Pharma.',
                'sort_order' => 80,
                'payload' => [],
                'fields' => [],
            ],
            'newsletter' => [
                'label' => 'Newsletter',
                'title' => 'Stay Updated',
                'subtitle' => 'Health tips, new arrivals, and consult reminders — no spam.',
                'sort_order' => 90,
                'payload' => [
                    'placeholder' => 'Enter your email',
                    'submit_label' => 'Subscribe',
                ],
                'fields' => [
                    'placeholder' => ['label' => 'Email placeholder', 'type' => 'text'],
                    'submit_label' => ['label' => 'Submit button label', 'type' => 'text'],
                ],
            ],
            'footer_trust' => [
                'label' => 'Footer trust labels',
                'title' => 'Footer trust strip',
                'subtitle' => null,
                'sort_order' => 100,
                'payload' => [
                    'labels_text' => "100% Genuine Products\nSecure Payments\nExpert Doctors\nEasy Returns",
                ],
                'fields' => [
                    'labels_text' => [
                        'label' => 'Labels',
                        'type' => 'textarea',
                        'rows' => 5,
                        'help' => 'One label per line',
                    ],
                ],
            ],
        ];
    }

    public static function label(string $key): string
    {
        return self::definitions()[$key]['label'] ?? $key;
    }

    /**
     * @return array<string, array{label: string, type: string, help?: string, rows?: int}>
     */
    public static function fieldsFor(string $key): array
    {
        return self::definitions()[$key]['fields'] ?? [];
    }

    /**
     * Normalize payload helpers used by Blade.
     *
     * @param  array<string, mixed>  $payload
     * @return array<string, mixed>
     */
    public static function normalizePayload(string $key, array $payload): array
    {
        $defaults = self::definitions()[$key]['payload'] ?? [];
        $merged = array_merge($defaults, $payload);

        if ($key === 'trust') {
            $merged['items'] = self::parseTitleBodyLines((string) ($merged['items_text'] ?? ''));
            if ($merged['items'] === [] && isset($payload['items']) && is_array($payload['items'])) {
                $merged['items'] = $payload['items'];
            }
        }

        if ($key === 'consult') {
            $merged['concerns'] = self::parseLines((string) ($merged['concerns_text'] ?? ''));
        }

        if ($key === 'footer_trust') {
            $merged['labels'] = self::parseLines((string) ($merged['labels_text'] ?? ''));
        }

        return $merged;
    }

    /**
     * @return list<array{title: string, body: string}>
     */
    public static function parseTitleBodyLines(string $text): array
    {
        $items = [];
        foreach (preg_split('/\r\n|\r|\n/', $text) ?: [] as $line) {
            $line = trim($line);
            if ($line === '') {
                continue;
            }
            if (str_contains($line, '|')) {
                [$title, $body] = array_map('trim', explode('|', $line, 2));
            } else {
                $title = $line;
                $body = '';
            }
            $items[] = ['title' => $title, 'body' => $body];
        }

        return $items;
    }

    /**
     * @return list<string>
     */
    public static function parseLines(string $text): array
    {
        $out = [];
        foreach (preg_split('/\r\n|\r|\n/', $text) ?: [] as $line) {
            $line = trim($line);
            if ($line !== '') {
                $out[] = $line;
            }
        }

        return $out;
    }
}
