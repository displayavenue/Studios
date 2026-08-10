import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCms } from "../cms/CmsProvider";
import { Icon } from "./Icon";
import "./SiteSearch.css";

type SearchHit = {
  title: string;
  href: string;
  kind: string;
  blurb: string;
};

function pathFor(kind: string, slug: string) {
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
  return `${map[kind] || "/services/"}${slug}`;
}

export function SiteSearch({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const cms = useCms();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [q, setQ] = useState("");

  const index = useMemo<SearchHit[]>(() => {
    const hubs: SearchHit[] = [
      { title: "Home", href: "/", kind: "Page", blurb: "Get more customers online with DisplayAvenue." },
      { title: "All Services", href: "/services", kind: "Page", blurb: "Browse every marketing, web, and creative service." },
      { title: "Industries", href: "/industries", kind: "Page", blurb: "Solutions for healthcare, real estate, ecommerce, and more." },
      { title: "Packages", href: "/packages", kind: "Page", blurb: "Clear monthly plans for growing businesses." },
      { title: "AI Platform", href: "/ai-platform", kind: "Page", blurb: "Practical AI tools for marketing and operations." },
      { title: "Free Tools", href: "/free-tools", kind: "Page", blurb: "Free SEO and marketing tools - no signup." },
      { title: "Case Studies", href: "/case-studies", kind: "Page", blurb: "Real results from Indian businesses." },
      { title: "Portfolio", href: "/portfolio", kind: "Page", blurb: "Selected projects and brand work." },
      { title: "Resources", href: "/resources", kind: "Page", blurb: "Guides and tips in plain English." },
      { title: "Why DisplayAvenue", href: "/why-displayavenue", kind: "Page", blurb: "How we work with business owners." },
      { title: "Contact", href: "/contact", kind: "Page", blurb: "Book a free call with our team." },
      { title: "Solutions", href: "/solutions", kind: "Page", blurb: "Goal-based plans for leads, sales, and brand." },
    ];

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

    const items = catalogs.map((item) => ({
      title: item.title,
      href: pathFor(item.kind, item.slug),
      kind: item.category || item.kind,
      blurb: item.summary || item.headline || item.title,
    }));

    return [...hubs, ...items];
  }, [cms]);

  const results = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return index.slice(0, 12);
    return index
      .filter((item) => {
        const hay = `${item.title} ${item.kind} ${item.blurb}`.toLowerCase();
        return query.split(/\s+/).every((part) => hay.includes(part));
      })
      .slice(0, 24);
  }, [index, q]);

  useEffect(() => {
    if (!open) return;
    setQ("");
    const t = window.setTimeout(() => inputRef.current?.focus(), 40);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="site-search" role="dialog" aria-modal="true" aria-label="Search the website">
      <button type="button" className="site-search__backdrop" aria-label="Close search" onClick={onClose} />
      <div className="site-search__panel">
        <form
          className="site-search__bar"
          onSubmit={(e) => {
            e.preventDefault();
            if (results[0]) {
              onClose();
              navigate(results[0].href);
            }
          }}
        >
          <Icon name="search" size={18} color="#0056ff" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search services, industries, packages…"
            aria-label="Search"
            autoComplete="off"
          />
          <button type="button" className="site-search__close" onClick={onClose}>
            Close
          </button>
        </form>
        <p className="site-search__meta">
          {q.trim() ? `${results.length} result${results.length === 1 ? "" : "s"}` : "Popular pages & services"}
        </p>
        <ul className="site-search__list">
          {results.map((hit) => {
            const blurb = hit.blurb || "";
            return (
              <li key={hit.href + hit.title}>
                <Link
                  to={hit.href}
                  onClick={() => {
                    onClose();
                  }}
                >
                  <span className="site-search__kind">{hit.kind}</span>
                  <strong>{hit.title}</strong>
                  <span className="site-search__blurb">
                    {blurb.slice(0, 110)}
                    {blurb.length > 110 ? "…" : ""}
                  </span>
                </Link>
              </li>
            );
          })}
          {results.length === 0 && (
            <li className="site-search__empty">
              No matches. Try “SEO”, “Google Ads”, or{" "}
              <Link to="/contact" onClick={onClose}>
                contact us
              </Link>
              .
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
