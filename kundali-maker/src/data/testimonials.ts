import type { Language } from '../astrology/types'

export interface Testimonial {
  name: string
  nameHi: string
  role: string
  roleHi: string
  city: string
  cityHi: string
  quote: string
  quoteHi: string
}

export const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Rajesh Mehta',
    nameHi: 'राजेश मेहता',
    role: 'Business owner',
    roleHi: 'व्यवसायी',
    city: 'Ahmedabad',
    cityHi: 'अहमदाबाद',
    quote:
      'I needed clarity before expanding my shop. The kundali PDF was clear, and I only paid for remedies when Saturn pressure was flagged. Felt honest—not pushy.',
    quoteHi:
      'दुकान बढ़ाने से पहले स्पष्टता चाहिए थी। कुंडली PDF साफ़ थी, और शनि प्रभाव दिखने पर ही उपाय का भुगतान किया। दबाव नहीं—विश्वास जगा।',
  },
  {
    name: 'Ananya Iyer',
    nameHi: 'अनन्या अय्यर',
    role: 'College student',
    roleHi: 'छात्रा',
    city: 'Bengaluru',
    cityHi: 'बेंगलुरु',
    quote:
      'As a student I wanted my dasha timeline without sitting at a pandit’s office for hours. Ordering online and downloading the PDF the same day felt genuine and simple.',
    quoteHi:
      'छात्र के रूप में महादशा समयरेखा चाहिए थी, घंटों पंडित के पास बैठे बिना। ऑनलाइन मँगवाई और उसी दिन PDF—सरल और भरोसेमंद लगा।',
  },
  {
    name: 'Sunita Devi',
    nameHi: 'सुनीता देवी',
    role: 'Homemaker',
    roleHi: 'गृहिणी',
    city: 'Varanasi',
    cityHi: 'वाराणसी',
    quote:
      'I ordered charts for my daughter’s marriage matching prep. Hindi option and the North Indian chart made it easy to show the family. Remedies were optional—exactly what I wanted.',
    quoteHi:
      'बेटी की कुंडली मिलान तैयारी हेतु मँगवाई। हिन्दी विकल्प और उत्तर भारतीय चार्ट परिवार को दिखाने में आसान रहे। उपाय वैकल्पिक—यही चाहिए था।',
  },
  {
    name: 'Vikram Singh',
    nameHi: 'विक्रम सिंह',
    role: 'Working professional',
    roleHi: 'नौकरीपेशा',
    city: 'Delhi',
    cityHi: 'दिल्ली',
    quote:
      'Birth time and place mattered—they didn’t ask me to “generate free” then spam. Pay once, get the chart. That transparency made it feel real.',
    quoteHi:
      'जन्म समय और स्थान मायने रखते हैं—मुफ़्त बनाकर स्पैम नहीं किया। एक बार भुगतान, कुंडली मिल गई। पारदर्शिता से भरोसा बना।',
  },
]

export function testimonialText(t: Testimonial, lang: Language) {
  return {
    name: lang === 'hi' ? t.nameHi : t.name,
    role: lang === 'hi' ? t.roleHi : t.role,
    city: lang === 'hi' ? t.cityHi : t.city,
    quote: lang === 'hi' ? t.quoteHi : t.quote,
  }
}
