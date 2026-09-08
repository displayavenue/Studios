export type BirthInput = {
  name: string;
  gender?: string;
  dob: string;
  birthTime?: string;
  birthTimeUnknown?: boolean;
  placeName: string;
  lat?: number;
  lng?: number;
  timezone?: string;
  country?: string;
  /** Optional partner moon longitude (sidereal) for matching templates */
  partnerMoonLongitude?: number;
};

export type ChartPlanet = {
  sign: string;
  house: number;
  note: string;
  longitude?: number;
  formatted?: string;
  nakshatra?: string;
  pada?: number;
};

export type ChartData = {
  mock: boolean;
  disclaimer: string;
  ascendant?: string;
  moonSign?: string;
  sunSign?: string;
  houses?: Record<string, string>;
  planets?: Record<string, ChartPlanet>;
  /** Full Vedic engine payload when available */
  vedic?: Record<string, unknown>;
};

export interface AstrologyProvider {
  calculateChart(input: BirthInput): Promise<ChartData>;
  interpretChart(
    chart: ChartData,
    templateKey: string,
    chapterTitles?: string[],
  ): Promise<{
    sections: Record<string, string>;
    chapters?: Array<{ title: string; body: string }>;
  }>;
}
