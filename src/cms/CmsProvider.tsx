import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  company as fallbackCompany,
  navLinks as fallbackNav,
  trustBadges as fallbackBadges,
  brandLogos as fallbackBrands,
} from "../data/company";
import { services as fallbackServices } from "../data/services";
import { properties as fallbackProperties, type Property } from "../data/properties";
import { localities as fallbackLocalities } from "../data/localities";
import {
  faqs as fallbackFaqs,
  whyChoose as fallbackWhy,
  processSteps as fallbackProcess,
  testimonials as fallbackTestimonials,
  blogs as fallbackBlogs,
  team as fallbackTeam,
} from "../data/content";
import { homeContent as fallbackHome, type HomeContent } from "../data/home";
import {
  defaultTracking,
  mergeTracking,
  type SiteSettings,
  type TrackingSettings,
} from "../data/settings";

export type CmsState = {
  company: typeof fallbackCompany & {
    navLinks: typeof fallbackNav;
    trustBadges: typeof fallbackBadges;
    brandLogos: typeof fallbackBrands;
    socials: string[];
  };
  home: HomeContent;
  services: typeof fallbackServices;
  properties: Property[];
  localities: typeof fallbackLocalities;
  faqs: typeof fallbackFaqs;
  whyChoose: typeof fallbackWhy;
  processSteps: typeof fallbackProcess;
  testimonials: typeof fallbackTestimonials;
  blogs: typeof fallbackBlogs;
  team: typeof fallbackTeam;
  settings: SiteSettings;
  tracking: typeof defaultTracking;
  ready: boolean;
};

function mergeHome(partial: Partial<HomeContent> | null | undefined): HomeContent {
  const p = partial || {};
  return {
    seo: { ...fallbackHome.seo, ...(p.seo || {}) },
    hero: { ...fallbackHome.hero, ...(p.hero || {}) },
    services: { ...fallbackHome.services, ...(p.services || {}) },
    featured: { ...fallbackHome.featured, ...(p.featured || {}) },
    localities: { ...fallbackHome.localities, ...(p.localities || {}) },
    whyChoose: { ...fallbackHome.whyChoose, ...(p.whyChoose || {}) },
    process: { ...fallbackHome.process, ...(p.process || {}) },
    testimonials: { ...fallbackHome.testimonials, ...(p.testimonials || {}) },
    faqs: { ...fallbackHome.faqs, ...(p.faqs || {}) },
    blogs: { ...fallbackHome.blogs, ...(p.blogs || {}) },
    ctaBanner: { ...fallbackHome.ctaBanner, ...(p.ctaBanner || {}) },
  };
}

const defaults: CmsState = {
  company: {
    ...fallbackCompany,
    navLinks: fallbackNav,
    trustBadges: fallbackBadges,
    brandLogos: fallbackBrands,
    socials: fallbackCompany.socials || [],
  },
  home: fallbackHome,
  services: fallbackServices,
  properties: fallbackProperties,
  localities: fallbackLocalities,
  faqs: fallbackFaqs,
  whyChoose: fallbackWhy,
  processSteps: fallbackProcess,
  testimonials: fallbackTestimonials,
  blogs: fallbackBlogs,
  team: fallbackTeam,
  settings: { siteName: "DisplayAvenue Real Estate" },
  tracking: defaultTracking,
  ready: false,
};

const CmsContext = createContext<CmsState>(defaults);

async function fetchJson<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(path, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export function CmsProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CmsState>(defaults);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [company, home, content, propertiesJson, settingsJson, trackingJson] =
        await Promise.all([
          fetchJson<Record<string, unknown>>("/content/company.json"),
          fetchJson<Partial<HomeContent>>("/content/home.json"),
          fetchJson<Record<string, unknown>>("/content/content.json"),
          fetchJson<{ properties?: Property[] }>("/content/properties.json"),
          fetchJson<SiteSettings>("/content/settings.json"),
          fetchJson<TrackingSettings>("/content/tracking.json"),
        ]);

      if (cancelled) return;

      setState({
        company: {
          ...fallbackCompany,
          ...(company || {}),
          navLinks: (company?.navLinks as typeof fallbackNav) || fallbackNav,
          trustBadges:
            (company?.trustBadges as typeof fallbackBadges) || fallbackBadges,
          brandLogos:
            (company?.brandLogos as typeof fallbackBrands) || fallbackBrands,
          socials:
            (company?.socials as string[]) || fallbackCompany.socials || [],
          address: {
            ...fallbackCompany.address,
            ...((company?.address as object) || {}),
            geo: {
              ...fallbackCompany.address.geo,
              ...((company?.address as { geo?: object })?.geo || {}),
            },
          },
        },
        home: mergeHome(home),
        services: fallbackServices,
        properties: propertiesJson?.properties || fallbackProperties,
        localities: fallbackLocalities,
        faqs: (content?.faqs as CmsState["faqs"]) || fallbackFaqs,
        whyChoose: (content?.whyChoose as CmsState["whyChoose"]) || fallbackWhy,
        processSteps:
          (content?.processSteps as CmsState["processSteps"]) || fallbackProcess,
        testimonials:
          (content?.testimonials as CmsState["testimonials"]) ||
          fallbackTestimonials,
        blogs: (content?.blogs as CmsState["blogs"]) || fallbackBlogs,
        team: (content?.team as CmsState["team"]) || fallbackTeam,
        settings: settingsJson || { siteName: "DisplayAvenue Real Estate" },
        tracking: mergeTracking(trackingJson || settingsJson?.tracking),
        ready: true,
      });
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return <CmsContext.Provider value={state}>{children}</CmsContext.Provider>;
}

export function useCms() {
  return useContext(CmsContext);
}

export function useProperty(slug: string) {
  const { properties } = useCms();
  return properties.find((p) => p.slug === slug);
}
