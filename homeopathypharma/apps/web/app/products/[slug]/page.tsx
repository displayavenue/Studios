import type { Metadata } from "next";
import Link from "next/link";
import { Button, Container, Section } from "@homeopathypharma/ui";
import { buildProductJsonLd, serializeJsonLd } from "@homeopathypharma/seo";
import { getProduct } from "@/lib/api";
import { buildPageMetadata } from "@/components/content-page";
import { PRODUCT_SLUGS, toParams } from "@/lib/static-params";


export function generateStaticParams() {
  return toParams(PRODUCT_SLUGS);
}

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  return buildPageMetadata(product?.name ?? "Product", `/products/${slug}`, product?.description);
}

const sections = [
  "Gallery",
  "Title & brand",
  "Potency / variant",
  "Ingredients",
  "Directions",
  "Warnings",
  "Reviews",
  "FAQ",
  "Related products",
  "Consultation CTA",
  "Shipping estimate",
] as const;

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);
  const displayName = product?.name ?? slug.replace(/-/g, " ");

  const jsonLd = product
    ? serializeJsonLd(
        buildProductJsonLd({
          name: product.name,
          description: product.description,
          url: `/products/${slug}`,
          brand: product.brand,
          sku: slug,
          imageUrls: [],
          price: 0,
          currency: "INR",
          availability: "InStock",
        }),
      )
    : null;

  return (
    <>
      {jsonLd ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} /> : null}
      <Section>
        <Container>
          <nav aria-label="Breadcrumb" style={{ fontSize: "var(--hp-text-sm)", marginBottom: "var(--hp-space-6)" }}>
            <Link href="/search" className="hp-link">
              Remedies
            </Link>
            <span aria-hidden="true"> / </span>
            <span>{displayName}</span>
          </nav>

          {sections.map((section) => (
            <section key={section} className="product-section" aria-labelledby={`section-${section}`}>
              <h2 id={`section-${section}`}>{section}</h2>
              <div className="product-placeholder">
                {section === "Title & brand" && product ? (
                  <>
                    <strong>{product.name}</strong> — {product.brand}
                  </>
                ) : section === "Consultation CTA" ? (
                  <Link href="/doctors">
                    <Button variant="accent">Ask a doctor before you order</Button>
                  </Link>
                ) : (
                  <>
                    Placeholder for <strong>{section}</strong> — wired to{" "}
                    <code>GET /v1/products/{slug}</code> and related endpoints.
                  </>
                )}
              </div>
            </section>
          ))}

          <aside className="disclaimer-banner" style={{ marginTop: "var(--hp-space-8)" }}>
            Product information is for educational purposes. Read labels carefully and consult a qualified
            practitioner. HomeopathyPharma does not make disease-treatment claims for any remedy listed here.
          </aside>
        </Container>
      </Section>
    </>
  );
}
