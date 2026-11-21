<?php

namespace App\Support;

/**
 * Educational Q&A drawn from CCRH, Homoeopathy — Science of Gentle Healing
 * (Ministry of AYUSH / CCRH, 2016).
 */
final class UnderstandingHomeopathyFaqs
{
    /**
     * @return list<array{question: string, answer: string}>
     */
    public static function items(): array
    {
        return [
            [
                'question' => 'What is homeopathy and how does it work?',
                'answer' => 'Homeopathy (from the Greek words homoios, “similar”, and pathos, “suffering”) is a system of medicine founded by Dr. Samuel Hahnemann. It rests on three cardinal principles: the law of similars (similia similibus curentur — let likes be treated by likes), the law of the single simple remedy, and the law of the minimum dose. In practice, a substance that can produce a set of symptoms in a healthy person is used, in a carefully prepared dose, to treat a sick person who has a similar symptom picture. For example, Allium cepa (from red onion) is used when cold symptoms resemble the watering and burning of eyes and nose that onions cause. Homeopathy views health as a dynamic balance and disease as a loss of that balance; the medicine is chosen to support the body’s own righting tendency rather than to suppress symptoms alone.',
            ],
            [
                'question' => 'What are homeopathic medicines made from, and how are they prepared?',
                'answer' => 'Homeopathic medicines are prepared from natural and other pharmacopoeial source materials. These include substances of plant and animal origin, chemicals and minerals, as well as special categories described in homeopathic pharmacy such as nosodes (from disease products), sarcodes (from healthy animal tissues or secretions), and imponderabilia (from natural energy sources). Preparation begins with a mother tincture or stock — the initial extract in a suitable solvent — which may be used as such or further potentized. Potentization is the combined process of serial dilution and succussion (vigorous shaking) or trituration (grinding with lactose). Dilution scales include decimal (1:10), centesimal (1:100), and fifty-millesimal (1:50,000). Both lower dilutions (still containing molecules of the starting material) and higher dilutions are used in the system. This process was introduced so that even inert or highly toxic substances could be applied as remedial agents with gentler action.',
            ],
            [
                'question' => 'Are homeopathic medicines safe, and do they have side effects?',
                'answer' => 'According to the CCRH dossier, homeopathy is regarded as one of the safest medical systems in use today because of the minimum dose. Doses range from concentrations similar to some conventional medicines to very high dilutions. Potentization was developed to enable beneficial remedial action while avoiding or reducing unwanted side effects and aggravations that can follow crude dosing. With single simple substances in micro-doses, medicines are described as free from toxicological effects and suitable for pregnant and lactating women, infants, children, and older adults when prescribed appropriately. Remedies are not addictive; once relief occurs, they can usually be stopped. As with any medicine, individual response varies — brief homeopathic aggravations are discussed in the literature — so guidance from a qualified homeopathic doctor remains important, especially in serious illness.',
            ],
            [
                'question' => 'Can homeopathy be used alongside conventional medical treatments?',
                'answer' => 'In India, homeopathy is recognised as part of the AYUSH systems and is widely used in primary care alongside mainstream (allopathic) services. The CCRH dossier notes that many people try conventional medicines for everyday problems, yet a large share prefer to continue with homeopathy unless the situation is an emergency. Homeopathic medicines are described as acting on the person’s self-protective system rather than directly on microbes, and microbial resistance to homeopathic drugs is not known. In practice, integration depends on the condition: homeopathy may be used alone for many everyday and chronic complaints, or as a complementary approach where other care is also needed. For emergencies, surgical needs, or conditions that require hospital medicine, conventional care should not be delayed. Always tell every doctor you see which homeopathic and allopathic medicines you are taking.',
            ],
            [
                'question' => 'When should you consult a homeopathic doctor, and what happens during a consultation?',
                'answer' => 'Consult a qualified homeopathic doctor for acute or chronic complaints, constitutional care, children’s and women’s health needs, and whenever self-selection of a remedy is unclear — and seek urgent conventional care for emergencies. A homeopathic consultation is a careful, unprejudiced clinical investigation of you as an individual, not only of a disease label. The physician notes the characteristic features that distinguish your case from others with the same diagnosis, explores your pre-illness personality, past illnesses, family and hereditary predispositions, mental and emotional state, and the conditions that aggravate or relieve your symptoms. Environmental factors that contribute to illness are also considered. From this whole picture the doctor selects a single similar remedy (the similimum) matched to your symptoms and constitution. Follow-up visits assess the course of recovery and refine the prescription. Lack of a final conventional diagnosis need not prevent starting carefully individualised homeopathic treatment, but serious or unexplained symptoms should still be evaluated medically.',
            ],
            [
                'question' => 'What is the difference between homeopathy and Ayurveda?',
                'answer' => 'Both are recognised in India under the Ministry of AYUSH and form part of the country’s pluralistic healthcare system, but they are different medical traditions. Ayurveda is one of India’s classical traditional systems of medicine. Homeopathy was founded in the modern scientific age by Dr. Samuel Hahnemann in Germany and is based on the law of similars, drug proving on healthy human beings, the single simple remedy, and the minimum dose prepared through potentization. The CCRH dossier notes that where many traditional systems remained largely rooted in their countries of origin, homeopathy spread internationally early on, while in India it developed alongside Ayurveda, Yoga & Naturopathy, Unani, Siddha and other AYUSH systems under shared government frameworks for education, research and regulation. In short: they share official recognition and a holistic intent, but their founding principles, pharmacy and prescribing methods are not the same.',
            ],
            [
                'question' => 'How long does homeopathic treatment usually take to show results?',
                'answer' => 'There is no single fixed timeline — response depends on whether the complaint is acute or chronic, how long it has been present, and how closely the remedy matches the individual. The CCRH dossier notes that using homeopathy as a first-line approach in many conditions can markedly reduce the duration and intensity of illness, especially in children with respiratory complaints, and that follow-up visits are used to judge the course of recovery. Acute problems such as injuries, colds, diarrhoea or teething discomfort may settle more quickly when the similar remedy is well chosen. Chronic diseases are described as often having a constitutional basis, and lasting cure may require correcting deeper miasmatic dyscrasias with suitable remedies over a longer course. Your doctor will usually review progress at follow-ups and adjust the prescription rather than expecting one dose to finish every case.',
            ],
            [
                'question' => 'Can homeopathic medicines be taken by children and elderly people?',
                'answer' => 'Yes. The CCRH dossier states that with single simple substances in micro-doses, homeopathic medicines are not associated with toxicological effects and can be safely used for infants and children as well as the geriatric (elderly) population when prescribed appropriately. The mode of administration is easy, without invasive methods, and medicines are highly palatable, which improves acceptability in children. Homeopathy is widely used for paediatric concerns such as diarrhoea, colic and dentition complaints, and CCRH programmes have specifically addressed teething and child health. Older adults likewise form an important care group in AYUSH geriatric initiatives. Dose and remedy choice should still be guided by a qualified homeopathic doctor, especially for infants, frail elderly people, or anyone with other medical conditions.',
            ],
            [
                'question' => 'How should homeopathic medicines be stored, and do they expire?',
                'answer' => 'In India, homeopathic medicines are regulated under the Drugs and Cosmetics Act and Rules. Manufacturing must follow Good Manufacturing Practices (GMP), which cover premises, process, packaging and labelling, so bottles carry official product information from the manufacturer. Always keep medicines in their original labelled containers, tightly closed, in a cool, dry place away from direct sunlight, heat, moisture and strong-smelling substances (perfumes, camphor, spices) that can affect quality. Check the pack for the manufacturer’s expiry or “use before” date and do not use medicines past that date, or if the label is missing, the seal is broken, or the contents look damaged. When in doubt, ask your pharmacist or homeopathic doctor rather than guessing from an unmarked vial.',
            ],
            [
                'question' => 'Can homeopathic medicines be taken during pregnancy and breastfeeding?',
                'answer' => 'According to the CCRH dossier, homeopathic medicines prepared as single simple substances in micro-doses are not associated with toxicological effects and can be safely used for pregnant women and lactating mothers when prescribed appropriately. The dossier also lists common complaints during pregnancy and lactation among the conditions for which homeopathy is frequently used in primary care. That does not mean every remedy or potency is automatically suitable for every stage of pregnancy — individualised prescribing by a qualified homeopathic doctor is essential, and any sudden, severe, or high-risk obstetric symptom needs conventional medical attention without delay. Always tell both your obstetric/medical doctor and your homeopath which medicines you are taking.',
            ],
        ];
    }
}
