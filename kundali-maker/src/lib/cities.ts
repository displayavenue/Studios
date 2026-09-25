export interface CityOption {
  name: string
  nameHi: string
  latitude: number
  longitude: number
  timezoneOffsetMinutes: number
}

/** Common Indian cities for place-of-birth picker */
export const CITIES: CityOption[] = [
  { name: 'Delhi', nameHi: 'दिल्ली', latitude: 28.6139, longitude: 77.209, timezoneOffsetMinutes: 330 },
  { name: 'Mumbai', nameHi: 'मुंबई', latitude: 19.076, longitude: 72.8777, timezoneOffsetMinutes: 330 },
  { name: 'Bengaluru', nameHi: 'बेंगलुरु', latitude: 12.9716, longitude: 77.5946, timezoneOffsetMinutes: 330 },
  { name: 'Chennai', nameHi: 'चेन्नई', latitude: 13.0827, longitude: 80.2707, timezoneOffsetMinutes: 330 },
  { name: 'Kolkata', nameHi: 'कोलकाता', latitude: 22.5726, longitude: 88.3639, timezoneOffsetMinutes: 330 },
  { name: 'Hyderabad', nameHi: 'हैदराबाद', latitude: 17.385, longitude: 78.4867, timezoneOffsetMinutes: 330 },
  { name: 'Pune', nameHi: 'पुणे', latitude: 18.5204, longitude: 73.8567, timezoneOffsetMinutes: 330 },
  { name: 'Ahmedabad', nameHi: 'अहमदाबाद', latitude: 23.0225, longitude: 72.5714, timezoneOffsetMinutes: 330 },
  { name: 'Jaipur', nameHi: 'जयपुर', latitude: 26.9124, longitude: 75.7873, timezoneOffsetMinutes: 330 },
  { name: 'Lucknow', nameHi: 'लखनऊ', latitude: 26.8467, longitude: 80.9462, timezoneOffsetMinutes: 330 },
  { name: 'Chandigarh', nameHi: 'चंडीगढ़', latitude: 30.7333, longitude: 76.7794, timezoneOffsetMinutes: 330 },
  { name: 'Varanasi', nameHi: 'वाराणसी', latitude: 25.3176, longitude: 82.9739, timezoneOffsetMinutes: 330 },
  { name: 'Patna', nameHi: 'पटना', latitude: 25.5941, longitude: 85.1376, timezoneOffsetMinutes: 330 },
  { name: 'Bhopal', nameHi: 'भोपाल', latitude: 23.2599, longitude: 77.4126, timezoneOffsetMinutes: 330 },
  { name: 'Indore', nameHi: 'इंदौर', latitude: 22.7196, longitude: 75.8577, timezoneOffsetMinutes: 330 },
  { name: 'Kochi', nameHi: 'कोच्चि', latitude: 9.9312, longitude: 76.2673, timezoneOffsetMinutes: 330 },
  { name: 'Thiruvananthapuram', nameHi: 'तिरुवनंतपुरम', latitude: 8.5241, longitude: 76.9366, timezoneOffsetMinutes: 330 },
  { name: 'Guwahati', nameHi: 'गुवाहाटी', latitude: 26.1445, longitude: 91.7362, timezoneOffsetMinutes: 330 },
  { name: 'Srinagar', nameHi: 'श्रीनगर', latitude: 34.0837, longitude: 74.7973, timezoneOffsetMinutes: 330 },
  { name: 'Goa (Panaji)', nameHi: 'गोवा (पणजी)', latitude: 15.4909, longitude: 73.8278, timezoneOffsetMinutes: 330 },
]
