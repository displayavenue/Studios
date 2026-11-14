import { computeMilan } from './milan'
import type { BirthDetails } from './types'

const boy: BirthDetails = {
  name: 'Aarav',
  gender: 'male',
  dateOfBirth: '1990-05-12',
  timeOfBirth: '09:15',
  placeName: 'Delhi',
  latitude: 28.6139,
  longitude: 77.209,
  timezoneOffsetMinutes: 330,
  language: 'en',
}

const girl: BirthDetails = {
  name: 'Ananya',
  gender: 'female',
  dateOfBirth: '1993-11-03',
  timeOfBirth: '18:40',
  placeName: 'Mumbai',
  latitude: 19.076,
  longitude: 72.8777,
  timezoneOffsetMinutes: 330,
  language: 'en',
}

const result = computeMilan(boy, girl)

if (result.koots.length !== 8) throw new Error('Expected 8 koots')
if (result.maxTotal !== 36) throw new Error('Max should be 36')
if (result.total < 0 || result.total > 36) throw new Error('Total out of range')

const sum = result.koots.reduce((s, k) => s + k.score, 0)
if (Math.abs(sum - result.total) > 0.01) throw new Error('Koot sum mismatch')

console.log('OK milan', {
  total: result.total,
  boy: `${result.boy.moonSignEn}/${result.boy.nakshatraEn}`,
  girl: `${result.girl.moonSignEn}/${result.girl.nakshatraEn}`,
  manglik: [result.boy.manglik, result.girl.manglik],
  koots: result.koots.map((k) => `${k.nameEn}:${k.score}/${k.max}`),
})
