import Link from "next/link";
import type { Product } from "@/lib/content/products";

export function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return <p style={{ color: "var(--hp-color-text-muted)" }}>No products in this view yet.</p>;
  }

  return (
    <ul className="catalog-grid" role="list">
      {products.map((product) => (
        <li key={product.id} className="catalog-tile">
          <Link href={`/products/${product.slug}/`} className="catalog-tile__link hp-focus-ring">
            <p className="catalog-tile__eyebrow">{product.brandName}</p>
            <h3 className="catalog-tile__title font-display">{product.name}</h3>
            <p className="catalog-tile__meta">
              {product.form}
              {product.potency ? ` · ${product.potency}` : ""}
              {product.packSize ? ` · ${product.packSize}` : ""}
            </p>
            <p className="catalog-tile__price">
              <span>₹{product.priceInr}</span>
              {product.mrpInr > product.priceInr ? (
                <span className="catalog-tile__mrp">MRP ₹{product.mrpInr}</span>
              ) : null}
            </p>
            <p className="catalog-tile__stock">{product.inStock ? "In stock" : "Currently unavailable"}</p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
