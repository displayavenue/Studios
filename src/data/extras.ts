export type GoogleReview = {
  name: string;
  initials: string;
  rating: number;
  time: string;
  text: string;
};

export type InstagramPost = {
  id: string;
  image: string;
  likes: string;
  caption: string;
};

export type CaseStudy = {
  slug: string;
  title: string;
  client: string;
  category: string;
  city: string;
  year: string;
  result: string;
  summary: string;
  challenge: string;
  approach: string;
  outcome: string;
  image: string;
  gallery: string[];
};

export type CareerRole = {
  id: string;
  title: string;
  type: string;
  location: string;
  summary: string;
  requirements: string[];
};

export type ClientGallery = {
  code: string;
  title: string;
  type: string;
  cover: string;
  images: string[];
};

export type AvailabilityDay = {
  date: number;
  status: "open" | "limited" | "booked" | "past";
};

export type AvailabilityMonth = {
  label: string;
  year: number;
  month: number;
  days: AvailabilityDay[];
};

export type ExtrasContent = {
  googleReviews: {
    rating: number;
    count: number;
    label: string;
    profileUrl: string;
    reviews: GoogleReview[];
  };
  instagram: {
    handle: string;
    url: string;
    posts: InstagramPost[];
  };
  awards: { title: string; org: string; year: string }[];
  showreel: {
    eyebrow: string;
    title: string;
    text: string;
    youtubeUrl: string;
    poster: string;
  };
  caseStudies: CaseStudy[];
  careers: {
    eyebrow: string;
    title: string;
    text: string;
    perks: string[];
    roles: CareerRole[];
  };
  clientGalleries: ClientGallery[];
  availability: {
    eyebrow: string;
    title: string;
    text: string;
    note: string;
    months: AvailabilityMonth[];
  };
};

export const extrasFallback: ExtrasContent = {
  googleReviews: {
    rating: 4.9,
    count: 186,
    label: "Google reviews",
    profileUrl: "https://www.google.com/maps",
    reviews: [],
  },
  instagram: {
    handle: "@displayavenuestudios",
    url: "https://www.instagram.com/displayavenuestudios/",
    posts: [],
  },
  awards: [],
  showreel: {
    eyebrow: "Studio showreel",
    title: "Indian weddings, vows & forever — in one film",
    text: "",
    youtubeUrl: "",
    poster: "",
  },
  caseStudies: [],
  careers: {
    eyebrow: "Careers",
    title: "Build visual stories with us",
    text: "",
    perks: [],
    roles: [],
  },
  clientGalleries: [],
  availability: {
    eyebrow: "Availability",
    title: "Wedding & production calendar",
    text: "",
    note: "",
    months: [],
  },
};

export function mergeExtras(partial: Partial<ExtrasContent> | null | undefined): ExtrasContent {
  const p = partial || {};
  return {
    googleReviews: {
      ...extrasFallback.googleReviews,
      ...(p.googleReviews || {}),
      reviews: p.googleReviews?.reviews?.length
        ? p.googleReviews.reviews
        : extrasFallback.googleReviews.reviews,
    },
    instagram: {
      ...extrasFallback.instagram,
      ...(p.instagram || {}),
      posts: p.instagram?.posts?.length ? p.instagram.posts : extrasFallback.instagram.posts,
    },
    awards: p.awards?.length ? p.awards : extrasFallback.awards,
    showreel: { ...extrasFallback.showreel, ...(p.showreel || {}) },
    caseStudies: p.caseStudies?.length ? p.caseStudies : extrasFallback.caseStudies,
    careers: {
      ...extrasFallback.careers,
      ...(p.careers || {}),
      perks: p.careers?.perks?.length ? p.careers.perks : extrasFallback.careers.perks,
      roles: p.careers?.roles?.length ? p.careers.roles : extrasFallback.careers.roles,
    },
    clientGalleries: p.clientGalleries?.length
      ? p.clientGalleries
      : extrasFallback.clientGalleries,
    availability: {
      ...extrasFallback.availability,
      ...(p.availability || {}),
      months: p.availability?.months?.length
        ? p.availability.months
        : extrasFallback.availability.months,
    },
  };
}
