import { Link, useLocation } from "react-router-dom";
import type { CSSProperties } from "react";
import { useCms } from "../cms/CmsProvider";
import type { DetailPageContent } from "../data/catalogTypes";
import { Icon } from "./Icon";
import { AutoCarousel } from "./AutoCarousel";
import "./InternalLinks.css";

export type InternalLink = {
  label: string;
  href: string;
  blurb?: string;
};

function pathFor(page: DetailPageContent): string {
  if (page.kind === "combo" && page.industrySlug && page.serviceSlug) {
    return `/industries/${page.industrySlug}/${page.serviceSlug}`;
  }
  const map: Record<string, string> = {
    service: "/services/",
    industry: "/industries/",
    package: "/packages/",
    solution: "/solutions/",
    ai: "/ai-platform/",
    tool: "/free-tools/",
    "case-study": "/case-studies/",
    project: "/portfolio/",
    resource: "/resources/",
    combo: "/industry-solutions/",
  };
  return `${map[page.kind] || "/services/"}${page.slug}`;
}

function shortBlurb(text: string, max = 78) {
  const clean = (text || "").replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1).trim()}…`;
}

type Group = {
  id: string;
  title: string;
  why: string;
  hubLabel: string;
  hubHref: string;
  icon: string;
  accent: string;
  items: InternalLink[];
};

const START_HERE = [
  {
    title: "Services",
    why: "Google, ads, websites, and branding  -  pick what you need.",
    href: "/services",
    icon: "grid",
    accent: "#0056ff",
  },
  {
    title: "Industries",
    why: "Plans that fit how your customers search and buy.",
    href: "/industries",
    icon: "briefcase",
    accent: "#0d9488",
  },
  {
    title: "Industry solutions",
    why: "Industry + service pages with unique funnels and CTAs.",
    href: "/industry-solutions",
    icon: "target",
    accent: "#0284c7",
  },
  {
    title: "Packages",
    why: "Clear monthly plans when you want everything in one place.",
    href: "/packages",
    icon: "layers",
    accent: "#ea580c",
  },
  {
    title: "Free tools",
    why: "Check your listing or website before you hire anyone.",
    href: "/free-tools",
    icon: "gear",
    accent: "#7c3aed",
  },
  {
    title: "Case studies",
    why: "See real results from businesses like yours.",
    href: "/case-studies",
    icon: "chart",
    accent: "#0284c7",
  },
  {
    title: "Talk to us",
    why: "Free call. Plain plan. No hard sell.",
    href: "/contact",
    icon: "chat",
    accent: "#16a34a",
  },
];

function toLinks(pages: DetailPageContent[], excludeHref?: string): InternalLink[] {
  return pages
    .filter((p) => pathFor(p) !== excludeHref)
    .map((p) => ({
      label: p.title,
      href: pathFor(p),
      blurb: shortBlurb(p.summary || p.headline || ""),
    }));
}

export function buildSiteLinks(cms: ReturnType<typeof useCms>, excludeHref?: string): InternalLink[] {
  const catalogs = [
    ...cms.services,
    ...cms.industries,
    ...cms.packages,
    ...cms.solutions,
    ...cms.ai,
    ...cms.tools,
    ...cms.cases,
    ...cms.projects,
    ...cms.resources,
  ];
  return toLinks(catalogs, excludeHref);
}

function buildGroups(cms: ReturnType<typeof useCms>, excludeHref?: string): Group[] {
  return [
    {
      id: "services",
      title: "Services",
      why: "Practical help to get found online and turn interest into calls and enquiries.",
      hubLabel: "Browse all services",
      hubHref: "/services",
      icon: "grid",
      accent: "#0056ff",
      items: toLinks(cms.services, excludeHref),
    },
    {
      id: "industries",
      title: "Industries",
      why: "Marketing that matches your type of business  -  clinics, real estate, shops, and more.",
      hubLabel: "Browse all industries",
      hubHref: "/industries",
      icon: "briefcase",
      accent: "#0d9488",
      items: toLinks(cms.industries, excludeHref),
    },
    {
      id: "industry-solutions",
      title: "Industry solutions",
      why: "Dedicated industry × service pages with unique funnels - not generic templates.",
      hubLabel: "Browse industry solutions",
      hubHref: "/industry-solutions",
      icon: "target",
      accent: "#0284c7",
      items: toLinks(cms.combos || [], excludeHref),
    },
    {
      id: "packages",
      title: "Packages",
      why: "Bundled monthly plans when you want SEO, ads, and content handled together.",
      hubLabel: "See packages",
      hubHref: "/packages",
      icon: "layers",
      accent: "#ea580c",
      items: toLinks(cms.packages, excludeHref),
    },
    {
      id: "solutions",
      title: "Solutions by goal",
      why: "Start from the outcome you want  -  more leads, stronger brand, or online sales.",
      hubLabel: "See all solutions",
      hubHref: "/solutions",
      icon: "target",
      accent: "#db2777",
      items: toLinks(cms.solutions, excludeHref),
    },
    {
      id: "ai",
      title: "AI platform",
      why: "Useful AI for content, leads, and ops  -  without the buzzword fog.",
      hubLabel: "Open AI platform",
      hubHref: "/ai-platform",
      icon: "brain",
      accent: "#6366f1",
      items: toLinks(cms.ai, excludeHref),
    },
    {
      id: "tools",
      title: "Free tools",
      why: "Quick checkers and generators you can use today. No signup for most tools.",
      hubLabel: "Try free tools",
      hubHref: "/free-tools",
      icon: "gear",
      accent: "#7c3aed",
      items: [
        {
          label: "ROI Calculator",
          href: "/free-tools/roi-calculator",
          blurb: "Estimate leads, revenue, and marketing ROI",
        },
        {
          label: "SEO Checklist",
          href: "/free-tools/seo-checklist",
          blurb: "Score your site against 20 SEO checks",
        },
        {
          label: "Local SEO Score",
          href: "/free-tools/local-seo-score",
          blurb: "GMB and citation readiness scorecard",
        },
        {
          label: "Citation Directory",
          href: "/free-tools/citation-directory",
          blurb: "India directories + outreach templates",
        },
        {
          label: "SME Digital Growth Report",
          href: "/resources/india-sme-digital-growth-report",
          blurb: "Cite-ready industry benchmarks for 2026",
        },
        ...toLinks(cms.tools, excludeHref),
      ].filter((l) => !excludeHref || l.href !== excludeHref),
    },
    {
      id: "proof",
      title: "Results & work",
      why: "Proof before you hire  -  case studies, awards, certifications, and selected projects.",
      hubLabel: "View case studies",
      hubHref: "/case-studies",
      icon: "chart",
      accent: "#0284c7",
      items: [
        ...toLinks(cms.cases, excludeHref),
        ...toLinks(cms.projects, excludeHref),
        { label: "Awards", href: "/awards", blurb: "19 awards the team has won" },
        {
          label: "Certifications",
          href: "/certifications",
          blurb: "40 team certificates from Google, Meta, HubSpot & more",
        },
      ].filter((l) => !excludeHref || l.href !== excludeHref),
    },
    {
      id: "resources",
      title: "Guides & resources",
      why: "Plain-English tips for Indian business owners who want more customers online.",
      hubLabel: "Read resources",
      hubHref: "/resources",
      icon: "book",
      accent: "#475569",
      items: toLinks(cms.resources, excludeHref),
    },
  ].filter((g) => g.items.length > 0);
}

function contextForPath(pathname: string): { title: string; lead: string } {
  const p = pathname.replace(/\/$/, "") || "/";
  if (p === "/") {
    return {
      title: "Find the right page for your business",
      lead: "New here? Start with Services or your Industry. Want a monthly plan? Open Packages. Prefer to check first? Try Free tools. Each group below explains what it is for, then links to the pages inside.",
    };
  }
  if (p.startsWith("/services")) {
    return {
      title: "More ways DisplayAvenue can help",
      lead: "You are in Services. Use Industries if you want a plan for your business type, Packages for monthly bundles, or Free tools for a quick check before you hire.",
    };
  }
  if (p.startsWith("/industries") || p.startsWith("/industry-solutions")) {
    return {
      title: "Next steps for your industry",
      lead: "You are browsing Industries or Industry solutions. Pair this with Services (SEO, ads, websites) or Packages if you want a clear monthly plan for growth.",
    };
  }
  if (p.startsWith("/packages")) {
    return {
      title: "Explore beyond packages",
      lead: "Packages bundle the work. If you want a single service, open Services. If you want proof first, open Case studies. Free tools help you check your current setup.",
    };
  }
  if (p.startsWith("/free-tools")) {
    return {
      title: "After you try a free tool",
      lead: "Tools show what to fix. Services and Packages are how we help you fix it. Case studies show what similar businesses achieved.",
    };
  }
  if (p.startsWith("/case-studies") || p.startsWith("/portfolio")) {
    return {
      title: "Ready to get similar results?",
      lead: "You are looking at proof. Next, pick a Service, match your Industry, or choose a Package  -  then talk to us for a plain plan.",
    };
  }
  if (p.startsWith("/resources")) {
    return {
      title: "Put these guides into action",
      lead: "Guides explain the ideas. Services and Packages turn them into weekly work for your business.",
    };
  }
  if (p.startsWith("/solutions") || p.startsWith("/ai-platform")) {
    return {
      title: "Related services and plans",
      lead: "Solutions and AI suites work best when matched with the right Service or Package for your budget and goals.",
    };
  }
  if (p.startsWith("/awards") || p.startsWith("/certifications")) {
    return {
      title: "More ways to explore DisplayAvenue",
      lead: "You are looking at credentials and recognition. Next, open Services, Packages, or Case studies - or Contact us for a plain plan.",
    };
  }
  if (p.startsWith("/contact") || p.startsWith("/why-displayavenue")) {
    return {
      title: "Browse while you decide",
      lead: "Not ready to talk yet? Explore Services, Industries, Packages, and Free tools  -  each page explains what you get in plain English.",
    };
  }
  if (p.startsWith("/privacy") || p.startsWith("/terms")) {
    return {
      title: "Back to growing your business",
      lead: "When you are done with the legal pages, jump into Services, Packages, or Contact to continue.",
    };
  }
  return {
    title: "Explore DisplayAvenue",
    lead: "Business owners often ask “where do I start?” Each group explains what it is for, then links to the pages inside  -  so you can jump to SEO, ads, your industry, packages, or free tools without hunting.",
  };
}

export function InternalLinks({
  title,
  links,
  columns: _columns = 3,
  limit = 140,
  excludeHref,
}: {
  title?: string;
  links?: InternalLink[];
  columns?: number;
  limit?: number;
  excludeHref?: string;
}) {
  const cms = useCms();
  const { pathname } = useLocation();
  void _columns;

  const ctx = contextForPath(pathname);
  const heading = title || ctx.title;
  const currentPath = pathname.replace(/\/$/, "") || "/";
  const autoExclude = excludeHref || (currentPath !== "/" ? currentPath : undefined);

  if (links?.length) {
    const resolved = links.slice(0, limit);
    return (
      <section className="explore-dir" aria-labelledby="explore-dir-title">
        <div className="container">
          <header className="explore-dir__header">
            <p className="explore-dir__kicker">Site directory</p>
            <h2 id="explore-dir-title" className="explore-dir__title">
              {heading}
            </h2>
            <p className="explore-dir__lead">{ctx.lead}</p>
          </header>
          <div className="explore-dir__panel">
            <AutoCarousel label={heading} intervalMs={5500} className="explore-carousel">
              {resolved.map((link) => (
                <Link key={link.href + link.label} to={link.href} className="explore-tile">
                  <strong>{link.label}</strong>
                  {link.blurb ? <span>{link.blurb}</span> : <span>Open page</span>}
                </Link>
              ))}
            </AutoCarousel>
          </div>
        </div>
      </section>
    );
  }

  const groups = buildGroups(cms, autoExclude);
  let remaining = limit;
  const clipped = groups
    .map((group) => {
      if (remaining <= 0) return { ...group, items: [] as InternalLink[] };
      const take = Math.min(group.items.length, remaining);
      remaining -= take;
      return { ...group, items: group.items.slice(0, take) };
    })
    .filter((g) => g.items.length > 0);

  const totalLinks = clipped.reduce((n, g) => n + g.items.length, 0) + START_HERE.length;

  return (
    <section className="explore-dir" aria-labelledby="explore-dir-title">
      <div className="container">
        <header className="explore-dir__header">
          <p className="explore-dir__kicker">Why this section</p>
          <h2 id="explore-dir-title" className="explore-dir__title">
            {heading}
          </h2>
          <p className="explore-dir__lead">{ctx.lead}</p>
          <p className="explore-dir__meta">{totalLinks}+ pages organised by goal</p>
        </header>

        <div className="explore-dir__start">
          <h3 className="explore-dir__section-label">Start here</h3>
          <AutoCarousel label="Start here" intervalMs={4800} maxItems={8} className="explore-carousel explore-carousel--start">
            {START_HERE.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="explore-start"
                style={{ ["--accent" as string]: item.accent }}
              >
                <span className="explore-start__icon" aria-hidden>
                  <Icon name={item.icon} color={item.accent} size={18} />
                </span>
                <span className="explore-start__body">
                  <strong>{item.title}</strong>
                  <span>{item.why}</span>
                </span>
                <span className="explore-start__arrow" aria-hidden>
                  →
                </span>
              </Link>
            ))}
          </AutoCarousel>
        </div>

        <div className="explore-dir__groups">
          {clipped.map((group, gi) => (
            <article
              key={group.id}
              className="explore-group"
              style={
                {
                  ["--accent" as string]: group.accent,
                  animationDelay: `${gi * 0.07}s`,
                } as CSSProperties
              }
            >
              <header className="explore-group__head">
                <span className="explore-group__icon" aria-hidden>
                  <Icon name={group.icon} color={group.accent} size={18} />
                </span>
                <div className="explore-group__copy">
                  <h3>{group.title}</h3>
                  <p>{group.why}</p>
                  <Link to={group.hubHref} className="explore-group__hub explore-group__hub--inline">
                    {group.hubLabel} →
                  </Link>
                </div>
                <Link to={group.hubHref} className="explore-group__hub explore-group__hub--side">
                  {group.hubLabel} →
                </Link>
              </header>
              <AutoCarousel
                label={group.title}
                intervalMs={5200 + (gi % 3) * 400}
                maxItems={9}
                className="explore-carousel"
              >
                {group.items.map((link) => (
                  <Link key={link.href} to={link.href} className="explore-tile">
                    <strong>{link.label}</strong>
                    <span>{link.blurb || "Learn what you get and how we start"}</span>
                  </Link>
                ))}
              </AutoCarousel>
            </article>
          ))}
        </div>

        <div className="explore-dir__footer-note">
          <div>
            <h3>Still unsure?</h3>
            <p>
              Tell us your business and city. We will point you to the 2-3 pages that
              matter most  -  or build a simple plan on a free call.
            </p>
          </div>
          <div className="explore-dir__footer-actions">
            <Link to="/contact" className="btn btn-primary">
              Book a free call
            </Link>
            <Link to="/why-displayavenue" className="btn btn-ghost">
              Why DisplayAvenue
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
