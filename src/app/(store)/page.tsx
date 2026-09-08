import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ServiceCard } from "@/components/site/service-card";
import { Button } from "@/components/ui/button";
import { BRAND, PRICING } from "@/config/site";
import { formatINR } from "@/lib/utils";

export const dynamic = "force-dynamic";

async function getHomeData() {
  const products = await prisma.product.findMany({
    where: { status: "PUBLISHED", isActive: true, isMembership: false },
    orderBy: { sortOrder: "asc" },
    take: 6,
    include: { category: true },
  });
  return { products };
}

export default async function HomePage() {
  const { products } = await getHomeData();

  return (
    <div>
      <section className="hero-gradient text-[var(--jk-ivory)]">
        <div className="container-jk py-16 sm:py-24">
          <p className="text-sm uppercase tracking-[0.2em] text-[var(--jk-gold)]">{BRAND.tagline}</p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
            Discover Your True Self
          </h1>
          <p className="mt-5 max-w-2xl text-base text-[var(--jk-ivory)]/80 sm:text-lg">
            Personalized Vedic astrology reports, compatibility insights, and self-discovery tools —
            crafted for reflection, not prediction.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="bg-[var(--jk-gold)] text-[var(--jk-navy)] hover:bg-[var(--jk-gold-soft)]">
              <Link href="/services/janam-kundali">Create My Kundali</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-[var(--jk-gold)]/50 bg-transparent text-[var(--jk-ivory)] hover:bg-white/10">
              <Link href="/services">Explore Services</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="border-b border-[var(--jk-line)] bg-white">
        <div className="container-jk flex flex-wrap items-center justify-center gap-6 py-4 text-center text-sm text-[var(--jk-muted)]">
          <span>Secure payments via Razorpay</span>
          <span className="hidden sm:inline">·</span>
          <span>Reports from ₹{PRICING.reportPrice}</span>
          <span className="hidden sm:inline">·</span>
          <span>Interpretive & entertainment purpose</span>
        </div>
      </section>

      <section className="container-jk py-12">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-semibold sm:text-3xl">Featured Services</h2>
            <p className="mt-2 text-sm text-[var(--jk-muted)]">Each report is {formatINR(PRICING.reportPrice)} — delivered digitally.</p>
          </div>
          <Link href="/services" className="text-sm text-[var(--jk-purple)] hover:underline">
            View all
          </Link>
        </div>
        <div className="service-grid mt-8">
          {products.length ? (
            products.map((p) => <ServiceCard key={p.id} product={p} />)
          ) : (
            <p className="text-sm text-[var(--jk-muted)]">Run <code>npm run db:seed</code> to load astrology reports.</p>
          )}
        </div>
      </section>

      <section className="container-jk pb-12">
        <div className="site-section">
          <h2 className="font-display text-2xl font-semibold">How it works</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {[
              ["1", "Share birth details", "Name, date, time, and place of birth — time can be marked unknown."],
              ["2", "Secure checkout", "Pay ₹499 per report via Razorpay. Membership available at ₹2,999/year."],
              ["3", "Receive your report", "Your personalized interpretive report is generated and available in your dashboard."],
            ].map(([step, title, desc]) => (
              <div key={step} className="rounded-lg border border-[var(--jk-line)] p-5">
                <span className="font-display text-2xl text-[var(--jk-gold)]">{step}</span>
                <h3 className="mt-2 font-semibold">{title}</h3>
                <p className="mt-2 text-sm text-[var(--jk-muted)]">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-jk pb-12">
        <div className="site-section hero-gradient text-[var(--jk-ivory)]">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-wider text-[var(--jk-gold)]">Membership</p>
              <h2 className="mt-2 font-display text-2xl font-semibold">Unlimited insights, one year</h2>
              <p className="mt-2 text-sm text-[var(--jk-ivory)]/75">
                Daily horoscope, AI assistant, and member pricing on select reports.
              </p>
            </div>
            <div className="text-right">
              <p className="font-display text-3xl text-[var(--jk-gold)]">{formatINR(PRICING.membershipYearly)}<span className="text-base font-normal text-[var(--jk-ivory)]/70">/year</span></p>
              <Button asChild className="mt-4 bg-[var(--jk-gold)] text-[var(--jk-navy)] hover:bg-[var(--jk-gold-soft)]">
                <Link href="/membership">Learn more</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="container-jk pb-16">
        <div className="site-section">
          <h2 className="font-display text-2xl font-semibold">FAQ</h2>
          <div className="mt-4 divide-y divide-[var(--jk-line)]">
            {[
              ["Are these real planetary positions?", "Production uses verified ephemeris data. Demo/mock mode clearly labels interpretive sample calculations."],
              ["What if I don't know my birth time?", "Select 'birth time unknown' — reports adjust scope accordingly with a note in your reading."],
              ["Is this medical or financial advice?", "No. All content is for interpretive reflection and entertainment only."],
            ].map(([q, a]) => (
              <details key={q} className="py-3">
                <summary className="cursor-pointer text-sm font-medium">{q}</summary>
                <p className="mt-2 text-sm text-[var(--jk-muted)]">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
