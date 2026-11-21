<?php

namespace Database\Seeders;

use App\Models\MythVsFact;
use Illuminate\Database\Seeder;

class MythVsFactSeeder extends Seeder
{
    public function run(): void
    {
        $items = [
            [
                'myth_title' => 'Rain or AC instantly “gives you a cold.”',
                'fact_title' => 'Viruses cause colds.',
                'fact_body' => 'Cool weather and crowded indoor spaces help those viruses spread more easily—chilly air itself is not the infection.',
            ],
            [
                'myth_title' => 'A migraine is just a very bad headache.',
                'fact_title' => 'Migraine is neurological.',
                'fact_body' => 'Nausea, light or sound sensitivity, aura, or fatigue can appear—not only head pain.',
            ],
            [
                'myth_title' => 'Fever must be forced down immediately.',
                'fact_title' => 'Mild fever can be protective.',
                'fact_body' => 'Comfort, fluids, and clinical judgment matter more than chasing a perfect number on the thermometer.',
            ],
            [
                'myth_title' => 'Cracking knuckles causes arthritis.',
                'fact_title' => 'The pop is usually gas.',
                'fact_body' => 'It does not wear cartilage the way genuine inflammatory arthritis does.',
            ],
            [
                'myth_title' => 'Sugar makes every child hyperactive.',
                'fact_title' => 'Evidence does not show a reliable “sugar rush.”',
                'fact_body' => 'Sleep, excitement, and screen time often explain restless behaviour better than sugar alone.',
            ],
            [
                'myth_title' => 'You lose most body heat through your head.',
                'fact_title' => 'Any uncovered skin loses heat.',
                'fact_body' => 'Your head matters mainly when it is the one area left bare in cold weather.',
            ],
            [
                'myth_title' => 'Spicy food creates stomach ulcers.',
                'fact_title' => 'Most ulcers have other drivers.',
                'fact_body' => 'H. pylori infection or certain painkillers are usual culprits; spice may irritate symptoms without creating the ulcer.',
            ],
            [
                'myth_title' => 'Green mucus always needs antibiotics.',
                'fact_title' => 'Colour often reflects immune cells.',
                'fact_body' => 'Many sinus and chest infections are viral and settle without antibacterial drugs.',
            ],
            [
                'myth_title' => 'Acne means you are not washing enough.',
                'fact_title' => 'Acne is more than cleanliness.',
                'fact_body' => 'Oil glands, hormones, bacteria, and inflammation drive it; over-scrubbing can worsen redness.',
            ],
            [
                'myth_title' => 'Asthma is only a childhood problem.',
                'fact_title' => 'Asthma can start or continue later.',
                'fact_body' => 'Triggers and severity change over a lifetime, so ongoing review still matters for adults too.',
            ],
            [
                'myth_title' => 'Joint pain is just ageing.',
                'fact_title' => 'Age is only one factor.',
                'fact_body' => 'Weight, movement, injury history, and inflammation also shape joints—and many of those are modifiable.',
            ],
            [
                'myth_title' => 'Detox juices flush toxins better than your organs.',
                'fact_title' => 'Your liver and kidneys already clear waste.',
                'fact_body' => 'Extreme cleanses can dehydrate you or disrupt electrolytes without proven detox magic.',
            ],
            [
                'myth_title' => 'Reading in dim light ruins eyesight forever.',
                'fact_title' => 'It can strain, not rewrite your prescription.',
                'fact_body' => 'Regular breaks and good lighting keep reading comfortable without permanently changing vision.',
            ],
            [
                'myth_title' => 'Everyone needs exactly eight glasses of water.',
                'fact_title' => 'Fluid needs vary.',
                'fact_body' => 'Climate, activity, thirst, urine colour, and medical advice are better guides than a fixed glass count.',
            ],
            [
                'myth_title' => 'Stress alone digs a stomach ulcer.',
                'fact_title' => 'Stress can intensify symptoms.',
                'fact_body' => 'The usual ulcer culprits remain infection and medicines—not worry by itself.',
            ],
            [
                'myth_title' => '“Natural” means automatically safe.',
                'fact_title' => 'Not necessarily.',
                'fact_body' => 'Remedies can still interact with medicines, allergies, pregnancy, or chronic illness—individual assessment matters.',
            ],
            [
                'myth_title' => 'You can catch eczema from someone else’s rash.',
                'fact_title' => 'Eczema is not contagious.',
                'fact_body' => 'It is an inflammatory skin pattern shaped by barrier function, genetics, and triggers.',
            ],
            [
                'myth_title' => 'Skipping breakfast wrecks metabolism forever.',
                'fact_title' => 'Preferences differ.',
                'fact_body' => 'Overall diet quality, protein, fibre, and energy balance matter more than a rigid breakfast rule.',
            ],
            [
                'myth_title' => 'Back pain always means a slipped disc needing a scan.',
                'fact_title' => 'Most acute back pain settles with guidance.',
                'fact_body' => 'Scans are for red-flag symptoms or when results will change care.',
            ],
            [
                'myth_title' => 'Multivitamins prevent nearly every disease.',
                'fact_title' => 'Supplements help proven deficiencies.',
                'fact_body' => 'For most people, food patterns, sleep, and movement outweigh a catch-all vitamin.',
            ],
            [
                'myth_title' => 'Thyroid problems only hit middle-aged women.',
                'fact_title' => 'Anyone can be affected.',
                'fact_body' => 'Men, teens, and older adults can have thyroid disorders; symptoms deserve proper checks.',
            ],
            [
                'myth_title' => 'Homeopathy is just another name for herbal medicine.',
                'fact_title' => 'Homeopathy and herbal medicine are different systems.',
                'fact_body' => 'Homeopathic preparations follow specific dilution and shaking processes, whereas herbal medicines use plant-based ingredients.',
            ],
            [
                'myth_title' => 'Feeling better means you can stop long-term medicines alone.',
                'fact_title' => 'Feeling better can mean treatment is working.',
                'fact_body' => 'Dose changes belong in a clinician’s plan to avoid rebound or relapse.',
            ],
            [
                'myth_title' => 'Allergy and intolerance are the same thing.',
                'fact_title' => 'They follow different pathways.',
                'fact_body' => 'True allergy involves the immune system; intolerance is usually digestive or dose-related discomfort.',
            ],
        ];

        foreach ($items as $index => $item) {
            MythVsFact::query()->updateOrCreate(
                ['myth_title' => $item['myth_title']],
                [
                    'fact_title' => $item['fact_title'],
                    'fact_body' => $item['fact_body'],
                    'sort_order' => $index + 1,
                    'status' => 'published',
                    'published_at' => now(),
                ]
            );
        }
    }
}
