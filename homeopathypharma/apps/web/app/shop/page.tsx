import type { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata, ContentPage } from "@/components/content-page";

export const metadata: Metadata = buildPageMetadata(
  "Shop",
  "/shop",
  "Browse homeopathic remedies and wellness products across categories, brands, remedies, health areas, and bundles.",
);

const browseDimensions = [
  { href: "/shop/categories/", label: "Categories", hint: "Store navigation tree" },
  { href: "/brands/", label: "Brands", hint: "First-class brand hubs" },
  { href: "/remedies/", label: "Remedies", hint: "Master remedy monographs" },
  { href: "/shop/health-areas/", label: "Health areas", hint: "Shop-by wellness themes" },
  { href: "/bundles/", label: "Bundles", hint: "Curated multi-product kits" },
  { href: "/shop/offers/", label: "Offers", hint: "Promotions and deals" },
  { href: "/shop/new-arrivals/", label: "New arrivals", hint: "Recently published products" },
  { href: "/shop/bestsellers/", label: "Bestsellers", hint: "Popular products" },
] as const;

export default function ShopPage() {
  return (
    <ContentPage
      title="Shop"
      description="Multidimensional catalog browse — categories, brands, remedies, health areas, bundles, and more."
      path="/shop"
    >
      <p style={{ marginTop: 0, maxWidth: "60ch" }}>
        Our catalogue is organized across several dimensions, not a single category tree. Choose how you want to
        explore — each path links to the same underlying product catalog with different discovery lenses.
      </p>
      <ul
        style={{
          listStyle: "none",
          padding: 0,
          display: "grid",
          gap: "var(--hp-space-4)",
          marginTop: "var(--hp-space-6)",
        }}
      >
        {browseDimensions.map((dim) => (
          <li key={dim.href}>
            <Link href={dim.href} className="hp-link hp-focus-ring font-display" style={{ fontSize: "var(--hp-text-lg)" }}>
              {dim.label}
            </Link>
            <span style={{ display: "block", fontSize: "var(--hp-text-sm)", color: "var(--hp-color-text-muted)" }}>
              {dim.hint}
            </span>
          </li>
        ))}
      </ul>
      <p className="product-placeholder" style={{ marginTop: "var(--hp-space-8)" }}>
        Product grid from <code>GET /v1/products</code>.
      </p>
    </ContentPage>
  );
}
