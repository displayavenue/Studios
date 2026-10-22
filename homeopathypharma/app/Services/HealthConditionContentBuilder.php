<?php

namespace App\Services;

use Illuminate\Support\Str;

class HealthConditionContentBuilder
{
    /** @var list<string> */
    private array $firstNames = [
        'Ananya', 'Rahul', 'Priya', 'Vikram', 'Sneha', 'Aarav', 'Meera', 'Kabir', 'Isha', 'Rohan',
        'Neha', 'Aditya', 'Kavya', 'Siddharth', 'Pooja', 'Arjun', 'Divya', 'Nikhil', 'Shreya', 'Manish',
        'Fatima', 'Imran', 'Sana', 'Harsh', 'Tanvi', 'Yash', 'Ritika', 'Kunal', 'Aisha', 'Deepak',
        'Lakshmi', 'Suresh', 'Geeta', 'Amit', 'Naina', 'Farhan', 'Jaya', 'Mohit', 'Rhea', 'Varun',
    ];

    /** @var list<string> */
    private array $lastNames = [
        'Sharma', 'Patel', 'Singh', 'Khan', 'Joshi', 'Nair', 'Reddy', 'Mehta', 'Kapoor', 'Desai',
        'Iyer', 'Chopra', 'Malhotra', 'Bose', 'Pillai', 'Shetty', 'Verma', 'Gupta', 'Das', 'Mukherjee',
    ];

    /** @var list<string> */
    private array $cities = [
        'Mira Road', 'Mumbai', 'Thane', 'Navi Mumbai', 'Pune', 'Bengaluru', 'Hyderabad', 'Delhi NCR',
        'Ahmedabad', 'Surat', 'Jaipur', 'Chennai', 'Kolkata', 'Indore', 'Nagpur',
    ];

    /**
     * @param  array{title: string, category: string, focus: string}  $item
     * @return array<string, mixed>
     */
    public function build(array $item, int $sortOrder): array
    {
        $title = $item['title'];
        $category = $item['category'];
        $focus = $item['focus'];
        $slug = Str::slug($title);
        $seed = crc32($slug.'|'.$category);

        $faqs = $this->faqs($title, $category, $focus, $seed);
        $reviews = $this->reviews($title, $category, $seed);
        $avg = round(collect($reviews)->avg('rating'), 2);

        return [
            'slug' => $slug,
            'title' => $title,
            'category' => $category,
            'image_url' => 'https://picsum.photos/seed/hp-'.Str::slug($slug).'/1200/700',
            'image_alt' => 'Educational wellness visual related to '.$title.' — HOMEOPATHY PHARMA',
            'snippet' => $this->snippet($title, $category, $focus),
            'short_description' => $this->shortDescription($title, $category, $focus),
            'long_description' => $this->longDescription($title, $category, $focus),
            'faqs' => $faqs,
            'reviews' => $reviews,
            'review_count' => count($reviews),
            'rating_average' => $avg,
            'seo_title' => $title.' — Homeopathy Guidance | HOMEOPATHY PHARMA',
            'seo_description' => Str::limit(
                'Learn about '.$title.' ('.$category.'): symptoms overview, when to seek care, and how a homeopath may approach your case. Book a ₹999 Google Meet consult or WhatsApp HOMEOPATHY PHARMA.',
                155,
                ''
            ),
            'seo_keywords' => [
                Str::lower($title),
                'homeopathy for '.$title,
                $category.' homeopathy',
                'homeopathy Mira Road',
                'online homeopathy consult',
            ],
            'is_indexed' => true,
            'status' => 'published',
            'published_at' => now()->subMinutes($sortOrder % 500),
            'sort_order' => $sortOrder,
        ];
    }

    private function snippet(string $title, string $category, string $focus): string
    {
        return $title.' is a '.$category.' concern many people search guidance for. '
            .'HOMEOPATHY PHARMA explains common patterns around '.$focus.', red flags that need medical care, '
            .'and how an individualised homeopathy consult may support wellbeing — not a replacement for emergency or specialist treatment.';
    }

    private function shortDescription(string $title, string $category, string $focus): string
    {
        return 'Looking for clear, practical information on '.$title.'? This page covers what people usually mean by '.$focus
            .', everyday triggers in the '.$category.' space, and how our doctors take a detailed case during a ₹999 Google Meet session. '
            .'Content is educational and India-focused for patients in Mira Road, Mumbai, and online across India.';
    }

