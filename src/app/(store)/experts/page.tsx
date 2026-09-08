import Link from "next/link";
import { AstrologerCard } from "@/components/marketplace/astrologer-card";
import { MARKETPLACE_ASTROLOGERS, MARKETPLACE_DISCLAIMER } from "@/content/marketplace-astrologers";

export const metadata = {
  title: "Expert Astrologers",
  description: "Browse sample JyotishKundali marketplace experts.",
};

export default function ExpertsPage() {
  return (
    <div className="at-home min-h-screen">
      <div className="container-jk py-10">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--jk-muted)]">Consultations</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Expert Astrologers</h1>
        <p className="mt-2 max-w-2xl text-sm text-[var(--jk-muted)]">{MARKETPLACE_DISCLAIMER}</p>
        <div className="mt-6 flex flex-wrap gap-2">
          <Link href="/chat-with-astrologer" className="at-cta inline-flex h-10 items-center px-4 text-sm">
            Chat listing
          </Link>
          <Link
            href="/talk-to-astrologer"
            className="inline-flex h-10 items-center rounded-full border border-[var(--jk-line)] px-4 text-sm font-semibold"
          >
            Call listing
          </Link>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {MARKETPLACE_ASTROLOGERS.map((a) => (
            <AstrologerCard key={a.slug} a={a} />
          ))}
        </div>
      </div>
    </div>
  );
}
