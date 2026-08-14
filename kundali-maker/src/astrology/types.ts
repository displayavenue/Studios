export type Language = 'en' | 'hi'

export interface BirthDetails {
  name: string
  gender: 'male' | 'female' | 'other'
  dateOfBirth: string // YYYY-MM-DD
  timeOfBirth: string // HH:mm
  placeName: string
  latitude: number
  longitude: number
  timezoneOffsetMinutes: number
  language: Language
}

export interface PlanetPosition {
  id: string
  nameEn: string
  nameHi: string
  longitude: number
  signIndex: number
  signEn: string
  signHi: string
  degreeInSign: number
  nakshatraIndex: number
  nakshatraEn: string
  nakshatraHi: string
  pada: number
  house: number
  isRetrograde: boolean
}

export interface DoshaFlag {
  id: string
  nameEn: string
  nameHi: string
  severity: 'low' | 'medium' | 'high'
  summaryEn: string
  summaryHi: string
  remedyIds: string[]
}

export interface RemedyItem {
  id: string
  titleEn: string
  titleHi: string
  bodyEn: string
  bodyHi: string
  category: 'mantra' | 'gemstone' | 'daan' | 'ritual' | 'lifestyle'
}

export interface DashaPeriod {
  lordEn: string
  lordHi: string
  start: string
  end: string
  isCurrent: boolean
}

export interface KundaliChart {
  generatedAt: string
  lagnaSignIndex: number
  lagnaEn: string
  lagnaHi: string
  moonSignIndex: number
  moonSignEn: string
  moonSignHi: string
  sunSignIndex: number
  sunSignEn: string
  sunSignHi: string
  ayanamsa: number
  planets: PlanetPosition[]
  houses: number[] // sign index for houses 1-12
  currentDasha: DashaPeriod
  upcomingDashas: DashaPeriod[]
  doshas: DoshaFlag[]
  summaryEn: string
  summaryHi: string
}

export type OrderStatus = 'draft' | 'kundali_paid' | 'remedies_paid'

export interface KundaliOrder {
  id: string
  createdAt: string
  details: BirthDetails
  status: OrderStatus
  kundaliPaidAt?: string
  remediesPaidAt?: string
  chart?: KundaliChart
  amountKundali: number
  amountRemedies: number
}
