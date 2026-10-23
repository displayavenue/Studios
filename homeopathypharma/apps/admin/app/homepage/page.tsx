"use client";

import { useEffect, useState } from "react";
import { Container, Section, Button } from "@homeopathypharma/ui";

type Banner = {
  id: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
  tone: "teal" | "amber" | "sage";
  imageUrl?: string;
};

type Category = { label: string; href: string; seed: string };

type HomepageContent = {
  searchPlaceholder: string;
  banners: Banner[];
  categories: Category[];
  rails: {
    bestsellersTitle: string;
    consultTitle: string;
    consultBody: string;
    brandsTitle: string;
    doctorsTitle: string;
  };
};

const blankBanner = (): Banner => ({
  id: `banner-${Date.now().toString(36)}`,
  eyebrow: "",
  title: "New banner",
  subtitle: "",
  ctaLabel: "Shop now",
  ctaHref: "/shop/",
  tone: "teal",
  imageUrl: "/images/banners/banner-medicines.png",
});

export default function HomepageCmsPage() {
  const [content, setContent] = useState<HomepageContent | null>(null);
  const [message, setMessage] = useState("Loading homepage CMS…");

  useEffect(() => {
    void (async () => {
      const res = await fetch("/api/cms/homepage");
      if (!res.ok) {
        setMessage(res.status === 401 ? "Sign in required" : "Failed to load");
        return;
      }
      setContent((await res.json()) as HomepageContent);
      setMessage("Edit hero banners, category chips, and section titles — saved to data/cms/homepage.json");
    })();
  }, []);

  async function save() {
    if (!content) return;
    const res = await fetch("/api/cms/homepage", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(content),
    });
    if (!res.ok) {
      setMessage("Save failed");
      return;
    }
    setContent((await res.json()) as HomepageContent);
    setMessage("Homepage saved. Rebuild/redeploy storefront to publish on Hostinger.");
  }

  if (!content) {
    return (
      <Section>
        <Container>
          <p>{message}</p>
        </Container>
      </Section>
    );
  }

  return (
    <Section>
      <Container>
        <div className="admin-content">
          <h1 className="font-display" style={{ marginTop: 0 }}>
            Homepage
          </h1>
          <p style={{ color: "var(--hp-color-text-muted)" }}>{message}</p>

          <label className="admin-field">
            Search placeholder
            <input
              className="admin-input"
              value={content.searchPlaceholder}
              onChange={(e) => setContent({ ...content, searchPlaceholder: e.target.value })}
            />
          </label>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1rem" }}>
            <h2 className="font-display" style={{ fontSize: "1.15rem", margin: 0 }}>
              Hero banners
            </h2>
            <Button size="sm" variant="secondary" onClick={() => setContent({ ...content, banners: [...content.banners, blankBanner()] })}>
              Add banner
            </Button>
          </div>

          {content.banners.map((banner, index) => (
            <fieldset key={banner.id} className="admin-fieldset">
              <legend>
                Banner {index + 1}{" "}
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() =>
                    setContent({ ...content, banners: content.banners.filter((_, i) => i !== index) })
                  }
                >
                  Remove
                </Button>
              </legend>
              <label className="admin-field">
                Title
                <input
                  className="admin-input"
                  value={banner.title}
                  onChange={(e) => {
                    const banners = [...content.banners];
                    banners[index] = { ...banner, title: e.target.value };
                    setContent({ ...content, banners });
                  }}
                />
              </label>
              <label className="admin-field">
                Subtitle
                <textarea
                  className="admin-input"
                  rows={2}
                  value={banner.subtitle}
                  onChange={(e) => {
                    const banners = [...content.banners];
                    banners[index] = { ...banner, subtitle: e.target.value };
                    setContent({ ...content, banners });
                  }}
                />
              </label>
              <label className="admin-field">
                Image URL
                <input
                  className="admin-input"
                  value={banner.imageUrl || ""}
                  placeholder="/images/banners/banner-medicines.png"
                  onChange={(e) => {
                    const banners = [...content.banners];
                    banners[index] = { ...banner, imageUrl: e.target.value };
                    setContent({ ...content, banners });
                  }}
                />
              </label>
              <label className="admin-field">
                CTA label
                <input
                  className="admin-input"
                  value={banner.ctaLabel}
                  onChange={(e) => {
                    const banners = [...content.banners];
                    banners[index] = { ...banner, ctaLabel: e.target.value };
                    setContent({ ...content, banners });
                  }}
                />
              </label>
              <label className="admin-field">
                CTA link
                <input
                  className="admin-input"
                  value={banner.ctaHref}
                  onChange={(e) => {
                    const banners = [...content.banners];
                    banners[index] = { ...banner, ctaHref: e.target.value };
                    setContent({ ...content, banners });
                  }}
                />
              </label>
              <label className="admin-field">
                Tone
                <select
                  className="admin-input"
                  value={banner.tone}
                  onChange={(e) => {
                    const banners = [...content.banners];
                    banners[index] = { ...banner, tone: e.target.value as Banner["tone"] };
                    setContent({ ...content, banners });
                  }}
                >
                  <option value="teal">Teal</option>
                  <option value="amber">Amber</option>
                  <option value="sage">Sage</option>
                </select>
              </label>
            </fieldset>
          ))}

          <h2 className="font-display" style={{ fontSize: "1.15rem" }}>
            Category chips
          </h2>
          {content.categories.map((cat, index) => (
            <div
              key={`${cat.href}-${index}`}
              style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr 0.8fr auto", gap: "0.5rem", marginBottom: "0.5rem" }}
            >
              <input
                className="admin-input"
                value={cat.label}
                onChange={(e) => {
                  const categories = [...content.categories];
                  categories[index] = { ...cat, label: e.target.value };
                  setContent({ ...content, categories });
                }}
              />
              <input
                className="admin-input"
                value={cat.href}
                onChange={(e) => {
                  const categories = [...content.categories];
                  categories[index] = { ...cat, href: e.target.value };
                  setContent({ ...content, categories });
                }}
              />
              <input
                className="admin-input"
                value={cat.seed}
                onChange={(e) => {
                  const categories = [...content.categories];
                  categories[index] = { ...cat, seed: e.target.value };
                  setContent({ ...content, categories });
                }}
              />
              <Button
                size="sm"
                variant="secondary"
                onClick={() =>
                  setContent({ ...content, categories: content.categories.filter((_, i) => i !== index) })
                }
              >
                ×
              </Button>
            </div>
          ))}
          <Button
            size="sm"
            variant="secondary"
            onClick={() =>
              setContent({
                ...content,
                categories: [...content.categories, { label: "New", href: "/shop/", seed: "new" }],
              })
            }
          >
            Add category
          </Button>

          <h2 className="font-display" style={{ fontSize: "1.15rem", marginTop: "1.5rem" }}>
            Section titles
          </h2>
          {(
            [
              ["bestsellersTitle", "Bestsellers title"],
              ["consultTitle", "Consult title"],
              ["consultBody", "Consult body"],
              ["brandsTitle", "Brands title"],
              ["doctorsTitle", "Doctors title"],
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="admin-field">
              {label}
              {key === "consultBody" ? (
                <textarea
                  className="admin-input"
                  rows={2}
                  value={content.rails[key]}
                  onChange={(e) =>
                    setContent({ ...content, rails: { ...content.rails, [key]: e.target.value } })
                  }
                />
              ) : (
                <input
                  className="admin-input"
                  value={content.rails[key]}
                  onChange={(e) =>
                    setContent({ ...content, rails: { ...content.rails, [key]: e.target.value } })
                  }
                />
              )}
            </label>
          ))}

          <div style={{ marginTop: "1.25rem" }}>
            <Button variant="accent" onClick={() => void save()}>
              Save homepage
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  );
}
