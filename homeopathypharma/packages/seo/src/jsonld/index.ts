/** Schema.org context URI. */
export const SCHEMA_ORG_CONTEXT = "https://schema.org" as const;

export type JsonLdDocument = Record<string, unknown> & {
  "@context": typeof SCHEMA_ORG_CONTEXT | string;
  "@type": string;
};

export interface OrganizationInput {
  name: string;
  url: string;
  logoUrl: string;
  description: string;
  sameAs?: string[];
  contactEmail?: string;
  contactPhone?: string;
}

export function buildOrganizationJsonLd(input: OrganizationInput): JsonLdDocument {
  return {
    "@context": SCHEMA_ORG_CONTEXT,
    "@type": "Organization",
    name: input.name,
    url: input.url,
    logo: input.logoUrl,
    description: input.description,
    ...(input.sameAs?.length ? { sameAs: input.sameAs } : {}),
    ...(input.contactEmail
      ? { contactPoint: { "@type": "ContactPoint", email: input.contactEmail, contactType: "customer support" } }
      : {}),
  };
}

export interface WebSiteInput {
  name: string;
  url: string;
  searchUrlTemplate: string;
}

export function buildWebSiteJsonLd(input: WebSiteInput): JsonLdDocument {
  return {
    "@context": SCHEMA_ORG_CONTEXT,
    "@type": "WebSite",
    name: input.name,
    url: input.url,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: input.searchUrlTemplate,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export interface BreadcrumbListInput {
  items: Array<{ name: string; url: string }>;
}

export function buildBreadcrumbListJsonLd(input: BreadcrumbListInput): JsonLdDocument {
  return {
    "@context": SCHEMA_ORG_CONTEXT,
    "@type": "BreadcrumbList",
    itemListElement: input.items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export interface ProductJsonLdInput {
  name: string;
  description: string;
  url: string;
  sku: string;
  imageUrls: string[];
  brand: string;
  price: number;
  currency: string;
  availability: "InStock" | "OutOfStock" | "PreOrder";
  /** Only include when valid verified reviews exist — see buildAggregateRatingJsonLd. */
  aggregateRating?: NonNullable<ReturnType<typeof buildAggregateRatingJsonLd>>;
}

export function buildProductJsonLd(input: ProductJsonLdInput): JsonLdDocument {
  return {
    "@context": SCHEMA_ORG_CONTEXT,
    "@type": "Product",
    name: input.name,
    description: input.description,
    url: input.url,
    sku: input.sku,
    image: input.imageUrls,
    brand: { "@type": "Brand", name: input.brand },
    offers: {
      "@type": "Offer",
      url: input.url,
      priceCurrency: input.currency,
      price: input.price.toFixed(2),
      availability: `https://schema.org/${input.availability}`,
    },
    ...(input.aggregateRating ? { aggregateRating: input.aggregateRating } : {}),
  };
}

export interface FaqItem {
  question: string;
  answer: string;
}

export function buildFaqJsonLd(items: FaqItem[]): JsonLdDocument {
  return {
    "@context": SCHEMA_ORG_CONTEXT,
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export interface ArticleJsonLdInput {
  headline: string;
  description: string;
  url: string;
  imageUrl: string;
  datePublished: string;
  dateModified: string;
  authorName: string;
  publisherName: string;
  publisherLogoUrl: string;
}

export function buildArticleJsonLd(input: ArticleJsonLdInput): JsonLdDocument {
  return {
    "@context": SCHEMA_ORG_CONTEXT,
    "@type": "Article",
    headline: input.headline,
    description: input.description,
    url: input.url,
    image: input.imageUrl,
    datePublished: input.datePublished,
    dateModified: input.dateModified,
    author: { "@type": "Person", name: input.authorName },
    publisher: {
      "@type": "Organization",
      name: input.publisherName,
      logo: { "@type": "ImageObject", url: input.publisherLogoUrl },
    },
  };
}

export interface MedicalWebPageInput {
  name: string;
  description: string;
  url: string;
  lastReviewed: string;
  reviewedByName: string;
  reviewedByCredential: string;
}

/** Medical content pages — requires visible reviewer attribution on page. */
export function buildMedicalWebPageJsonLd(input: MedicalWebPageInput): JsonLdDocument {
  return {
    "@context": SCHEMA_ORG_CONTEXT,
    "@type": "MedicalWebPage",
    name: input.name,
    description: input.description,
    url: input.url,
    lastReviewed: input.lastReviewed,
    reviewedBy: {
      "@type": "Person",
      name: input.reviewedByName,
      jobTitle: input.reviewedByCredential,
    },
  };
}

export interface AggregateRatingInput {
  ratingValue: number;
  reviewCount: number;
  bestRating?: number;
  worstRating?: number;
}

const MIN_VERIFIED_REVIEWS_FOR_SCHEMA = 3;

/**
 * Build AggregateRating JSON-LD only when verified purchase reviews meet threshold.
 * Policy: no fake reviews — caller must pass server-verified counts only.
 */
export function buildAggregateRatingJsonLd(
  input: AggregateRatingInput,
): JsonLdDocument | null {
  if (input.reviewCount < MIN_VERIFIED_REVIEWS_FOR_SCHEMA) {
    return null;
  }
  if (input.ratingValue < 1 || input.ratingValue > 5) {
    return null;
  }
  return {
    "@context": SCHEMA_ORG_CONTEXT,
    "@type": "AggregateRating",
    ratingValue: input.ratingValue.toFixed(1),
    reviewCount: input.reviewCount,
    bestRating: input.bestRating ?? 5,
    worstRating: input.worstRating ?? 1,
  };
}

/** Serialize JSON-LD for embedding in a script tag. */
export function serializeJsonLd(data: JsonLdDocument | JsonLdDocument[]): string {
  return JSON.stringify(data, null, 0);
}
