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

export type CmsState = {
  company: typeof fallbackCompany & {
    navLinks: typeof fallbackNav;
    trustBadges: typeof fallbackBadges;
    brandLogos: typeof fallbackBrands;
  };
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

const defaults: CmsState = {
  company: {
    ...fallbackCompany,
    navLinks: fallbackNav,
    trustBadges: fallbackBadges,
    brandLogos: fallbackBrands,
  },
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
      const [company, services, packages, portfolio, content] = await Promise.all([
        fetchJson<Record<string, unknown>>("/content/company.json"),
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
          address: {
            ...fallbackCompany.address,
            ...((company?.address as object) || {}),
          },
        },
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
