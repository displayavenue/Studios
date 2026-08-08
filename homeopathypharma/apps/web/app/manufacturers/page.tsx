import type { Metadata } from "next";
import { buildPageMetadata, ContentPage } from "@/components/content-page";

export const metadata: Metadata = buildPageMetadata("Manufacturers", "/manufacturers", "Manufacturing partners and quality standards.");

export default function Page() {
  return (
    <ContentPage title="Manufacturers" description="Manufacturing partners and quality standards." path="/manufacturers">
      <p className="product-placeholder">Manufacturer listings from GET /v1/manufacturers.</p>
    </ContentPage>
  );
}
