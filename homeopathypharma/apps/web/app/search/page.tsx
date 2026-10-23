import type { Metadata } from "next";
import { buildPageMetadata, ContentPage } from "@/components/content-page";
import { StorefrontSearch } from "@/components/storefront-search";
import { brands } from "@/lib/content/brands";
import { DOCTORS } from "@/lib/content/doctors";
import { PRODUCTS } from "@/lib/content/products";
import { remedies } from "@/lib/content/remedies";

export const metadata: Metadata = buildPageMetadata(
  "Search",
  "/search",
  "Search homeopathic remedies, products, brands, and Mumbai doctors.",
);

export default function SearchPage() {
  return (
    <ContentPage
      title="Search"
      description="Find remedies, products, brands, and practitioners across HomeopathyPharma."
      path="/search"
    >
      <StorefrontSearch products={PRODUCTS} doctors={DOCTORS} remedies={remedies} brands={brands} />
    </ContentPage>
  );
}
