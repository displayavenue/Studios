import { Link } from "react-router-dom";
import type { ReactNode } from "react";
import { SEO, BreadcrumbSchema, FAQPageSchema } from "../../components/SEO";
import { linkableTools, industryReport } from "../../data/linkableTools";
import "./tools.css";

type ToolLayoutProps = {
  title: string;
  description: string;
  path: string;
  badge?: string;
  children: ReactNode;
  faqs?: { question: string; answer: string }[];
};

export function ToolLayout({
  title,
  description,
  path,
  badge = "Free tool",
  children,
  faqs = [],
}: ToolLayoutProps) {
  const related = [
    ...linkableTools.filter((t) => t.href !== path).slice(0, 3),
    {
      slug: industryReport.slug,
      title: industryReport.title,
      href: industryReport.href,
      badge: "Report",
    },
  ];

  return (
    <div className="page-shell tool-app-page">
      <SEO title={`${title} | DisplayAvenue`} description={description} path={path} />
      <BreadcrumbSchema
        items={[
          { name: "Home", path: "/" },
          { name: "Free Tools", path: "/free-tools" },
          { name: title, path },
        ]}
      />
      {faqs.length ? <FAQPageSchema faqs={faqs} /> : null}

      <div className="container">
        <div className="tool-app">
          <header className="tool-app__head">
            <p className="badge">{badge}</p>
            <h1>{title}</h1>
            <p>{description}</p>
            <div className="tool-app__crumbs">
              <Link to="/free-tools">All free tools</Link>
              <span aria-hidden>·</span>
              <Link to="/contact">Get a free growth plan</Link>
            </div>
          </header>

          <div className="tool-app__body">{children}</div>

          <aside className="tool-app__related">
            <h2>More linkable resources</h2>
            <div className="tool-app__related-grid">
              {related.map((item) => (
                <Link key={item.href} to={item.href} className="tool-app__related-card">
                  <span>{item.badge || "Tool"}</span>
                  <strong>{item.title}</strong>
                </Link>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export function useSoftwareAppSchema(
  name: string,
  description: string,
  path: string,
  applicationCategory = "BusinessApplication",
) {
  // Imported dynamically in pages via SoftwareApplicationSchema component
  return { name, description, path, applicationCategory };
}
