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
     * @return list<array{myth: string, fact: string}>
     */
    private function items(): array
    {
        return [
            [
                'myth' => 'Getting caught in the rain or sitting in AC instantly “gives you a cold.”',
                'fact' => 'Colds come from viruses, not chilly air. Cool weather and crowded indoor spaces just help those viruses spread more easily.',
            ],
            [
                'myth' => 'A migraine is simply a very bad headache.',
                'fact' => 'Migraine is a neurological condition. Many people also get nausea, light or sound sensitivity, aura, or fatigue—not only head pain.',
            ],
            [
                'myth' => 'Fever must always be forced down as soon as the thermometer rises.',
                'fact' => 'Mild fever is often part of the body’s defence. Comfort, fluids, and clinical judgment matter more than chasing a perfect number.',
            ],
            [
                'myth' => 'Cracking your knuckles causes arthritis.',
                'fact' => 'The pop is usually gas shifting in the joint fluid. It does not wear cartilage the way genuine inflammatory arthritis does.',
            ],
            [
                'myth' => 'Sugar makes every child hyperactive.',
                'fact' => 'Large studies do not show a reliable “sugar rush” effect. Sleep, excitement, and screen time often explain restless behaviour better.',
            ],
            [
                'myth' => 'You lose most of your body heat through your head.',
                'fact' => 'Heat escapes from any uncovered skin. Your head is only special if it is the one area left bare in cold weather.',
            ],
            [
                'myth' => 'Spicy food creates stomach ulcers.',
                'fact' => 'Most ulcers are linked to H. pylori infection or certain painkillers. Spice may irritate symptoms, but it is rarely the root cause.',
            ],
            [
                'myth' => 'Green or yellow mucus always means you need antibiotics.',
                'fact' => 'Colour mainly reflects immune cells at work. Many sinus and chest infections are viral and settle without antibacterial drugs.',
            ],
            [
                'myth' => 'Acne means you are not washing your face enough.',
                'fact' => 'Acne involves oil glands, hormones, bacteria, and inflammation. Over-scrubbing can worsen redness without treating the drivers.',
            ],
            [
                'myth' => 'Asthma is only a childhood problem that people outgrow.',
                'fact' => 'Asthma can begin or continue in adulthood. Triggers and severity change over a lifetime, so ongoing review still matters.',
            ],
            [
                'myth' => 'Joint pain is just an inevitable part of getting old.',
                'fact' => 'Age raises risk, but weight, movement, injury history, and inflammatory conditions also shape joint health—and many of those are modifiable.',
            ],
            [
                'myth' => 'Detox juices “flush toxins” better than your own organs.',
                'fact' => 'Your liver and kidneys already clear waste. Extreme cleanses can dehydrate you or disrupt electrolytes without proven detox magic.',
            ],
            [
                'myth' => 'Reading in dim light permanently ruins eyesight.',
                'fact' => 'Low light can strain eyes for a while, but it does not rewrite your prescription. Regular breaks and good lighting keep reading comfortable.',
            ],
            [
                'myth' => 'Everyone must drink exactly eight glasses of water a day.',
                'fact' => 'Fluid needs vary with climate, activity, and health. Thirst, urine colour, and medical advice are better guides than a fixed glass count.',
            ],
            [
                'myth' => 'Stress alone digs a hole in your stomach lining.',
                'fact' => 'Stress can intensify acid symptoms, yet the usual ulcer culprits remain infection and medicines—not worry by itself.',
            ],
            [
                'myth' => 'If a product is “natural,” it is automatically safe for every condition.',
                'fact' => 'Plants and remedies can still interact with medicines, allergies, pregnancy, or chronic illness. Individual assessment beats marketing labels.',
            ],
            [
                'myth' => 'You can “catch” eczema from someone else’s rash.',
                'fact' => 'Eczema is not contagious. It is an inflammatory skin pattern influenced by barrier function, genetics, and triggers—not person-to-person spread.',
            ],
            [
                'myth' => 'Skipping breakfast wrecks metabolism forever.',
                'fact' => 'Meal timing preferences differ. Overall diet quality, protein, fibre, and energy balance matter more than a rigid breakfast rule.',
            ],
            [
                'myth' => 'Back pain always means a slipped disc that needs urgent imaging.',
                'fact' => 'Most acute back pain improves with time, movement, and guidance. Scans are reserved for red-flag symptoms or when they will change care.',
            ],
            [
                'myth' => 'Multivitamins prevent nearly every chronic disease.',
                'fact' => 'Supplements help when there is a proven deficiency. For most people, food patterns, sleep, and movement outweigh a daily mega-pill.',
            ],
            [
                'myth' => 'Thyroid problems only happen to middle-aged women.',
                'fact' => 'Thyroid disorders can affect men, teens, and older adults too. Fatigue, weight shifts, or mood changes deserve proper testing—not stereotypes.',
            ],
            [
                'myth' => 'Homeopathy is “one remedy for one disease name” for everyone.',
                'fact' => 'Classical homeopathic care looks at the whole person—symptoms, modalities, and constitution—so two people with the same label may receive different approaches.',
            ],
            [
                'myth' => 'If symptoms improve, you can stop long-term medicines on your own.',
                'fact' => 'Feeling better can mean treatment is working—not that the condition has vanished. Dose changes belong in a clinician’s plan to avoid rebound or relapse.',
            ],
            [
                'myth' => 'Allergy and intolerance are the same thing.',
                'fact' => 'True allergy involves the immune system and can be severe. Intolerance is usually digestive or dose-related discomfort without that same immune pathway.',
            ],
        ];
    }
}
