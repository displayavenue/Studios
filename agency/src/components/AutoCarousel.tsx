import { useEffect, useRef, useState, type ReactNode } from "react";
import "./AutoCarousel.css";

type AutoCarouselProps = {
  children: ReactNode[];
  /** Time between advances (ms). */
  intervalMs?: number;
  className?: string;
  label?: string;
  /** Max items to show in the carousel (hub link covers the rest). */
  maxItems?: number;
};

function usePerView() {
  const [perView, setPerView] = useState(1);
  useEffect(() => {
    const calc = () => {
      const w = window.innerWidth;
      if (w >= 980) setPerView(3);
      else if (w >= 700) setPerView(2);
      else setPerView(1);
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);
  return perView;
}

/**
 * Mobile-first auto carousel: 1 card on phones, crisp text, compact
 * "n / total" chrome (no dozens of dots), swipe support.
 */
export function AutoCarousel({
  children,
  intervalMs = 5500,
  className = "",
  label = "Carousel",
  maxItems = 9,
}: AutoCarouselProps) {
  const all = children.filter(Boolean);
  const items = maxItems > 0 ? all.slice(0, maxItems) : all;
  const count = items.length;
  const perView = usePerView();
  const pages = Math.max(1, Math.ceil(count / perView));
  const [page, setPage] = useState(0);
  const [paused, setPaused] = useState(false);
  const reducedRef = useRef(false);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    reducedRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    setPage((p) => Math.min(p, Math.max(0, pages - 1)));
  }, [pages]);

  useEffect(() => {
    if (pages <= 1 || paused || reducedRef.current) return;
    const id = window.setInterval(() => {
      setPage((p) => (p + 1) % pages);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [pages, paused, intervalMs]);

  if (count === 0) return null;

  const go = (next: number) => setPage(((next % pages) + pages) % pages);

  return (
    <div
      className={`auto-carousel ${className}`}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setPaused(false);
      }}
      onTouchStart={(e) => {
        touchStartX.current = e.changedTouches[0]?.clientX ?? null;
        setPaused(true);
      }}
      onTouchEnd={(e) => {
        const start = touchStartX.current;
        const end = e.changedTouches[0]?.clientX;
        touchStartX.current = null;
        window.setTimeout(() => setPaused(false), 1200);
        if (start == null || end == null) return;
        const dx = end - start;
        if (Math.abs(dx) < 36) return;
        go(dx < 0 ? page + 1 : page - 1);
      }}
    >
      <div className="auto-carousel__viewport">
        <div
          className="auto-carousel__track"
          style={{
            transform: `translate3d(-${page * 100}%, 0, 0)`,
            ["--per-view" as string]: String(perView),
          }}
        >
          {Array.from({ length: pages }, (_, pageIdx) => (
            <div
              key={pageIdx}
              className={`auto-carousel__page${pageIdx === page ? " is-active" : ""}`}
              aria-hidden={pageIdx !== page}
            >
              {items.slice(pageIdx * perView, pageIdx * perView + perView).map((child, i) => (
                <div key={i} className="auto-carousel__slide">
                  {child}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {pages > 1 && (
        <div className="auto-carousel__chrome">
          <button
            type="button"
            className="auto-carousel__nav"
            aria-label="Previous"
            onClick={() => go(page - 1)}
          >
            ‹
          </button>
          <div className="auto-carousel__status" aria-live="polite">
            <span className="auto-carousel__count">
              {page + 1} <span aria-hidden>/</span> {pages}
            </span>
            {pages <= 6 && (
              <div className="auto-carousel__dots" role="tablist" aria-label="Pages">
                {Array.from({ length: pages }, (_, i) => (
                  <button
                    key={i}
                    type="button"
                    role="tab"
                    aria-selected={i === page}
                    aria-label={`Page ${i + 1}`}
                    className={`auto-carousel__dot${i === page ? " is-active" : ""}`}
                    onClick={() => go(i)}
                  />
                ))}
              </div>
            )}
          </div>
          <button
            type="button"
            className="auto-carousel__nav"
            aria-label="Next"
            onClick={() => go(page + 1)}
          >
            ›
          </button>
          <span className="auto-carousel__progress" aria-hidden>
            <span
              key={`${page}-${paused}`}
              className={`auto-carousel__progress-bar${paused ? " is-paused" : ""}`}
              style={{ animationDuration: `${intervalMs}ms` }}
            />
          </span>
        </div>
      )}
    </div>
  );
}
