"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PageHero, SectionShell, Surface, GoldCtaLink } from "@/components/site/page-chrome";

type HoroscopePayload = {
  ok?: boolean;
  needsProfile?: boolean;
  message?: string;
  profile?: { name: string };
  horoscope?: { content: { overview?: string; guidance?: string; disclaimer?: string; mock?: boolean; moonSign?: string } };
};

export default function HoroscopePage() {
  const [data, setData] = useState<HoroscopePayload | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/horoscope")
      .then(async (res) => {
        const json = await res.json();
        if (res.status === 401) {
          window.location.href = "/login?next=/dashboard/horoscope";
          return;
        }
        setData(json);
      })
      .catch(() => setError("Could not load horoscope"));
  }, []);

  return (
    <div>
      <PageHero
        eyebrow="Daily guidance"
        title="Horoscope"
        subtitle="Personalized daily themes based on your saved birth details."
      />
      <SectionShell muted>
        <Surface className="mx-auto max-w-2xl">
          {error && <p className="text-sm text-red-600">{error}</p>}
          {!data && !error && <p className="text-sm text-[var(--jk-muted)]">Loading today’s guidance…</p>}
          {data?.needsProfile && (
            <div className="text-center">
              <p className="text-sm text-[var(--jk-muted)]">{data.message}</p>
              <div className="mt-6 flex justify-center">
                <GoldCtaLink href="/dashboard/profile">Add birth details</GoldCtaLink>
              </div>
            </div>
          )}
          {data?.ok && data.horoscope && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--jk-gold-dark)]">
                For {data.profile?.name}
                {data.horoscope.content.moonSign ? ` · Moon ${data.horoscope.content.moonSign}` : ""}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-[var(--jk-ink)]">{data.horoscope.content.overview}</p>
              <p className="mt-3 text-sm leading-relaxed text-[var(--jk-muted)]">{data.horoscope.content.guidance}</p>
              <p className="mt-6 rounded-xl bg-[#f8f9fb] p-3 text-xs text-[var(--jk-muted)]">
                {data.horoscope.content.disclaimer ||
                  "Interpretive guidance for reflection and entertainment only."}
                {data.horoscope.content.mock ? " Mock chart engine in use." : ""}
              </p>
            </div>
          )}
          <div className="mt-6 text-center text-sm">
            <Link href="/services" className="underline">
              Explore full reports
            </Link>
          </div>
        </Surface>
      </SectionShell>
    </div>
  );
}
