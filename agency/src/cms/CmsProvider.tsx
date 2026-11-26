import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { company as fallbackCompany, navItems as fallbackNav } from "../data/company";
import { servicePages as fallbackServices } from "../data/serviceCatalog";
import { industryPages as fallbackIndustries } from "../data/industryCatalog";
import { packagePages as fallbackPackages } from "../data/packageCatalog";
import { solutionPages as fallbackSolutions } from "../data/solutionCatalog";
import { aiPages as fallbackAi } from "../data/aiCatalog";
import { toolPages as fallbackTools } from "../data/toolCatalog";
import { casePages as fallbackCases } from "../data/caseCatalog";
import { projectPages as fallbackProjects } from "../data/projectCatalog";
import { resourcePages as fallbackResources } from "../data/resourceCatalog";
import { testimonials as fallbackTestimonials } from "../data/content";
import { clientLogos as fallbackLogos } from "../data/work";
import {
  fallbackGoogleReviews,
  type GoogleReviewsCms,
} from "../data/googleReviews";
import {
  fallbackAwards,
  fallbackCertifications,
  type AwardsCms,
  type CertificationsCms,
} from "../data/awardsCerts";
import { fallbackContact, type ContactCms } from "../data/contactForm";
import type { DetailPageContent } from "../data/catalogTypes";
import {
  defaultTracking,
  mergeTracking,
  type TrackingSettings,
} from "../data/settings";

type CompanyCms = typeof fallbackCompany & {
  announcement?: string;
  navItems: typeof fallbackNav;
};

type HomeCms = {
  seo?: { title?: string; description?: string };
  hero: {
    eyebrow: string;
    titleBefore: string;
    titleAccent: string;
    lead: string;
    primaryCta: string;
    secondaryCta: string;
    image?: string;
    imageAlt?: string;
  };
  trustLabel: string;
  servicesTitle: string;
  servicesSub: string;
};

type ContentCms = {
  testimonials: typeof fallbackTestimonials;
  clientLogos: string[];
  footerCta: { title: string; sub: string };
};

export type AgencyCms = {
  company: CompanyCms;
  home: HomeCms;
  services: DetailPageContent[];
  industries: DetailPageContent[];
  packages: DetailPageContent[];
  solutions: DetailPageContent[];
  ai: DetailPageContent[];
  tools: DetailPageContent[];
  cases: DetailPageContent[];
  projects: DetailPageContent[];
  resources: DetailPageContent[];
  content: ContentCms;
  googleReviews: GoogleReviewsCms;
  awards: AwardsCms;
  certifications: CertificationsCms;
  contact: ContactCms;
  combos: DetailPageContent[];
  tracking: typeof defaultTracking;
  ready: boolean;
};

const fallbackHome: HomeCms = {
  hero: {
    eyebrow: "DisplayAvenue",
    titleBefore: "Get more customers from",
    titleAccent: "Google, Instagram & your website",
    lead: "We help business owners get found online and turn interest into real enquiries. Clear plans. Plain English. No jargon.",
    primaryCta: "Book a free call",
    secondaryCta: "See our work",
    image: "/images/hero-agency-india.jpg",
    imageAlt: "Indian digital agency team collaborating in a modern office - DisplayAvenue",
  },
  trustLabel: "Trusted by growing businesses across India",
  servicesTitle: "What we help you with",
  servicesSub: "Simple services that bring more people to your business  -  and help them become customers.",
};

const defaults: AgencyCms = {
  company: { ...fallbackCompany, announcement: "Free growth call for business owners  -  book in 2 minutes.", navItems: fallbackNav },
  home: fallbackHome,
  services: fallbackServices,
  industries: fallbackIndustries,
  packages: fallbackPackages,
  solutions: fallbackSolutions,
  ai: fallbackAi,
  tools: fallbackTools,
  cases: fallbackCases,
  projects: fallbackProjects,
  resources: fallbackResources,
  content: {
    testimonials: fallbackTestimonials,
    clientLogos: fallbackLogos,
    footerCta: {
      title: "Ready for more customers?",
      sub: "Book a free call. We’ll map a simple plan for your business.",
    },
  },
  googleReviews: fallbackGoogleReviews,
  awards: fallbackAwards,
  certifications: fallbackCertifications,
  contact: fallbackContact,
  combos: [],
  tracking: defaultTracking,
  ready: false,
};

const CmsContext = createContext<AgencyCms>(defaults);

const base = import.meta.env.BASE_URL.replace(/\/?$/, "/");

