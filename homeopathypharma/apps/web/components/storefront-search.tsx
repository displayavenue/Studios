"use client";

import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";
import type { Brand } from "@/lib/content/brands";
import type { DoctorProfile } from "@/lib/content/doctors";
import type { Product } from "@/lib/content/products";
import type { Remedy } from "@/lib/content/remedies";

type Props = {
  products: Product[];
  doctors: DoctorProfile[];
  remedies: Remedy[];
  brands: Brand[];
};

export function StorefrontSearch({ products, doctors, remedies, brands }: Props) {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();

  const results = useMemo(() => {
    if (q.length < 2) {
      return { products: [] as Product[], doctors: [] as DoctorProfile[], remedies: [] as Remedy[], brands: [] as Brand[] };
    }
    return {
      products: products
        .filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.remedyName.toLowerCase().includes(q) ||
            p.brandName.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q) ||
            p.healthAreas.some((area) => area.includes(q.replace(/\s+/g, "-"))) ||
            p.potency.toLowerCase().includes(q),
        )
        .slice(0, 16),
      doctors: doctors
        .filter(
          (d) =>
            d.fullName.toLowerCase().includes(q) ||
            d.locality.toLowerCase().includes(q) ||
            d.specialties.some((s) => s.toLowerCase().includes(q)) ||
            d.clinicName.toLowerCase().includes(q),
        )
        .slice(0, 12),
      remedies: remedies
        .filter((r) => r.name.toLowerCase().includes(q) || r.latinName.toLowerCase().includes(q))
        .slice(0, 12),
      brands: brands.filter((b) => b.name.toLowerCase().includes(q) || b.tagline.toLowerCase().includes(q)).slice(0, 8),
    };
  }, [brands, doctors, products, q, remedies]);

  const total =
    results.products.length + results.doctors.length + results.remedies.length + results.brands.length;

  return (
    <div>
      <label htmlFor="search-q" style={{ display: "block", marginBottom: "var(--hp-space-2)", fontWeight: 600 }}>
        Search the catalogue
      </label>
      <input
        id="search-q"
        name="q"
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="hp-focus-ring"
        placeholder="Search remedies, products, brands, Mumbai doctors…"
        style={{
          width: "100%",
          maxWidth: "32rem",
          padding: "var(--hp-space-3) var(--hp-space-4)",
          border: "1px solid var(--hp-color-border)",
          borderRadius: "var(--hp-radius-md)",
          fontFamily: "inherit",
          minHeight: "44px",
          background: "var(--hp-color-surface-elevated)",
        }}
      />

      {q.length >= 2 ? (
        <div style={{ marginTop: "var(--hp-space-8)" }}>
          <p style={{ color: "var(--hp-color-text-muted)" }}>
            {total} result{total === 1 ? "" : "s"} for “{query.trim()}”
          </p>

          {results.products.length > 0 ? (
            <ResultGroup title="Products">
              {results.products.map((p) => (
                <li key={p.id}>
                  <Link href={`/products/${p.slug}/`} className="hp-link">
                    {p.name}
                  </Link>
                  <span style={{ color: "var(--hp-color-text-muted)" }}> · ₹{p.priceInr}</span>
                </li>
              ))}
            </ResultGroup>
          ) : null}

          {results.remedies.length > 0 ? (
            <ResultGroup title="Remedies">
              {results.remedies.map((r) => (
                <li key={r.slug}>
                  <Link href={`/remedies/${r.slug}/`} className="hp-link">
                    {r.name}
                  </Link>
                  <span style={{ color: "var(--hp-color-text-muted)" }}> · {r.productCount} packs</span>
                </li>
              ))}
            </ResultGroup>
          ) : null}

          {results.brands.length > 0 ? (
            <ResultGroup title="Brands">
              {results.brands.map((b) => (
                <li key={b.slug}>
                  <Link href={`/brands/${b.slug}/`} className="hp-link">
                    {b.name}
                  </Link>
                </li>
              ))}
            </ResultGroup>
          ) : null}

          {results.doctors.length > 0 ? (
            <ResultGroup title="Doctors">
              {results.doctors.map((d) => (
                <li key={d.id}>
                  <Link href={`/doctors/${d.slug}/`} className="hp-link">
                    {d.fullName}
                  </Link>
                  <span style={{ color: "var(--hp-color-text-muted)" }}>
                    {" "}
                    · {d.locality}, Mumbai · from ₹{d.consultationFeeInr}
                  </span>
                </li>
              ))}
            </ResultGroup>
          ) : null}

          {total === 0 ? <p>No matches yet. Try a remedy name, brand, locality, or doctor name.</p> : null}
        </div>
      ) : (
        <p style={{ marginTop: "var(--hp-space-6)", color: "var(--hp-color-text-muted)", maxWidth: "55ch" }}>
          Type at least two characters to search across {products.length} products, {remedies.length} remedies,{" "}
          {brands.length} brands, and {doctors.length} Mumbai practitioners.
        </p>
      )}
    </div>
  );
}

function ResultGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section style={{ marginTop: "var(--hp-space-6)" }}>
      <h2 className="font-display" style={{ color: "var(--hp-color-teal-900)", fontSize: "var(--hp-text-xl)" }}>
        {title}
      </h2>
      <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: "var(--hp-space-2)" }}>{children}</ul>
    </section>
  );
}
