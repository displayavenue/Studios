import type { Metadata } from "next";
import Link from "next/link";
import { Container, Section } from "@homeopathypharma/ui";
import { getCmsSummary, listCatalogDoctors, listCatalogProducts } from "@homeopathypharma/content-store";

export const metadata: Metadata = { title: "Dashboard" };

export default function AdminDashboardPage() {
  const products = listCatalogProducts();
  const doctors = listCatalogDoctors();
  const cms = getCmsSummary();

  const cards = [
    { label: "Published products", value: products.length },
    { label: "Listed doctors", value: doctors.length },
    { label: "Pending verification", value: doctors.filter((d) => d.verificationStatus !== "VERIFIED").length },
    { label: "Homepage banners", value: cms.bannerCount },
  ];

  return (
    <Section>
      <Container>
        <div className="admin-content">
          <h1 className="font-display" style={{ marginTop: 0, fontSize: "var(--hp-text-3xl)" }}>
            Command center
          </h1>
          <p style={{ color: "var(--hp-color-text-muted)", marginBottom: "var(--hp-space-8)" }}>
            Control homepage, catalogue pricing/stock, and doctor directory. CMS path: <code>{cms.cmsDir}</code>
          </p>
          <div className="metric-grid">
            {cards.map((card) => (
              <div key={card.label} className="metric-card">
                <span style={{ fontSize: "var(--hp-text-sm)", color: "var(--hp-color-text-muted)" }}>{card.label}</span>
                <strong>{card.value}</strong>
              </div>
            ))}
          </div>
          <ul style={{ marginTop: "1.5rem", paddingLeft: "1.2rem", lineHeight: 1.7 }}>
            <li>
              <Link href="/homepage" className="hp-link">
                Edit homepage banners & rails
              </Link>
            </li>
            <li>
              <Link href="/catalog" className="hp-link">
                Manage product price & stock
              </Link>
            </li>
            <li>
              <Link href="/doctors" className="hp-link">
                Manage doctor fees & verification
              </Link>
            </li>
          </ul>
        </div>
      </Container>
    </Section>
  );
}
