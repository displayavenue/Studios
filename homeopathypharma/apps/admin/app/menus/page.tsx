"use client";

import { useEffect, useState } from "react";
import { Container, Section, Button } from "@homeopathypharma/ui";

type MenuItem = { id: string; label: string; href: string; order: number };
type Menus = { header: MenuItem[]; footer: MenuItem[]; mobile: MenuItem[] };

function MenuEditor({
  title,
  items,
  onChange,
}: {
  title: string;
  items: MenuItem[];
  onChange: (items: MenuItem[]) => void;
}) {
  return (
    <fieldset className="admin-fieldset">
      <legend>{title}</legend>
      {items.map((item, index) => (
        <div
          key={item.id}
          style={{ display: "grid", gridTemplateColumns: "2fr 3fr auto", gap: "0.5rem", marginBottom: "0.5rem" }}
        >
          <input
            className="admin-input"
            value={item.label}
            onChange={(e) => {
              const next = [...items];
              next[index] = { ...item, label: e.target.value };
              onChange(next);
            }}
            placeholder="Label"
          />
          <input
            className="admin-input"
            value={item.href}
            onChange={(e) => {
              const next = [...items];
              next[index] = { ...item, href: e.target.value };
              onChange(next);
            }}
            placeholder="/shop/"
          />
          <Button
            size="sm"
            variant="secondary"
            onClick={() => onChange(items.filter((_, i) => i !== index))}
          >
            Remove
          </Button>
        </div>
      ))}
      <Button
        size="sm"
        variant="secondary"
        onClick={() =>
          onChange([
            ...items,
            { id: `item-${Date.now().toString(36)}`, label: "New link", href: "/", order: items.length + 1 },
          ])
        }
      >
        Add item
      </Button>
    </fieldset>
  );
}

export default function MenusCmsPage() {
  const [menus, setMenus] = useState<Menus | null>(null);
  const [message, setMessage] = useState("Loading menus…");

  useEffect(() => {
    void (async () => {
      const res = await fetch("/api/cms/menus");
      if (!res.ok) {
        setMessage("Sign in required");
        return;
      }
      setMenus((await res.json()) as Menus);
      setMessage("Edit header, footer, and mobile navigation");
    })();
  }, []);

  async function save() {
    if (!menus) return;
    const res = await fetch("/api/cms/menus", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(menus),
    });
    if (!res.ok) {
      setMessage("Save failed");
      return;
    }
    setMenus((await res.json()) as Menus);
    setMessage("Menus saved");
  }

  if (!menus) {
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
            Menus
          </h1>
          <p style={{ color: "var(--hp-color-text-muted)" }}>{message}</p>
          <MenuEditor
            title="Header menu"
            items={menus.header}
            onChange={(header) => setMenus({ ...menus, header })}
          />
          <MenuEditor
            title="Footer menu"
            items={menus.footer}
            onChange={(footer) => setMenus({ ...menus, footer })}
          />
          <MenuEditor
            title="Mobile bottom nav"
            items={menus.mobile}
            onChange={(mobile) => setMenus({ ...menus, mobile })}
          />
          <Button variant="accent" onClick={() => void save()}>
            Save menus
          </Button>
        </div>
      </Container>
    </Section>
  );
}
