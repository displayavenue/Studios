import Link from "next/link";
import {
  MessageCircle,
  Phone,
  Sun,
  ScrollText,
  ArrowRight,
  Check,
  Sparkles,
  Calendar,
  Calculator,
  Wallet,
} from "lucide-react";
import { AstrologerCard } from "@/components/marketplace/astrologer-card";
import { DailyHoroscopePanel } from "@/components/marketplace/daily-horoscope-panel";
import {
  MARKETPLACE_ASTROLOGERS,
  MARKETPLACE_CATEGORIES,
  MARKETPLACE_DISCLAIMER,
} from "@/content/marketplace-astrologers";
import { SAMPLE_STORIES, SAMPLE_STORIES_DISCLAIMER } from "@/content/sample-stories";
import { BRAND } from "@/config/site";
import { CmsHomeBanners } from "@/components/site/cms-banners";

export const dynamic = "force-dynamic";

const QUICK = [
  {
    href: "/chat-with-astrologer",
    title: "Chat with Astrologer",
    desc: "Instant text consultation",
    icon: MessageCircle,
  },
  {
    href: "/talk-to-astrologer",
    title: "Call Astrologer",
    desc: "One-on-one voice call in seconds",
    icon: Phone,
  },
  {
    href: "/horoscope",
    title: "Daily Horoscope",
    desc: "Your personalized daily reading",
    icon: Sun,
  },
  {
    href: "/free-kundli",
    title: "Get Free Kundli",
    desc: "Detailed birth chart analysis",
    icon: ScrollText,
  },
  {
    href: "/shop",
    title: "AstroMall",
    desc: "Gemstones, yantras, puja kits",
    icon: Sparkles,
  },
  {
    href: "/panchang",
    title: "Panchang",
    desc: "Tithi, nakshatra, yoga, karana",
    icon: Calendar,
  },
  {
    href: "/calculators",
    title: "Calculators",
    desc: "Matching & moon-sign tools",
    icon: Calculator,
  },
  {
    href: "/wallet",
    title: "Wallet",
    desc: "Recharge consult minutes",
    icon: Wallet,
  },
] as const;

const SERVICES = [
  { href: "/free-kundli", title: "Free Kundli", desc: "Detailed birth chart in seconds" },
  { href: "/horoscope", title: "Daily Horoscope", desc: "For all 12 raashis" },
  { href: "/services?category=self-discovery", title: "Face Self-Discovery", desc: "Reflective entertainment reading" },
  { href: "/services", title: "PDF Reports", desc: "33 specialised interpretive reports" },
  { href: "/services?category=numerology", title: "Numerology", desc: "Name & life-path themes" },
  { href: "/services?category=wealth", title: "Wealth & Family", desc: "Prosperity and home motifs" },
  { href: "/services/guna-milan", title: "Kundali Matching", desc: "Guna milan score" },
  { href: "/services?category=dosha", title: "Dosha Analysis", desc: "Informational flags" },
  { href: "/membership", title: "Membership", desc: "Yearly unlock for tools" },
] as const;

const FAQS = [
  {
    q: "Why is astrology useful for reflection?",
    a: "Birth-chart symbolism can organise questions about timing, temperament, and relationships. It is interpretive — not a guarantee of outcomes.",
  },
  {
    q: "How is JyotishKundali different?",
    a: "You get an AstroTalk-style consult marketplace UI plus paid PDF reports powered by a real Lahiri Vedic engine. Sample expert cards are clearly labeled until live consultants onboard.",
  },
  {
    q: "Is chat/call free?",
    a: "Demo consultations open without charging a wallet. Paid PDF reports use Razorpay. Live per-minute billing activates when real experts go live.",
  },
  {
    q: "Are predictions guaranteed?",
    a: "No. All guidance is for personal reflection and entertainment — not medical, legal, financial, or marriage certainty.",
  },
] as const;

