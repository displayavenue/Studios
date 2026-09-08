import { julianCenturiesJ2000, julianDay, norm360 } from "./math";

/**
 * Lahiri (Chitrapaksha) ayanamsa in degrees.
 * Anchored to the widely used value ≈ 23°51'11" near J2000.0 and the
 * standard precession rate used in Indian calendar / Lahiri computations.
 *
 * Reference points used for calibration in tests:
 * - 2000-01-01 ≈ 23.853°
 * - increases ~50.29"/year
 */
export function lahiriAyanamsa(date: Date): number {
  const t = julianCenturiesJ2000(date);
  // Linear + small quadratic terms aligned with common Lahiri implementations
  const ayan =
    23.853955555555556 +
    1.397971518 * t +
    0.000005584 * t * t;
  return norm360(ayan);
}

export function tropicalToSidereal(tropicalLon: number, date: Date): number {
  return norm360(tropicalLon - lahiriAyanamsa(date));
}

export function ayanamsaMeta(date: Date) {
  return {
    name: "Lahiri (Chitrapaksha)" as const,
    degrees: lahiriAyanamsa(date),
    julianDay: julianDay(date),
  };
}
