/** Shared helpers for building rich product catalogue entries. */

export type Faq = { q: string; a: string };

export type WhatsIncludedRich = {
  included: string[];
  chapters: string[];
  whoFor: string[];
  outcomes: string[];
  pageEstimate?: number;
};

export type ProductSeed = {
  name: string;
  slug: string;
  categorySlug: string;
  shortDescription: string;
  description: string;
  whatsIncluded: WhatsIncludedRich;
  faqs: Faq[];
  deliveryNote: string;
  reportTemplateKey: string;
  sortOrder: number;
  pageEstimate: number;
};

export function faqDelivery(): Faq {
  return {
    q: "How long does delivery take?",
    a: "After successful payment, your digital PDF is generated and available in your dashboard within minutes. You also receive an email link when delivery is ready.",
  };
}

export function faqBirth(): Faq {
  return {
    q: "What birth details do I need?",
    a: "Date of birth, approximate time of birth, and place of birth. If time is unknown, we still generate a report and clearly mark time-sensitive sections as approximate.",
  };
}

export function faqEntertainment(): Faq {
  return {
    q: "Is this a prediction or guarantee?",
    a: "No. JyotishKundali reports are interpretive guidance for personal reflection and entertainment. They are not medical, legal, financial, or relationship advice, and they do not guarantee future events.",
  };
}

export function faqLanguages(): Faq {
  return {
    q: "Which languages are supported?",
    a: "The storefront supports English and Hindi UI. Report PDFs are currently delivered in English with clear section headings you can share with family.",
  };
}

export const COMMON_FAQS: Faq[] = [faqDelivery(), faqBirth(), faqLanguages(), faqEntertainment()];
