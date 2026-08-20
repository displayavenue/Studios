import type { Metadata } from "next";
import { buildPageMetadata, ContentPage } from "@/components/content-page";

export const metadata: Metadata = buildPageMetadata(
  "Doctor verification",
  "/doctor-verification",
  "How we review practitioner credentials before listing profiles.",
);

export default function Page() {
  return (
    <ContentPage title="Doctor verification" description="How we review practitioner credentials before listing profiles." path="/doctor-verification">
      <p style={{ maxWidth: "60ch" }}>
        Listed practitioners undergo credential checks and profile review. Verification status is shown on each doctor
        profile; listings may change as credentials are renewed or updated.
      </p>
      <p className="disclaimer-banner" style={{ marginTop: "var(--hp-space-6)" }}>
        Verification supports trust in our directory. It does not guarantee clinical outcomes or replace your own
        due diligence when choosing care.
      </p>
    </ContentPage>
  );
}
