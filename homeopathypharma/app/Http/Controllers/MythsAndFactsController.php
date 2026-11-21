<?php

namespace App\Http\Controllers;

use App\Services\SiteSettings;
use Illuminate\View\View;

class MythsAndFactsController extends Controller
{
    public function __invoke(SiteSettings $settings): View
    {
        return view('pages.myths-and-facts', [
            'settings' => $settings,
            'items' => $this->items(),
        ]);
    }

    /**
     * @return list<array{myth: string, myth_note: string, fact: string, fact_note: string}>
     */
    private function items(): array
    {
        return [
            [
                'myth' => 'Rain or AC instantly “gives you a cold.”',
                'myth_note' => 'A common belief about catching colds from chilly air.',
                'fact' => 'Viruses cause colds.',
                'fact_note' => 'Cool weather and crowded indoor spaces help those viruses spread more easily.',
            ],
            [
                'myth' => 'A migraine is just a very bad headache.',
                'myth_note' => 'People often treat migraine as ordinary pain that got worse.',
                'fact' => 'Migraine is neurological.',
                'fact_note' => 'Nausea, light or sound sensitivity, aura, or fatigue can appear—not only head pain.',
            ],
            [
                'myth' => 'Fever must be forced down immediately.',
                'myth_note' => 'Many people panic at the first rise on the thermometer.',
                'fact' => 'Mild fever can be protective.',
                'fact_note' => 'Comfort, fluids, and clinical judgment matter more than chasing a perfect number.',
            ],
            [
                'myth' => 'Cracking knuckles causes arthritis.',
                'myth_note' => 'A long-standing warning passed down in families.',
                'fact' => 'The pop is usually gas.',
                'fact_note' => 'It does not wear cartilage the way genuine inflammatory arthritis does.',
            ],
            [
                'myth' => 'Sugar makes every child hyperactive.',
                'myth_note' => 'Birthday parties get blamed on the cake alone.',
                'fact' => 'Evidence does not show a reliable “sugar rush.”',
                'fact_note' => 'Sleep, excitement, and screen time often explain restless behaviour better.',
            ],
            [
                'myth' => 'You lose most body heat through your head.',
                'myth_note' => 'A winter myth that makes hats sound uniquely magical.',
                'fact' => 'Any uncovered skin loses heat.',
                'fact_note' => 'Your head matters mainly when it is the one area left bare.',
            ],
            [
                'myth' => 'Spicy food creates stomach ulcers.',
                'myth_note' => 'Chilli gets blamed for burning a hole in the stomach.',
                'fact' => 'Most ulcers have other drivers.',
                'fact_note' => 'H. pylori infection or certain painkillers are usual culprits; spice may irritate symptoms.',
            ],
            [
                'myth' => 'Green mucus always needs antibiotics.',
                'myth_note' => 'Colour is treated like a prescription signal.',
                'fact' => 'Colour often reflects immune cells.',
                'fact_note' => 'Many sinus and chest infections are viral and settle without antibacterial drugs.',
            ],
            [
                'myth' => 'Acne means you are not washing enough.',
                'myth_note' => 'Dirty-skin blame is still common.',
                'fact' => 'Acne is more than cleanliness.',
                'fact_note' => 'Oil glands, hormones, bacteria, and inflammation drive it; over-scrubbing can worsen redness.',
            ],
            [
                'myth' => 'Asthma is only a childhood problem.',
                'myth_note' => 'Adults are told they should have “outgrown” it.',
                'fact' => 'Asthma can start or continue later.',
                'fact_note' => 'Triggers and severity change over a lifetime, so ongoing review still matters.',
            ],
            [
                'myth' => 'Joint pain is just ageing.',
                'myth_note' => 'Many people accept discomfort as inevitable.',
                'fact' => 'Age is only one factor.',
                'fact_note' => 'Weight, movement, injury history, and inflammation also shape joints—and many are modifiable.',
            ],
            [
                'myth' => 'Detox juices flush toxins better than your organs.',
                'myth_note' => 'Cleanse marketing promises a reset bottle.',
                'fact' => 'Your liver and kidneys already clear waste.',
                'fact_note' => 'Extreme cleanses can dehydrate you or disrupt electrolytes without proven detox magic.',
            ],
            [
                'myth' => 'Reading in dim light ruins eyesight forever.',
                'myth_note' => 'Parents still warn that low light “damages” eyes permanently.',
                'fact' => 'It can strain, not rewrite your prescription.',
                'fact_note' => 'Regular breaks and good lighting keep reading comfortable.',
            ],
            [
                'myth' => 'Everyone needs exactly eight glasses of water.',
                'myth_note' => 'A fixed daily glass count is treated as a rule.',
                'fact' => 'Fluid needs vary.',
                'fact_note' => 'Climate, activity, thirst, urine colour, and medical advice are better guides.',
            ],
            [
                'myth' => 'Stress alone digs a stomach ulcer.',
                'myth_note' => 'Worry is blamed as the only cause of ulcers.',
                'fact' => 'Stress can intensify symptoms.',
                'fact_note' => 'The usual ulcer culprits remain infection and medicines—not worry by itself.',
            ],
            [
                'myth' => '“Natural” means automatically safe.',
                'myth_note' => 'A common belief about homeopathic and herbal products.',
                'fact' => 'Not necessarily.',
                'fact_note' => 'Remedies can still interact with medicines, allergies, pregnancy, or chronic illness.',
            ],
            [
                'myth' => 'You can catch eczema from someone else’s rash.',
                'myth_note' => 'People avoid contact as if eczema were contagious.',
                'fact' => 'Eczema is not contagious.',
                'fact_note' => 'It is an inflammatory skin pattern shaped by barrier function, genetics, and triggers.',
            ],
            [
                'myth' => 'Skipping breakfast wrecks metabolism forever.',
                'myth_note' => 'Meal timing gets treated as permanent damage.',
                'fact' => 'Preferences differ.',
                'fact_note' => 'Overall diet quality, protein, fibre, and energy balance matter more than a rigid breakfast rule.',
            ],
            [
                'myth' => 'Back pain always means a slipped disc needing a scan.',
                'myth_note' => 'Imaging is requested at the first twinge.',
                'fact' => 'Most acute back pain settles with guidance.',
                'fact_note' => 'Scans are for red-flag symptoms or when results will change care.',
            ],
            [
                'myth' => 'Multivitamins prevent nearly every disease.',
                'myth_note' => 'A daily mega-pill is sold as full protection.',
                'fact' => 'Supplements help proven deficiencies.',
                'fact_note' => 'For most people, food patterns, sleep, and movement outweigh a catch-all vitamin.',
            ],
            [
                'myth' => 'Thyroid problems only hit middle-aged women.',
                'myth_note' => 'A stereotype that delays testing for others.',
                'fact' => 'Anyone can be affected.',
                'fact_note' => 'Men, teens, and older adults can have thyroid disorders; symptoms deserve proper checks.',
            ],
            [
                'myth' => 'One homeopathy remedy fits every disease name.',
                'myth_note' => 'People expect the same bottle for the same label.',
                'fact' => 'Care looks at the whole person.',
                'fact_note' => 'Two people with the same condition name may need different approaches.',
            ],
            [
                'myth' => 'Feeling better means you can stop long-term medicines alone.',
                'myth_note' => 'Improvement is mistaken for a green light to quit.',
                'fact' => 'Feeling better can mean treatment is working.',
                'fact_note' => 'Dose changes belong in a clinician’s plan to avoid rebound or relapse.',
            ],
            [
                'myth' => 'Allergy and intolerance are the same thing.',
                'myth_note' => 'The words get used interchangeably in daily talk.',
                'fact' => 'They follow different pathways.',
                'fact_note' => 'True allergy involves the immune system; intolerance is usually digestive or dose-related discomfort.',
            ],
        ];
    }
}
