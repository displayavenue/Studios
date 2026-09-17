export type GoogleReview = {
  author: string;
  rating: number;
  relativeTime: string;
  text: string;
  profilePhotoUrl?: string;
  authorUrl?: string;
};

export type GoogleReviewsCms = {
  enabled: boolean;
  businessName: string;
  placeId: string;
  placeQuery: string;
  rating: number;
  reviewCount: number;
  profileUrl: string;
  writeReviewUrl: string;
  mapsUrl: string;
  title: string;
  sub: string;
  lastSyncedAt: string | null;
  syncSource: string;
  reviews: GoogleReview[];
};

export const fallbackGoogleReviews: GoogleReviewsCms = {
  enabled: true,
  businessName: "Display Avenue",
  placeId: "ChIJNa7u4d6x5zsRoOOdxeOMqwM",
  placeQuery: "Display Avenue Mira Road Mumbai",
  rating: 4.9,
  reviewCount: 172,
  profileUrl: "https://maps.app.goo.gl/MUgowgr6oRqLGWFZ6",
  writeReviewUrl: "https://maps.app.goo.gl/MUgowgr6oRqLGWFZ6",
  mapsUrl: "https://maps.app.goo.gl/MUgowgr6oRqLGWFZ6",
  title: "What clients say on Google",
  sub: "Real Google reviews for Display Avenue. Updated from our Google Business Profile.",
  lastSyncedAt: null,
  syncSource: "cms",
  reviews: [],
};
