import type { Metadata } from "next";
import { buildPageMetadata, ContentPage } from "@/components/content-page";

export const metadata: Metadata = buildPageMetadata(
  "About HomeopathyPharma",
  "/about",
  "Our mission, team, and commitment to thoughtful homeopathic care.",
);

export default function Page() {
  return (
    <ContentPage title="About HomeopathyPharma" description="Our mission, team, and commitment to thoughtful homeopathic care." path="/about">
      <p style={{ maxWidth: "60ch" }}>
        HomeopathyPharma connects curated remedies, verified practitioners, and medically reviewed educational
        content. We prioritize clarity, safety, and respectful healthcare UX.
      </p>
    </ContentPage>
  );
}
