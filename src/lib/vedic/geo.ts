/** Rough city coordinates for India-first birth-place resolution when lat/lng not stored. */
const CITY_COORDS: Array<{ match: RegExp; lat: number; lng: number; tz: string }> = [
  { match: /mumbai|bombay/i, lat: 19.076, lng: 72.8777, tz: "Asia/Kolkata" },
  { match: /delhi|new delhi/i, lat: 28.6139, lng: 77.209, tz: "Asia/Kolkata" },
  { match: /bengaluru|bangalore/i, lat: 12.9716, lng: 77.5946, tz: "Asia/Kolkata" },
  { match: /hyderabad/i, lat: 17.385, lng: 78.4867, tz: "Asia/Kolkata" },
  { match: /chennai|madras/i, lat: 13.0827, lng: 80.2707, tz: "Asia/Kolkata" },
  { match: /kolkata|calcutta/i, lat: 22.5726, lng: 88.3639, tz: "Asia/Kolkata" },
  { match: /pune/i, lat: 18.5204, lng: 73.8567, tz: "Asia/Kolkata" },
  { match: /ahmedabad/i, lat: 23.0225, lng: 72.5714, tz: "Asia/Kolkata" },
  { match: /jaipur/i, lat: 26.9124, lng: 75.7873, tz: "Asia/Kolkata" },
  { match: /lucknow/i, lat: 26.8467, lng: 80.9462, tz: "Asia/Kolkata" },
  { match: /chandigarh/i, lat: 30.7333, lng: 76.7794, tz: "Asia/Kolkata" },
  { match: /kochi|cochin|ernakulam/i, lat: 9.9312, lng: 76.2673, tz: "Asia/Kolkata" },
  { match: /indore/i, lat: 22.7196, lng: 75.8577, tz: "Asia/Kolkata" },
  { match: /bhopal/i, lat: 23.2599, lng: 77.4126, tz: "Asia/Kolkata" },
  { match: /patna/i, lat: 25.5941, lng: 85.1376, tz: "Asia/Kolkata" },
  { match: /surat/i, lat: 21.1702, lng: 72.8311, tz: "Asia/Kolkata" },
  { match: /varanasi|banaras|benaras/i, lat: 25.3176, lng: 82.9739, tz: "Asia/Kolkata" },
  { match: /noida|gurugram|gurgaon/i, lat: 28.5355, lng: 77.391, tz: "Asia/Kolkata" },
  { match: /nagpur/i, lat: 21.1458, lng: 79.0882, tz: "Asia/Kolkata" },
  { match: /vadodara|baroda/i, lat: 22.3072, lng: 73.1812, tz: "Asia/Kolkata" },
  { match: /visakhapatnam|vizag/i, lat: 17.6868, lng: 83.2185, tz: "Asia/Kolkata" },
  { match: /coimbatore/i, lat: 11.0168, lng: 76.9558, tz: "Asia/Kolkata" },
  { match: /madurai/i, lat: 9.9252, lng: 78.1198, tz: "Asia/Kolkata" },
  { match: /thiruvananthapuram|trivandrum/i, lat: 8.5241, lng: 76.9366, tz: "Asia/Kolkata" },
  { match: /mysuru|mysore/i, lat: 12.2958, lng: 76.6394, tz: "Asia/Kolkata" },
  { match: /ranchi/i, lat: 23.3441, lng: 85.3096, tz: "Asia/Kolkata" },
  { match: /guwahati/i, lat: 26.1445, lng: 91.7362, tz: "Asia/Kolkata" },
  { match: /bhubaneswar/i, lat: 20.2961, lng: 85.8245, tz: "Asia/Kolkata" },
  { match: /dehradun/i, lat: 30.3165, lng: 78.0322, tz: "Asia/Kolkata" },
  { match: /shimla/i, lat: 31.1048, lng: 77.1734, tz: "Asia/Kolkata" },
  { match: /goa|panaji|panjim/i, lat: 15.4909, lng: 73.8278, tz: "Asia/Kolkata" },
  { match: /amritsar/i, lat: 31.634, lng: 74.8723, tz: "Asia/Kolkata" },
  { match: /ludhiana/i, lat: 30.901, lng: 75.8573, tz: "Asia/Kolkata" },
  { match: /kanpur/i, lat: 26.4499, lng: 80.3319, tz: "Asia/Kolkata" },
  { match: /agra/i, lat: 27.1767, lng: 78.0081, tz: "Asia/Kolkata" },
  { match: /nashik|nasik/i, lat: 19.9975, lng: 73.7898, tz: "Asia/Kolkata" },
  { match: /rajkot/i, lat: 22.3039, lng: 70.8022, tz: "Asia/Kolkata" },
  { match: /london/i, lat: 51.5074, lng: -0.1278, tz: "Europe/London" },
  { match: /new york|nyc/i, lat: 40.7128, lng: -74.006, tz: "America/New_York" },
  { match: /dubai/i, lat: 25.2048, lng: 55.2708, tz: "Asia/Dubai" },
  { match: /singapore/i, lat: 1.3521, lng: 103.8198, tz: "Asia/Singapore" },
  { match: /toronto/i, lat: 43.6532, lng: -79.3832, tz: "America/Toronto" },
  { match: /sydney/i, lat: -33.8688, lng: 151.2093, tz: "Australia/Sydney" },
  { match: /melbourne/i, lat: -37.8136, lng: 144.9631, tz: "Australia/Melbourne" },
];

export function resolvePlace(
  placeName: string,
  lat?: number | null,
  lng?: number | null,
  timezone?: string | null,
) {
  if (lat != null && lng != null && Number.isFinite(Number(lat)) && Number.isFinite(Number(lng))) {
    // Ignore hardcoded Delhi defaults that were historically seeded without real geocoding
    const isDefaultDelhi =
      Math.abs(Number(lat) - 28.6139) < 0.0001 && Math.abs(Number(lng) - 77.209) < 0.0001;
    if (!isDefaultDelhi || /delhi/i.test(placeName)) {
      return { lat: Number(lat), lng: Number(lng), timezone: timezone || "Asia/Kolkata", approx: false };
    }
  }
  for (const city of CITY_COORDS) {
    if (city.match.test(placeName)) {
      return { lat: city.lat, lng: city.lng, timezone: timezone || city.tz, approx: true };
    }
  }
  // India geographic center fallback
  return { lat: 22.3511, lng: 78.6677, timezone: timezone || "Asia/Kolkata", approx: true };
}
