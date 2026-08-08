import type { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata, ContentPage } from "@/components/content-page";
import { ProductGrid } from "@/components/product-grid";
import { PRODUCTS } from "@/lib/content/products";

export const metadata: Metadata = buildPageMetadata(
  "Shop",
  "/shop",
  "Browse homeopathic remedies and wellness products across categories, brands, remedies, health areas, and bundles.",
);

const browseDimensions = [
  { href: "/shop/categories/", label: "Categories", hint: "Single remedies, biochemic, bundles, pet care" },
  { href: "/brands/", label: "Brands", hint: "First-class brand hubs" },
  { href: "/remedies/", label: "Remedies", hint: "Master remedy monographs" },
  { href: "/shop/health-areas/", label: "Health areas", hint: "Shop-by wellness themes" },
  { href: "/bundles/", label: "Bundles", hint: "Curated multi-product kits" },
  { href: "/shop/new-arrivals/", label: "New arrivals", hint: "Recently published products" },
  { href: "/shop/bestsellers/", label: "Bestsellers", hint: "Popular products" },
] as const;

export default function ShopPage() {
  return (
    <ContentPage
      title="Shop"
      description="Browse the live catalogue by category, brand, remedy, or health area — each path links to the same published products."
      path="/shop"
    >
      <p style={{ marginTop: 0, maxWidth: "60ch" }}>
        {PRODUCTS.length} products currently published. Choose how you want to explore, or scroll the full grid
        below.
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

      <h2 className="font-display" style={{ marginTop: "var(--hp-space-10)", color: "var(--hp-color-teal-900)" }}>
        All products
      </h2>
      <ProductGrid products={PRODUCTS} />
    </ContentPage>
  );
}
