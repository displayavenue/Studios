export const HEALTH_AREA_LABELS = {
  "general-wellness": "General wellness",
  "digestive-health": "Digestive health",
  "respiratory-health": "Respiratory health",
  "skin-health": "Skin health",
  "pet-care": "Pet care",
} as const;

export type HealthAreaSlug = keyof typeof HEALTH_AREA_LABELS;
