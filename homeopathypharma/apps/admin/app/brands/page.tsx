"use client";

import { useEffect, useState } from "react";
import { Container, Section, Button } from "@homeopathypharma/ui";

type Brand = {
  slug: string;
  name: string;
  manufacturer: string;
  productCount: number;
  description?: string;
  imageUrl?: string;
};

export default function BrandsCmsPage() {
  const [items, setItems] = useState<Brand[]>([]);
  const [message, setMessage] = useState("Loading brands…");
  const [draft, setDraft] = useState({ name: "", manufacturer: "", description: "", imageUrl: "" });

  async function load() {
    const res = await fetch("/api/cms/brands");
    if (!res.ok) {
      setMessage("Sign in required");
      return;
    }
    const data = (await res.json()) as { items: Brand[] };
    setItems(data.items ?? []);
    setMessage(`${data.items?.length ?? 0} brands`);
  }

  useEffect(() => {
    void load();
  }, []);

  async function create() {
    if (!draft.name.trim()) return;
    const res = await fetch("/api/cms/brands", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });
    if (!res.ok) {
      const err = (await res.json().catch(() => ({}))) as { error?: string };
      setMessage(err.error || "Create failed");
      return;
    }
    setDraft({ name: "", manufacturer: "", description: "", imageUrl: "" });
    await load();
  }

  async function save(brand: Brand) {
    await fetch("/api/cms/brands", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug: brand.slug,
        patch: {
          name: brand.name,
          manufacturer: brand.manufacturer,
          description: brand.description,
          imageUrl: brand.imageUrl,
        },
      }),
    });
    await load();
    setMessage(`Saved ${brand.name}`);
  }

  return (
    <Section>
      <Container>
        <div className="admin-content">
          <h1 className="font-display" style={{ marginTop: 0 }}>
            Brands
          </h1>
          <p style={{ color: "var(--hp-color-text-muted)" }}>{message}</p>

          <fieldset className="admin-fieldset">
            <legend>Add brand</legend>
            <label className="admin-field">
              Name
              <input
                className="admin-input"
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              />
            </label>
            <label className="admin-field">
              Manufacturer
              <input
                className="admin-input"
                value={draft.manufacturer}
                onChange={(e) => setDraft({ ...draft, manufacturer: e.target.value })}
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
            <label className="admin-field">
              Image URL
              <input
                className="admin-input"
                value={draft.imageUrl}
                onChange={(e) => setDraft({ ...draft, imageUrl: e.target.value })}
                placeholder="/images/brands/brand-sbl.png"
              />
            </label>
            <Button variant="accent" onClick={() => void create()}>
              Create brand
            </Button>
          </fieldset>

          <div style={{ display: "grid", gap: "1rem", marginTop: "1.5rem" }}>
            {items.map((brand, index) => (
              <fieldset key={brand.slug} className="admin-fieldset">
                <legend>
                  {brand.name} · {brand.productCount} products · <code>{brand.slug}</code>
                </legend>
                <label className="admin-field">
                  Name
                  <input
                    className="admin-input"
                    value={brand.name}
                    onChange={(e) => {
                      const next = [...items];
                      next[index] = { ...brand, name: e.target.value };
                      setItems(next);
                    }}
                  />
                </label>
                <label className="admin-field">
                  Manufacturer
                  <input
                    className="admin-input"
                    value={brand.manufacturer}
                    onChange={(e) => {
                      const next = [...items];
                      next[index] = { ...brand, manufacturer: e.target.value };
                      setItems(next);
                    }}
                  />
                </label>
                <label className="admin-field">
                  Description
                  <textarea
                    className="admin-input"
                    rows={2}
                    value={brand.description || ""}
                    onChange={(e) => {
                      const next = [...items];
                      next[index] = { ...brand, description: e.target.value };
                      setItems(next);
                    }}
                  />
                </label>
                <label className="admin-field">
                  Image URL
                  <input
                    className="admin-input"
                    value={brand.imageUrl || ""}
                    onChange={(e) => {
                      const next = [...items];
                      next[index] = { ...brand, imageUrl: e.target.value };
                      setItems(next);
                    }}
                  />
                </label>
                <Button variant="accent" size="sm" onClick={() => void save(brand)}>
                  Save brand
                </Button>
              </fieldset>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