export default function HomePage() {
  const online = MARKETPLACE_ASTROLOGERS.filter((a) => a.online);
  const featured = MARKETPLACE_ASTROLOGERS.slice(0, 8);
  const stories = SAMPLE_STORIES.slice(0, 3);

  return (
    <div className="at-home">
      {/* Hero */}
      <section className="at-hero">
        <div className="container-jk grid items-center gap-10 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:py-16">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-3 py-1 text-xs font-medium text-emerald-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              {online.length} sample experts marked online · demo marketplace
            </p>
            <h1 className="mt-5 max-w-xl text-4xl font-bold leading-[1.1] tracking-tight text-[var(--jk-ink)] sm:text-5xl">
              India&apos;s reflective{" "}
              <span className="text-[var(--at-yellow-ink)]">astrology platform</span>
            </h1>
            <ul className="mt-5 space-y-2 text-sm text-[var(--jk-ink)]/80 sm:text-base">
              <li className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                Get free detailed Kundli from our Lahiri engine
              </li>
              <li className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                Chat / call marketplace UI with sample verified-style profiles
              </li>
            </ul>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/chat-with-astrologer" className="at-cta inline-flex h-12 items-center gap-2 px-6 text-sm">
                Start Free Chat <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/free-kundli"
                className="inline-flex h-12 items-center rounded-full border border-[var(--jk-line)] bg-white px-6 text-sm font-semibold hover:border-[var(--at-yellow)]"
              >
                Free Kundli
              </Link>
            </div>
          </div>
          <div className="relative mx-auto flex max-w-md justify-center gap-3 lg:max-w-none">
            {featured.slice(0, 3).map((a, i) => (
              <div
                key={a.slug}
                className={`flex flex-col items-center ${i === 1 ? "mt-0 scale-110" : "mt-8 opacity-95"}`}
              >
                <div className="relative h-36 w-28 overflow-hidden rounded-[2.5rem] border-4 border-white shadow-lg sm:h-44 sm:w-32">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={a.photoUrl}
                    alt={a.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <p className="mt-2 text-center text-xs font-semibold">{a.name.split(" ")[0]}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="container-jk pb-10">
          <div className="grid grid-cols-2 gap-4 rounded-2xl border border-[var(--jk-line)] bg-white/90 p-5 sm:grid-cols-4">
            {[
              { n: "33+", l: "PDF report products" },
              { n: `${MARKETPLACE_ASTROLOGERS.length}`, l: "Sample expert cards" },
              { n: "2", l: "UI languages (EN/HI)" },
              { n: "Lahiri", l: "Sidereal chart engine" },
            ].map((s) => (
              <div key={s.l} className="text-center">
                <p className="text-2xl font-bold text-[var(--jk-ink)] sm:text-3xl">{s.n}</p>
                <p className="mt-1 text-xs text-[var(--jk-muted)] sm:text-sm">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CmsHomeBanners />

      {/* Quick actions */}
      <section className="container-jk -mt-2 pb-12">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {QUICK.map((q) => (
            <Link key={q.href} href={q.href} className="at-card group flex items-center gap-4 p-4 transition hover:-translate-y-0.5">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--at-yellow)] text-[var(--jk-ink)]">
                <q.icon className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-sm font-semibold group-hover:text-[var(--at-yellow-ink)]">{q.title}</span>
                <span className="mt-0.5 block text-xs text-[var(--jk-muted)]">{q.desc}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Astrologers */}
      <section className="container-jk pb-14">
        <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-orange-600">
          <span className="h-2 w-2 animate-pulse rounded-full bg-orange-500" />
          Live UI · {online.length} online (demo)
        </div>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Talk to India&apos;s <span className="text-[var(--at-yellow-ink)]">sample</span> astrologers
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-[var(--jk-muted)]">{MARKETPLACE_DISCLAIMER}</p>
          </div>
          <Link
            href="/chat-with-astrologer"
            className="inline-flex items-center rounded-full border border-[var(--jk-line)] px-4 py-2 text-sm font-semibold hover:border-[var(--at-yellow)]"
          >
            View all astrologers →
          </Link>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((a) => (
            <AstrologerCard key={a.slug} a={a} />
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="bg-white py-14">
        <div className="container-jk">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--jk-muted)]">Browse by category</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight">
            Find the right <span className="text-[var(--at-yellow-ink)]">astrologer</span>, for You
          </h2>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {MARKETPLACE_CATEGORIES.map((c) => (
              <Link
                key={c.key}
                href={c.href}
                className="flex items-center gap-4 rounded-2xl border border-[var(--jk-line)] bg-[var(--at-cream)] p-4 transition hover:border-[var(--at-yellow)]"
              >
                <span className={`flex h-12 w-12 items-center justify-center rounded-xl text-lg ${c.tint}`}>{c.icon}</span>
                <span className="font-semibold">{c.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="container-jk py-14">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--jk-muted)]">Our services</p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight">Our Services</h2>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s) => (
            <Link
              key={s.href + s.title}
              href={s.href}
              className="at-card flex items-center justify-between gap-3 p-4 transition hover:-translate-y-0.5"
            >
              <span>
                <span className="block font-semibold">{s.title}</span>
                <span className="mt-1 block text-xs text-[var(--jk-muted)]">{s.desc}</span>
              </span>
              <ArrowRight className="h-4 w-4 shrink-0 text-[var(--jk-muted)]" />
            </Link>
          ))}
        </div>
      </section>

      {/* Horoscope */}
      <section className="bg-white py-14">
        <div className="container-jk">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--jk-muted)]">Your daily horoscope</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight">Your daily horoscope reading</h2>
          <p className="mt-2 text-sm text-[var(--jk-muted)]">Pick your raashi — sample entertainment blurbs for UI.</p>
          <div className="mt-8">
            <DailyHoroscopePanel />
          </div>
        </div>
      </section>

      {/* Stories */}
      <section className="container-jk py-14">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--jk-muted)]">Testimonials</p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight">
          Sample stories. <span className="text-[var(--at-yellow-ink)]">Clearly labeled.</span>
        </h2>
        <p className="mt-2 text-sm text-[var(--jk-muted)]">{SAMPLE_STORIES_DISCLAIMER}</p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {stories.map((s) => (
            <blockquote key={s.id} className="at-card p-5 text-sm leading-relaxed text-[var(--jk-ink)]">
              “{s.quote.slice(0, 180)}…”
              <footer className="mt-4 text-xs text-[var(--jk-muted)]">
                {s.name} · {s.city} · labeled sample
              </footer>
            </blockquote>
          ))}
        </div>
        <Link href="/stories" className="mt-6 inline-flex text-sm font-semibold text-[var(--at-yellow-ink)]">
          Browse all sample stories →
        </Link>
      </section>

      {/* App promo */}
      <section className="container-jk pb-14">
        <div className="grid items-center gap-8 overflow-hidden rounded-3xl bg-[var(--jk-ink)] px-6 py-10 text-white lg:grid-cols-2 lg:px-12">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Astrology made simpler — available 24×7.</h2>
            <p className="mt-3 text-sm text-white/70">
              Connect with the {BRAND.name} marketplace UI anytime for love, marriage, career, and finance reflection — then deepen with PDF reports.
            </p>
            <ul className="mt-5 space-y-2 text-sm text-white/80">
              <li>✓ Instant chat demo + notifications-ready architecture</li>
              <li>✓ Secure Razorpay for report checkout</li>
              <li>✓ Free Kundli + daily horoscope tools</li>
            </ul>
            <Link href="/signup" className="at-cta mt-6 inline-flex h-11 items-center px-5 text-sm text-[var(--jk-ink)]">
              Create free account →
            </Link>
          </div>
          <div className="mx-auto w-full max-w-xs rounded-[2rem] border border-white/15 bg-white/5 p-4 shadow-2xl">
            <div className="rounded-2xl bg-white p-4 text-[var(--jk-ink)]">
              <p className="text-xs text-[var(--jk-muted)]">Demo chat</p>
              <p className="mt-1 font-semibold">Astro Heena</p>
              <p className="text-xs text-emerald-600">online · ₹42/min sample</p>
              <div className="mt-4 space-y-2 text-xs">
                <p className="rounded-2xl bg-[var(--at-cream)] px-3 py-2">Hi — how can I help you reflect today?</p>
                <p className="ml-8 rounded-2xl bg-[var(--at-yellow)]/40 px-3 py-2">I want clarity on career timing.</p>
              </div>
              <p className="mt-4 rounded-full border border-[var(--jk-line)] px-3 py-2 text-[var(--jk-muted)]">Type a message…</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-14">
        <div className="container-jk max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--jk-muted)]">Questions, answered</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight">First time? Read these first.</h2>
          <div className="mt-8 divide-y divide-[var(--jk-line)]">
            {FAQS.map((f) => (
              <details key={f.q} className="group py-4">
                <summary className="cursor-pointer list-none text-sm font-semibold marker:content-none">
                  <span className="flex justify-between gap-3">
                    {f.q}
                    <span className="text-[var(--jk-muted)] transition group-open:rotate-45">+</span>
                  </span>
                </summary>
                <p className="mt-2 text-sm leading-relaxed text-[var(--jk-muted)]">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
