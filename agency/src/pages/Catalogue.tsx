import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { SEO } from "../components/SEO";
import "../styles/pages.css";

type CatalogueData = {
  enabled?: boolean;
  title?: string;
  eyebrow?: string;
  headline?: string;
  summary?: string;
  ctaLabel?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  pdfUrl?: string;
  fileName?: string;
  fileSize?: number;
  uploadedAt?: string | null;
};

const DEFAULTS: CatalogueData = {
  enabled: true,
  title: "DisplayAvenue Catalogue",
  eyebrow: "Company Catalogue",
  headline: "Explore the DisplayAvenue catalogue",
  summary:
    "Download our latest catalogue for services, capabilities, and how we help brands grow with digital marketing, web, ecommerce, branding, and AI.",
  ctaLabel: "Download PDF",
  secondaryCtaLabel: "Request a proposal",
  secondaryCtaHref: "/contact",
  pdfUrl: "",
};

function formatBytes(n?: number) {
  const bytes = Number(n) || 0;
  if (!bytes) return "";
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

export function Catalogue() {
  const [data, setData] = useState<CatalogueData>(DEFAULTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/content/catalogue.json", { cache: "no-store" });
        if (!res.ok) return;
        const json = (await res.json()) as CatalogueData;
        if (!cancelled && json && typeof json === "object") {
          setData({ ...DEFAULTS, ...json });
        }
      } catch {
        /* keep defaults */
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const enabled = data.enabled !== false;
  const pdfUrl = (data.pdfUrl || "").trim();
  const hasPdf = Boolean(pdfUrl);
  const title = data.title || DEFAULTS.title!;
  const headline = data.headline || DEFAULTS.headline!;
  const summary = data.summary || DEFAULTS.summary!;
  const sizeLabel = formatBytes(data.fileSize);

  return (
    <div className="page-shell">
      <SEO
        title={`${title} | DisplayAvenue`}
        description={summary}
        path="/catalogue"
      />
      <div className="container">
        <div className="page-frame" style={{ padding: "2rem" }}>
          <p className="badge">{data.eyebrow || "Company Catalogue"}</p>
          <h1 className="section-title" style={{ marginTop: "0.75rem" }}>
            {headline}
          </h1>
          <p className="section-sub" style={{ maxWidth: "42rem" }}>
            {summary}
          </p>

          {!enabled ? (
            <p className="section-sub" style={{ marginTop: "1.5rem" }}>
              The catalogue is temporarily unavailable. Please check back soon or{" "}
              <Link to="/contact">contact us</Link>.
            </p>
          ) : loading ? (
            <p className="section-sub" style={{ marginTop: "1.5rem" }}>
              Loading catalogue…
            </p>
          ) : hasPdf ? (
            <>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "0.75rem",
                  alignItems: "center",
                  marginTop: "1.5rem",
                }}
              >
                <a
                  href={pdfUrl}
                  className="btn btn-primary"
                  download={data.fileName || "DisplayAvenue-Catalogue.pdf"}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {data.ctaLabel || "Download PDF"} →
                </a>
                <Link
                  to={data.secondaryCtaHref || "/contact"}
                  className="btn btn-ghost"
                >
                  {data.secondaryCtaLabel || "Request a proposal"} →
                </Link>
                {(data.fileName || sizeLabel) && (
                  <span style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
                    {[data.fileName, sizeLabel].filter(Boolean).join(" · ")}
                  </span>
                )}
              </div>

              <div
                className="catalogue-viewer"
                style={{
                  marginTop: "2rem",
                  border: "1px solid var(--border, #e2e8f0)",
                  borderRadius: "12px",
                  overflow: "hidden",
                  background: "#f8fafc",
                  minHeight: "70vh",
                }}
              >
                <iframe
                  title={title}
                  src={`${pdfUrl}#view=FitH`}
                  style={{
                    width: "100%",
                    height: "78vh",
                    border: 0,
                    display: "block",
                  }}
                />
              </div>
              <p
                style={{
                  marginTop: "0.75rem",
                  fontSize: "0.85rem",
                  color: "var(--muted)",
                }}
              >
                Can’t see the preview?{" "}
                <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
                  Open the PDF in a new tab
                </a>
                .
              </p>
            </>
          ) : (
            <div style={{ marginTop: "2rem" }}>
              <p className="section-sub">
                Our latest catalogue PDF will appear here once published. In the
                meantime, explore our services or request a proposal.
              </p>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "0.75rem",
                  marginTop: "1.25rem",
                }}
              >
                <Link to="/services" className="btn btn-primary">
                  Browse services →
                </Link>
                <Link to="/contact" className="btn btn-ghost">
                  Request a proposal →
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
