<?php

namespace App\Services;

/**
 * Master catalogue of health problems for SEO condition pages.
 * Educational topics only — not diagnoses or cure claims.
 */
class HealthConditionCatalog
{
    /**
     * @return list<array{title: string, category: string, focus: string}>
     */
    public static function all(): array
    {
        $rows = [];
        foreach (self::grouped() as $category => $items) {
            foreach ($items as $item) {
                if (is_string($item)) {
                    $rows[] = ['title' => $item, 'category' => $category, 'focus' => $item];
                } else {
                    $rows[] = [
                        'title' => $item[0],
                        'category' => $category,
                        'focus' => $item[1] ?? $item[0],
                    ];
                }
            }
        }

        return $rows;
    }

    /**
     * @return array<string, list<string|array{0: string, 1?: string}>>
     */
    public static function grouped(): array
    {
        return [
            'General symptoms' => [
                'Fever', 'Chronic fatigue', 'Weakness', 'Unexplained weight loss', 'Unexplained weight gain',
                'Loss of appetite', 'Night sweats', 'Swollen lymph nodes', 'Dizziness', 'Oedema and swelling',
            ],
            'Infections' => [
                'Common cold', 'Influenza', 'Viral fever', 'Dengue recovery support', 'Typhoid recovery support',
                'Malaria recovery support', 'Chikungunya joint pain', 'COVID long fatigue', 'Tuberculosis supportive care',
                'Recurrent infections', 'Worm infestation', 'Herpes simplex', 'Shingles', 'Urinary tract infection',
            ],
            'Respiratory' => [
                'Allergic rhinitis', 'Sinusitis', 'Post-nasal drip', 'Asthma', 'Chronic cough', 'Bronchitis',
                'Sore throat', 'Tonsillitis', 'Laryngitis', 'Hoarseness', 'Snoring', 'Sleep apnoea concerns',
                'Nasal blockage', 'Nosebleeds', 'Chest congestion', 'Pollution-related breathing issues',
            ],
            'Heart and circulation' => [
                'High blood pressure support', 'Low blood pressure', 'Palpitations', 'High cholesterol support',
                'Varicose veins', 'Poor circulation', 'Cold hands and feet', 'Leg swelling',
            ],
            'Digestion' => [
                'Acidity and acid reflux', 'Indigestion', 'Gas and bloating', 'Nausea', 'Vomiting',
                'Diarrhoea', 'Constipation', 'Irritable bowel syndrome', 'Gastritis', 'Stomach ulcer support',
                'Food intolerance', 'Lactose intolerance discomfort', 'Mouth ulcers', 'Bad breath',
                'Piles and haemorrhoids', 'Anal fissure', 'Fatty liver support', 'Gallbladder discomfort',
                'Abdominal pain', 'Hiccups', 'Loss of taste concerns',
            ],
            'Liver and metabolism' => [
                'Jaundice recovery support', 'Metabolic syndrome support', 'Obesity', 'Sugar craving',
                'Prediabetes support', 'Diabetes supportive care', 'Gout and high uric acid',
            ],
            'Kidney and urinary' => [
                'Kidney stone discomfort', 'Burning urination', 'Urinary frequency', 'Urinary urgency',
                'Urinary incontinence', 'Nocturia', 'Chronic kidney supportive care',
            ],
            'Endocrine' => [
                'Hypothyroidism support', 'Hyperthyroidism support', 'Goitre concerns', 'Thyroid fatigue',
                'PCOS', 'Adrenal stress patterns', 'Vitamin D deficiency symptoms', 'Vitamin B12 deficiency symptoms',
                'Iron deficiency anaemia',
            ],
            'Skin' => [
                'Acne', 'Eczema', 'Psoriasis', 'Urticaria and hives', 'Rosacea', 'Vitiligo', 'Melasma',
                'Dry skin', 'Itchy skin', 'Fungal skin infection', 'Ringworm', 'Boils', 'Warts',
                'Corns and calluses', 'Excessive sweating', 'Dandruff', 'Seborrheic dermatitis',
                'Contact dermatitis', 'Stretch marks', 'Scars and keloids', 'Sunburn recovery',
            ],
            'Hair and nails' => [
                'Hair fall', 'Male pattern baldness', 'Female pattern hair loss', 'Alopecia areata',
                'Postpartum hair fall', 'Premature greying', 'Thinning hair', 'Itchy scalp',
                'Nail fungus', 'Brittle nails', 'Ingrown toenail',
            ],
            'Musculoskeletal' => [
                'Joint pain', 'Osteoarthritis', 'Rheumatoid arthritis support', 'Back pain', 'Sciatica',
                'Cervical spondylosis', 'Neck pain', 'Frozen shoulder', 'Knee pain', 'Heel pain',
                'Plantar fasciitis', 'Tennis elbow', 'Carpal tunnel symptoms', 'Fibromyalgia support',
                'Muscle cramps', 'Sports injury recovery', 'Osteoporosis support', 'Gout flares',
                'TMJ jaw pain', 'Ankle sprain recovery',
            ],
            'Neurology' => [
                'Migraine', 'Tension headache', 'Cluster headache', 'Vertigo', 'Neuropathy support',
                'Tingling and numbness', 'Tremor concerns', 'Memory fog', 'Bell\'s palsy recovery support',
                'Restless legs', 'Neuralgia',
            ],
            'Mental health' => [
                'Stress', 'Burnout', 'Anxiety', 'Generalised anxiety', 'Social anxiety', 'Panic attacks',
                'Depression support', 'OCD tendencies', 'Irritability', 'Mood swings', 'Grief support',
                'Exam stress', 'Performance anxiety', 'Anger issues', 'Low motivation', 'Loneliness',
                'Screen addiction concerns', 'Emotional eating',
            ],
            'Sleep' => [
                'Insomnia', 'Difficulty falling asleep', 'Frequent night waking', 'Unrefreshing sleep',
                'Nightmares', 'Teeth grinding', 'Shift work sleep problems', 'Snoring-related sleep issues',
            ],
            'Eyes' => [
                'Eye strain', 'Dry eyes', 'Watery eyes', 'Allergic eye irritation', 'Stye',
                'Blurry vision concerns', 'Computer vision syndrome', 'Itchy eyes',
            ],
            'Ears' => [
                'Earache', 'Ear wax blockage', 'Tinnitus', 'Hearing difficulty concerns',
                'Eustachian tube dysfunction', 'Swimmer\'s ear',
            ],
            'Oral and dental' => [
                'Toothache support', 'Bleeding gums', 'Gum inflammation', 'Tooth sensitivity',
                'Oral thrush', 'Dry mouth', 'Jaw clicking', 'Bad taste in mouth',
            ],
            'Women\'s health' => [
                'Painful periods', 'Heavy periods', 'Scanty periods', 'Irregular periods', 'PMS',
                'Endometriosis support', 'Fibroids support', 'Leucorrhoea', 'Vaginal yeast infection',
                'Bacterial vaginosis support', 'Pelvic pain', 'Menopause', 'Hot flushes',
                'Vaginal dryness', 'Low libido in women', 'Female infertility support',
                'Breast pain', 'UTI in women',
            ],
            'Pregnancy and postpartum' => [
                'Morning sickness', 'Pregnancy constipation', 'Pregnancy back pain', 'Pregnancy anaemia support',
                'Breastfeeding difficulties', 'Low milk supply concerns', 'Postpartum depression support',
                'Postpartum recovery', 'Postpartum fatigue',
            ],
            'Men\'s health' => [
                'Erectile dysfunction support', 'Premature ejaculation', 'Low libido in men',
                'Male infertility support', 'Prostatitis support', 'Enlarged prostate symptoms',
                'Testicular discomfort concerns', 'Male androgenetic alopecia',
            ],
            'Children' => [
                'Teething', 'Infant colic', 'Childhood eczema', 'Recurrent childhood colds',
                'Adenoid concerns', 'Childhood tonsillitis', 'Childhood asthma support',
                'Bedwetting', 'Childhood constipation', 'Childhood diarrhoea', 'Worms in children',
                'Poor appetite in children', 'Growth concerns in children', 'School refusal',
                'Childhood sleep problems', 'Temper tantrums', 'Thumb sucking',
                'Learning difficulty support', 'Childhood ADHD support',
            ],
            'Teens' => [
                'Teenage acne', 'Teenage hormonal mood swings', 'Academic stress in teens',
                'Body image concerns', 'Sports injuries in teens',
            ],
            'Older adults' => [
                'Age-related joint stiffness', 'Fall-related fear and frailty support', 'Age-related constipation',
                'Age-related insomnia', 'Age-related memory concerns', 'Caregiver stress',
            ],
            'Allergies' => [
                'Dust mite allergy', 'Pollen allergy', 'Food allergy concerns', 'Drug allergy awareness',
                'Insect bite allergy', 'Allergic asthma', 'Skin allergy',
            ],
            'Lifestyle' => [
                'Sedentary lifestyle fatigue', 'Poor posture strain', 'Digital eye and neck strain',
                'Caffeine dependence', 'Smoking withdrawal support', 'Alcohol hangover recovery',
                'Dehydration', 'Heat exhaustion recovery', 'Motion sickness', 'Jet lag',
                'Low stamina', 'Chronic stress eating',
            ],
            'Autoimmune support' => [
                'Autoimmune thyroid support', 'Psoriatic arthritis support', 'Lupus supportive care',
                'IBD supportive care', 'Sjogren supportive care',
            ],
            'Sexual health' => [
                'Painful intercourse', 'Sexual performance anxiety', 'Low sexual desire',
                'Genital itching concerns',
            ],
        ];
    }
}
