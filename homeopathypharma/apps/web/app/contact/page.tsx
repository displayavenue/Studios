import type { Metadata } from "next";
import { buildPageMetadata, ContentPage } from "@/components/content-page";

export const metadata: Metadata = buildPageMetadata(
  "Contact us",
  "/contact",
  "Reach our support and editorial teams.",
);

export default function Page() {
  return (
    <ContentPage title="Contact us" description="Reach our support and editorial teams." path="/contact">
      <p className="product-placeholder">
        Contact form and support channels load from <code>GET /v1/support/contact-options</code>.
      </p>
    </ContentPage>
  );
}
