"use client";

import { useEffect, useState } from "react";
import { Container, Section, Button } from "@homeopathypharma/ui";

type HomepageContent = {
  searchPlaceholder: string;
  banners: {
    id: string;
    eyebrow: string;
    title: string;
    subtitle: string;
    ctaLabel: string;
    ctaHref: string;
    tone: "teal" | "amber" | "sage";
  }[];
  rails: {
    bestsellersTitle: string;
    consultTitle: string;
    consultBody: string;
    brandsTitle: string;
    doctorsTitle: string;
  };
};

export default function HomepageCmsPage() {
  const [content, setContent] = useState<HomepageContent | null>(null);
  const [message, setMessage] = useState("Loading homepage CMS…");

  useEffect(() => {
    void (async () => {
      const res = await fetch("/api/cms/homepage");
      setContent((await res.json()) as HomepageContent);
      setMessage("Edit hero banners and rail titles — saved to data/cms/homepage.json");
    })();
  }, []);

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
            Homepage CMS
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

          {content.banners.map((banner, index) => (
            <fieldset key={banner.id} className="admin-fieldset">
              <legend>Banner {index + 1}</legend>
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
                  rows={3}
                  value={banner.subtitle}
                  onChange={(e) => {
                    const banners = [...content.banners];
                    banners[index] = { ...banner, subtitle: e.target.value };
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
                CTA href
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
            </fieldset>
          ))}

          <fieldset className="admin-fieldset">
            <legend>Section titles</legend>
            {(Object.keys(content.rails) as (keyof HomepageContent["rails"])[]).map((key) => (
              <label key={key} className="admin-field">
                {key}
                <input
                  className="admin-input"
                  value={content.rails[key]}
                  onChange={(e) =>
                    setContent({ ...content, rails: { ...content.rails, [key]: e.target.value } })
                  }
                />
              </label>
            ))}
          </fieldset>

          <Button
            variant="accent"
            onClick={() => {
              void (async () => {
                setMessage("Saving…");
                await fetch("/api/cms/homepage", {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(content),
                });
                setMessage("Saved. Redeploy storefront to publish homepage changes on Hostinger.");
              })();
            }}
          >
            Save homepage
          </Button>
        </div>
      </Container>
    </Section>
  );
}
