"use client";

import { useEffect, useState } from "react";
import { Container, Section, Button } from "@homeopathypharma/ui";

type MediaItem = {
  id: string;
  url: string;
  alt: string;
  filename: string;
  mimeType: string;
  uploadedAt: string;
};

export default function MediaLibraryPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [message, setMessage] = useState("Loading media…");
  const [url, setUrl] = useState("");
  const [alt, setAlt] = useState("");
  const [uploading, setUploading] = useState(false);

  async function load() {
    const res = await fetch("/api/cms/media");
    if (!res.ok) {
      setMessage("Sign in required");
      return;
    }
    const data = (await res.json()) as { items: MediaItem[] };
    setItems(data.items ?? []);
    setMessage(`${data.items?.length ?? 0} media items`);
  }

  useEffect(() => {
    void load();
  }, []);

  async function registerUrl() {
    if (!url.trim()) return;
    setUploading(true);
    await fetch("/api/cms/media", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: url.trim(), alt }),
    });
    setUrl("");
    setAlt("");
    setUploading(false);
    await load();
  }

  async function uploadFile(file: File) {
    setUploading(true);
    const form = new FormData();
    form.append("file", file);
    form.append("alt", alt || file.name);
    await fetch("/api/cms/media", { method: "POST", body: form });
    setAlt("");
    setUploading(false);
    await load();
  }

  async function remove(id: string) {
    if (!confirm("Remove from media library?")) return;
    await fetch("/api/cms/media", {
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
            Media library
          </h1>
          <p style={{ color: "var(--hp-color-text-muted)" }}>{message}</p>

          <div className="admin-fieldset" style={{ marginTop: "1rem" }}>
            <legend style={{ fontWeight: 700 }}>Add media</legend>
            <label className="admin-field">
              Upload image
              <input
                type="file"
                accept="image/*"
                disabled={uploading}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void uploadFile(file);
                }}
              />
            </label>
            <label className="admin-field">
              Or register existing URL / path
              <input
                className="admin-input"
                placeholder="/images/banners/banner-medicines.png"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </label>
            <label className="admin-field">
              Alt text
              <input className="admin-input" value={alt} onChange={(e) => setAlt(e.target.value)} />
            </label>
            <Button variant="accent" disabled={uploading || !url.trim()} onClick={() => void registerUrl()}>
              Register URL
            </Button>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(10rem, 1fr))",
              gap: "1rem",
              marginTop: "1.5rem",
            }}
          >
            {items.map((item) => (
              <figure
                key={item.id}
                style={{
                  margin: 0,
                  border: "1px solid var(--hp-color-border)",
                  borderRadius: "0.75rem",
                  overflow: "hidden",
                  background: "#fff",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.url.startsWith("http") ? item.url : `https://homeopathypharma.com${item.url}`}
                  alt={item.alt}
                  style={{ width: "100%", aspectRatio: "1", objectFit: "cover", display: "block" }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
                <figcaption style={{ padding: "0.65rem", fontSize: "0.78rem" }}>
                  <strong style={{ display: "block", wordBreak: "break-all" }}>{item.filename}</strong>
                  <code style={{ fontSize: "0.7rem" }}>{item.url}</code>
                  <div style={{ marginTop: "0.5rem" }}>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        void navigator.clipboard.writeText(item.url);
                        setMessage(`Copied ${item.url}`);
                      }}
                    >
                      Copy URL
                    </Button>{" "}
                    <Button size="sm" variant="secondary" onClick={() => void remove(item.id)}>
                      Remove
                    </Button>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
