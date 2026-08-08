import type { Metadata } from "next";
import { buildPageMetadata, ContentPage } from "@/components/content-page";

export const metadata: Metadata = buildPageMetadata(
  "Search",
  "/search",
  "Search homeopathic remedies, health topics, and educational articles.",
);

/**
 * Static-export friendly search shell.
 * Query handling and live results require the API (`/v1/search`) — not available on shared Hostinger static hosting.
 */
export default function SearchPage() {
  return (
    <ContentPage
      title="Search"
      description="Find remedies, health topics, and articles across HomeopathyPharma."
      path="/search"
    >
      <form action="/search/" role="search" method="get" style={{ marginBottom: "var(--hp-space-8)" }}>
        <label htmlFor="search-q" style={{ display: "block", marginBottom: "var(--hp-space-2)", fontWeight: 600 }}>
          Search query
        </label>
        <input
          id="search-q"
          name="q"
          type="search"
          className="hp-focus-ring"
          placeholder="Search remedies, conditions, doctors…"
          style={{
            width: "100%",
            maxWidth: "32rem",
            padding: "var(--hp-space-3) var(--hp-space-4)",
            border: "1px solid var(--hp-color-border)",
            borderRadius: "var(--hp-radius-md)",
            fontFamily: "inherit",
            minHeight: "44px",
          }}
        />
      </form>

      <p className="disclaimer-banner">
        Live search connects to the HomeopathyPharma API. This static Hostinger deploy shows the storefront shell;
        catalog search activates when the API is online.
      </p>
    </ContentPage>
  );
}
