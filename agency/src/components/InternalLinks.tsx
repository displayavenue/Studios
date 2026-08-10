import { Link } from "react-router-dom";
import { useCms } from "../cms/CmsProvider";
import type { DetailPageContent } from "../data/catalogTypes";
import "./InternalLinks.css";

export type InternalLink = { label: string; href: string };

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

const HUBS: InternalLink[] = [
  { label: "Home", href: "/" },
  { label: "All services", href: "/services" },
  { label: "Industries", href: "/industries" },
  { label: "Packages", href: "/packages" },
  { label: "Solutions", href: "/solutions" },
  { label: "AI Platform", href: "/ai-platform" },
  { label: "Free tools", href: "/free-tools" },
  { label: "Case studies", href: "/case-studies" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Resources & blog", href: "/resources" },
  { label: "Why DisplayAvenue", href: "/why-displayavenue" },
  { label: "Contact us", href: "/contact" },
  { label: "Privacy policy", href: "/privacy" },
  { label: "Terms & conditions", href: "/terms" },
];

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
  const fromCatalog = catalogs.map((item) => ({
    label: item.title,
    href: pathFor(item),
  }));
  const all = [...HUBS, ...fromCatalog];
  const seen = new Set<string>();
  return all.filter((link) => {
    if (excludeHref && link.href === excludeHref) return false;
    if (seen.has(link.href)) return false;
    seen.add(link.href);
    return true;
  });
}

export function InternalLinks({
  title = "Explore more on DisplayAvenue",
  links,
  columns = 3,
  limit = 120,
  excludeHref,
}: {
  title?: string;
  links?: InternalLink[];
  columns?: number;
  limit?: number;
  excludeHref?: string;
}) {
  const cms = useCms();
  const resolved = (links ?? buildSiteLinks(cms, excludeHref)).slice(0, limit);
  if (!resolved.length) return null;
  return (
    <section className="internal-links">
      <div className="container">
        <h2 className="internal-links__title">{title}</h2>
        <p className="internal-links__sub">
          Jump to services, industries, tools, and guides  -  {resolved.length} pages linked here.
        </p>
        <ul
          className="internal-links__grid"
          style={{ ["--cols" as string]: String(columns) }}
        >
          {resolved.map((link) => (
            <li key={link.href + link.label}>
              <Link to={link.href}>{link.label}</Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
