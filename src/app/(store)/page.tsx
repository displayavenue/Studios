import Link from "next/link";
import {
  Gift,
  Zap,
  Globe,
  Lock,
  Heart,
  ArrowRight,
  Calendar,
  CreditCard,
  FileText,
  Star,
  Check,
  Sparkles,
  Brain,
  Shield,
  Headphones,
  BookOpen,
  Smile,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { BRAND, PRICING } from "@/config/site";
import { formatINR } from "@/lib/utils";
import { SAMPLE_STORIES, SAMPLE_STORIES_DISCLAIMER } from "@/content/sample-stories";

export const dynamic = "force-dynamic";

const SERVICE_CATEGORIES = [
  {
    title: "Kundali & Birth Charts",
    desc: "Janam Kundali, houses, dasha timelines, and natal deep-dives.",
    href: "/services?category=kundali",
    color: "bg-violet-100 text-violet-600",
    icon: "☉",
  },
  {
    title: "Marriage & Matching",
    desc: "Guna Milan, love chemistry, marriage timing, and couple synastry.",
    href: "/services?category=marriage",
    color: "bg-pink-100 text-pink-600",
    icon: "♥",
  },
  {
    title: "Career & Profession",
    desc: "Career path, timing windows, business themes, and abroad-work motifs.",
    href: "/services?category=career",
    color: "bg-blue-100 text-blue-600",
    icon: "↑",
  },
  {
    title: "Wealth & Family",
    desc: "Prosperity themes, property symbolism, education, and family dynamics.",
    href: "/services?category=wealth",
    color: "bg-amber-100 text-amber-700",
    icon: "₹",
  },
  {
    title: "Dosha & Planets",
    desc: "Dosha scans, Manglik, Rahu-Ketu, Sade Sati, and Saturn lessons.",
    href: "/services?category=dosha",
    color: "bg-orange-100 text-orange-600",
    icon: "△",
  },
  {
    title: "Face Self-Discovery",
    desc: "AI face reading and strengths maps for reflective self-awareness.",
    href: "/services?category=self-discovery",
    color: "bg-fuchsia-100 text-fuchsia-600",
    icon: "◉",
  },
  {
    title: "Numerology",
    desc: "Complete number profiles, name, mobile, and personal year forecasts.",
    href: "/services?category=numerology",
    color: "bg-indigo-100 text-indigo-600",
    icon: "8",
  },
  {
    title: "Horoscopes & Transits",
    desc: "Year-ahead forecasts, gochar reports, and monthly personalised guidance.",
    href: "/services?category=daily-astrology",
    color: "bg-sky-100 text-sky-600",
    icon: "☾",
  },
] as const;

const MEMBERSHIP_FEATURES = [
  "All Kundali & birth chart reports",
  "Marriage & compatibility analysis",
  "Career & wealth reports",
  "Dosha analysis & remedies guidance",
  "AI Face Self-Discovery",
  "Complete numerology suite",
  "Daily / weekly / monthly horoscope",
  "AI astrology assistant",
  "Family member profiles",
  "Personalized dashboard & support",
] as const;

async function getFeaturedCount() {
  try {
    return await prisma.product.count({
      where: { status: "PUBLISHED", isActive: true, isMembership: false },
    });
  } catch {
    return 78;
  }
}

export default async function HomePage() {
  const reportCount = await getFeaturedCount();

  return (
    <div>
      {/* Hero */}
      <section className="hero-astro">
        <div className="zodiac-glow hidden md:block" aria-hidden />
        <div className="container-jk relative z-10 py-14 sm:py-20 lg:py-24">
          <p className="mb-4 hidden text-right text-sm italic text-[var(--jk-gold)]/90 lg:block">
            Same Stars. A Brighter You.
          </p>
          <div className="max-w-2xl">
            <h1 className="font-display text-4xl font-semibold leading-[1.15] text-white sm:text-5xl lg:text-6xl">
              Discover Your True Self Through Ancient Wisdom & Modern AI
            </h1>
            <p className="mt-5 text-sm text-white/75 sm:text-base">
              Astrology · Face Analysis · Numerology · Daily Guidance · And More
            </p>

            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs text-white/70 sm:text-sm">
              <span className="inline-flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5 text-[var(--jk-gold)]" />
                {reportCount}+ Detailed Reports
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-[var(--jk-gold)]" />
                Secure & Private
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-[var(--jk-gold)]" />
                Instant PDF Download
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5 text-[var(--jk-gold)]" />
                Razorpay Checkout
              </span>
            </div>

            <form
              action="/services/janam-kundali"
              method="get"
              className="mt-8 flex w-full max-w-xl flex-col overflow-hidden rounded-full bg-white p-1.5 shadow-xl sm:flex-row sm:items-center"
            >
              <input
                name="q"
                placeholder="Enter your birth details to create your Kundali"
                className="h-11 flex-1 border-0 bg-transparent px-5 text-sm text-[var(--jk-ink)] outline-none placeholder:text-[var(--jk-muted)]"
                aria-label="Birth details"
              />
              <button type="submit" className="gold-btn flex h-11 items-center justify-center gap-2 px-6 text-sm">
                Generate Now
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Trust ribbon */}
      <section className="border-b border-[var(--jk-line)] bg-white">
        <div className="container-jk grid grid-cols-2 gap-4 py-5 sm:grid-cols-3 lg:grid-cols-5">
          {[
            { icon: Gift, label: "Accurate & Detailed Reports", color: "text-violet-500" },
            { icon: Zap, label: "Instant PDF Download", color: "text-fuchsia-500" },
            { icon: Globe, label: "Multiple Languages Ready", color: "text-blue-500" },
            { icon: Lock, label: "Your Data is Secure", color: "text-sky-500" },
            { icon: Heart, label: "Built for Reflection", color: "text-pink-500" },
          ].map(({ icon: Icon, label, color }) => (
            <div key={label} className="flex items-center gap-2.5 text-sm text-[var(--jk-ink)]">
              <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-50 ${color}`}>
                <Icon className="h-4 w-4" />
              </span>
              <span className="leading-snug">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section className="bg-[#f4f5f7] py-14 sm:py-16">
        <div className="container-jk">
          <div className="text-center">
            <h2 className="font-display text-3xl font-semibold text-[var(--jk-ink)] sm:text-4xl">
              Explore by category
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-[var(--jk-muted)]">
              Eight clear categories — each product has a distinct job. Individual reports are{" "}
              {formatINR(PRICING.reportPrice)}.
            </p>
          </div>
          <div className="service-grid mt-10">
            {SERVICE_CATEGORIES.map((s) => (
              <Link
                key={s.title}
                href={s.href}
                className="group flex flex-col rounded-2xl border border-white bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <span className={`mb-4 flex h-12 w-12 items-center justify-center rounded-full text-lg font-semibold ${s.color}`}>
                  {s.icon}
                </span>
                <h3 className="text-base font-semibold text-[var(--jk-ink)]">{s.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--jk-muted)]">{s.desc}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm font-medium text-[var(--jk-gold-dark)]">View products</span>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-[var(--jk-ink)] transition group-hover:bg-[var(--jk-gold)]">
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Premium membership */}
      <section className="bg-[#f4f5f7] pb-14 sm:pb-16">
        <div className="container-jk">
          <div className="premium-glow relative overflow-hidden rounded-3xl p-6 text-white sm:p-10 lg:p-12">
            <div className="absolute -right-10 top-1/2 hidden h-72 w-72 -translate-y-1/2 rounded-full bg-[var(--jk-gold)]/20 blur-3xl lg:block" aria-hidden />
            <div className="relative grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
              <div>
                <div className="mb-3 inline-flex items-center gap-2">
                  <span className="text-2xl" aria-hidden>👑</span>
                  <span className="rounded-full bg-[var(--jk-gold)] px-3 py-0.5 text-xs font-semibold text-[var(--jk-navy)]">
                    Most Popular
                  </span>
                </div>
                <h2 className="font-display text-3xl font-semibold sm:text-4xl">
                  Complete Self-Discovery Premium Membership
                </h2>
                <p className="mt-3 text-white/75">
                  Get access to premium features for just{" "}
                  <strong className="text-[var(--jk-gold)]">{formatINR(PRICING.membershipYearly)}/year</strong>
                </p>
                <ul className="mt-6 grid gap-2 sm:grid-cols-2">
                  {MEMBERSHIP_FEATURES.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-white/85">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--jk-gold)]" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/membership"
                  className="gold-btn mt-8 inline-flex h-12 items-center gap-2 px-7 text-sm"
                >
                  Get Premium for {formatINR(PRICING.membershipYearly)}/year
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="relative mx-auto hidden h-64 w-64 items-center justify-center lg:flex">
                <div className="absolute inset-0 rounded-full border border-[var(--jk-gold)]/30" />
                <div className="absolute inset-6 rounded-full border border-dashed border-[var(--jk-gold)]/40" />
                <div className="relative z-10 flex h-28 w-28 items-center justify-center rounded-full bg-[var(--jk-gold)]/20 text-5xl">
                  ✧
                </div>
                {[
                  { label: "Complete Access", pos: "left-0 top-8" },
                  { label: "Deeper Insights", pos: "right-0 top-8" },
                  { label: "Better Decisions", pos: "left-0 bottom-8" },
                  { label: "A Happier You", pos: "right-0 bottom-8" },
                ].map((b) => (
                  <div
                    key={b.label}
                    className={`absolute ${b.pos} rounded-full border border-[var(--jk-gold)]/40 bg-[var(--jk-midnight)]/90 px-3 py-1.5 text-[10px] text-[var(--jk-gold)]`}
                  >
                    {b.label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white py-14 sm:py-16">
        <div className="container-jk">
          <h2 className="text-center font-display text-3xl font-semibold sm:text-4xl">How It Works</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Calendar, title: "Enter Details", desc: "Share your birth date, time, and place." },
              { icon: CreditCard, title: "Make Payment", desc: "Secure Razorpay checkout — ₹499 per report." },
              { icon: FileText, title: "Get Your Report", desc: "PDF ready in your dashboard when generated." },
              { icon: Star, title: "Explore More", desc: "Ask the AI assistant and unlock membership." },
            ].map(({ icon: Icon, title, desc }, i) => (
              <div key={title} className="relative text-center">
                {i < 3 && (
                  <div className="absolute left-[60%] top-8 hidden h-px w-[80%] bg-slate-200 lg:block" aria-hidden />
                )}
                <div className="relative mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-violet-50 text-violet-600">
                  <Icon className="h-7 w-7" />
                  <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--jk-gold)] text-xs font-bold text-[var(--jk-navy)]">
                    {i + 1}
                  </span>
                </div>
                <h3 className="font-semibold">{title}</h3>
                <p className="mt-1 text-sm text-[var(--jk-muted)]">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section className="bg-[#f4f5f7] py-14 sm:py-16">
        <div className="container-jk grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div>
            <h2 className="font-display text-3xl font-semibold sm:text-4xl">Why Choose {BRAND.name}?</h2>
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {[
                { icon: BookOpen, label: "Authentic Vedic Knowledge" },
                { icon: Brain, label: "AI-Powered Insights" },
                { icon: Zap, label: "Instant Results" },
                { icon: Smile, label: "Easy to Use" },
                { icon: Shield, label: "Trusted & Secure" },
                { icon: Headphones, label: "Dedicated Support" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="rounded-2xl bg-white p-4 text-center shadow-sm">
                  <Icon className="mx-auto h-6 w-6 text-violet-500" />
                  <p className="mt-2 text-xs font-medium leading-snug">{label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-md sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">
              Sample stories · not verified reviews
            </p>
            <p className="mt-2 text-xs leading-relaxed text-[var(--jk-muted)]">{SAMPLE_STORIES_DISCLAIMER}</p>
            <div className="mt-5 space-y-4">
              {SAMPLE_STORIES.slice(0, 3).map((s) => (
                <blockquote key={s.id} className="border-l-2 border-[var(--jk-gold)] pl-3">
                  <p className="text-sm leading-relaxed text-[var(--jk-ink)] line-clamp-3">“{s.quote}”</p>
                  <footer className="mt-2 text-xs text-[var(--jk-muted)]">
                    {s.name} · {s.city} · <span className="text-amber-700">Sample</span>
                  </footer>
                </blockquote>
              ))}
            </div>
            <Link href="/stories" className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-[var(--jk-navy)] hover:text-[var(--jk-gold-dark)]">
              Browse all {SAMPLE_STORIES.length} sample stories
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="cta-final py-16 sm:py-20">
        <div className="container-jk text-center text-white">
          <Sparkles className="mx-auto h-8 w-8 text-[var(--jk-gold)]" />
          <h2 className="mt-4 font-display text-3xl font-semibold sm:text-5xl">
            Your Journey to a Better Tomorrow Starts Today
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-white/75">
            Create your Kundali, explore self-discovery tools, and grow with interpretive guidance.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/services/janam-kundali" className="gold-btn inline-flex h-12 items-center gap-2 px-7 text-sm">
              Create Your Kundali Now
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/services"
              className="inline-flex h-12 items-center rounded-full border border-white/40 px-7 text-sm text-white hover:bg-white/10"
            >
              Explore All Services
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
