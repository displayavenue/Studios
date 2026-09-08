import * as Astronomy from "astronomy-engine";
import { tropicalToSidereal } from "./ayanamsa";
import { julianCenturiesJ2000, norm360, toDegrees, toRadians } from "./math";

export type PlanetKey =
  | "Sun"
  | "Moon"
  | "Mercury"
  | "Venus"
  | "Mars"
  | "Jupiter"
  | "Saturn"
  | "Rahu"
  | "Ketu";

function geoTropicalLongitude(body: Astronomy.Body, time: Astronomy.AstroTime): number {
  if (body === Astronomy.Body.Moon) {
    return norm360(Astronomy.EclipticGeoMoon(time).lon);
  }
  const vec = Astronomy.GeoVector(body, time, true);
  return norm360(Astronomy.Ecliptic(vec).elon);
}

/** Mean lunar ascending node (Rahu) — classical mean-node formula. */
export function meanRahuLongitudeTropical(date: Date): number {
  const T = julianCenturiesJ2000(date);
  // Meeus / IAU-style mean longitude of ascending node (degrees)
  const omega =
    125.0445479 -
    1934.1363428 * T +
    0.0020708 * T * T +
    T * T * T / 450000;
  return norm360(omega);
}

export function meanObliquityDegrees(date: Date): number {
  const T = julianCenturiesJ2000(date);
  // IAU 2000 approximate mean obliquity
  return 23.4392911 - 0.0130042 * T - 0.00000016 * T * T;
}

/**
 * Ascendant (Lagna) tropical ecliptic longitude.
 * Standard spherical astronomy formula from RAMC, latitude, obliquity.
 */
export function tropicalAscendant(date: Date, latDeg: number, lngDeg: number): number {
  const time = Astronomy.MakeTime(date);
  const gmstHours = Astronomy.SiderealTime(time);
  const lstHours = ((gmstHours + lngDeg / 15) % 24 + 24) % 24;
  const ramc = toRadians(lstHours * 15);
  const eps = toRadians(meanObliquityDegrees(date));
  const phi = toRadians(latDeg);

  const y = Math.cos(ramc);
  const x = -(Math.sin(ramc) * Math.cos(eps) + Math.tan(phi) * Math.sin(eps));
  return norm360(toDegrees(Math.atan2(y, x)));
}

export function computeTropicalLongitudes(date: Date): Record<PlanetKey, number> {
  const time = Astronomy.MakeTime(date);
  const rahu = meanRahuLongitudeTropical(date);
  return {
    Sun: geoTropicalLongitude(Astronomy.Body.Sun, time),
    Moon: geoTropicalLongitude(Astronomy.Body.Moon, time),
    Mercury: geoTropicalLongitude(Astronomy.Body.Mercury, time),
    Venus: geoTropicalLongitude(Astronomy.Body.Venus, time),
    Mars: geoTropicalLongitude(Astronomy.Body.Mars, time),
    Jupiter: geoTropicalLongitude(Astronomy.Body.Jupiter, time),
    Saturn: geoTropicalLongitude(Astronomy.Body.Saturn, time),
    Rahu: rahu,
    Ketu: norm360(rahu + 180),
  };
}

export function computeSiderealLongitudes(date: Date): Record<PlanetKey, number> {
  const tropical = computeTropicalLongitudes(date);
  const out = {} as Record<PlanetKey, number>;
  for (const [k, v] of Object.entries(tropical)) {
    out[k as PlanetKey] = tropicalToSidereal(v, date);
  }
  return out;
}
