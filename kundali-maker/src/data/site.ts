/** Site-wide contact & business settings */
export const SITE = {
  brandEn: 'Jyotish Kundali',
  brandHi: 'ज्योतिष कुंडली',
  domain: 'https://jyotishkundali.com',
  supportEmail: 'support@jyotishkundali.com',
  whatsappNumber: '917400303493',
  whatsappDisplay: '+91 74003 03493',
  businessName: 'Jyotish Kundali',
  businessAddress: 'India',
  grievanceName: 'Grievance Officer',
  grievanceEmail: 'grievance@jyotishkundali.com',
  methodNoteEn: 'Lahiri (Chitrapaksha) ayanamsa · Vedic sidereal · whole-sign houses',
  methodNoteHi: 'लाहिरी (चित्रापक्ष) अयनांश · वैदिक सायन · पूर्ण-राशि भाव',
}

export function whatsappLink(message?: string): string {
  const text = encodeURIComponent(
    message ?? 'Namaste, I need help with my Jyotish Kundali order.',
  )
  return `https://wa.me/${SITE.whatsappNumber}?text=${text}`
}
