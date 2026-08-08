import type { Metadata } from "next";
import Link from "next/link";
import { Button, Container, Section } from "@homeopathypharma/ui";
import { buildProductJsonLd, serializeJsonLd } from "@homeopathypharma/seo";
import { ProductGrid } from "@/components/product-grid";
import { buildPageMetadata } from "@/components/content-page";
import { getProduct, listProductSlugs, relatedProducts } from "@/lib/content/products";
import { toParams } from "@/lib/static-params";

export function generateStaticParams() {
  return toParams(listProductSlugs());
}

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  return buildPageMetadata(
    product?.name ?? "Product",
    `/products/${slug}`,
    product
      ? `${product.name} by ${product.brandName}. ${product.form}${product.potency ? ` ${product.potency}` : ""}, ${product.packSize}. Educational retail listing.`
      : undefined,
  );
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProduct(slug);

  if (!product) {
    return (
      <Section>
        <Container>
          <h1 className="font-display">Product not found</h1>
          <p>
            <Link href="/shop/" className="hp-link">
              Back to shop
            </Link>
          </p>
        </Container>
      </Section>
    );
  }

  const related = relatedProducts(slug, 4);
  const jsonLd = serializeJsonLd(
    buildProductJsonLd({
      name: product.name,
      description: `${product.name} — ${product.form}${product.potency ? ` ${product.potency}` : ""}. Educational listing only.`,
      url: `/products/${slug}`,
      brand: product.brandName,
      sku: product.id,
      imageUrls: [],
      price: product.priceInr,
      currency: "INR",
      availability: product.inStock ? "InStock" : "OutOfStock",
    }),
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      <Section>
        <Container>
          <nav aria-label="Breadcrumb" style={{ fontSize: "var(--hp-text-sm)", marginBottom: "var(--hp-space-6)" }}>
            <Link href="/shop/" className="hp-link">
              Shop
            </Link>
            <span aria-hidden="true"> / </span>
            <Link href={`/remedies/${product.remedySlug}/`} className="hp-link">
              {product.remedyName}
            </Link>
            <span aria-hidden="true"> / </span>
            <span>{product.name}</span>
          </nav>

          <p className="catalog-tile__eyebrow">{product.brandName}</p>
          <h1 className="font-display" style={{ margin: "0 0 var(--hp-space-3)", color: "var(--hp-color-teal-900)" }}>
            {product.name}
          </h1>
          <p style={{ marginTop: 0, color: "var(--hp-color-text-muted)" }}>
            {product.form}
            {product.potency ? ` · ${product.potency}` : ""} · {product.packSize} · {product.category}
          </p>

          <div className="price-row">
            <span className="price-row__current">₹{product.priceInr}</span>
            {product.mrpInr > product.priceInr ? <span className="price-row__mrp">MRP ₹{product.mrpInr}</span> : null}
            <span style={{ color: "var(--hp-color-text-muted)", fontSize: "var(--hp-text-sm)" }}>
              {product.inStock ? "In stock · ships after payment confirmation" : "Currently unavailable"}
            </span>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--hp-space-3)", marginBottom: "var(--hp-space-8)" }}>
            {product.inStock ? (
              <Link href="/cart/">
                <Button variant="accent">Add to cart</Button>
              </Link>
            ) : (
              <Button variant="secondary">Currently unavailable</Button>
            )}
            <Link href="/doctors/">
              <Button variant="secondary">Ask a doctor before you order</Button>
            </Link>
          </div>

          <ul className="detail-meta">
            <li>
              <strong>Brand</strong>
              <Link href={`/brands/${product.brandSlug}/`} className="hp-link">
                {product.brandName}
              </Link>
            </li>
            <li>
              <strong>Manufacturer</strong>
              <span>{product.manufacturer}</span>
            </li>
            <li>
              <strong>Remedy</strong>
              <Link href={`/remedies/${product.remedySlug}/`} className="hp-link">
                {product.remedyName}
              </Link>
            </li>
            <li>
              <strong>Source</strong>
              <span>{product.source}</span>
            </li>
            <li>
              <strong>Batch</strong>
              <span>{product.batchNote}</span>
            </li>
          </ul>

          <section className="product-section" aria-labelledby="ingredients">
            <h2 id="ingredients">Ingredients</h2>
            <p>{product.ingredients}</p>
          </section>

          <section className="product-section" aria-labelledby="directions">
            <h2 id="directions">Directions</h2>
            <p>{product.directions}</p>
            <p style={{ color: "var(--hp-color-text-muted)" }}>{product.storage}</p>
          </section>

          <section className="product-section" aria-labelledby="warnings">
            <h2 id="warnings">Warnings</h2>
            <p>{product.warnings}</p>
          </section>

          <section className="product-section" aria-labelledby="faq">
            <h2 id="faq">FAQ</h2>
            <ul className="faq-list">
              {product.faqs.map((faq) => (
                <li key={faq.q}>
                  <details>
                    <summary>{faq.q}</summary>
                    <p>{faq.a}</p>
                  </details>
                </li>
              ))}
            </ul>
          </section>

          {related.length > 0 ? (
            <section className="product-section" aria-labelledby="related">
              <h2 id="related">Related products</h2>
              <ProductGrid products={related} />
            </section>
          ) : null}

          <aside className="disclaimer-banner" style={{ marginTop: "var(--hp-space-8)" }}>
            Product information is for educational purposes. Read labels carefully and consult a qualified
            practitioner. HomeopathyPharma does not make disease-treatment claims for any remedy listed here.
          </aside>
        </Container>
      </Section>
    </>
  );
}
