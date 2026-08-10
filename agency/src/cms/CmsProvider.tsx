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
    imageAlt: "Indian digital agency team collaborating in a modern office — DisplayAvenue",
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

export function CmsProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AgencyCms>(defaults);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [
        company,
        home,
        services,
        industries,
        packages,
        solutions,
        ai,
        tools,
        cases,
        projects,
        resources,
        content,
        trackingJson,
        googleReviews,
      ] = await Promise.all([
        fetchJson<Partial<CompanyCms>>("company"),
        fetchJson<Partial<HomeCms>>("home"),
        fetchJson<{ items: DetailPageContent[] }>("services"),
        fetchJson<{ items: DetailPageContent[] }>("industries"),
        fetchJson<{ items: DetailPageContent[] }>("packages"),
        fetchJson<{ items: DetailPageContent[] }>("solutions"),
        fetchJson<{ items: DetailPageContent[] }>("ai"),
        fetchJson<{ items: DetailPageContent[] }>("tools"),
        fetchJson<{ items: DetailPageContent[] }>("cases"),
        fetchJson<{ items: DetailPageContent[] }>("projects"),
        fetchJson<{ items: DetailPageContent[] }>("resources"),
        fetchJson<Partial<ContentCms>>("content"),
        fetchJson<TrackingSettings>("tracking"),
        fetchJson<GoogleReviewsCms>("google-reviews"),
      ]);

      if (cancelled) return;

      const navItems = (company?.navItems || fallbackNav).map((n) => {
        const mega = (n as { mega?: unknown }).mega;
        return {
          ...n,
          mega: mega === false || mega === "false" ? false : (mega as typeof n.mega),
        };
      });

      setState({
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
        services: itemsOf(services, fallbackServices),
        industries: itemsOf(industries, fallbackIndustries),
        packages: itemsOf(packages, fallbackPackages),
        solutions: itemsOf(solutions, fallbackSolutions),
        ai: itemsOf(ai, fallbackAi),
        tools: itemsOf(tools, fallbackTools),
        cases: itemsOf(cases, fallbackCases),
        projects: itemsOf(projects, fallbackProjects),
        resources: itemsOf(resources, fallbackResources),
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
          reviews:
            googleReviews?.reviews?.length
              ? googleReviews.reviews
              : fallbackGoogleReviews.reviews,
        },
        tracking: mergeTracking(trackingJson),
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
    | "resources",
  slug: string,
) {
  const cms = useCms();
  return useMemo(
    () => cms[kind].find((p) => p.slug === slug),
    [cms, kind, slug],
  );
}
