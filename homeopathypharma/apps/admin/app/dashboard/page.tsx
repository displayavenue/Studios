import type { Metadata } from "next";
import Link from "next/link";
import { Container, Section } from "@homeopathypharma/ui";
import {
  ensureCmsDefaults,
  getCmsSummary,
  listCatalogDoctors,
  listCatalogProducts,
  listMedia,
  listPages,
  listCatalogBrands,
} from "@homeopathypharma/content-store";

export const metadata: Metadata = { title: "Dashboard" };

export default function AdminDashboardPage() {
  ensureCmsDefaults();
  const products = listCatalogProducts(true);
  const doctors = listCatalogDoctors(true);
  const cms = getCmsSummary();
  const pages = listPages();
  const media = listMedia();
  const brands = listCatalogBrands();

  const cards = [
    { label: "Products", value: products.length, href: "/catalog" },
    { label: "Brands", value: brands.length, href: "/brands" },
    { label: "Doctors", value: doctors.length, href: "/doctors" },
    { label: "Pages", value: pages.length, href: "/pages" },
    { label: "Media", value: media.length, href: "/media" },
    { label: "Homepage banners", value: cms.bannerCount, href: "/homepage" },
  ];

  return (
    <Section>
      <Container>
        <div className="admin-content">
          <h1 className="font-display" style={{ marginTop: 0, fontSize: "var(--hp-text-3xl)" }}>
            Command center
          </h1>
          <p style={{ color: "var(--hp-color-text-muted)", marginBottom: "var(--hp-space-8)" }}>
            WordPress-style CMS — edit content, catalogue, media, and menus from this backend. CMS path:{" "}
            <code>{cms.cmsDir}</code>
          </p>
          <div className="metric-grid">
            {cards.map((card) => (
              <Link key={card.label} href={card.href} className="metric-card" style={{ textDecoration: "none", color: "inherit" }}>
                <span style={{ fontSize: "var(--hp-text-sm)", color: "var(--hp-color-text-muted)" }}>{card.label}</span>
                <strong>{card.value}</strong>
              </Link>
            ))}
          </div>
          <ul style={{ marginTop: "1.5rem", paddingLeft: "1.2rem", lineHeight: 1.7 }}>
            <li>
              <Link href="/homepage" className="hp-link">
                Homepage banners, categories & rails
              </Link>
            </li>
            <li>
              <Link href="/pages" className="hp-link">
                Pages (About, Contact, custom)
              </Link>
            </li>
            <li>
              <Link href="/media" className="hp-link">
                Media library
              </Link>
            </li>
            <li>
              <Link href="/menus" className="hp-link">
                Header / footer / mobile menus
              </Link>
            </li>
            <li>
              <Link href="/catalog" className="hp-link">
                Products — create, price, stock, unlist
              </Link>
            </li>
            <li>
              <Link href="/brands" className="hp-link">
                Brands
              </Link>
            </li>
            <li>
              <Link href="/settings" className="hp-link">
                Site settings & SEO defaults
              </Link>
            </li>
          </ul>
          <p style={{ marginTop: "1.5rem", fontSize: "0.9rem", color: "var(--hp-color-text-muted)" }}>
            After saving CMS changes, rebuild and redeploy the storefront so Hostinger static hosting picks them up.
          </p>
        </div>
      </Container>
    </Section>
  );
}
