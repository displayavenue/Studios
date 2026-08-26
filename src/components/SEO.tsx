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

export function SEO({
  title,
  description,
  path = "/",
  type = "website",
  image = "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80",
  noindex = false,
}: SEOProps) {
  const { company } = useCms();

  useEffect(() => {
    document.title = title;
    const url = `${company.website}${path === "/" ? "" : path}`;

    setMeta('meta[name="description"]', "content", description);
    setMeta(
      'meta[name="google-site-verification"]',
      "content",
      "80ZVa9R1VjKZnfedwtUgfAYvfs1WsncTMsAwiSeSTBM",
    );
    setMeta(
      'meta[name="robots"]',
      "content",
      noindex ? "noindex,nofollow" : "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1",
    );
    setMeta('meta[name="author"]', "content", company.name);
    setMeta('meta[name="geo.region"]', "content", "IN-MH");
    setMeta('meta[name="geo.placename"]', "content", "Mumbai");
    setMeta('meta[property="og:site_name"]', "content", company.name);
    setMeta('meta[property="og:title"]', "content", title);
    setMeta('meta[property="og:description"]', "content", description);
    setMeta('meta[property="og:type"]', "content", type);
    setMeta('meta[property="og:url"]', "content", url);
    setMeta('meta[property="og:image"]', "content", image);
    setMeta('meta[property="og:locale"]', "content", "en_IN");
    setMeta('meta[name="twitter:card"]', "content", "summary_large_image");
    setMeta('meta[name="twitter:title"]', "content", title);
    setMeta('meta[name="twitter:description"]', "content", description);
    setMeta('meta[name="twitter:image"]', "content", image);

    let canonical = document.querySelector(
      'link[rel="canonical"]',
    ) as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = url;
  }, [title, description, path, type, image, noindex, company.website, company.name]);

  return null;
}

export function LocalBusinessSchema() {
  const { company, testimonials, services } = useCms();

  useEffect(() => {
    const addr = company.address;
    const socials = (company.socials || []).filter((u) =>
      /^https?:\/\//i.test(u),
    );

    const reviews = testimonials.slice(0, 5).map((t) => ({
      "@type": "Review",
      author: { "@type": "Person", name: t.name },
      reviewBody: t.quote,
      name: t.role,
      reviewRating: {
        "@type": "Rating",
        ratingValue: "5",
        bestRating: "5",
      },
    }));

    upsertJsonLd("schema-local-business", {
      "@context": "https://schema.org",
      "@type": ["LocalBusiness", "ProfessionalService", "Photographers"],
      "@id": `${company.website}/#business`,
      name: company.name,
      alternateName: ["DisplayAvenue", "DisplayAvenue Wedding Photographers"],
      description:
        company.tagline ||
        "Premium wedding photographer in Mumbai for candid & traditional photography, cinematic wedding films, pre-wedding, engagement, maternity, birthday and event coverage across India.",
      url: company.website,
      telephone: company.phone,
      email: company.email,
      image: [
        "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80",
      ],
      logo: `${company.website}/favicon.svg`,
      priceRange: "₹₹₹",
      currenciesAccepted: "INR",
      paymentAccepted: "Cash, UPI, Bank Transfer, Card",
      foundingDate: "2018",
      address: {
        "@type": "PostalAddress",
        streetAddress:
          addr.streetAddress ||
          "Office No. 44, D Wing, Shree Sharanam CHS, Unique Garden, Kanakia",
        addressLocality: addr.addressLocality || "Mumbai",
        addressRegion: addr.addressRegion || "Maharashtra",
        postalCode: addr.postalCode || "401107",
        addressCountry: addr.addressCountry || "IN",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: addr.geo?.latitude ?? 19.2952,
        longitude: addr.geo?.longitude ?? 72.8679,
      },
      hasMap: addr.mapEmbed,
      areaServed: [
        { "@type": "Country", name: "India" },
        { "@type": "City", name: company.primaryFocus || "Mumbai" },
      ],
      knowsAbout: [
        "Wedding photographer in Mumbai",
        "Candid wedding photography",
        "Cinematic wedding films",
        "Pre-wedding shoot",
        "Destination wedding photography",
        "Maternity photography",
        "Engagement photography",
        "Birthday photography",
        ...services.slice(0, 8).map((s) => s.title),
      ],
      slogan: "The wedding photographer couples shortlist for forever",
      keywords:
        "wedding photographer Mumbai, candid wedding photographer, wedding photography packages, pre wedding shoot Mumbai, cinematic wedding films",
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
          contactType: "customer service",
          areaServed: "IN",
          availableLanguage: ["English", "Hindi"],
        },
      ],
      sameAs: socials.length
        ? socials
        : [company.whatsappHref].filter(Boolean),
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.9",
        reviewCount: String(Math.max(testimonials.length, 6)),
        bestRating: "5",
        worstRating: "1",
      },
      review: reviews,
    });
  }, [company, testimonials, services]);

  return null;
}

/** @deprecated use LocalBusinessSchema */
export function OrganizationSchema() {
  return <LocalBusinessSchema />;
}

export function WebSiteSchema() {
  const { company } = useCms();

  useEffect(() => {
    upsertJsonLd("schema-website", {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${company.website}/#website`,
      name: company.name,
      url: company.website,
      description: company.tagline,
      publisher: { "@id": `${company.website}/#business` },
      inLanguage: "en-IN",
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
  image,
  path,
  category,
}: {
  name: string;
  description: string;
  image: string;
  path: string;
  category?: string;
}) {
  const { company } = useCms();

  useEffect(() => {
    upsertJsonLd("schema-service", {
      "@context": "https://schema.org",
      "@type": "Service",
      name,
      description,
      image,
      url: `${company.website}${path}`,
      serviceType: category || name,
      provider: { "@id": `${company.website}/#business` },
      areaServed: {
        "@type": "Country",
        name: "India",
      },
      brand: {
        "@type": "Brand",
        name: company.name,
      },
    });
    return () => upsertJsonLd("schema-service", null);
  }, [name, description, image, path, category, company]);

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
        item: `${company.website}${item.path === "/" ? "" : item.path}`,
      })),
    });
    return () => upsertJsonLd("schema-breadcrumb", null);
  }, [items, company.website]);

  return null;
}

export function ArticleSchema({
  title,
  description,
  image,
  path,
  datePublished,
  category,
}: {
  title: string;
  description: string;
  image: string;
  path: string;
  datePublished?: string;
  category?: string;
}) {
  const { company } = useCms();

  useEffect(() => {
    upsertJsonLd("schema-article", {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: title,
      description,
      image,
      mainEntityOfPage: `${company.website}${path}`,
      datePublished: datePublished || undefined,
      author: { "@type": "Organization", name: company.name },
      publisher: {
        "@type": "Organization",
        name: company.name,
        logo: {
          "@type": "ImageObject",
          url: `${company.website}/favicon.svg`,
        },
      },
      articleSection: category,
    });
    return () => upsertJsonLd("schema-article", null);
  }, [title, description, image, path, datePublished, category, company]);

  return null;
}
