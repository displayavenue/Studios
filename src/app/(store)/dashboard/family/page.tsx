"use client";

import { useEffect, useState } from "react";
import { PageHero, SectionShell, Surface, GoldCtaLink } from "@/components/site/page-chrome";

type Member = {
  id: string;
  name: string;
  relation: string;
  placeName: string;
  dob: string;
};

export default function FamilyPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    const res = await fetch("/api/family");
    if (res.status === 401) {
      window.location.href = "/login?next=/dashboard/family";
      return;
    }
    const data = await res.json();
    setMembers(data.members || []);
  }

  useEffect(() => {
    load().catch(() => setError("Could not load family profiles"));
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/family", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fd.get("name"),
          relation: fd.get("relation"),
          dob: fd.get("dob"),
          placeName: fd.get("placeName"),
          birthTimeUnknown: true,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not save");
      e.currentTarget.reset();
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setPending(false);
    }
  }

  return (
    <div>
      <PageHero
        eyebrow="Family"
        title="Family profiles"
        subtitle="Store birth details for spouse, children, or parents to use in future compatibility reports."
      />
      <SectionShell muted>
        <div className="mx-auto grid max-w-4xl gap-5 lg:grid-cols-2">
          <Surface>
            <h2 className="font-display text-xl font-semibold">Add member</h2>
            <form className="mt-4 space-y-3" onSubmit={onSubmit}>
              <input name="name" required placeholder="Name" className="h-11 w-full rounded-xl border px-3 text-sm" />
              <select name="relation" required className="h-11 w-full rounded-xl border px-3 text-sm" defaultValue="SPOUSE">
                <option value="SPOUSE">Spouse</option>
                <option value="CHILD">Child</option>
                <option value="PARENT">Parent</option>
                <option value="SIBLING">Sibling</option>
                <option value="FRIEND">Friend</option>
                <option value="OTHER">Other</option>
              </select>
              <input name="dob" type="date" required className="h-11 w-full rounded-xl border px-3 text-sm" />
              <input name="placeName" required placeholder="Place of birth" className="h-11 w-full rounded-xl border px-3 text-sm" />
              {error && <p className="text-sm text-red-600">{error}</p>}
              <button type="submit" disabled={pending} className="gold-btn h-11 w-full text-sm disabled:opacity-60">
                {pending ? "Saving…" : "Save member"}
              </button>
            </form>
          </Surface>
          <Surface>
            <h2 className="font-display text-xl font-semibold">Saved members</h2>
            {!members.length ? (
              <p className="mt-4 text-sm text-[var(--jk-muted)]">No family profiles yet.</p>
            ) : (
              <ul className="mt-4 divide-y">
                {members.map((m) => (
                  <li key={m.id} className="flex items-center justify-between py-3 text-sm">
                    <div>
                      <p className="font-medium">{m.name}</p>
                      <p className="text-[var(--jk-muted)]">
                        {m.relation} · {new Date(m.dob).toLocaleDateString("en-IN")} · {m.placeName}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="text-xs underline"
                      onClick={async () => {
                        await fetch(`/api/family?id=${m.id}`, { method: "DELETE" });
                        await load();
                      }}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-6">
              <GoldCtaLink href="/services?category=marriage">Browse compatibility</GoldCtaLink>
            </div>
          </Surface>
        </div>
      </SectionShell>
    </div>
  );
}
