import { useEffect } from "react";
import { useCms } from "../cms/CmsProvider";

type SEOProps = {
  title: string;
  description: string;
  path?: string;
  type?: string;
  image?: string;
};

export function SEO({
  title,
  description,
  path = "/",
  type = "website",
  image = "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80",
}: SEOProps) {
  const { company } = useCms();

  useEffect(() => {
    document.title = title;

    const setMeta = (selector: string, attr: string, value: string) => {
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
    };

    setMeta('meta[name="description"]', "content", description);
    setMeta('meta[property="og:title"]', "content", title);
    setMeta('meta[property="og:description"]', "content", description);
    setMeta('meta[property="og:type"]', "content", type);
    setMeta('meta[property="og:url"]', "content", `${company.website}${path}`);
    setMeta('meta[property="og:image"]', "content", image);
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
    canonical.href = `${company.website}${path}`;
  }, [title, description, path, type, image, company.website]);

  return null;
}

export function OrganizationSchema() {
  const { company } = useCms();

  useEffect(() => {
    const id = "schema-organization";
    let script = document.getElementById(id) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.id = id;
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "@id": `${company.website}/#business`,
      name: company.name,
      description: company.tagline,
      url: company.website,
      telephone: company.phone,
      email: company.email,
      image:
        "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Office No. 44, D Wing, Shree Sharanam CHS, Unique Garden, Kanakia",
        addressLocality: "Mira Road East, Mumbai",
        addressRegion: "Maharashtra",
        postalCode: "401107",
        addressCountry: "IN",
      },
      areaServed: "IN",
      priceRange: "₹₹₹",
      sameAs: [
        "https://instagram.com",
        "https://youtube.com",
        "https://linkedin.com",
      ],
    });
  }, [company]);

  return null;
}
