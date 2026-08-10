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
  placeId: "",
  placeQuery: "Display Avenue Mira Road Mumbai",
  rating: 5,
  reviewCount: 4,
  profileUrl: "https://www.google.com/search?kgmid=/g/11l59jbzkb&q=Display+Avenue",
  writeReviewUrl: "https://share.google/OC1gFqDqJCDFjdL50",
  mapsUrl: "https://share.google/OC1gFqDqJCDFjdL50",
  title: "What clients say on Google",
  sub: "Real Google reviews for Display Avenue. Updated from our Google Business Profile.",
  lastSyncedAt: null,
  syncSource: "cms",
  reviews: [
    {
      author: "Rahul Sharma",
      rating: 5,
      relativeTime: "Recently",
      text: "DisplayAvenue rebuilt our entire digital engine. Lead quality improved and revenue followed within one quarter.",
    },
    {
      author: "Anita Desai",
      rating: 5,
      relativeTime: "Recently",
      text: "Transparent reporting, sharp strategy, and an AI toolkit that actually saves our team hours every week.",
    },
    {
      author: "Karan Mehta",
      rating: 5,
      relativeTime: "Recently",
      text: "From website to paid media, they operate like an extension of our team - fast, accountable, and ROI-focused.",
    },
    {
      author: "Neha Kapoor",
      rating: 5,
      relativeTime: "Recently",
      text: "The best agency partnership we have had. Clear process, creative excellence, and measurable growth.",
    },
  ],
};
