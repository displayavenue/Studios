import Link from "next/link";
import type { Product } from "@/lib/content/products";
import { productImageDataUrl } from "@/lib/content/images";

export function ProductGrid({
  products,
  compact = false,
}: {
  products: Product[];
  compact?: boolean;
}) {
  if (products.length === 0) {
    return <p style={{ color: "var(--hp-color-text-muted)" }}>No products in this view yet.</p>;
  }

  return (
    <ul className={`product-grid${compact ? " product-grid--compact" : ""}`} role="list">
      {products.map((product) => {
        const image = productImageDataUrl({
          name: product.name,
          form: product.form,
          brandName: product.brandName,
          potency: product.potency,
        });
        const discount =
          product.mrpInr > product.priceInr
            ? Math.round(((product.mrpInr - product.priceInr) / product.mrpInr) * 100)
            : 0;

        return (
          <li key={product.id} className="product-card">
            <Link href={`/products/${product.slug}/`} className="product-card__link hp-focus-ring">
              <div className="product-card__media">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image} alt="" width={320} height={320} loading="lazy" />
                {discount > 0 ? <span className="product-card__badge">{discount}% off</span> : null}
              </div>
              <div className="product-card__body">
                <p className="product-card__brand">{product.brandName}</p>
                <h3 className="product-card__title">{product.name}</h3>
                <p className="product-card__meta">
                  {product.form}
                  {product.potency ? ` · ${product.potency}` : ""}
                  {product.packSize ? ` · ${product.packSize}` : ""}
                </p>
                <div className="product-card__price-row">
                  <span className="product-card__price">₹{product.priceInr}</span>
                  {product.mrpInr > product.priceInr ? (
                    <span className="product-card__mrp">₹{product.mrpInr}</span>
                  ) : null}
                </div>
                <span className={`product-card__cta${product.inStock ? "" : " is-disabled"}`}>
                  {product.inStock ? "Add" : "Notify"}
                </span>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
