"use client";

import { useEffect, useState } from "react";
import { Container, Section, Button } from "@homeopathypharma/ui";

type CmsPage = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  bodyHtml: string;
  status: "draft" | "published";
  seoTitle?: string;
  seoDescription?: string;
  updatedAt: string;
};

const empty: Omit<CmsPage, "id" | "updatedAt"> = {
  slug: "",
  title: "",
  excerpt: "",
  bodyHtml: "",
  status: "draft",
  seoTitle: "",
  seoDescription: "",
};

export default function PagesCmsPage() {
  const [items, setItems] = useState<CmsPage[]>([]);
  const [editing, setEditing] = useState<(Partial<CmsPage> & typeof empty) | null>(null);
  const [message, setMessage] = useState("Loading pages…");

  async function load() {
    const res = await fetch("/api/cms/pages");
    if (!res.ok) {
      setMessage(res.status === 401 ? "Sign in required" : "Failed to load pages");
      return;
    }
    const data = (await res.json()) as { items: CmsPage[] };
    setItems(data.items ?? []);
    setMessage(`${data.items?.length ?? 0} pages · like WordPress Pages`);
  }

  useEffect(() => {
    void load();
  }, []);

  async function save() {
    if (!editing?.title) return;
    const method = editing.id ? "PUT" : "POST";
    const res = await fetch("/api/cms/pages", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing),
    });
    if (!res.ok) {
      setMessage("Save failed");
      return;
    }
    setEditing(null);
    await load();
    setMessage("Page saved");
  }

  async function remove(id: string) {
    if (!confirm("Delete this page?")) return;
    await fetch("/api/cms/pages", {
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
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
            <div>
              <h1 className="font-display" style={{ marginTop: 0 }}>
                Pages
              </h1>
              <p style={{ color: "var(--hp-color-text-muted)" }}>{message}</p>
            </div>
            <Button
              variant="accent"
              onClick={() => setEditing({ ...empty })}
            >
              Add page
            </Button>
          </div>

          {editing ? (
            <div className="admin-fieldset" style={{ marginTop: "1.25rem" }}>
              <h2 className="font-display" style={{ marginTop: 0, fontSize: "1.15rem" }}>
                {editing.id ? "Edit page" : "New page"}
              </h2>
              <label className="admin-field">
                Title
                <input
                  className="admin-input"
                  value={editing.title}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                />
              </label>
              <label className="admin-field">
                Slug
                <input
                  className="admin-input"
                  value={editing.slug}
                  placeholder="about"
                  onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
                />
              </label>
              <label className="admin-field">
                Excerpt
                <input
                  className="admin-input"
                  value={editing.excerpt}
                  onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })}
                />
              </label>
              <label className="admin-field">
                Body (HTML)
                <textarea
                  className="admin-input"
                  rows={8}
                  value={editing.bodyHtml}
                  onChange={(e) => setEditing({ ...editing, bodyHtml: e.target.value })}
                />
              </label>
              <label className="admin-field">
                Status
                <select
                  className="admin-input"
                  value={editing.status}
                  onChange={(e) =>
                    setEditing({ ...editing, status: e.target.value as "draft" | "published" })
                  }
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </label>
              <label className="admin-field">
                SEO title
                <input
                  className="admin-input"
                  value={editing.seoTitle || ""}
                  onChange={(e) => setEditing({ ...editing, seoTitle: e.target.value })}
                />
              </label>
              <label className="admin-field">
                SEO description
                <textarea
                  className="admin-input"
                  rows={2}
                  value={editing.seoDescription || ""}
                  onChange={(e) => setEditing({ ...editing, seoDescription: e.target.value })}
                />
              </label>
              <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.75rem" }}>
                <Button variant="accent" onClick={() => void save()}>
                  Save page
                </Button>
                <Button variant="secondary" onClick={() => setEditing(null)}>
                  Cancel
                </Button>
              </div>
              {editing.slug ? (
                <p style={{ fontSize: "0.85rem", color: "var(--hp-color-text-muted)" }}>
                  Storefront URL after publish: <code>/p/{editing.slug}/</code>
                </p>
              ) : null}
            </div>
          ) : null}

          <table className="admin-table" style={{ marginTop: "1.5rem" }}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Slug</th>
                <th>Status</th>
                <th>Updated</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {items.map((page) => (
                <tr key={page.id}>
                  <td>
                    <strong>{page.title}</strong>
                    <div style={{ fontSize: "0.75rem", color: "var(--hp-color-text-muted)" }}>{page.excerpt}</div>
                  </td>
                  <td>
                    <code>{page.slug}</code>
                  </td>
                  <td>
                    <span className="status-pill">{page.status}</span>
                  </td>
                  <td style={{ fontSize: "0.8rem" }}>{new Date(page.updatedAt).toLocaleString()}</td>
                  <td style={{ whiteSpace: "nowrap" }}>
                    <Button size="sm" variant="secondary" onClick={() => setEditing({ ...empty, ...page })}>
                      Edit
                    </Button>{" "}
                    <Button size="sm" variant="secondary" onClick={() => void remove(page.id)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Container>
    </Section>
  );
}
