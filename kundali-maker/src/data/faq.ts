export interface FaqItem {
  qEn: string
  qHi: string
  aEn: string
  aHi: string
}

export const FAQS: FaqItem[] = [
  {
    qEn: 'What birth details do you need?',
    qHi: 'कौन से जन्म विवरण चाहिए?',
    aEn: 'Full name, gender, date of birth, exact time of birth, and place of birth. Exact time matters most for lagna (ascendant).',
    aHi: 'पूरा नाम, लिंग, जन्म तिथि, सटीक जन्म समय और जन्म स्थान। लग्न के लिए समय सबसे महत्वपूर्ण है।',
  },
  {
    qEn: 'Which ayanamsa / method do you use?',
    qHi: 'कौन सा अयनांश / पद्धति?',
    aEn: 'We use Vedic sidereal calculations with Lahiri (Chitrapaksha) ayanamsa and whole-sign houses. This is stated on your PDF.',
    aHi: 'हम वैदिक सायन गणना, लाहिरी (चित्रापक्ष) अयनांश व पूर्ण-राशि भाव उपयोग करते हैं—यह आपकी PDF पर लिखा होता है।',
  },
  {
    qEn: 'Why do I pay before seeing the full kundali?',
    qHi: 'पूरी कुंडली से पहले भुगतान क्यों?',
    aEn: 'So the service stays honest—no freebait spam. You pay once for the full chart and PDF. Remedies are a separate optional add-on.',
    aHi: 'ताकि सेवा ईमानदार रहे—मुफ़्त जाल नहीं। एक बार भुगतान पर पूरी कुंडली व PDF। उपाय अलग वैकल्पिक ऐड-ऑन हैं।',
  },
  {
    qEn: 'Can I download the PDF again later?',
    qHi: 'PDF बाद में फिर डाउनलोड कर सकते हैं?',
    aEn: 'Yes. Use Order lookup with your Order ID on this device to re-open and download again.',
    aHi: 'हाँ। इस डिवाइस पर Order ID से Order lookup करके फिर खोलें व डाउनलोड करें।',
  },
  {
    qEn: 'Is Hindi supported?',
    qHi: 'क्या हिन्दी मिलती है?',
    aEn: 'Yes. Switch EN/हिं in the header. Your report language is chosen while ordering.',
    aHi: 'हाँ। हेडर में EN/हिं बदलें। ऑर्डर करते समय रिपोर्ट भाषा चुनें।',
  },
  {
    qEn: 'What if my birth time is approximate?',
    qHi: 'अगर जन्म समय अनुमानित हो?',
    aEn: 'The chart may still be useful, but lagna can be wrong if time is off by more than ~30–60 minutes. Check hospital records or family diaries when possible.',
    aHi: 'चार्ट उपयोगी हो सकता है, पर ३०–६० मिनट से अधिक अंतर पर लग्न गलत हो सकता है। संभव हो तो अस्पताल/पारिवारिक रिकॉर्ड देखें।',
  },
  {
    qEn: 'Do remedies guarantee results?',
    qHi: 'क्या उपाय परिणाम की गारंटी देते हैं?',
    aEn: 'No. Remedies are traditional guidance only. They are not medical, legal, or financial advice and do not guarantee outcomes.',
    aHi: 'नहीं। उपाय पारंपरिक मार्गदर्शन हैं। चिकित्सा, कानूनी या वित्तीय सलाह नहीं; परिणाम की गारंटी नहीं।',
  },
  {
    qEn: 'Refund policy?',
    qHi: 'रिफंड नीति?',
    aEn: 'Digital kundali PDFs are generally non-refundable once generated. If payment succeeded but PDF failed to unlock, email support within 48 hours with Order ID.',
    aHi: 'बनने के बाद डिजिटल कुंडली PDF सामान्यतः अप्रतिदेय हैं। भुगतान हुआ पर PDF न खुले तो ४८ घंटे में Order ID के साथ ईमेल करें।',
  },
  {
    qEn: 'Is my birth data safe?',
    qHi: 'क्या जन्म डेटा सुरक्षित है?',
    aEn: 'In the current MVP, orders are stored in your browser (local device). We do not sell birth data. When server accounts launch, data will be encrypted and covered by our Privacy Policy.',
    aHi: 'वर्तमान MVP में ऑर्डर आपके ब्राउज़र (डिवाइस) में रहते हैं। हम जन्म डेटा नहीं बेचते। सर्वर अकाउंट आने पर एन्क्रिप्शन व गोपनीयता नीति लागू होगी।',
  },
  {
    qEn: 'Can I see a sample before paying?',
    qHi: 'पेमेंट से पहले नमूना देख सकते हैं?',
    aEn: 'Yes. Open Sample from the menu and download the free SAMPLE PDF (watermarked demo birth). Your real chart unlocks after payment.',
    aHi: 'हाँ। मेनू से Sample खोलकर मुफ़्त SAMPLE PDF डाउनलोड करें (वॉटरमार्क डेमो)। असली कुंडली भुगतान के बाद खुलती है।',
  },
  {
    qEn: 'Do I need to talk to someone?',
    qHi: 'क्या किसी से बात करनी होगी?',
    aEn: 'No. Jyotish Kundali is fully self-serve: pay → instant chart + PDF. There is no pandit call or WhatsApp consult in the product.',
    aHi: 'नहीं। ज्योतिष कुंडली पूरी तरह स्वयं-सेवा है: पे → तुरंत चार्ट + PDF। उत्पाद में पंडित कॉल या WhatsApp परामर्श नहीं।',
  },
  {
    qEn: 'What is Kundali Milan?',
    qHi: 'कुंडली मिलान क्या है?',
    aEn: 'Kundali Milan is Ashtakoot (36-point) gun matching plus manglik compare for a couple. It is live for ₹399 with an instant shareable PDF. Points are traditional guidance—not the only factor for marriage.',
    aHi: 'कुंडली मिलान अष्टकूट (३६ अंक) गुण मिलान व मंगलिक तुलना है। ₹३९९ में तुरंत PDF। अंक पारंपरिक मार्गदर्शन हैं—विवाह का एकमात्र आधार नहीं।',
  },
  {
    qEn: 'Where can I see all features?',
    qHi: 'सभी विशेषताएँ कहाँ देखूँ?',
    aEn: 'Open the Features page for the full list of 50 self-serve capabilities (live and coming soon).',
    aHi: 'Features पृष्ठ पर ५० स्वयं-सेवा क्षमताओं की पूरी सूची देखें (लाइव व जल्द)।',
  },
]
