import { useEffect, useRef, useState, type ReactNode } from "react";
import { useCountUp } from "../../hooks/useCountUp";
import "./motionBits.css";

/** Word-by-word hero reveal — full text stays in aria-label for SEO/a11y. */
export function WordReveal({
  text,
  className = "",
  as: Tag = "span",
}: {
  text: string;
  className?: string;
  as?: "span" | "h1" | "h2" | "p";
}) {
  const words = text.trim().split(/\s+/).filter(Boolean);
  return (
    <Tag className={`word-reveal ${className}`.trim()} aria-label={text}>
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          className="word-reveal__word"
          style={{ animationDelay: `${0.08 + i * 0.07}s` }}
          aria-hidden
        >
          {word}
          {i < words.length - 1 ? "\u00A0" : ""}
        </span>
      ))}
    </Tag>
  );
}

/** Fast brand type-on (≤1.2s). Skips after first session visit for CWV. */
export function BrandTypeOn({ text }: { text: string }) {
  const [run] = useState(() => {
    try {
      if (sessionStorage.getItem("da-brand-typed") === "1") return false;
      sessionStorage.setItem("da-brand-typed", "1");
      return true;
    } catch {
      return true;
    }
  });

  if (!run) return <span className="brand-type">{text}</span>;

  const chars = Array.from(text);
  return (
    <span className="brand-type brand-type--animate" aria-label={text}>
      {chars.map((ch, i) => (
        <span
          key={`${ch}-${i}`}
          className="brand-type__ch"
          style={{ animationDelay: `${0.04 + i * 0.045}s` }}
          aria-hidden
        >
          {ch === " " ? "\u00A0" : ch}
        </span>
      ))}
    </span>
  );
}

const DEFAULT_KEYWORDS = [
  "Build your brand",
  "Grow your business",
  "Generate more leads",
  "Scale with confidence",
];

export function RotatingKeywords({
  items = DEFAULT_KEYWORDS,
  intervalMs = 2800,
}: {
  items?: string[];
  intervalMs?: number;
}) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % items.length);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [items, intervalMs]);

  return (
    <p className="rotate-kw" aria-live="polite">
      <span className="rotate-kw__label">We help you</span>
      <span className="rotate-kw__stage">
        {items.map((item, i) => (
          <span key={item} className={`rotate-kw__item${i === index ? " is-active" : ""}`}>
            {item}
          </span>
        ))}
      </span>
    </p>
  );
}

export function LogoMarquee({ logos }: { logos: string[] }) {
  if (!logos.length) return null;
  const loop = [...logos, ...logos];
  return (
    <div className="logo-marquee" aria-label="Clients and partners">
      <div className="logo-marquee__track">
        {loop.map((logo, i) => (
          <span key={`${logo}-${i}`} className="logo-marquee__item">
            {logo}
          </span>
        ))}
      </div>
    </div>
  );
}

export function CountStat({
  value,
  label,
  className = "",
}: {
  value: string;
  label: string;
  className?: string;
}) {
  const { ref, display } = useCountUp(value);
  return (
    <div className={`home-stat reveal-up ${className}`.trim()} ref={ref as React.RefObject<HTMLDivElement>}>
      <strong>{display}</strong>
      <span>{label}</span>
    </div>
  );
}

/** Mobile horizontal swipe rail with dots + progress. Desktop: children as grid via CSS contents. */
export function MobileSwipeRail({
  children,
  className = "",
  label = "Items",
}: {
  children: ReactNode[];
  className?: string;
  label?: string;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const total = children.length;

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const onScroll = () => {
      const items = Array.from(el.children) as HTMLElement[];
      if (!items.length) return;
      const mid = el.scrollLeft + el.clientWidth / 2;
      let best = 0;
      let bestDist = Infinity;
      items.forEach((item, i) => {
        const c = item.offsetLeft + item.offsetWidth / 2;
        const d = Math.abs(c - mid);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      });
      setActive(best);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => el.removeEventListener("scroll", onScroll);
  }, [total]);

  const goTo = (i: number) => {
    const el = scrollerRef.current;
    const item = el?.children[i] as HTMLElement | undefined;
    item?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  };

  return (
    <div className={`motion-rail-wrap ${className}`.trim()}>
      <div
        ref={scrollerRef}
        className="motion-rail motion-rail--mobile-only"
        role="list"
        aria-label={label}
      >
        {children.map((child, i) => (
          <div
            key={i}
            className={`motion-rail__item${i === active ? " is-active" : ""}`}
            role="listitem"
          >
            {child}
          </div>
        ))}
      </div>
      <div className="motion-rail__dots motion-rail__dots--mobile-only" aria-hidden>
        {children.map((_, i) => (
          <button
            key={i}
            type="button"
            className={`motion-rail__dot${i === active ? " is-active" : ""}`}
            onClick={() => goTo(i)}
            tabIndex={-1}
          />
        ))}
      </div>
      <p className="motion-rail__progress motion-rail__progress--mobile-only" aria-live="polite">
        {String(active + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </p>
    </div>
  );
}
