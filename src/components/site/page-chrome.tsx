import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function PageHero({
  eyebrow,
  title,
  subtitle,
  lead,
  children,
  variant = "marketplace",
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  lead?: string;
  children?: React.ReactNode;
  variant?: "dark" | "marketplace";
}) {
  const blurb = lead ?? subtitle;
  if (variant === "marketplace") {
    return (
      <section className="at-page-hero">
        <div className="container-jk relative z-10 py-10 sm:py-12">
          {eyebrow && (
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--at-yellow-ink)]">{eyebrow}</p>
          )}
          <h1 className="mt-2 max-w-3xl text-3xl font-bold tracking-tight text-[var(--jk-ink)] sm:text-4xl">
            {title}
          </h1>
          {blurb && <p className="mt-3 max-w-2xl text-sm text-[var(--jk-muted)] sm:text-base">{blurb}</p>}
          {children && <div className="mt-6">{children}</div>}
        </div>
      </section>
    );
  }
  return (
    <section className="hero-astro">
      <div className="zodiac-glow opacity-40" aria-hidden />
      <div className="container-jk relative z-10 py-12 sm:py-16">
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--jk-gold)]">{eyebrow}</p>
        )}
        <h1 className="mt-2 max-w-3xl font-display text-3xl font-semibold leading-tight text-white sm:text-4xl lg:text-5xl">
          {title}
        </h1>
        {blurb && <p className="mt-3 max-w-2xl text-sm text-white/70 sm:text-base">{blurb}</p>}
        {children && <div className="mt-6">{children}</div>}
      </div>
    </section>
  );
}

export function Surface({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-2xl border border-[var(--jk-line)] bg-white p-5 shadow-sm sm:p-6 ${className}`}>
      {children}
    </div>
  );
}

export function SectionShell({
  children,
  className = "",
  muted = false,
}: {
  children: React.ReactNode;
  className?: string;
  muted?: boolean;
}) {
  return (
    <section className={`${muted ? "bg-[#f4f5f7]" : "bg-white"} py-10 sm:py-14 ${className}`}>
      <div className="container-jk">{children}</div>
    </section>
  );
}

export function GoldCtaLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link href={href} className={`gold-btn inline-flex h-11 items-center gap-2 px-6 text-sm ${className}`}>
      {children}
      <ArrowRight className="h-4 w-4" />
    </Link>
  );
}
