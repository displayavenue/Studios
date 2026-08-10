import { Link } from "react-router-dom";
import { useCms } from "../cms/CmsProvider";
import type { DetailPageContent } from "../data/catalogTypes";
import { Icon } from "./Icon";
import "./InternalLinks.css";

export type InternalLink = {
  label: string;
  href: string;
  blurb?: string;
};

function pathFor(page: DetailPageContent): string {
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
      items: toLinks(cms.tools, excludeHref),
    },
    {
      id: "proof",
      title: "Results & work",
      why: "Proof before you hire  -  case studies and selected projects.",
      hubLabel: "View case studies",
      hubHref: "/case-studies",
      icon: "chart",
      accent: "#0284c7",
      items: [
        ...toLinks(cms.cases, excludeHref),
        ...toLinks(cms.projects, excludeHref),
      ],
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

export function InternalLinks({
  title = "Find the right page for your business",
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
  void _columns;

  // Custom flat list (rare) — still render as a tidy directory block
  if (links?.length) {
    const resolved = links.slice(0, limit);
    return (
      <section className="explore-dir" aria-labelledby="explore-dir-title">
        <div className="container">
          <header className="explore-dir__header">
            <p className="explore-dir__kicker">Site directory</p>
            <h2 id="explore-dir-title" className="explore-dir__title">
              {title}
            </h2>
            <p className="explore-dir__lead">
              Short links to related pages so you can keep exploring without getting lost.
            </p>
          </header>
          <div className="explore-dir__panel">
            <div className="explore-dir__tiles">
              {resolved.map((link) => (
                <Link key={link.href + link.label} to={link.href} className="explore-tile">
                  <strong>{link.label}</strong>
                  {link.blurb ? <span>{link.blurb}</span> : <span>Open page</span>}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  const groups = buildGroups(cms, excludeHref);
  let remaining = limit;
  const clipped = groups
    .map((group) => {
      if (remaining <= 0) return { ...group, items: [] as InternalLink[] };
      const take = Math.min(group.items.length, remaining);
      remaining -= take;
      return { ...group, items: group.items.slice(0, take) };
    })
    .filter((g) => g.items.length > 0);

  const totalLinks =
    clipped.reduce((n, g) => n + g.items.length, 0) + START_HERE.length;

  return (
    <section className="explore-dir" aria-labelledby="explore-dir-title">
      <div className="container">
        <header className="explore-dir__header">
          <p className="explore-dir__kicker">Why this section</p>
          <h2 id="explore-dir-title" className="explore-dir__title">
            {title}
          </h2>
          <p className="explore-dir__lead">
            Business owners often ask “where do I start?” This directory answers that.
            Each group explains what it is for, then links to the pages inside  -  so you
            can jump to SEO, ads, your industry, packages, or free tools without hunting.
          </p>
          <p className="explore-dir__meta">{totalLinks}+ pages organised by goal</p>
        </header>

        <div className="explore-dir__start">
          <h3 className="explore-dir__section-label">Start here</h3>
          <div className="explore-dir__start-grid">
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
          </div>
        </div>

        <div className="explore-dir__groups">
          {clipped.map((group) => (
            <article
              key={group.id}
              className="explore-group"
              style={{ ["--accent" as string]: group.accent }}
            >
              <header className="explore-group__head">
                <span className="explore-group__icon" aria-hidden>
                  <Icon name={group.icon} color={group.accent} size={18} />
                </span>
                <div>
                  <h3>{group.title}</h3>
                  <p>{group.why}</p>
                </div>
                <Link to={group.hubHref} className="explore-group__hub">
                  {group.hubLabel} →
                </Link>
              </header>
              <div className="explore-dir__tiles">
                {group.items.map((link) => (
                  <Link key={link.href} to={link.href} className="explore-tile">
                    <strong>{link.label}</strong>
                    <span>{link.blurb || "Learn what you get and how we start"}</span>
                  </Link>
                ))}
              </div>
            </article>
          ))}
        </div>

        <div className="explore-dir__footer-note">
          <div>
            <h3>Still unsure?</h3>
            <p>
              Tell us your business and city. We will point you to the 2–3 pages that
              matter most  -  or build a simple plan on a free call.
            </p>
          </div>
          <div className="explore-dir__footer-actions">
            <Link to="/contact" className="btn btn-primary">
              Book a free call
            </Link>
            <Link to="/why-displayavenue" className="btn btn-outline">
              Why DisplayAvenue
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