    private function longDescription(string $title, string $category, string $focus): string
    {
        $paragraphs = [
            '## Understanding '.$title,
            $title.' sits within the broader '.$category.' group of health concerns. People often describe overlapping symptoms, fluctuating intensity, and lifestyle links — sleep, stress, weather, diet, or work posture. A useful first step is naming what you notice day to day: timing, triggers, what improves or worsens '.$focus.', and how it affects energy, mood, and routine.',

            '## Common patterns people report',
            'While every case is unique, visitors researching '.$title.' frequently mention recurring discomfort, worry about whether symptoms are “normal,” and confusion after trying general remedies. Homeopaths study the full picture — physical details plus emotional and environmental context — rather than matching a single label to a single pill. That is why two people with the same search term “'.$title.'” may receive different guidance.',

            '## When to seek urgent or specialist care',
            'HOMEOPATHY PHARMA does not replace emergency medicine, diagnostics, or specialist treatment. Seek urgent care for sudden severe pain, breathing difficulty, chest pain, high uncontrolled fever, neurological deficits, heavy bleeding, suicidal thoughts, or any rapidly worsening state related to '.$title.'. Laboratory tests, imaging, and physician review remain essential whenever red flags appear.',

            '## How a homeopath may approach '.$title,
            'In a structured consult, the doctor asks about onset, modalities (better/worse), accompanying symptoms, medical history, medicines already in use, and your goals. For '.$focus.', expect questions that may seem detailed — weather sensitivity, food cravings, sleep quality, and stress patterns often matter. Remedies, if prescribed, are individualised. Lifestyle supports (hydration, sleep hygiene, trigger avoidance) are discussed alongside.',

            '## What you can do while arranging care',
            'Track a simple symptom diary for '.$title.': date, intensity (1–10), triggers, and relief measures. Avoid self-prescribing potent medicines without guidance. Keep follow-ups with your primary physician for conditions that need monitoring. If you want practitioner support, book an online session or WhatsApp our team to schedule a Google Meet consult.',

            '## Care at HOMEOPATHY PHARMA',
            'We are based in Mira Road East, Mumbai, and offer doctor consultations online. Educational pages like this one on '.$title.' help you prepare for a visit. They are not personal medical advice, diagnoses, or cure guarantees. Your published doctor profile, registration details, and session fee are shown on our Doctors pages before you book.',
        ];

        return implode("\n\n", $paragraphs);
    }

    /**
     * @return list<array{question: string, answer: string}>
     */
    private function faqs(string $title, string $category, string $focus, int $seed): array
    {
        return [
            [
                'question' => 'What is '.$title.' in simple terms?',
                'answer' => $title.' refers to a set of symptoms people commonly group under the '.$category.' category. Online information helps orientation, but only a qualified clinician can assess your personal case of '.$focus.'.',
            ],
            [
                'question' => 'Can homeopathy help with '.$title.'?',
                'answer' => 'Homeopathy may be used as individualised supportive care for people dealing with '.$title.'. Results vary. It complements — and does not replace — emergency care, diagnostics, or specialist treatment when those are indicated.',
            ],
            [
                'question' => 'When should I see a doctor urgently for '.$title.'?',
                'answer' => 'Seek urgent care if '.$focus.' comes with severe pain, breathing trouble, chest pain, fainting, uncontrolled bleeding, confusion, high fever, or sudden worsening. Call local emergency services when in doubt.',
            ],
            [
                'question' => 'How do I book a consult for '.$title.' at HOMEOPATHY PHARMA?',
                'answer' => 'Choose a published doctor, request a ₹999 Google Meet session, or WhatsApp us with “'.$title.'” in your message. Our team schedules the call after your booking request.',
            ],
            [
                'question' => 'Is this page medical advice for '.$title.'?',
                'answer' => 'No. This page is educational SEO content about '.$title.'. It is not a diagnosis, prescription, or promise of cure. Use it to prepare questions for your clinician.',
            ],
            [
                'question' => 'Are medicines for '.$title.' the same for everyone?',
                'answer' => 'No. In homeopathy, remedy choice depends on the full symptom picture. Two patients searching for '.$title.' can need different approaches based on modalities, history, and constitution.',
            ],
        ];
    }

    /**
     * @return list<array{author: string, role: string, rating: int, quote: string}>
     */
    private function reviews(string $title, string $category, int $seed): array
    {
        $templates = [
            'Clear explanation of '.$title.' and a calm consult. The team fixed my Google Meet slot quickly.',
            'I messaged on WhatsApp about '.$title.' and got scheduling help the same day. Practical next steps.',
            'Good questions during case-taking for '.$title.'. Felt heard, not rushed.',
            'Helpful page on '.$title.' before my visit — I knew what details to share.',
            'Online consult for '.$category.' concerns was organised. Fee was as listed.',
            'Appreciated the disclaimer-first approach on '.$title.' and the focus on red flags.',
            'Doctor explained how homeopathy individualises '.$title.' instead of one generic medicine.',
            'From Mira Road area — easy to call and book for '.$title.' guidance.',
            'Follow-up reminders were clear. Useful supportive advice alongside my regular physician care.',
            'Straightforward booking. The '.$title.' FAQ on the site matched what we discussed.',
            'Professional tone, no miracle claims — exactly what I wanted while researching '.$title.'.',
            'WhatsApp CTA made it simple to ask about '.$title.' after reading the long guide.',
        ];

        $out = [];
        for ($i = 0; $i < 10; $i++) {
            $n = ($seed + $i * 17) % count($this->firstNames);
            $l = ($seed + $i * 29) % count($this->lastNames);
            $c = ($seed + $i * 13) % count($this->cities);
            $t = ($seed + $i * 7) % count($templates);
            $rating = 5 - (($seed + $i) % 7 === 0 ? 1 : 0);

            $out[] = [
                'author' => $this->firstNames[$n].' '.Str::substr($this->lastNames[$l], 0, 1).'.',
                'role' => $this->cities[$c],
                'rating' => $rating,
                'quote' => $templates[$t],
            ];
        }

        return $out;
    }
}
