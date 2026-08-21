import { useEffect, useRef, useState, type ReactNode } from "react";
import "./AutoCarousel.css";

type AutoCarouselProps = {
  children: ReactNode[];
  /** Auto-advance interval in ms (slide mode) */
  intervalMs?: number;
  /** slide = one-at-a-time; marquee = continuous horizontal scroll */
  mode?: "slide" | "marquee";
  className?: string;
  label?: string;
};

/**
 * Auto-moving carousel. Marquee mode loops continuously; slide mode advances
 * one card at a time. Both pause on hover/focus and respect reduced motion.
 */
export function AutoCarousel({
  children,
  intervalMs = 3800,
  mode = "marquee",
  className = "",
  label = "Carousel",
}: AutoCarouselProps) {
  const items = children.filter(Boolean);
  const count = items.length;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reducedRef = useRef(false);

  useEffect(() => {
    reducedRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    if (mode !== "slide" || count <= 1 || paused || reducedRef.current) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % count);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [count, paused, intervalMs, mode]);

  if (count === 0) return null;

  const go = (next: number) => setIndex(((next % count) + count) % count);

  // Duplicate set for seamless marquee loop
  const marqueeItems = mode === "marquee" && count > 1 ? [...items, ...items] : items;

  return (
    <div
      className={`auto-carousel auto-carousel--${mode} ${className}`}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setPaused(false);
      }}
    >
      <div className="auto-carousel__viewport">
        <div
          className={`auto-carousel__track${paused ? " is-paused" : ""}`}
          style={mode === "slide" ? { transform: `translate3d(-${index * 100}%, 0, 0)` } : undefined}
        >
          {marqueeItems.map((child, i) => (
            <div
              key={i}
              className={`auto-carousel__slide${mode === "slide" && i === index ? " is-active" : ""}`}
              aria-hidden={mode === "slide" ? i !== index : i >= count}
            >
              {child}
            </div>
          ))}
        </div>
      </div>

      {mode === "slide" && count > 1 && (
        <div className="auto-carousel__chrome">
          <button
            type="button"
            className="auto-carousel__nav"
            aria-label="Previous"
            onClick={() => go(index - 1)}
          >
            ‹
          </button>
          <div className="auto-carousel__dots" role="tablist" aria-label="Slides">
            {items.map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Slide ${i + 1}`}
                className={`auto-carousel__dot${i === index ? " is-active" : ""}`}
                onClick={() => go(i)}
              />
            ))}
          </div>
          <button
            type="button"
            className="auto-carousel__nav"
            aria-label="Next"
            onClick={() => go(index + 1)}
          >
            ›
          </button>
          <span className="auto-carousel__progress" aria-hidden>
            <span
              key={index}
              className={`auto-carousel__progress-bar${paused ? " is-paused" : ""}`}
              style={{ animationDuration: `${intervalMs}ms` }}
            />
          </span>
        </div>
      )}
    </div>
  );
}
