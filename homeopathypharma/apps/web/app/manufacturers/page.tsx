import type { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata, ContentPage } from "@/components/content-page";
import { brands } from "@/lib/content/brands";

export const metadata: Metadata = buildPageMetadata(
  "Manufacturers",
  "/manufacturers",
  "Manufacturing partners linked to published brands on HomeopathyPharma.",
);

export default function Page() {
  const manufacturers = [...new Map(brands.map((b) => [b.manufacturer, b])).values()];

  return (
    <ContentPage
      title="Manufacturers"
      description="Manufacturing partners linked from brand hubs. Brands and manufacturers are separate catalogue entities."
      path="/manufacturers"
    >
      <ul className="catalog-grid" role="list">
        {manufacturers.map((entry) => (
          <li key={entry.manufacturer} className="catalog-tile">
            <div className="catalog-tile__link">
              <p className="catalog-tile__eyebrow">Linked brand</p>
              <h3 className="catalog-tile__title font-display">{entry.manufacturer}</h3>
              <p className="catalog-tile__meta">
                See{" "}
                <Link href={`/brands/${entry.slug}/`} className="hp-link">
                  {entry.name}
                </Link>
              </p>
            </div>
          </li>
        ))}
      </ul>
    </ContentPage>
  );
}
