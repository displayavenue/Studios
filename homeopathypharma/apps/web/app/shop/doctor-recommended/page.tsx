import type { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata, ContentPage } from "@/components/content-page";
import { ProductGrid } from "@/components/product-grid";
import { PRODUCTS } from "@/lib/content/products";

export const metadata: Metadata = buildPageMetadata(
  "Often paired with consultations",
  "/shop/doctor-recommended",
  "Products commonly browsed alongside practitioner consultations — not endorsed prescriptions.",
);

export default function DoctorRecommendedPage() {
  const picks = PRODUCTS.filter((p) =>
    ["arnica-montana", "nux-vomica", "pulsatilla", "rhus-tox", "chamomilla"].includes(p.remedySlug),
  ).slice(0, 20);

  return (
    <ContentPage
      title="Often paired with consultations"
      description="These products are frequently viewed near consultation booking — not personal prescriptions or endorsements."
      path="/shop/doctor-recommended"
    >
      <p style={{ maxWidth: "60ch" }}>
        Prefer guidance first?{" "}
        <Link href="/doctors/" className="hp-link">
          Browse Mumbai practitioners
        </Link>
        .
      </p>
      <ProductGrid products={picks} />
    </ContentPage>
  );
}
