"use client";

import { useEffect, useState } from "react";
import { Container, Section, Button } from "@homeopathypharma/ui";

type ProductRow = {
  id: string;
  slug: string;
  name: string;
  brandName: string;
  priceInr: number;
  mrpInr: number;
  inStock: boolean;
  category: string;
};

export default function CatalogPage() {
  const [items, setItems] = useState<ProductRow[]>([]);
  const [status, setStatus] = useState("Loading catalogue…");
  const [savingId, setSavingId] = useState<string | null>(null);

  async function load() {
    const res = await fetch("/api/cms/catalog");
    const data = (await res.json()) as { items: ProductRow[] };
    setItems(data.items ?? []);
    setStatus(`${data.items?.length ?? 0} products · edits write to CMS overrides`);
  }

  useEffect(() => {
    void load();
  }, []);

  async function save(product: ProductRow, patch: Partial<ProductRow>) {
    setSavingId(product.id);
    await fetch("/api/cms/catalog", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: product.id, patch }),
    });
    await load();
    setSavingId(null);
  }

  return (
    <Section>
      <Container>
        <div className="admin-content">
          <h1 className="font-display" style={{ marginTop: 0 }}>
            Catalog control
          </h1>
          <p style={{ color: "var(--hp-color-text-muted)" }}>{status}</p>
          <p style={{ color: "var(--hp-color-text-muted)", fontSize: "0.9rem" }}>
            Price, stock, and listing changes save to <code>data/cms/product-overrides.json</code>. Rebuild/redeploy
            the storefront to publish overrides on Hostinger static hosting.
          </p>

          <div style={{ overflowX: "auto", marginTop: "1.25rem" }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Brand</th>
                  <th>Price</th>
                  <th>MRP</th>
                  <th>Stock</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {items.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <strong>{p.name}</strong>
                      <div style={{ fontSize: "0.75rem", color: "var(--hp-color-text-muted)" }}>{p.category}</div>
                    </td>
                    <td>{p.brandName}</td>
                    <td>
                      <input
                        type="number"
                        defaultValue={p.priceInr}
                        className="admin-input"
                        id={`price-${p.id}`}
                      />
                    </td>
                    <td>
                      <input type="number" defaultValue={p.mrpInr} className="admin-input" id={`mrp-${p.id}`} />
                    </td>
                    <td>
                      <label style={{ display: "inline-flex", gap: "0.35rem", alignItems: "center" }}>
                        <input type="checkbox" defaultChecked={p.inStock} id={`stock-${p.id}`} />
                        In stock
                      </label>
                    </td>
                    <td>
                      <Button
                        variant="accent"
                        size="sm"
                        disabled={savingId === p.id}
                        onClick={() => {
                          const price = Number((document.getElementById(`price-${p.id}`) as HTMLInputElement).value);
                          const mrp = Number((document.getElementById(`mrp-${p.id}`) as HTMLInputElement).value);
                          const inStock = (document.getElementById(`stock-${p.id}`) as HTMLInputElement).checked;
                          void save(p, { priceInr: price, mrpInr: mrp, inStock });
                        }}
                      >
                        {savingId === p.id ? "Saving…" : "Save"}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Container>
    </Section>
  );
}
