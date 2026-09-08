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
};

export type ChartData = {
  mock: boolean;
  disclaimer: string;
  ascendant?: string;
  moonSign?: string;
  sunSign?: string;
  houses?: Record<string, string>;
  planets?: Record<string, { sign: string; house: number; note: string }>;
};

export interface AstrologyProvider {
  calculateChart(input: BirthInput): Promise<ChartData>;
  interpretChart(chart: ChartData, templateKey: string): Promise<{ sections: Record<string, string> }>;
}
