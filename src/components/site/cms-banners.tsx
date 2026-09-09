"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Banner = { title?: string; href?: string; cta?: string };

export function SiteAnnouncement() {
  const [text, setText] = useState<string | null>(null);

  useEffect(() => {
    const ctrl = new AbortController();
    fetch("/api/content/public", { signal: ctrl.signal })
      .then(async (res) => {
        const data = await res.json();
        if (res.ok && data.announcement) setText(String(data.announcement));
      })
      .catch(() => undefined);
    return () => ctrl.abort();
  }, []);

  if (!text) return null;

  return (
    <div className="border-b border-[var(--jk-line)] bg-[var(--at-yellow)]/25 px-3 py-2 text-center text-xs font-medium text-[var(--jk-ink)] sm:text-sm">
      {text}
    </div>
  );
}

export function CmsHomeBanners() {
  const [banners, setBanners] = useState<Banner[]>([]);

  useEffect(() => {
    const ctrl = new AbortController();
    fetch("/api/content/public", { signal: ctrl.signal })
      .then(async (res) => {
        const data = await res.json();
        if (res.ok && Array.isArray(data.banners) && data.banners.length) {
          setBanners(data.banners as Banner[]);
        }
      })
      .catch(() => undefined);
    return () => ctrl.abort();
  }, []);

  if (!banners.length) return null;

  return (
    <section className="container-jk py-6">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {banners.map((b, i) => (
          <Link
            key={`${b.title}-${i}`}
            href={b.href || "/chat-with-astrologer"}
            className="flex items-center justify-between gap-3 rounded-2xl border border-[var(--jk-line)] bg-white px-4 py-4 shadow-sm transition hover:border-[var(--at-yellow)]"
          >
            <span className="text-sm font-semibold text-[var(--jk-ink)]">{b.title || "Offer"}</span>
            <span className="shrink-0 text-xs font-bold text-[var(--at-yellow-ink)]">{b.cta || "Explore →"}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
