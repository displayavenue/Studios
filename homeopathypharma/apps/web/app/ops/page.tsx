import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@homeopathypharma/ui";
import { buildPageMetadata, ContentPage } from "@/components/content-page";
import { allCatalogTopicCount, CATALOG_TAXONOMY } from "@/lib/content/taxonomy";
import { PRODUCTS } from "@/lib/content/products";
import { DOCTORS } from "@/lib/content/doctors";

export const metadata: Metadata = buildPageMetadata("Admin ops", "/ops", "HomeopathyPharma operations overview.");

export default function OpsPortalPage() {
  return (
    <ContentPage
      title="Admin operations"
      description="Catalogue, doctors, and storefront controls."
      path="/ops"
    >
      <div className="portal-panel">
        <div className="metric-grid" style={{ marginBottom: "1.25rem" }}>
          <div className="metric-card">
            <span>Products</span>
            <strong>{PRODUCTS.length}</strong>
          </div>
          <div className="metric-card">
            <span>Categories</span>
            <strong>{CATALOG_TAXONOMY.length}</strong>
          </div>
          <div className="metric-card">
            <span>Topics</span>
            <strong>{allCatalogTopicCount()}</strong>
          </div>
          <div className="metric-card">
            <span>Doctors</span>
            <strong>{DOCTORS.length}</strong>
          </div>
        </div>
        <ul className="portal-links">
          <li>
            <Link href="/shop/categories/">Review catalogue categories</Link>
          </li>
          <li>
            <Link href="/doctors/">Review doctor directory</Link>
          </li>
          <li>
            <Link href="/shop/">Storefront shop</Link>
          </li>
          <li>
            <Link href="/content-update-log/">Content update log</Link>
          </li>
        </ul>
        <p style={{ color: "var(--hp-color-text-muted)", fontSize: "0.9rem" }}>
          Full CMS editing (homepage, price/stock overrides, doctor verification) runs in the Admin app on your ops
          host. This portal is the storefront-side control overview.
        </p>
        <div style={{ marginTop: "1rem" }}>
          <Link href="/login/admin/">
            <Button variant="secondary">Switch admin account</Button>
          </Link>
        </div>
      </div>
    </ContentPage>
  );
}
