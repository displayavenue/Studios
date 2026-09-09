"use client";

import { useState } from "react";
import Link from "next/link";

const CATEGORY_OPTS = ["vedic", "love", "marriage", "career", "women", "business", "health", "tarot", "numerology"];

export function ExpertApplyForm() {
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [specialties, setSpecialties] = useState("Vedic, Life Coach");
  const [languages, setLanguages] = useState("English, Hindi");
  const [categories, setCategories] = useState<string[]>(["vedic"]);
  const [experienceYrs, setExperienceYrs] = useState(5);
  const [pricePerMinInr, setPricePerMinInr] = useState(29);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [slug, setSlug] = useState<string | null>(null);

  function toggleCat(c: string) {
    setCategories((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch("/api/experts/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName,
          bio,
          specialties,
          languages,
          categories,
          experienceYrs,
          pricePerMinInr,
        }),
      });
      const data = await res.json();
      if (res.status === 401) {
        window.location.href = "/login?next=/experts/apply";
        return;
      }
      if (!res.ok) throw new Error(data.message || data.error || "Application failed");
      setMessage(data.message || "Application submitted.");
      setSlug(data.expert?.slug || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={submit} className="at-card mx-auto max-w-xl space-y-4 p-6">
      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-[var(--jk-muted)]">Display name</label>
        <input
          required
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="mt-1 h-11 w-full rounded-full border border-[var(--jk-line)] px-4 text-sm outline-none focus:border-[var(--at-yellow)]"
        />
      </div>
      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-[var(--jk-muted)]">Bio</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={3}
          className="mt-1 w-full rounded-2xl border border-[var(--jk-line)] px-4 py-3 text-sm outline-none focus:border-[var(--at-yellow)]"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-[var(--jk-muted)]">Specialties</label>
          <input
            required
            value={specialties}
            onChange={(e) => setSpecialties(e.target.value)}
            className="mt-1 h-11 w-full rounded-full border border-[var(--jk-line)] px-4 text-sm outline-none focus:border-[var(--at-yellow)]"
          />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-[var(--jk-muted)]">Languages</label>
          <input
            required
            value={languages}
            onChange={(e) => setLanguages(e.target.value)}
            className="mt-1 h-11 w-full rounded-full border border-[var(--jk-line)] px-4 text-sm outline-none focus:border-[var(--at-yellow)]"
          />
        </div>
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--jk-muted)]">Categories</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {CATEGORY_OPTS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => toggleCat(c)}
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                categories.includes(c) ? "bg-[var(--at-yellow)]" : "border border-[var(--jk-line)]"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-[var(--jk-muted)]">Years experience</label>
          <input
            type="number"
            min={1}
            max={50}
            value={experienceYrs}
            onChange={(e) => setExperienceYrs(Number(e.target.value))}
            className="mt-1 h-11 w-full rounded-full border border-[var(--jk-line)] px-4 text-sm outline-none focus:border-[var(--at-yellow)]"
          />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-[var(--jk-muted)]">₹ / minute</label>
          <input
            type="number"
            min={9}
            max={999}
            value={pricePerMinInr}
            onChange={(e) => setPricePerMinInr(Number(e.target.value))}
            className="mt-1 h-11 w-full rounded-full border border-[var(--jk-line)] px-4 text-sm outline-none focus:border-[var(--at-yellow)]"
          />
        </div>
      </div>

      {error && <p className="text-sm text-rose-600">{error}</p>}
      {message && (
        <p className="text-sm text-emerald-700">
          {message}{" "}
          {slug && (
            <Link href={`/consult/${slug}`} className="font-semibold underline">
              Preview profile
            </Link>
          )}
        </p>
      )}

      <button type="submit" disabled={pending} className="at-cta h-11 w-full text-sm disabled:opacity-60">
        {pending ? "Submitting…" : "Submit application"}
      </button>
      <p className="text-xs text-[var(--jk-muted)]">
        Applications stay hidden until an admin verifies them. Consultations are interpretive entertainment — not medical, legal, or financial advice.
      </p>
    </form>
  );
}
