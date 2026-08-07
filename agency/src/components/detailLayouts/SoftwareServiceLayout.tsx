import { Link } from "react-router-dom";
import { Icon } from "../Icon";
import type { DetailPageContent } from "../../data/catalogTypes";
import { FaqBlock, LeadStrip, RelatedBlock } from "./shared";

const MODULES = [
  { title: "Finance & Accounting", desc: "GST-ready ledgers, invoicing, payables, receivables, and closing packs.", icon: "dollar" },
  { title: "Inventory & Warehouse", desc: "Stock, batches, multi-location transfers, and reorder automation.", icon: "bag" },
  { title: "Sales & CRM", desc: "Quotes, orders, pipeline, and customer history in one workflow.", icon: "growth" },
  { title: "Purchase & Vendors", desc: "PO approvals, vendor scorecards, and landed-cost tracking.", icon: "briefcase" },
  { title: "HR & Payroll", desc: "Attendance, payroll, leave, and employee records connected to finance.", icon: "users" },
  { title: "Manufacturing / Projects", desc: "BOM, job cards, WIP, and project costing for ops teams.", icon: "gear" },
  { title: "Analytics & Dashboards", desc: "Role-based KPIs for founders, finance, and plant managers.", icon: "chart" },
  { title: "Integrations", desc: "Tally, GST portals, banks, ecommerce, WhatsApp, and custom APIs.", icon: "nodes" },
];

const PLATFORMS = [
  { title: "Custom ERP", desc: "Built around your processes when off-the-shelf tools force workarounds." },
  { title: "Odoo ERP", desc: "Modular implementation with clean apps, accounting, and inventory." },
  { title: "SAP Business One", desc: "Enterprise-grade controls for growing mid-market manufacturers & distributors." },
  { title: "Cloud ERP", desc: "Secure multi-branch access with role permissions and audit trails." },
];

export function SoftwareServiceLayout({ page }: { page: DetailPageContent }) {
  const isErp = page.slug === "erp";
  return (
    <div className="detail-page layout-software">
      <section className="soft-hero">
        <div className="container soft-hero-grid">
          <div>
            <p className="badge">{isErp ? "ERP Implementation · India" : page.eyebrow}</p>
            <h1>
              {isErp
                ? "ERP software that replaces spreadsheet chaos with one operational system"
                : page.headline}
            </h1>
            <p className="detail-summary">
              {isErp
                ? "DisplayAvenue designs, builds, and implements ERP systems for Indian manufacturers, distributors, and growing SMBs - finance, inventory, sales, HR, and reporting in one place."
                : page.summary}
            </p>
            <div className="detail-hero-actions">
              <Link to="/contact" className="btn btn-primary">
                Book Free ERP Consultation →
              </Link>
              <Link to="/case-studies" className="btn btn-outline">
                See Delivery Proof
              </Link>
            </div>
            <ul className="soft-trust-row">
              <li>Discovery in 5-7 days</li>
              <li>GST & multi-branch ready</li>
              <li>Training + handover included</li>
            </ul>
          </div>
          <aside className="soft-proof-card">
            <h2>What buyers evaluate first</h2>
            <ul>
              {(page.deliverables || []).slice(0, 6).map((d) => (
                <li key={d}>
                  <Icon name="check" size={14} color="#0056ff" />
                  {d}
                </li>
              ))}
            </ul>
            <Link to="/contact" className="btn btn-primary btn-sm">
              Request scoped proposal
            </Link>
          </aside>
        </div>
      </section>

      {isErp && (
        <section className="section">
          <div className="container">
            <h2 className="section-title">ERP modules we implement</h2>
            <p className="section-sub">
              Map every feature to an operational outcome - not a feature dump.
            </p>
            <div className="soft-module-grid">
              {MODULES.map((m) => (
                <article key={m.title} className="soft-module-card">
                  <span className="icon-box" style={{ background: "#e8f0ff" }}>
                    <Icon name={m.icon} color="#0056ff" />
                  </span>
                  <h3>{m.title}</h3>
                  <p>{m.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {isErp && (
        <section className="section detail-alt">
          <div className="container">
            <h2 className="section-title">Platform paths that fit your stage</h2>
            <div className="soft-platform-grid">
              {PLATFORMS.map((p) => (
                <article key={p.title} className="soft-platform-card">
                  <h3>{p.title}</h3>
                  <p>{p.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section">
        <div className="container">
          <h2 className="section-title">
            {isErp ? "Why operations teams choose DisplayAvenue for ERP" : `Why ${page.title}`}
          </h2>
          <div className="detail-benefits">
            {page.benefits.map((b) => (
              <div key={b.title} className="detail-benefit card">
                <h3>{b.title}</h3>
                <p>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section detail-alt">
        <div className="container">
          <h2 className="section-title">Implementation roadmap</h2>
          <ol className="soft-process">
            {page.process.map((step, i) => (
              <li key={step.title}>
                <span>{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {page.whoItsFor && page.whoItsFor.length > 0 && (
        <section className="section">
          <div className="container">
            <h2 className="section-title">Built for these teams</h2>
            <div className="soft-audience">
              {page.whoItsFor.map((w) => (
                <span key={w}>{w}</span>
              ))}
            </div>
          </div>
        </section>
      )}

      {page.reviews && page.reviews.length > 0 && (
        <section className="section detail-alt">
          <div className="container">
            <h2 className="section-title">Proof from delivery partners</h2>
            <div className="detail-reviews">
              {page.reviews.slice(0, 3).map((r) => (
                <blockquote key={r.name + r.quote.slice(0, 20)} className="detail-review">
                  <p>“{r.quote}”</p>
                  <footer>
                    <strong>{r.name}</strong>
                    <span>
                      {r.role}
                      {r.company ? `, ${r.company}` : ""}
                    </span>
                  </footer>
                </blockquote>
              ))}
            </div>
          </div>
        </section>
      )}

      <FaqBlock
        page={page}
        title={isErp ? "ERP implementation FAQs" : undefined}
      />
      <LeadStrip
        page={page}
        primary={isErp ? "Get ERP proposal →" : page.ctaLabel || "Get Free Proposal →"}
        secondary={{ label: "Talk on WhatsApp", href: "https://wa.me/919222122333" }}
        note={
          isErp
            ? "Tell us your industry, branches, and current tools (Excel/Tally/legacy). We reply with module scope, timeline, and investment range."
            : undefined
        }
      />
      <RelatedBlock page={page} />
    </div>
  );
}
