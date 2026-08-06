import { useEffect } from "react";
import { useCms } from "../cms/CmsProvider";

type SEOProps = {
  title: string;
  description: string;
  path?: string;
  type?: string;
  image?: string;
  noindex?: boolean;
};

/** Absolute public URL including Vite base (/demo when deployed as demo). */
export function absoluteUrl(website: string, path = "/"): string {
  const origin = website.replace(/\/$/, "");
  const mount = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");
  const cleanPath = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  return `${origin}${mount}${cleanPath || "/"}`.replace(/([^:]\/)\/+/g, "$1");
}

function upsertJsonLd(id: string, data: Record<string, unknown> | null) {
  let script = document.getElementById(id) as HTMLScriptElement | null;
  if (!data) {
    script?.remove();
    return;
  }
  if (!script) {
    script = document.createElement("script");
    script.id = id;
    script.type = "application/ld+json";
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data);
}

function setMeta(selector: string, attr: string, value: string) {
  let el = document.querySelector(selector) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    if (selector.includes("property=")) {
      el.setAttribute("property", selector.match(/property="([^"]+)"/)![1]);
    } else if (selector.includes("name=")) {
      el.setAttribute("name", selector.match(/name="([^"]+)"/)![1]);
    }
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
}

const DEFAULT_OG =
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80";

export function SEO({
  title,
  description,
  path = "/",
  type = "website",
  image = DEFAULT_OG,
  noindex = false,
}: SEOProps) {
  const { company, tracking } = useCms();
  const siteVerification = tracking.googleSiteVerification?.trim();
  const companyOg = (company as { ogImage?: string }).ogImage?.trim();
  const resolvedImage =
    image && image !== DEFAULT_OG
      ? image
      : companyOg
        ? companyOg.startsWith("http")
          ? companyOg
          : absoluteUrl(company.website, companyOg)
        : DEFAULT_OG;

  useEffect(() => {
    document.title = title;
    const url = absoluteUrl(company.website, path);

    setMeta('meta[name="description"]', "content", description);
    if (siteVerification) {
      setMeta(
        'meta[name="google-site-verification"]',
        "content",
        siteVerification,
      );
    }
    setMeta(
      'meta[name="robots"]',
      "content",
      noindex
        ? "noindex,nofollow"
        : "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1",
    );
    setMeta('meta[name="author"]', "content", company.name);
    setMeta('meta[name="geo.region"]', "content", "IN-MH");
    setMeta('meta[name="geo.placename"]', "content", company.address.city || "Mumbai");
    setMeta('meta[property="og:site_name"]', "content", company.name);
    setMeta('meta[property="og:title"]', "content", title);
    setMeta('meta[property="og:description"]', "content", description);
    setMeta('meta[property="og:type"]', "content", type);
    setMeta('meta[property="og:url"]', "content", url);
    setMeta('meta[property="og:image"]', "content", resolvedImage);
    setMeta('meta[property="og:locale"]', "content", "en_IN");
    setMeta('meta[name="twitter:card"]', "content", "summary_large_image");
    setMeta('meta[name="twitter:title"]', "content", title);
    setMeta('meta[name="twitter:description"]', "content", description);
    setMeta('meta[name="twitter:image"]', "content", resolvedImage);

    let canonical = document.querySelector(
      'link[rel="canonical"]',
    ) as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = url;
  }, [
    title,
    description,
    path,
    type,
    image,
    resolvedImage,
    noindex,
    company.website,
    company.name,
    company.address.city,
    siteVerification,
  ]);

  return null;
}

export function LocalBusinessSchema() {
  const { company, content, services } = useCms();

  useEffect(() => {
    const socials = Object.values(company.socials || {}).filter((u) =>
      /^https?:\/\//i.test(u),
    );
    const site = absoluteUrl(company.website, "/").replace(/\/$/, "") || company.website;

    const reviews = content.testimonials.slice(0, 5).map((t) => ({
      "@type": "Review",
      author: { "@type": "Person", name: t.name },
      reviewBody: t.quote,
      name: t.title,
      reviewRating: {
        "@type": "Rating",
        ratingValue: String(t.rating ?? 5),
        bestRating: "5",
      },
    }));

    upsertJsonLd("schema-local-business", {
      "@context": "https://schema.org",
      "@type": ["ProfessionalService", "Organization"],
      "@id": `${site}/#business`,
      name: company.name,
      alternateName: "DisplayAvenue",
      description: company.tagline,
      url: site,
      telephone: company.phone,
      email: company.email,
      image: [DEFAULT_OG],
      logo: absoluteUrl(company.website, "/favicon.svg"),
      priceRange: "₹₹₹",
      currenciesAccepted: "INR",
      address: {
        "@type": "PostalAddress",
        streetAddress: (company.address.lines || []).join(", "),
        addressLocality: company.address.city || "Mumbai",
        addressRegion: "Maharashtra",
        addressCountry: "IN",
      },
      areaServed: [
        { "@type": "Country", name: "India" },
        { "@type": "City", name: company.address.city || "Mumbai" },
      ],
      knowsAbout: services.slice(0, 16).map((s) => s.title),
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ],
          opens: "10:00",
          closes: "19:00",
        },
      ],
      contactPoint: [
        {
          "@type": "ContactPoint",
          telephone: company.phone,
          contactType: "sales",
          areaServed: "IN",
          availableLanguage: ["English", "Hindi"],
        },
      ],
      sameAs: socials.length ? socials : [company.whatsappHref].filter(Boolean),
      ...(company.googleMaps?.shareUrl || company.googleMaps?.profileUrl
        ? {
            hasMap:
              company.googleMaps.shareUrl || company.googleMaps.profileUrl,
          }
        : {}),
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.9",
        reviewCount: "150",
        bestRating: "5",
      },
      review: reviews,
    });
  }, [company, content.testimonials, services]);

  return null;
}

