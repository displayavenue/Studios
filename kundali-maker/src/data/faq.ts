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
    aEn: 'Yes. Use Order lookup with your Order ID, or contact us on WhatsApp with your order details.',
    aHi: 'हाँ। ऑर्डर ID से Order lookup करें, या WhatsApp पर ऑर्डर विवरण भेजें।',
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
    aEn: 'Digital kundali PDFs are generally non-refundable once generated. If payment succeeded but PDF failed to unlock, contact support within 48 hours with Order ID.',
    aHi: 'बनने के बाद डिजिटल कुंडली PDF सामान्यतः अप्रतिदेय हैं। भुगतान हुआ पर PDF न खुले तो ४८ घंटे में Order ID के साथ सपोर्ट से संपर्क करें।',
  },
  {
    qEn: 'Is my birth data safe?',
    qHi: 'क्या जन्म डेटा सुरक्षित है?',
    aEn: 'In the current MVP, orders are stored in your browser (local device). We do not sell birth data. When server accounts launch, data will be encrypted and covered by our Privacy Policy.',
    aHi: 'वर्तमान MVP में ऑर्डर आपके ब्राउज़र (डिवाइस) में रहते हैं। हम जन्म डेटा नहीं बेचते। सर्वर अकाउंट आने पर एन्क्रिप्शन व गोपनीयता नीति लागू होगी।',
  },
  {
    qEn: 'When will Kundali Milan / Muhurat launch?',
    qHi: 'कुंडली मिलान / मुहूर्त कब?',
    aEn: 'They are listed as Coming Soon on Services. Join via WhatsApp to get launch offers.',
    aHi: 'Services पर Coming Soon हैं। लॉन्च ऑफ़र हेतु WhatsApp पर जुड़ें।',
  },
]
