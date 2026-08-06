import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useCms } from "../cms/CmsProvider";
import type { DetailPageContent } from "../data/catalogTypes";
import { Icon } from "./Icon";
import "./SiteSearch.css";

type SearchHit = {
  id: string;
  title: string;
  category: string;
  summary: string;
  href: string;
};

const KIND_PATH: Record<string, string> = {
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

const STATIC_PAGES: SearchHit[] = [
  {
    id: "page-home",
    title: "Home",
    category: "Page",
    summary: "DisplayAvenue digital growth partner homepage",
    href: "/",
  },
  {
    id: "page-services",
    title: "Services",
    category: "Page",
    summary: "Browse all digital marketing, web, and AI services",
    href: "/services",
  },
  {
    id: "page-solutions",
    title: "Solutions",
    category: "Page",
    summary: "Growth solutions by goal, size, and channel",
    href: "/solutions",
  },
  {
    id: "page-ai",
    title: "AI Platform",
    category: "Page",
    summary: "AI tools and automation suites",
    href: "/ai-platform",
  },
  {
    id: "page-industries",
    title: "Industries",
    category: "Page",
    summary: "Industry-specific digital growth playbooks",
    href: "/industries",
  },
  {
    id: "page-packages",
    title: "Packages",
    category: "Page",
    summary: "Transparent packages and pricing plans",
    href: "/packages",
  },
  {
    id: "page-tools",
    title: "Free Tools",
    category: "Page",
    summary: "Free SEO, marketing, and growth tools",
    href: "/free-tools",
  },
  {
    id: "page-cases",
    title: "Case Studies",
    category: "Page",
    summary: "Real results and client success stories",
    href: "/case-studies",
  },
  {
    id: "page-portfolio",
    title: "Portfolio",
    category: "Page",
    summary: "Selected website and campaign work",
    href: "/portfolio",
  },
  {
    id: "page-resources",
    title: "Resources",
    category: "Page",
    summary: "Guides, blogs, and growth insights",
    href: "/resources",
  },
  {
    id: "page-catalogue",
    title: "Catalogue",
    category: "Page",
    summary: "Download the DisplayAvenue company catalogue PDF",
    href: "/catalogue",
  },
  {
    id: "page-contact",
    title: "Contact / Free Proposal",
    category: "Page",
    summary: "Book a consultation or request a proposal",
    href: "/contact",
  },
  {
    id: "page-why",
    title: "Why DisplayAvenue",
    category: "Page",
    summary: "Why brands choose DisplayAvenue",
    href: "/why-displayavenue",
  },
];

function toHit(page: DetailPageContent): SearchHit {
  const base = KIND_PATH[page.kind] || "/";
  return {
    id: `${page.kind}-${page.slug}`,
    title: page.title,
    category: page.category || page.kind,
    summary: page.summary || page.headline || "",
    href: `${base}${page.slug}`,
  };
}

function scoreHit(hit: SearchHit, q: string): number {
  const title = hit.title.toLowerCase();
  const cat = hit.category.toLowerCase();
  const summary = hit.summary.toLowerCase();
  if (title === q) return 100;
  if (title.startsWith(q)) return 80;
  if (title.includes(q)) return 60;
  if (cat.includes(q)) return 40;
  if (summary.includes(q)) return 20;
  return 0;
}

export function SiteSearch({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const cms = useCms();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");

  const catalog = useMemo(() => {
    const pages = [
      ...cms.services,
      ...cms.industries,
      ...cms.packages,
      ...cms.solutions,
      ...cms.ai,
      ...cms.tools,
      ...cms.cases,
      ...cms.projects,
      ...cms.resources,
    ].map(toHit);
    return [...STATIC_PAGES, ...pages];
  }, [cms]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    return catalog
      .map((hit) => ({ hit, score: scoreHit(hit, q) }))
      .filter((row) => row.score > 0)
      .sort((a, b) => b.score - a.score || a.hit.title.localeCompare(b.hit.title))
      .slice(0, 12)
      .map((row) => row.hit);
  }, [catalog, query]);

  useEffect(() => {
    if (!open) return;
    setQuery("");
    const t = window.setTimeout(() => inputRef.current?.focus(), 30);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.classList.add("search-open");
    return () => {
      window.clearTimeout(t);
      document.removeEventListener("keydown", onKey);
      document.body.classList.remove("search-open");
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="site-search" role="dialog" aria-modal="true" aria-label="Search the website">
      <button type="button" className="site-search-backdrop" aria-label="Close search" onClick={onClose} />
      <div className="site-search-panel">
        <div className="site-search-bar">
          <Icon name="search" size={18} color="#0056ff" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search services, industries, tools, resources…"
            aria-label="Search"
            autoComplete="off"
            spellCheck={false}
          />
          <button type="button" className="site-search-close" onClick={onClose} aria-label="Close">
            <Icon name="close" size={18} />
          </button>
        </div>

        <div className="site-search-body">
          {query.trim().length < 2 && (
            <p className="site-search-hint">Type at least 2 characters to search the site.</p>
          )}
          {query.trim().length >= 2 && results.length === 0 && (
            <p className="site-search-hint">
              No matches for “{query.trim()}”. Try another keyword or{" "}
              <Link to="/contact" onClick={onClose}>
                contact us
              </Link>
              .
            </p>
          )}
          {results.length > 0 && (
            <ul className="site-search-results">
              {results.map((hit) => (
                <li key={hit.id}>
                  <Link to={hit.href} onClick={onClose}>
                    <span className="site-search-cat">{hit.category}</span>
                    <strong>{hit.title}</strong>
                    {hit.summary && <span className="site-search-sum">{hit.summary}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
