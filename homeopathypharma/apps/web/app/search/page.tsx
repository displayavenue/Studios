import type { Metadata } from "next";
import { Container, Section } from "@homeopathypharma/ui";
import { searchCatalog } from "@/lib/api";
import { buildPageMetadata, ContentPage } from "@/components/content-page";

export const metadata: Metadata = buildPageMetadata(
  "Search",
  "/search",
  "Search homeopathic remedies, health topics, and educational articles.",
);

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q = "" } = await searchParams;
  const results = q ? await searchCatalog(q) : null;

  return (
    <ContentPage
      title="Search"
      description="Find remedies, health topics, and articles across HomeopathyPharma."
      path="/search"
    >
      <form action="/search" role="search" style={{ marginBottom: "var(--hp-space-8)" }}>
        <label htmlFor="search-q" style={{ display: "block", marginBottom: "var(--hp-space-2)", fontWeight: 600 }}>
          Search query
        </label>
        <input
          id="search-q"
          name="q"
          type="search"
          defaultValue={q}
          className="hp-focus-ring"
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

      {results ? (
        <Section aria-labelledby="results-heading">
          <h2 id="results-heading" style={{ fontSize: "var(--hp-text-xl)" }}>
            Results for &ldquo;{q}&rdquo;
          </h2>
          {results.total === 0 ? (
            <p className="product-placeholder">No results yet — API stub returned empty. Try again when search is live.</p>
          ) : (
            <ul style={{ paddingLeft: "var(--hp-space-6)" }}>
              {results.products.map((p) => (
                <li key={p.slug}>
                  <a href={`/products/${p.slug}`} className="hp-link">
                    {p.name}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </Section>
      ) : (
        <p className="disclaimer-banner">
          Enter a term above to search the catalog. Results are fetched from <code>API_URL/v1/search</code> when
          available.
        </p>
      )}
    </ContentPage>
  );
}