export function WebSiteSchema() {
  const { company } = useCms();

  useEffect(() => {
    const site = absoluteUrl(company.website, "/").replace(/\/$/, "") || company.website;
    upsertJsonLd("schema-website", {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${site}/#website`,
      name: company.name,
      url: site,
      description: company.tagline,
      publisher: { "@id": `${site}/#business` },
      inLanguage: "en-IN",
      potentialAction: {
        "@type": "SearchAction",
        target: `${site}/resources?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    });
  }, [company]);

  return null;
}

export function FAQPageSchema({
  faqs,
}: {
  faqs: { question: string; answer: string }[];
}) {
  useEffect(() => {
    if (!faqs.length) {
      upsertJsonLd("schema-faq", null);
      return;
    }
    upsertJsonLd("schema-faq", {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: f.answer,
        },
      })),
    });
    return () => upsertJsonLd("schema-faq", null);
  }, [faqs]);

  return null;
}

export function ServiceSchema({
  name,
  description,
  path,
  category,
  areaServed,
  keywords,
}: {
  name: string;
  description: string;
  path: string;
  category?: string;
  areaServed?: string[];
  keywords?: string[];
}) {
  const { company } = useCms();

  useEffect(() => {
    const site = absoluteUrl(company.website, "/").replace(/\/$/, "") || company.website;
    const areas =
      areaServed && areaServed.length
        ? areaServed.map((city) => ({ "@type": "City", name: city }))
        : [{ "@type": "Country", name: "India" }];
    upsertJsonLd("schema-service", {
      "@context": "https://schema.org",
      "@type": "Service",
      name,
      description,
      url: absoluteUrl(company.website, path),
      serviceType: category || name,
      provider: { "@id": `${site}/#business` },
      areaServed: areas,
      brand: { "@type": "Brand", name: company.name },
      ...(keywords?.length ? { keywords: keywords.join(", ") } : {}),
    });
    return () => upsertJsonLd("schema-service", null);
  }, [name, description, path, category, areaServed, keywords, company]);

  return null;
}

export function ReviewListSchema({
  serviceName,
  reviews,
}: {
  serviceName: string;
  reviews: {
    name: string;
    role?: string;
    quote: string;
    rating: number;
  }[];
}) {
  const { company } = useCms();

  useEffect(() => {
    if (!reviews.length) {
      upsertJsonLd("schema-reviews", null);
      return;
    }
    const site = absoluteUrl(company.website, "/").replace(/\/$/, "") || company.website;
    const avg =
      reviews.reduce((sum, r) => sum + (r.rating || 5), 0) / reviews.length;
    upsertJsonLd("schema-reviews", {
      "@context": "https://schema.org",
      "@type": "Product",
      name: `${serviceName} by ${company.name}`,
      description: `${serviceName} services from ${company.name}`,
      brand: { "@type": "Brand", name: company.name },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: avg.toFixed(1),
        reviewCount: String(reviews.length),
        bestRating: "5",
        worstRating: "1",
      },
      review: reviews.slice(0, 25).map((r) => ({
        "@type": "Review",
        author: { "@type": "Person", name: r.name },
        reviewBody: r.quote,
        name: r.role || serviceName,
        reviewRating: {
          "@type": "Rating",
          ratingValue: String(r.rating || 5),
          bestRating: "5",
        },
      })),
      provider: { "@id": `${site}/#business` },
    });
    return () => upsertJsonLd("schema-reviews", null);
  }, [serviceName, reviews, company]);

  return null;
}

export function BreadcrumbSchema({
  items,
}: {
  items: { name: string; path: string }[];
}) {
  const { company } = useCms();

  useEffect(() => {
    upsertJsonLd("schema-breadcrumb", {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: items.map((item, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: item.name,
        item: absoluteUrl(company.website, item.path),
      })),
    });
    return () => upsertJsonLd("schema-breadcrumb", null);
  }, [items, company.website]);

  return null;
}

export function ArticleSchema({
  title,
  description,
  path,
  category,
}: {
  title: string;
  description: string;
  path: string;
  category?: string;
}) {
  const { company } = useCms();

  useEffect(() => {
    upsertJsonLd("schema-article", {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: title,
      description,
      mainEntityOfPage: absoluteUrl(company.website, path),
      author: { "@type": "Organization", name: company.name },
      publisher: {
        "@type": "Organization",
        name: company.name,
        logo: {
          "@type": "ImageObject",
          url: absoluteUrl(company.website, "/favicon.svg"),
        },
      },
      articleSection: category,
    });
    return () => upsertJsonLd("schema-article", null);
  }, [title, description, path, category, company]);

  return null;
}
