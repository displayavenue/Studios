import type { Metadata } from "next";
import { buildPageMetadata, ContentPage } from "@/components/content-page";

export const metadata: Metadata = buildPageMetadata("Content update log", "/content-update-log", "Recent content updates.");

export default function Page() {
  return (
    <ContentPage title="Content update log" description="Recent educational and catalogue updates." path="/content-update-log">
      <ul style={{ maxWidth: "60ch", lineHeight: 1.7 }}>
        <li>Published Mumbai BHMS doctor directory and live product catalogue.</li>
        <li>Expanded remedy and brand hubs with pack-level product links.</li>
        <li>Refreshed homepage rails and pharmacy-style browsing experience.</li>
      </ul>
    </ContentPage>
  );
}
