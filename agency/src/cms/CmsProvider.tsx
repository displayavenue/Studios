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
import { homeDefaults, pickList } from "../data/homeDefaults";
import type { DetailPageContent } from "../data/catalogTypes";
import {
  defaultTracking,
  mergeTracking,
  type TrackingSettings,
} from "../data/settings";

type CompanyCms = typeof fallbackCompany & {
  announcement?: string;
  logoImage?: string;
  ogImage?: string;
  navItems: typeof fallbackNav;
  googleMaps?: {
    name?: string;
    shareUrl?: string;
    profileUrl?: string;
    directionsUrl?: string;
    embedUrl?: string;
    kgmid?: string;
    lat?: number;
    lng?: number;
  };
};

export type HomeLinkCard = {
  title: string;
  desc: string;
  icon: string;
  color: string;
  href: string;
};

export type HomeLinkRow = {
  label: string;
  desc: string;
  href: string;
  icon: string;
};

export type HomeCms = {
  seo?: { title?: string; description?: string };
  sections?: Record<string, boolean>;
  hero: {
    eyebrow: string;
    titleBefore: string;
    titleAccent: string;
    lead: string;
    image?: string;
    primaryCta: string;
    primaryCtaHref?: string;
    secondaryCta: string;
    secondaryCtaHref?: string;
    showreelLabel?: string;
    showreelHref?: string;
    portfolioLabel?: string;
    portfolioHref?: string;
  };
  heroDashboard?: {
    title: string;
    meta: string;
    metrics: { value: string; label: string }[];
  };
  aiAssist?: {
    title: string;
    body: string;
    actions: { label: string; href: string }[];
  };
  heroStats?: { value: string; label: string }[];
  statsBand?: { value: string; label: string }[];
  trustLabel: string;
  clientLogos?: string[];
  partners?: string[];
  servicesTitle: string;
  servicesSub: string;
  servicesViewAllLabel?: string;
  servicesViewAllHref?: string;
  services?: HomeLinkCard[];
  allServicesCard?: { title: string; desc: string; href: string };
  aiBanner?: {
    title: string;
    sub: string;
    bullets: string[];
    ctaLabel: string;
    ctaHref: string;
  };
  industriesTitle?: string;
  industriesCtaLabel?: string;
  industriesCtaHref?: string;
  industriesMoreLabel?: string;
  industrySlugs?: string[];
  challengesTitle?: string;
  challengesViewAllLabel?: string;
  challengesViewAllHref?: string;
  challengeLinks?: HomeLinkRow[];
  businessSizeTitle?: string;
  businessSizeViewAllLabel?: string;
  businessSizeViewAllHref?: string;
  businessSizeLinks?: HomeLinkRow[];
  packagesTitle?: string;
  packagesSub?: string;
  packagesCompareLabel?: string;
  packagesCompareHref?: string;
  packages?: {
    name: string;
    price: string;
    period: string;
    features: string[];
    highlighted?: boolean;
    badge?: string;
    href: string;
    ctaLabel?: string;
  }[];
  packagePills?: string[];
  toolsTitle?: string;
  toolsCtaLabel?: string;
  toolsCtaHref?: string;
  toolCategorySlugs?: string[];
  casesTitle?: string;
  casesViewAllLabel?: string;
  casesViewAllHref?: string;
  caseSlugs?: string[];
  portfolioTitle?: string;
  portfolioCtaLabel?: string;
  portfolioCtaHref?: string;
  portfolioSlugs?: string[];
  testimonialsTitle?: string;
  testimonials?: { quote: string; name: string; title: string; rating: number }[];
  ratings?: { label: string; score: string }[];
  insightsTitle?: string;
  insightsCtaLabel?: string;
  insightsCtaHref?: string;
  insightLinks?: {
    title: string;
    date: string;
    href: string;
    gradient: string;
  }[];
  location?: {
    enabled?: boolean;
    title?: string;
    sub?: string;
    ctaLabel?: string;
    directionsLabel?: string;
  };
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
  tracking: typeof defaultTracking;
  ready: boolean;
};

const fallbackHome: HomeCms = {
  ...homeDefaults,
  hero: { ...homeDefaults.hero },
  services: [...homeDefaults.services],
  partners: [...homeDefaults.partners],
  industrySlugs: [...homeDefaults.industrySlugs],
  challengeLinks: homeDefaults.challengeLinks.map((item) => ({ ...item })),
  businessSizeLinks: homeDefaults.businessSizeLinks.map((item) => ({ ...item })),
  packages: homeDefaults.packages.map((pkg) => ({
    ...pkg,
    features: [...pkg.features],
  })),
  packagePills: [...homeDefaults.packagePills],
  toolCategorySlugs: [...homeDefaults.toolCategorySlugs],
  caseSlugs: [...homeDefaults.caseSlugs],
  portfolioSlugs: [...homeDefaults.portfolioSlugs],
  ratings: homeDefaults.ratings.map((item) => ({ ...item })),
  insightLinks: homeDefaults.insightLinks.map((item) => ({ ...item })),
  aiBanner: {
    ...homeDefaults.aiBanner,
    bullets: [...homeDefaults.aiBanner.bullets],
  },
  heroDashboard: {
    ...homeDefaults.heroDashboard,
    metrics: homeDefaults.heroDashboard.metrics.map((m) => ({ ...m })),
  },
  aiAssist: {
    ...homeDefaults.aiAssist,
    actions: homeDefaults.aiAssist.actions.map((a) => ({ ...a })),
  },
  allServicesCard: { ...homeDefaults.allServicesCard },
  location: { ...homeDefaults.location },
  seo: { ...homeDefaults.seo },
};

