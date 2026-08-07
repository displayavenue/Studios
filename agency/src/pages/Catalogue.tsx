import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Icon } from "../components/Icon";
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

const HIGHLIGHTS = [
  { icon: "growth", color: "#0056ff", title: "Digital marketing", desc: "SEO, ads, and growth programs" },
  { icon: "layers", color: "#7c3aed", title: "Web & ecommerce", desc: "Sites and stores that convert" },
  { icon: "brain", color: "#0891b2", title: "AI & automation", desc: "Smarter delivery and ops" },
  { icon: "brand", color: "#e11d48", title: "Brand & creative", desc: "Identity that stands out" },
];

function formatBytes(n?: number) {
  const bytes = Number(n) || 0;
  if (!bytes) return "";
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

export function Catalogue() {
  const [data, setData] = useState<CatalogueData>(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [previewFailed, setPreviewFailed] = useState(false);

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
  const fileLabel = data.fileName || "DisplayAvenue-Catalogue.pdf";

  return (
    <div className="page-shell">
      <SEO
        title={`${title} | DisplayAvenue`}
        description={summary}
        path="/catalogue"
      />
      <div className="container-wide">
        <div className="page-frame">
          <div className="catalogue-layout">
            <aside className="catalogue-side">
              <p className="badge">{data.eyebrow || "Company Catalogue"}</p>
              <h1 className="section-title">{headline}</h1>
              <p className="catalogue-summary">{summary}</p>

              {enabled && hasPdf && !loading ? (
                <div className="catalogue-actions">
                  <a
                    href={pdfUrl}
                    className="btn btn-primary"
                    download={fileLabel}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {data.ctaLabel || "Download PDF"} →
                  </a>
                  <a
                    href={pdfUrl}
                    className="btn btn-ghost"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open in new tab →
                  </a>
                  <p className="catalogue-filemeta">
                    {[fileLabel, sizeLabel].filter(Boolean).join(" · ")}
                  </p>
                </div>
              ) : null}

              <ul className="feature-list catalogue-highlights">
                {HIGHLIGHTS.map((item) => (
                  <li key={item.title}>
                    <span className="icon-box" style={{ background: `${item.color}18` }}>
                      <Icon name={item.icon} color={item.color} />
                    </span>
                    <div>
                      <strong>{item.title}</strong>
                      <span>{item.desc}</span>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="cta-box dark">
                <h4>Want a tailored plan?</h4>
                <p>Tell us your goals — we’ll recommend the right mix of services.</p>
                <Link
                  to={data.secondaryCtaHref || "/contact"}
                  className="btn btn-outline btn-sm"
                  style={{ background: "#fff" }}
                >
                  {data.secondaryCtaLabel || "Request a proposal"} →
                </Link>
              </div>
            </aside>

            <div className="catalogue-main">
              {!enabled ? (
                <div className="catalogue-empty">
                  <h2>Catalogue temporarily unavailable</h2>
                  <p>
                    Please check back soon or{" "}
                    <Link to="/contact">contact our team</Link>.
                  </p>
                </div>
              ) : loading ? (
                <div className="catalogue-empty">
                  <h2>Loading catalogue…</h2>
                  <p>Fetching the latest PDF from the CMS.</p>
                </div>
              ) : hasPdf ? (
                <>
                  <div className="catalogue-toolbar">
                    <div>
                      <strong>Live catalogue preview</strong>
                      <span>{fileLabel}{sizeLabel ? ` · ${sizeLabel}` : ""}</span>
                    </div>
                    <div className="catalogue-toolbar-actions">
                      <a
                        href={pdfUrl}
                        className="btn btn-primary btn-sm"
                        download={fileLabel}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Download
                      </a>
                      <a
                        href={pdfUrl}
                        className="btn btn-ghost btn-sm"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Full screen
                      </a>
                    </div>
                  </div>

                  <div className="catalogue-viewer-wrap">
                    {!previewFailed ? (
                      <object
                        data={`${pdfUrl}#toolbar=1&navpanes=0&view=FitH`}
                        type="application/pdf"
                        className="catalogue-viewer"
                        aria-label={title}
                      >
                        <iframe
                          title={title}
                          src={`${pdfUrl}#toolbar=1&navpanes=0&view=FitH`}
                          className="catalogue-viewer"
                          onError={() => setPreviewFailed(true)}
                        />
                      </object>
                    ) : (
                      <div className="catalogue-empty">
                        <h2>Preview unavailable in this browser</h2>
                        <p>The catalogue is ready — open or download the PDF to view it.</p>
                        <div className="catalogue-actions" style={{ marginTop: "1rem" }}>
                          <a
                            href={pdfUrl}
                            className="btn btn-primary"
                            download={fileLabel}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Download PDF →
                          </a>
                        </div>
                      </div>
                    )}
                  </div>

                  <p className="catalogue-hint">
                    Can’t see the preview?{" "}
                    <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
                      Open the PDF in a new tab
                    </a>
                    .
                  </p>
                </>
              ) : (
                <div className="catalogue-empty">
                  <span className="icon-box" style={{ background: "#0056ff18", width: 48, height: 48 }}>
                    <Icon name="doc" color="#0056ff" />
                  </span>
                  <h2>Catalogue PDF coming soon</h2>
                  <p>
                    Our latest company catalogue will appear here once published from the CMS.
                    Browse services or request a proposal in the meantime.
                  </p>
                  <div className="catalogue-actions">
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
      </div>
    </div>
  );
}
