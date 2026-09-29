"use client";

import { useEffect, useState } from "react";
import { Container, Section, Button } from "@homeopathypharma/ui";

type ProductRow = {
  id: string;
  slug: string;
  name: string;
  brandSlug: string;
  brandName: string;
  priceInr: number;
  mrpInr: number;
  inStock: boolean;
  listed?: boolean;
  category: string;
  form?: string;
  potency?: string;
  packSize?: string;
  description?: string;
  imageUrl?: string;
};

type Brand = { slug: string; name: string };

export default function CatalogPage() {
  const [items, setItems] = useState<ProductRow[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [total, setTotal] = useState(0);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("Loading catalogue…");
  const [savingId, setSavingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState({
    name: "",
    brandSlug: "sbl",
    priceInr: 99,
    mrpInr: 120,
    category: "General",
    form: "Dilution",
    potency: "30C",
    packSize: "30 ml",
    description: "",
    imageUrl: "/images/products/product-dilution.png",
  });

  async function load(search = q) {
    const res = await fetch(`/api/cms/catalog?all=1&limit=80&q=${encodeURIComponent(search)}`);
    if (!res.ok) {
      setStatus(res.status === 401 ? "Sign in required" : "Failed to load");
      return;
    }
    const data = (await res.json()) as { items: ProductRow[]; total: number };
    setItems(data.items ?? []);
    setTotal(data.total ?? 0);
    setStatus(`${data.total ?? 0} products · full create / edit / unlist`);
  }

  useEffect(() => {
    void load();
    void (async () => {
      const res = await fetch("/api/cms/brands");
      if (res.ok) {
        const data = (await res.json()) as { items: Brand[] };
        setBrands(data.items ?? []);
        if (data.items?.[0]?.slug) {
          setDraft((d) => ({ ...d, brandSlug: data.items[0]!.slug }));
        }
      }
    })();
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

  async function create() {
    if (!draft.name.trim()) return;
    setCreating(true);
    const res = await fetch("/api/cms/catalog", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });
    setCreating(false);
    if (!res.ok) {
      setStatus("Create failed");
      return;
    }
    setDraft((d) => ({ ...d, name: "", description: "" }));
    await load();
    setStatus("Product created");
  }

  async function unlist(id: string) {
    if (!confirm("Unlist this product from the storefront?")) return;
    await fetch("/api/cms/catalog", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    await load();
  }

  return (
    <Section>
      <Container>
        <div className="admin-content">
          <h1 className="font-display" style={{ marginTop: 0 }}>
            Products
          </h1>
          <p style={{ color: "var(--hp-color-text-muted)" }}>{status}</p>
          <p style={{ color: "var(--hp-color-text-muted)", fontSize: "0.9rem" }}>
            Create and edit products in the CMS catalogue snapshot. Rebuild/redeploy the storefront to publish on
            Hostinger.
          </p>

          <div style={{ display: "flex", gap: "0.5rem", margin: "1rem 0", flexWrap: "wrap" }}>
            <input
              className="admin-input"
              style={{ maxWidth: "18rem" }}
              placeholder="Search products…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") void load(q);
              }}
            />
            <Button variant="secondary" onClick={() => void load(q)}>
              Search
            </Button>
          </div>

          <fieldset className="admin-fieldset">
            <legend>Add product</legend>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(10rem, 1fr))", gap: "0.65rem" }}>
              <label className="admin-field">
                Name
                <input className="admin-input" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
              </label>
              <label className="admin-field">
                Brand
                <select
                  className="admin-input"
                  value={draft.brandSlug}
                  onChange={(e) => setDraft({ ...draft, brandSlug: e.target.value })}
                >
                  {brands.map((b) => (
                    <option key={b.slug} value={b.slug}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="admin-field">
                Price
                <input
                  type="number"
                  className="admin-input"
                  value={draft.priceInr}
                  onChange={(e) => setDraft({ ...draft, priceInr: Number(e.target.value) })}
                />
              </label>
              <label className="admin-field">
                MRP
                <input
                  type="number"
                  className="admin-input"
                  value={draft.mrpInr}
                  onChange={(e) => setDraft({ ...draft, mrpInr: Number(e.target.value) })}
                />
              </label>
              <label className="admin-field">
                Form
                <input className="admin-input" value={draft.form} onChange={(e) => setDraft({ ...draft, form: e.target.value })} />
              </label>
              <label className="admin-field">
                Potency
                <input
                  className="admin-input"
                  value={draft.potency}
                  onChange={(e) => setDraft({ ...draft, potency: e.target.value })}
                />
              </label>
              <label className="admin-field">
                Pack size
                <input
                  className="admin-input"
                  value={draft.packSize}
                  onChange={(e) => setDraft({ ...draft, packSize: e.target.value })}
                />
              </label>
              <label className="admin-field">
                Category
                <input
                  className="admin-input"
                  value={draft.category}
                  onChange={(e) => setDraft({ ...draft, category: e.target.value })}
                />
              </label>
            </div>
            <label className="admin-field">
              Image URL
              <input
                className="admin-input"
                value={draft.imageUrl}
                onChange={(e) => setDraft({ ...draft, imageUrl: e.target.value })}
              />
            </label>
            <label className="admin-field">
              Description
              <textarea
                className="admin-input"
                rows={2}
                value={draft.description}
                onChange={(e) => setDraft({ ...draft, description: e.target.value })}
              />
            </label>
            <Button variant="accent" disabled={creating} onClick={() => void create()}>
              Create product
            </Button>
          </fieldset>

          <p style={{ fontSize: "0.85rem", color: "var(--hp-color-text-muted)" }}>
            Showing {items.length} of {total}
          </p>

          <div style={{ overflowX: "auto", marginTop: "0.75rem" }}>
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
                  <tr key={p.id} style={{ opacity: p.listed === false ? 0.55 : 1 }}>
                    <td>
                      <strong>{p.name}</strong>
                      <div style={{ fontSize: "0.75rem", color: "var(--hp-color-text-muted)" }}>
                        {p.category}
                        {p.listed === false ? " · unlisted" : ""}
                      </div>
                      <input
                        className="admin-input"
                        style={{ marginTop: "0.35rem" }}
                        defaultValue={p.imageUrl || ""}
                        placeholder="Image URL"
                        id={`img-${p.id}`}
                      />
                    </td>
                    <td>{p.brandName}</td>
                    <td>
                      <input type="number" defaultValue={p.priceInr} className="admin-input" id={`price-${p.id}`} />
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
                    <td style={{ whiteSpace: "nowrap" }}>
                      <Button
                        variant="accent"
                        size="sm"
                        disabled={savingId === p.id}
                        onClick={() => {
                          const price = Number((document.getElementById(`price-${p.id}`) as HTMLInputElement).value);
                          const mrp = Number((document.getElementById(`mrp-${p.id}`) as HTMLInputElement).value);
                          const inStock = (document.getElementById(`stock-${p.id}`) as HTMLInputElement).checked;
                          const imageUrl = (document.getElementById(`img-${p.id}`) as HTMLInputElement).value;
                          void save(p, { priceInr: price, mrpInr: mrp, inStock, imageUrl, listed: true });
                        }}
                      >
                        Save
                      </Button>{" "}
                      <Button size="sm" variant="secondary" onClick={() => void unlist(p.id)}>
                        Unlist
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
