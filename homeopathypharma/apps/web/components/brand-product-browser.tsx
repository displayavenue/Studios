"use client";

import { useMemo, useState } from "react";
import { ProductGrid } from "@/components/product-grid";
import type { Product } from "@/lib/content/products";

const PAGE_SIZE = 24;

export function BrandProductBrowser({ products }: { products: Product[] }) {
  const forms = useMemo(() => {
    const set = new Set(products.map((p) => p.form));
    return ["All", ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [products]);

  const [form, setForm] = useState("All");
  const [visible, setVisible] = useState(PAGE_SIZE);

  const filtered = useMemo(
    () => (form === "All" ? products : products.filter((p) => p.form === form)),
    [form, products],
  );

  const shown = filtered.slice(0, visible);
  const remaining = Math.max(0, filtered.length - shown.length);

  return (
    <div className="brand-browser">
      <div className="brand-browser__toolbar">
        <p className="brand-browser__count">
          Showing {shown.length} of {filtered.length} products
        </p>
        <div className="brand-browser__filters" role="group" aria-label="Filter by form">
          {forms.map((item) => (
            <button
              key={item}
              type="button"
              className={`brand-browser__chip hp-focus-ring${form === item ? " is-active" : ""}`}
              onClick={() => {
                setForm(item);
                setVisible(PAGE_SIZE);
              }}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <ProductGrid products={shown} />

      {remaining > 0 ? (
        <div className="brand-browser__more">
          <button
            type="button"
            className="brand-browser__load hp-focus-ring"
            onClick={() => setVisible((n) => n + PAGE_SIZE)}
          >
            Show more ({remaining} left)
          </button>
        </div>
      ) : null}
    </div>
  );
}
