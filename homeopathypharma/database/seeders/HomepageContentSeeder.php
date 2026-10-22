<?php

namespace Database\Seeders;

use App\Models\Article;
use App\Models\DoctorProfile;
use App\Models\SiteSetting;
use App\Models\TeamMember;
use App\Models\Testimonial;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class HomepageContentSeeder extends Seeder
{
    public function run(): void
    {
        SiteSetting::query()->updateOrCreate(
            ['key' => 'consultation_fee_paise'],
            ['group' => 'commerce', 'value' => '99900', 'type' => 'string']
        );
        SiteSetting::query()->updateOrCreate(
            ['key' => 'facebook_url'],
            ['group' => 'social', 'value' => '', 'type' => 'string']
        );
        SiteSetting::query()->updateOrCreate(
            ['key' => 'instagram_url'],
            ['group' => 'social', 'value' => '', 'type' => 'string']
        );
        SiteSetting::forgetCache();

        $this->seedDoctors();
        $this->seedFounders();
        $this->seedTestimonials();
        $this->seedCaseStudies();
        $this->seedBlogPosts();
    }

    private function seedDoctors(): void
    {
        $doctors = [
            [
                'full_name' => 'Dr. Kavita Deshmukh',
                'slug' => 'dr-kavita-deshmukh',
                'designation' => 'BHMS',
                'registration_number' => null,
                'expertise_summary' => 'Women’s health, thyroid support, and lifestyle-related complaints',
                'specializations' => ['Women\'s Health', 'Thyroid support', 'General Homeopathy'],
                'languages' => ['English', 'Hindi', 'Marathi'],
                'years_experience' => 8,
                'city' => 'Mumbai',
                'locality' => 'Mira Road East',
                'homepage_sort_order' => 1,
                'bio' => "Online consultations are held on Google Meet. After you book a ₹999 session, our team confirms a convenient slot and sends the Meet link.\n\nUpdate registration number and photo in Admin → Doctors.",
            ],
            [
                'full_name' => 'Dr. Rohan Patil',
                'slug' => 'dr-rohan-patil',
                'designation' => 'BHMS',
                'registration_number' => null,
                'expertise_summary' => 'Respiratory wellness, allergies, and long-standing chronic patterns',
                'specializations' => ['Respiratory Health', 'Allergies', 'Chronic care'],
                'languages' => ['English', 'Hindi', 'Marathi'],
                'years_experience' => 10,
                'city' => 'Mumbai',
                'locality' => 'Mira Road East',
                'homepage_sort_order' => 2,
                'bio' => "Sessions are scheduled by our coordination team and conducted on Google Meet. Fee: ₹999 per consultation session.\n\nAdd council registration and clinic photo from the admin panel.",
            ],
            [
                'full_name' => 'Dr. Meera Joshi',
                'slug' => 'dr-meera-joshi',
                'designation' => 'BHMS',
                'registration_number' => null,
                'expertise_summary' => 'Child & family care, digestion, and everyday wellness guidance',
                'specializations' => ['Pediatric support', 'Digestive Health', 'Family care'],
                'languages' => ['English', 'Hindi', 'Marathi'],
                'years_experience' => 7,
                'city' => 'Mumbai',
                'locality' => 'Mira Road East',
                'homepage_sort_order' => 3,
                'bio' => "Book a ₹999 session and our team will schedule your Google Meet call with the doctor.\n\nReplace name/photo/registration with your verified practitioner details in Admin whenever needed.",
            ],
        ];

        foreach ($doctors as $row) {
            DoctorProfile::query()->updateOrCreate(
                ['slug' => $row['slug']],
                [
                    ...$row,
                    'consultation_modes' => ['online'],
                    'fee_paise' => 99900,
                    'verification_status' => 'verified',
                    'verified_at' => now(),
                    'status' => 'published',
                    'published_at' => now(),
                    'show_on_homepage' => true,
                    'team_schedules_meet' => true,
                ]
            );
        }
    }

    private function seedFounders(): void
    {
        $members = [
            [
                'name' => 'Founder (update name in Admin)',
                'slug' => 'founder',
                'designation' => 'Founder',
                'role_key' => 'founder',
                'sort_order' => 1,
                'biography' => 'Add founder biography, photo, and qualifications from Admin → Founders & Team.',
            ],
            [
                'name' => 'Co-founder (update name in Admin)',
                'slug' => 'co-founder',
                'designation' => 'Co-founder',
                'role_key' => 'co_founder',
                'sort_order' => 2,
                'biography' => 'Add co-founder biography, photo, and qualifications from Admin → Founders & Team.',
            ],
        ];

        foreach ($members as $row) {
            TeamMember::query()->updateOrCreate(
                ['slug' => $row['slug']],
                [
                    ...$row,
                    'status' => 'published',
                    'published_at' => now(),
                    'show_on_homepage' => true,
                ]
            );
        }
    }

    private function seedTestimonials(): void
    {
        $items = [
            [
                'author_name' => 'Ananya S.',
                'author_role' => 'Mira Road',
                'quote' => 'Booking was simple and the team confirmed my Google Meet slot quickly. Clear guidance and a calm consultation experience.',
                'sort_order' => 1,
            ],
            [
                'author_name' => 'Rahul M.',
                'author_role' => 'Mumbai',
                'quote' => 'I appreciated that someone from the team coordinated the doctor call. The session felt organised and easy to follow.',
                'sort_order' => 2,
            ],
            [
                'author_name' => 'Priya K.',
                'author_role' => 'Parent',
                'quote' => 'Helpful explanations and practical next steps. Editing these quotes anytime from the admin panel keeps them accurate.',
                'sort_order' => 3,
            ],
        ];

        foreach ($items as $item) {
            Testimonial::query()->updateOrCreate(
                ['author_name' => $item['author_name'], 'quote' => $item['quote']],
                [
                    ...$item,
                    'rating' => 5,
                    'show_on_homepage' => true,
                    'status' => 'published',
                    'published_at' => now(),
                ]
            );
        }
    }

    private function seedCaseStudies(): void
    {
        // Educational problem → homeopathy approach briefs (not individual patient claims).
        $studies = [
            ['Allergic rhinitis & seasonal sneezing', 'Allergies', 'Repeated sneezing, watery eyes, and nasal blockage often worsen with weather or dust. A homeopath studies triggers, timing, and accompanying symptoms to select an individualised remedy and lifestyle supports—never a one-size-fits-all “allergy pill”.'],
            ['Migraine-type headaches', 'Headache', 'Migraines may link to stress, sleep, hormones, or food triggers. Case-taking maps modalities (better/worse) so remedy choice matches the person, alongside sleep and trigger hygiene.'],
            ['Acid reflux & dyspepsia patterns', 'Digestion', 'Burning, bloating, and post-meal heaviness are common. Homeopathy explores appetite, craving/aversion, and emotional context while advising meal timing and trigger foods.'],
            ['Irritable bowel–type discomfort', 'Digestion', 'Alternating stools, urgency, or cramps need careful history. Remedies are chosen for the full symptom picture; hydration and meal regularity remain foundational.'],
            ['Childhood colds & recurrent coryza', 'Children', 'Frequent colds in children are assessed with energy, appetite, and recovery pattern. Gentle individualised prescribing aims to support resilience—not suppress every sniffle.'],
            ['Eczema & dry itchy skin flares', 'Skin', 'Itching, dryness, and discharge character guide remedy selection. Skin care basics (moisturise, avoid harsh soaps) work alongside constitutional care.'],
            ['Acne with hormonal timing', 'Skin', 'Breakouts tied to cycle, diet, or stress are mapped in detail. Homeopathy individualises; skincare and sleep remain part of the plan.'],
            ['Hair fall with stress or postpartum change', 'Hair', 'Shedding after illness, stress, or childbirth needs timeline clarity. Remedies address the person’s state; nutrition and gentle hair care support recovery.'],
            ['Insomnia & unrefreshing sleep', 'Sleep', 'Difficulty falling asleep, frequent waking, or early rising each suggest different pictures. Sleep hygiene plus matching remedies is the usual approach.'],
            ['Anxiety with restlessness', 'Mind & stress', 'Worries, pacing, or anticipatory fear are described in the patient’s words. Care is supportive and complementary—not a replacement for crisis or psychiatric care when needed.'],
            ['Joint stiffness & weather sensitivity', 'Joints', 'Aching knees or fingers worse in damp weather are classic modalities. Motion, warmth, and remedy choice are tailored to the case.'],
            ['Low back strain from desk work', 'Musculoskeletal', 'Posture, sitting hours, and worse/better factors matter. Homeopathy can support recovery while ergonomics and movement remain essential.'],
            ['PCOS-related cycle irregularity (supportive)', 'Women\'s health', 'Irregular cycles, acne, or metabolic concerns need medical evaluation first. Homeopathy may support wellbeing as an adjunct under practitioner guidance.'],
            ['Painful periods (dysmenorrhoea)', 'Women\'s health', 'Cramping character, timing, and accompanying symptoms guide remedy choice. Heat, rest, and medical red-flag checks are discussed in consult.'],
            ['Menopausal hot flushes (supportive)', 'Women\'s health', 'Flushes, sleep change, and mood shifts form a full case. Care complements—not replaces—gynaecology advice when indicated.'],
            ['Thyroid-related fatigue (adjunct care)', 'Metabolic', 'Fatigue with thyroid history requires lab monitoring by a physician. Homeopathy may address vitality and accompanying symptoms as adjunct care.'],
            ['Urinary urgency patterns', 'Urinary', 'Frequency, burning, or urgency need infection ruled out. Non-infectious patterns may be considered constitutionally after proper medical screening.'],
            ['Sinus congestion & post-nasal drip', 'Respiratory', 'Pressure, discharge colour/character, and weather links inform prescribing. Steam, hydration, and trigger avoidance help alongside.'],
            ['Asthma-prone wheeze (adjunct only)', 'Respiratory', 'Wheeze and breathlessness need emergency and pulmonology pathways first. Homeopathy is only adjunctive under qualified supervision—never for acute attacks alone.'],
            ['Exam stress & concentration dips', 'Students', 'Anticipatory anxiety, memory blanks, or sleep loss before exams are common. Short-term supportive prescribing plus study/rest balance is discussed in session.'],
        ];

        foreach ($studies as $i => [$title, $topic, $body]) {
            $slug = Str::slug('case-'.$title);
            Article::query()->updateOrCreate(
                ['slug' => $slug],
                [
                    'title' => $title,
                    'content_type' => 'case_study',
                    'excerpt' => $topic.' — educational overview of how a homeopath may approach this pattern.',
                    'body' => $body."\n\nDisclaimer: Educational information only. Not a diagnosis or personal medical advice. For personal care, book a consultation or call +91 8169 122333.",
                    'author_name' => 'HOMEOPATHY PHARMA Health Library',
                    'is_featured' => $i < 3,
                    'show_on_homepage' => true,
                    'status' => 'published',
                    'published_at' => now()->subDays(20 - $i),
                    'seo_title' => $title.' | Homeopathy approach',
                    'seo_description' => Str::limit($body, 150),
                ]
            );
        }
    }

    private function seedBlogPosts(): void
    {
        $posts = [
            [
                'title' => 'What to expect in an online homeopathy consult',
                'slug' => 'what-to-expect-online-consult',
                'excerpt' => 'How our ₹999 Google Meet sessions are scheduled by the team.',
                'body' => "After you request a session, our coordination team confirms timing and shares a Google Meet link. Bring your symptom timeline, current medicines, and questions.\n\nFee: ₹999 per session.",
            ],
            [
                'title' => 'How homeopaths take a case',
                'slug' => 'how-homeopaths-take-a-case',
                'excerpt' => 'Why details like weather, sleep, and cravings matter.',
                'body' => "A homeopathy case includes more than the main complaint. Modalities (what makes symptoms better or worse), thirst, sleep, and emotional context help match a remedy to the person.",
            ],
            [
                'title' => 'When to seek urgent medical care',
                'slug' => 'when-to-seek-urgent-care',
                'excerpt' => 'Homeopathy complements—not replaces—emergency medicine.',
                'body' => "Chest pain, severe breathlessness, high fever in infants, sudden weakness, or uncontrolled bleeding need emergency services immediately. Online consults are for non-emergency guidance.",
            ],
        ];

        foreach ($posts as $i => $post) {
            Article::query()->updateOrCreate(
                ['slug' => $post['slug']],
                [
                    ...$post,
                    'content_type' => 'blog',
                    'is_featured' => true,
                    'show_on_homepage' => true,
                    'status' => 'published',
                    'published_at' => now()->subDays(3 - $i),
                    'author_name' => 'HOMEOPATHY PHARMA',
                ]
            );
        }
    }
}
