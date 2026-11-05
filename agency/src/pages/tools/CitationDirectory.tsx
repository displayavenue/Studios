import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ToolLayout } from "./ToolLayout";
import { SoftwareApplicationSchema } from "../../components/SEO";
import { fallbackCitations, type CitationsCms } from "../../data/citations";
import { useEffect } from "react";

const base = import.meta.env.BASE_URL.replace(/\/?$/, "/");

const faqs = [
  {
    question: "Should I buy 5000 DA80 backlinks?",
    answer:
      "No. Mass-bought high-DA links are usually PBNs or spam and can get the site penalized. Earn links with tools, reports, partners, and consistent citations instead.",
  },
  {
    question: "What is NAP consistency?",
    answer:
      "Name, Address, and Phone must match exactly across Google Business Profile, your website, and directories. Small mismatches confuse local ranking systems.",
  },
];

export function CitationDirectory() {
  const [data, setData] = useState<CitationsCms>(fallbackCitations);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    fetch(`${base}content/citations.json`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => {
        if (json?.directories?.length) setData({ ...fallbackCitations, ...json });
      })
      .catch(() => undefined);
  }, []);

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(data.directories.map((d) => d.category)))],
    [data.directories],
  );

  const rows = data.directories.filter(
    (d) => filter === "All" || d.category === filter,
  );

  return (
    <ToolLayout
      title="India Citation & Directory List"
      description={data.lead}
      path="/free-tools/citation-directory"
      badge="Outreach kit"
      faqs={faqs}
    >
      <SoftwareApplicationSchema
        name="India Citation & Directory List"
        description="Curated citation directories and outreach templates for Indian businesses."
        path="/free-tools/citation-directory"
      />

      <div className="tool-actions" style={{ marginTop: 0, marginBottom: "1rem" }}>
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            className={`btn btn-sm ${filter === cat ? "btn-primary" : "btn-outline"}`}
            onClick={() => setFilter(cat)}
          >
            {cat}
          </button>
        ))}
        <Link to="/resources/india-sme-digital-growth-report" className="btn btn-outline btn-sm">
          Industry report →
        </Link>
      </div>

      <div className="cite-table-wrap">
        <table className="cite-table">
          <thead>
            <tr>
              <th>Directory</th>
              <th>Category</th>
              <th>Priority</th>
              <th>NAP / fields</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>
                  <a href={row.url} target="_blank" rel="noreferrer">
                    <strong>{row.name}</strong>
                  </a>
                  <div style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>
                    Authority: {row.daHint}
                  </div>
                </td>
                <td>{row.category}</td>
                <td>
                  <span className={`cite-priority cite-priority--${row.priority}`}>
                    {row.priority}
                  </span>
                </td>
                <td>{row.napFields}</td>
                <td>{row.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="cite-templates">
        <h2 style={{ margin: "1.5rem 0 0", fontSize: "1.1rem", color: "var(--navy)" }}>
          Outreach templates
        </h2>
        <p className="tool-note" style={{ marginTop: "0.35rem" }}>
          Replace {"{{placeholders}}"} before sending. One polite follow-up is enough. Track sends
          in Admin → Backlink Tracker (or your Google Sheet).
        </p>
        {data.templates.map((t) => (
          <article key={t.id} className="cite-template">
            <h3>{t.name}</h3>
            <p>
              <strong>Subject:</strong> {t.subject}
            </p>
            <pre>{t.body}</pre>
          </article>
        ))}
      </div>
    </ToolLayout>
  );
}
