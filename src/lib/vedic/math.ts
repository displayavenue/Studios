export function norm360(deg: number): number {
  const x = deg % 360;
  return x < 0 ? x + 360 : x;
}

export function degToDms(deg: number): { d: number; m: number; s: number } {
  const n = norm360(deg);
  const d = Math.floor(n);
  const mf = (n - d) * 60;
  const m = Math.floor(mf);
  const s = (mf - m) * 60;
  return { d, m, s: Math.round(s * 100) / 100 };
}

export function formatDms(deg: number): string {
  const { d, m, s } = degToDms(deg);
  return `${d}deg ${String(m).padStart(2, "0")}'${s.toFixed(0).padStart(2, "0")}"`;
}

export function julianDay(date: Date): number {
  // Astronomy-engine MakeTime uses UT; JD approx from Unix
  return date.getTime() / 86400000 + 2440587.5;
}

export function julianCenturiesJ2000(date: Date): number {
  return (julianDay(date) - 2451545.0) / 36525;
}

export function toRadians(deg: number): number {
  return (deg * Math.PI) / 180;
}

export function toDegrees(rad: number): number {
  return (rad * 180) / Math.PI;
}