const defaults: AgencyCms = {
  company: {
    ...fallbackCompany,
    announcement: "New! AI-Powered Marketing Solutions are now available.",
    navItems: fallbackNav,
  },
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
      title: "Ready to Transform Your Business?",
      sub: "Book a free consultation or request a custom proposal today.",
    },
  },
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

function itemsOf<T>(
  payload: { items?: T[] } | null,
  fallback: T[],
): T[] {
  return Array.isArray(payload?.items) && payload!.items!.length
    ? payload!.items!
    : fallback;
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
        tracking,
      ] = await Promise.all([
        fetchJson<CompanyCms>("company"),
        fetchJson<HomeCms>("home"),
        fetchJson<{ items: DetailPageContent[] }>("services"),
        fetchJson<{ items: DetailPageContent[] }>("industries"),
        fetchJson<{ items: DetailPageContent[] }>("packages"),
        fetchJson<{ items: DetailPageContent[] }>("solutions"),
        fetchJson<{ items: DetailPageContent[] }>("ai"),
        fetchJson<{ items: DetailPageContent[] }>("tools"),
        fetchJson<{ items: DetailPageContent[] }>("cases"),
        fetchJson<{ items: DetailPageContent[] }>("projects"),
        fetchJson<{ items: DetailPageContent[] }>("resources"),
        fetchJson<ContentCms>("content"),
        fetchJson<TrackingSettings>("tracking"),
      ]);
      if (cancelled) return;
      const navItems = (company?.navItems?.length
        ? company.navItems
        : defaults.company.navItems
      ).map((n) => {
        const mega = (n as { mega?: unknown }).mega;
        return {
          ...n,
          mega:
            mega === false || mega === "false" ? false : (mega as typeof n.mega),
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
          seo: { ...fallbackHome.seo, ...(home?.seo || {}) },
          hero: { ...fallbackHome.hero, ...(home?.hero || {}) },
          heroDashboard: {
            ...fallbackHome.heroDashboard!,
            ...(home?.heroDashboard || {}),
            metrics: pickList(
              home?.heroDashboard?.metrics,
              fallbackHome.heroDashboard!.metrics,
            ),
          },
          aiAssist: {
            ...fallbackHome.aiAssist!,
            ...(home?.aiAssist || {}),
            actions: pickList(
              home?.aiAssist?.actions,
              fallbackHome.aiAssist!.actions,
            ),
          },
          partners: pickList(home?.partners, fallbackHome.partners || []),
          services: pickList(home?.services, fallbackHome.services || []),
          allServicesCard: {
            ...fallbackHome.allServicesCard!,
            ...(home?.allServicesCard || {}),
          },
          aiBanner: {
            ...fallbackHome.aiBanner!,
            ...(home?.aiBanner || {}),
            bullets: pickList(
              home?.aiBanner?.bullets,
              fallbackHome.aiBanner!.bullets,
            ),
          },
          industrySlugs: pickList(
            home?.industrySlugs,
            fallbackHome.industrySlugs || [],
          ),
          challengeLinks: pickList(
            home?.challengeLinks,
            fallbackHome.challengeLinks || [],
          ),
          businessSizeLinks: pickList(
            home?.businessSizeLinks,
            fallbackHome.businessSizeLinks || [],
          ),
          packages: pickList(home?.packages, fallbackHome.packages || []),
          packagePills: pickList(
            home?.packagePills,
            fallbackHome.packagePills || [],
          ),
          toolCategorySlugs: pickList(
            home?.toolCategorySlugs,
            fallbackHome.toolCategorySlugs || [],
          ),
          caseSlugs: pickList(home?.caseSlugs, fallbackHome.caseSlugs || []),
          portfolioSlugs: pickList(
            home?.portfolioSlugs,
            fallbackHome.portfolioSlugs || [],
          ),
          ratings: pickList(home?.ratings, fallbackHome.ratings || []),
          insightLinks: pickList(
            home?.insightLinks,
            fallbackHome.insightLinks || [],
          ),
          location: { ...fallbackHome.location, ...(home?.location || {}) },
          sections: {
            ...(fallbackHome.sections || {}),
            ...(home?.sections || {}),
          },
          clientLogos: Array.isArray(home?.clientLogos) ? home.clientLogos : [],
          testimonials: Array.isArray(home?.testimonials)
            ? home.testimonials
            : [],
          heroStats: Array.isArray(home?.heroStats) ? home.heroStats : [],
          statsBand: Array.isArray(home?.statsBand) ? home.statsBand : [],
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
        tracking: mergeTracking(tracking || {}),
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