async function fetchJson<T>(name: string): Promise<T | null> {
  try {
    const res = await fetch(`${base}content/${name}.json`, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

function itemsOf(data: { items?: DetailPageContent[] } | null, fallback: DetailPageContent[]) {
  return data?.items?.length ? data.items : fallback;
}

export type RawCms = Partial<{
  company: Partial<CompanyCms>;
  home: Partial<HomeCms>;
  services: { items: DetailPageContent[] };
  industries: { items: DetailPageContent[] };
  packages: { items: DetailPageContent[] };
  solutions: { items: DetailPageContent[] };
  ai: { items: DetailPageContent[] };
  tools: { items: DetailPageContent[] };
  cases: { items: DetailPageContent[] };
  projects: { items: DetailPageContent[] };
  resources: { items: DetailPageContent[] };
  content: Partial<ContentCms>;
  tracking: TrackingSettings;
  "google-reviews": GoogleReviewsCms;
  awards: AwardsCms;
  certifications: CertificationsCms;
  contact: ContactCms;
  combos: { items: DetailPageContent[] };
}>;

export const CMS_FILES = [
  "company",
  "home",
  "services",
  "industries",
  "packages",
  "solutions",
  "ai",
  "tools",
  "cases",
  "projects",
  "resources",
  "content",
  "tracking",
  "google-reviews",
  "awards",
  "certifications",
  "contact",
  "combos",
] as const;

/** Merge raw CMS JSON (any file may be missing) over the built-in fallbacks. */
export function buildCms(raw: RawCms): AgencyCms {
  const company = raw.company ?? null;
  const home = raw.home ?? null;
  const content = raw.content ?? null;
  const googleReviews = raw["google-reviews"] ?? null;
  const awardsJson = raw.awards ?? null;
  const certificationsJson = raw.certifications ?? null;
  const contactJson = raw.contact ?? null;

  const navItems = (company?.navItems || fallbackNav).map((n) => {
    const mega = (n as { mega?: unknown }).mega;
    return {
      ...n,
      mega: mega === false || mega === "false" ? false : (mega as typeof n.mega),
    };
  });

  return {
    company: {
      ...fallbackCompany,
      ...(company || {}),
      address: { ...fallbackCompany.address, ...(company?.address || {}) },
      socials: { ...fallbackCompany.socials, ...(company?.socials || {}) },
      stats: { ...fallbackCompany.stats, ...(company?.stats || {}) },
      googleMaps: {
        ...fallbackCompany.googleMaps,
        ...(company?.googleMaps || {}),
      },
      announcement:
        company?.announcement ||
        "New! AI-Powered Marketing Solutions are now available.",
      navItems: navItems as typeof fallbackNav,
    },
    home: {
      ...fallbackHome,
      ...(home || {}),
      hero: { ...fallbackHome.hero, ...(home?.hero || {}) },
    },
    services: itemsOf(raw.services ?? null, fallbackServices),
    industries: itemsOf(raw.industries ?? null, fallbackIndustries),
    packages: itemsOf(raw.packages ?? null, fallbackPackages),
    solutions: itemsOf(raw.solutions ?? null, fallbackSolutions),
    ai: itemsOf(raw.ai ?? null, fallbackAi),
    tools: itemsOf(raw.tools ?? null, fallbackTools),
    cases: itemsOf(raw.cases ?? null, fallbackCases),
    projects: itemsOf(raw.projects ?? null, fallbackProjects),
    resources: itemsOf(raw.resources ?? null, fallbackResources),
    content: {
      testimonials: content?.testimonials?.length
        ? content.testimonials
        : fallbackTestimonials,
      clientLogos: content?.clientLogos?.length
        ? content.clientLogos
        : fallbackLogos,
      footerCta: {
        ...defaults.content.footerCta,
        ...(content?.footerCta || {}),
      },
    },
    googleReviews: {
      ...fallbackGoogleReviews,
      ...(googleReviews || {}),
      reviews: googleReviews?.reviews?.length
        ? googleReviews.reviews
        : fallbackGoogleReviews.reviews,
    },
    awards: {
      ...fallbackAwards,
      ...(awardsJson || {}),
      items: awardsJson?.items?.length ? awardsJson.items : fallbackAwards.items,
    },
    certifications: {
      ...fallbackCertifications,
      ...(certificationsJson || {}),
      items: certificationsJson?.items?.length
        ? certificationsJson.items
        : fallbackCertifications.items,
    },
    contact: {
      ...fallbackContact,
      ...(contactJson || {}),
      fields: {
        ...fallbackContact.fields,
        ...(contactJson?.fields || {}),
      },
      seo: {
        ...fallbackContact.seo,
        ...(contactJson?.seo || {}),
      },
    },
    combos: itemsOf(raw.combos ?? null, []),
    tracking: mergeTracking(raw.tracking ?? null),
    ready: true,
  };
}

export function CmsProvider({
  children,
  initial,
}: {
  children: ReactNode;
  /** Pre-built state (used by the build-time prerenderer). */
  initial?: AgencyCms;
}) {
  const [state, setState] = useState<AgencyCms>(initial ?? defaults);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const results = await Promise.all(CMS_FILES.map((name) => fetchJson<unknown>(name)));
      if (cancelled) return;
      const raw: Record<string, unknown> = {};
      CMS_FILES.forEach((name, i) => {
        if (results[i] != null) raw[name] = results[i];
      });
      setState(buildCms(raw as RawCms));
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

export function useCatalogPage(
  kind:
    | "services"
    | "industries"
    | "packages"
    | "solutions"
    | "ai"
    | "tools"
    | "cases"
    | "projects"
    | "resources"
    | "combos",
  slug: string,
) {
  const cms = useCms();
  return useMemo(
    () => cms[kind].find((p) => p.slug === slug),
    [cms, kind, slug],
  );
}
