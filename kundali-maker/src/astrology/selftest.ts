import { generateKundali } from './generate'
import type { BirthDetails } from './types'

const sample: BirthDetails = {
  name: 'Test Native',
  gender: 'male',
  dateOfBirth: '1990-08-15',
  timeOfBirth: '10:30',
  placeName: 'Delhi',
  latitude: 28.6139,
  longitude: 77.209,
  timezoneOffsetMinutes: 330,
  language: 'en',
}

const chart = generateKundali(sample)

function fail(msg: string): never {
  console.error(msg)
  throw new Error(msg)
}

if (!chart.planets.length || chart.planets.length !== 9) {
  fail('Expected 9 planets')
}
if (chart.lagnaSignIndex < 0 || chart.lagnaSignIndex > 11) {
  fail('Invalid lagna')
}
if (!chart.currentDasha.lordEn) {
  fail('Missing dasha')
}

console.log('OK', {
  lagna: chart.lagnaEn,
  moon: chart.moonSignEn,
  sun: chart.sunSignEn,
  ayanamsa: chart.ayanamsa.toFixed(4),
  dasha: chart.currentDasha.lordEn,
  doshas: chart.doshas.map((d) => d.id),
  planets: chart.planets.map((p) => `${p.nameEn}:${p.signEn}@H${p.house}`),
})
