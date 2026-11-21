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
                'myth_title' => 'Homeopathy is just another name for herbal medicine.',
                'fact_title' => 'They are different systems.',
                'fact_body' => 'Herbal medicine uses plant extracts in material doses. Homeopathy prepares remedies through dilution and succussion, guided by symptom similarity—not plant chemistry alone.',
            ],
            [
                'myth_title' => 'Homeopathic remedies are only sugar pills with nothing in them.',
                'fact_title' => 'Preparation and potency matter.',
                'fact_body' => 'Remedies are made through a defined dilution and shaking process. Higher potencies are more diluted, but classical practice still treats potency choice as clinically meaningful.',
            ],
            [
                'myth_title' => 'One homeopathic remedy fits every person with the same disease name.',
                'fact_title' => 'The whole person guides the choice.',
                'fact_body' => 'Two people labelled with the same condition may receive different remedies based on modalities, mental state, food desires, sleep, and other individualising symptoms.',
            ],
            [
                'myth_title' => 'Higher potency always means a stronger, riskier medicine.',
                'fact_title' => 'Potency is not the same as pharmaceutical strength.',
                'fact_body' => 'In homeopathy, potency describes the dilution–succussion stage. Suitability depends on the case, not on treating “higher” as automatically harsher like a high drug dose.',
            ],
            [
                'myth_title' => 'You can safely self-prescribe long courses for any chronic disease.',
                'fact_title' => 'Chronic cases need professional review.',
                'fact_body' => 'Acute self-care may be simple, but long-standing complaints benefit from a full case history so remedy, potency, and follow-up are matched to the person.',
            ],
            [
                'myth_title' => 'Homeopathy never interacts with other treatments.',
                'fact_title' => 'Tell your practitioner everything you take.',
                'fact_body' => 'While many remedies are highly diluted, your overall care plan still needs to account for conventional medicines, allergies, pregnancy, and other therapies you are using.',
            ],
            [
                'myth_title' => 'If a product is labelled “natural,” it is automatically harmless.',
                'fact_title' => 'Natural does not mean risk-free.',
                'fact_body' => 'Mother tinctures, combinations, and topical products can still irritate skin, upset digestion, or be unsuitable in pregnancy—read labels and ask a qualified practitioner.',
            ],
            [
                'myth_title' => 'Homeopathy works only through placebo.',
                'fact_title' => 'Patients and practitioners report individual responses.',
                'fact_body' => 'Debate continues in research communities, yet clinical homeopathy is practised case-by-case. Outcomes are assessed on symptom change, not on a single disease lab marker alone.',
            ],
            [
                'myth_title' => 'Taking more pellets makes the remedy work faster.',
                'fact_title' => 'Dose frequency matters more than stuffing the mouth.',
                'fact_body' => 'Repeating a remedy too often can confuse the response. Follow the prescribed interval rather than increasing pellet count hoping for a quicker effect.',
            ],
            [
                'myth_title' => 'You must stop all other medicines before starting homeopathy.',
                'fact_title' => 'Do not stop prescribed drugs on your own.',
                'fact_body' => 'Homeopathic care can often run alongside conventional treatment. Any change to ongoing medicines should be decided with the prescribing clinician.',
            ],
            [
                'myth_title' => 'All homeopathic brands and potencies are interchangeable.',
                'fact_title' => 'Source, form, and potency can differ.',
                'fact_body' => 'Mother tinctures, biochemics, dilutions, and combination packs are not the same product. Match the exact form and potency advised for your case.',
            ],
            [
                'myth_title' => 'Children cannot take homeopathic medicines.',
                'fact_title' => 'Paediatric dosing is common—with guidance.',
                'fact_body' => 'Many remedies are used in children, but age, weight, remedy form, and the complaint still need careful selection by someone trained in homeopathic prescribing.',
            ],
            [
                'myth_title' => 'Homeopathy is only useful for coughs and colds.',
                'fact_title' => 'It is used across acute and chronic presentations.',
                'fact_body' => 'Practitioners also manage skin, digestion, women’s health, allergies, and long-term complaints—always within scope and with referral when red-flag signs appear.',
            ],
            [
                'myth_title' => 'Coffee, mint, or camphor always “antidote” every remedy.',
                'fact_title' => 'Sensitivity varies by person and remedy.',
                'fact_body' => 'Some patients are asked to limit strong aromatic substances during treatment, but blanket rules are not universal. Follow the advice given for your specific prescription.',
            ],
            [
                'myth_title' => 'A homeopathic “aggravation” means the medicine failed.',
                'fact_title' => 'A short intensification can be part of response.',
                'fact_body' => 'Mild temporary worsening of existing symptoms is sometimes described after a well-matched dose. Persistent or severe new symptoms need prompt clinical review.',
            ],
            [
                'myth_title' => 'LM, CH, and X potencies are just different packaging.',
                'fact_title' => 'Scale and method differ.',
                'fact_body' => 'Decimal (X/D), centesimal (CH), and fifty-millesimal (LM) scales follow different dilution ratios and repetition patterns—so they are not casual swaps.',
            ],
            [
                'myth_title' => 'Combination remedies replace the need for individualisation.',
                'fact_title' => 'Combinations are convenient, not always complete.',
                'fact_body' => 'OTC combinations may help common acute pictures, but classical chronic prescribing still relies on matching the totality of symptoms to a single leading remedy.',
            ],
            [
                'myth_title' => 'Homeopathy can replace emergency care.',
                'fact_title' => 'Emergencies need urgent medical help first.',
                'fact_body' => 'Chest pain, breathlessness, uncontrolled bleeding, seizures, and similar crises are not home-remedy situations. Seek emergency services, then discuss supportive care later.',
            ],
            [
                'myth_title' => 'You should keep changing remedies every day until something works.',
                'fact_title' => 'Frequent switching muddies the picture.',
                'fact_body' => 'A clear follow-up needs time to observe. Rapid remedy hopping makes it harder to know what helped—or what to adjust next.',
            ],
            [
                'myth_title' => 'Biochemic tissue salts are the same as classical homeopathy.',
                'fact_title' => 'Related history, different framework.',
                'fact_body' => 'Schuessler tissue salts focus on mineral cell-salt imbalances. Classical homeopathy centres on the law of similars and individualised remedy selection.',
            ],
            [
                'myth_title' => 'Expired homeopathic pellets are always dangerous to take.',
                'fact_title' => 'Follow labelled shelf life and storage.',
                'fact_body' => 'Quality can fall if bottles are heat-damaged, moist, or long past expiry. Prefer in-date stock stored cool, dry, and tightly closed.',
            ],
            [
                'myth_title' => 'Online symptom checkers can replace a homeopathic consultation.',
                'fact_title' => 'Case-taking is more than a keyword match.',
                'fact_body' => 'A proper consult explores timeline, modalities, emotions, and generals. Apps can educate, but they do not replace trained case analysis.',
            ],
            [
                'myth_title' => 'Homeopathy is anti-science and rejects all modern medicine.',
                'fact_title' => 'Responsible practice works with—not against—medical care.',
                'fact_body' => 'Many clinics integrate history-taking, referral, and conventional investigations when needed, while using homeopathy as a complementary therapeutic approach.',
            ],
            [
                'myth_title' => 'Once you feel better, you can stop long-term protocols without advice.',
                'fact_title' => 'Improvement is a checkpoint, not always a stop signal.',
                'fact_body' => 'Your practitioner may taper, wait, or change potency based on how symptoms evolved. Self-stopping mid-plan can invite relapse or confusion.',
            ],
        ];

        MythVsFact::query()->delete();

        foreach ($items as $index => $item) {
            MythVsFact::query()->create([
                'myth_title' => $item['myth_title'],
                'fact_title' => $item['fact_title'],
                'fact_body' => $item['fact_body'],
                'sort_order' => $index + 1,
                'status' => 'published',
                'published_at' => now(),
            ]);
        }
    }
}
