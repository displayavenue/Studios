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
import {
  services as fallbackServices,
  homeServices as fallbackHomeServices,
} from "../data/services";
import { packageGroups as fallbackPackages } from "../data/packages";
import {
  portfolio as fallbackPortfolio,
  portfolioCategories as fallbackPortfolioCats,
} from "../data/portfolio";
import {
  faqs as fallbackFaqs,
  whyChoose as fallbackWhy,
  processSteps as fallbackProcess,
  testimonials as fallbackTestimonials,
  blogs as fallbackBlogs,
  industries as fallbackIndustries,
  locations as fallbackLocations,
  team as fallbackTeam,
} from "../data/content";
import { homeContent as fallbackHome, type HomeContent } from "../data/home";
import { menuConfig as fallbackMenu, mergeMenu, type MenuConfig } from "../data/menu";

export type CmsState = {
  company: typeof fallbackCompany & {
    navLinks: typeof fallbackNav;
    trustBadges: typeof fallbackBadges;
    brandLogos: typeof fallbackBrands;
    socials: string[];
  };
  home: HomeContent;
  menu: MenuConfig;
  services: typeof fallbackServices;
  homeServices: typeof fallbackHomeServices;
  packageGroups: typeof fallbackPackages;
  portfolio: typeof fallbackPortfolio;
  portfolioCategories: typeof fallbackPortfolioCats;
  faqs: typeof fallbackFaqs;
  whyChoose: typeof fallbackWhy;
  processSteps: typeof fallbackProcess;
  testimonials: typeof fallbackTestimonials;
  blogs: typeof fallbackBlogs;
  industries: typeof fallbackIndustries;
  locations: typeof fallbackLocations;
  team: typeof fallbackTeam;
  ready: boolean;
};

function mergeHome(partial: Partial<HomeContent> | null | undefined): HomeContent {
  const p = partial || {};
  return {
    seo: { ...fallbackHome.seo, ...(p.seo || {}) },
    hero: { ...fallbackHome.hero, ...(p.hero || {}) },
    brands: { ...fallbackHome.brands, ...(p.brands || {}) },
    services: { ...fallbackHome.services, ...(p.services || {}) },
    portfolio: { ...fallbackHome.portfolio, ...(p.portfolio || {}) },
    packages: { ...fallbackHome.packages, ...(p.packages || {}) },
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
  menu: fallbackMenu,
  services: fallbackServices,
  homeServices: fallbackHomeServices,
  packageGroups: fallbackPackages,
  portfolio: fallbackPortfolio,
  portfolioCategories: fallbackPortfolioCats,
  faqs: fallbackFaqs,
  whyChoose: fallbackWhy,
  processSteps: fallbackProcess,
  testimonials: fallbackTestimonials,
  blogs: fallbackBlogs,
  industries: fallbackIndustries,
  locations: fallbackLocations,
  team: fallbackTeam,
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
      const [company, home, menu, services, packages, portfolio, content] =
        await Promise.all([
          fetchJson<Record<string, unknown>>("/content/company.json"),
          fetchJson<Partial<HomeContent>>("/content/home.json"),
          fetchJson<Partial<MenuConfig>>("/content/menu.json"),
          fetchJson<{ services?: CmsState["services"]; homeServices?: string[] }>(
            "/content/services.json",
          ),
          fetchJson<{ packageGroups?: CmsState["packageGroups"] }>(
            "/content/packages.json",
          ),
          fetchJson<{
            portfolio?: CmsState["portfolio"];
            portfolioCategories?: string[];
          }>("/content/portfolio.json"),
          fetchJson<Record<string, unknown>>("/content/content.json"),
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
        menu: mergeMenu(menu),
        services: services?.services || fallbackServices,
        homeServices: services?.homeServices || fallbackHomeServices,
        packageGroups: packages?.packageGroups || fallbackPackages,
        portfolio: portfolio?.portfolio || fallbackPortfolio,
        portfolioCategories:
          portfolio?.portfolioCategories || fallbackPortfolioCats,
        faqs: (content?.faqs as CmsState["faqs"]) || fallbackFaqs,
        whyChoose: (content?.whyChoose as CmsState["whyChoose"]) || fallbackWhy,
        processSteps:
          (content?.processSteps as CmsState["processSteps"]) || fallbackProcess,
        testimonials:
          (content?.testimonials as CmsState["testimonials"]) ||
          fallbackTestimonials,
        blogs: (content?.blogs as CmsState["blogs"]) || fallbackBlogs,
        industries:
          (content?.industries as CmsState["industries"]) || fallbackIndustries,
        locations:
          (content?.locations as CmsState["locations"]) || fallbackLocations,
        team: (content?.team as CmsState["team"]) || fallbackTeam,
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

export function useService(slug: string) {
  const { services } = useCms();
  return services.find((s) => s.slug === slug);
}
