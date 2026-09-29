"use client";

import { useEffect, useState } from "react";
import { Container, Section, Button } from "@homeopathypharma/ui";

type Settings = {
  siteName: string;
  tagline: string;
  supportEmail: string;
  supportPhone: string;
  defaultSeoTitle: string;
  defaultSeoDescription: string;
  currency: string;
  timezone: string;
};

export default function SettingsCmsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [message, setMessage] = useState("Loading settings…");

  useEffect(() => {
    void (async () => {
      const res = await fetch("/api/cms/settings");
      if (!res.ok) {
        setMessage("Sign in required");
        return;
      }
      setSettings((await res.json()) as Settings);
      setMessage("Site-wide settings & default SEO");
    })();
  }, []);

  async function save() {
    if (!settings) return;
    const res = await fetch("/api/cms/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    if (!res.ok) {
      setMessage("Save failed");
      return;
    }
    setSettings((await res.json()) as Settings);
    setMessage("Settings saved");
  }

  if (!settings) {
    return (
      <Section>
        <Container>
          <p>{message}</p>
        </Container>
      </Section>
    );
  }

  const fields: { key: keyof Settings; label: string; multiline?: boolean }[] = [
    { key: "siteName", label: "Site name" },
    { key: "tagline", label: "Tagline" },
    { key: "supportEmail", label: "Support email" },
    { key: "supportPhone", label: "Support phone" },
    { key: "defaultSeoTitle", label: "Default SEO title" },
    { key: "defaultSeoDescription", label: "Default SEO description", multiline: true },
    { key: "currency", label: "Currency" },
    { key: "timezone", label: "Timezone" },
  ];

  return (
    <Section>
      <Container>
        <div className="admin-content">
          <h1 className="font-display" style={{ marginTop: 0 }}>
            Site settings
          </h1>
          <p style={{ color: "var(--hp-color-text-muted)" }}>{message}</p>
          {fields.map((field) => (
            <label key={field.key} className="admin-field">
              {field.label}
              {field.multiline ? (
                <textarea
                  className="admin-input"
                  rows={3}
                  value={settings[field.key]}
                  onChange={(e) => setSettings({ ...settings, [field.key]: e.target.value })}
                />
              ) : (
                <input
                  className="admin-input"
                  value={settings[field.key]}
                  onChange={(e) => setSettings({ ...settings, [field.key]: e.target.value })}
                />
              )}
            </label>
          ))}
          <Button variant="accent" onClick={() => void save()}>
            Save settings
          </Button>
        </div>
      </Container>
    </Section>
  );
}
