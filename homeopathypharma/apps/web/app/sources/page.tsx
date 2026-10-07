import type { Metadata } from "next";
import { buildPageMetadata, ContentPage } from "@/components/content-page";

export const metadata: Metadata = buildPageMetadata("Sources", "/sources", "Reference sources for educational content.");

export default function Page() {
  return (
    <ContentPage title="Sources" description="Reference sources used across educational pages." path="/sources">
      <p style={{ maxWidth: "60ch" }}>
        Educational pages cite pharmacopoeial references, materia medica literature, and editorial review notes.
        Source lists are maintained for transparency and are not prescribing guidance.
      </p>
    </ContentPage>
  );
}
