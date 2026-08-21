import { useEffect, useRef, useState, type ReactNode } from "react";
import "./AutoCarousel.css";

type AutoCarouselProps = {
  children: ReactNode[];
  /** Time between advances (ms). Default slow & readable. */
  intervalMs?: number;
  className?: string;
  label?: string;
};

function usePerView() {
  const [perView, setPerView] = useState(1);
  useEffect(() => {
    const calc = () => {
      const w = window.innerWidth;
      if (w >= 980) setPerView(3);
      else if (w >= 640) setPerView(2);
      else setPerView(1);
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);
  return perView;
}

/**
 * Crisp multi-card auto carousel. Advances one page at a time (slow),
 * pauses on hover/touch, respects reduced motion. No continuous marquee
 * (avoids GPU text blur).
 */
export function AutoCarousel({
  children,
  intervalMs = 5200,
  className = "",
  label = "Carousel",
}: AutoCarouselProps) {
  const items = children.filter(Boolean);
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

  // Keep page in range when perView changes
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
  const offsetPct = page * 100;

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
        setPaused(false);
        if (start == null || end == null) return;
        const dx = end - start;
        if (Math.abs(dx) < 40) return;
        go(dx < 0 ? page + 1 : page - 1);
      }}
    >
      <div className="auto-carousel__viewport">
        <div
          className="auto-carousel__track"
          style={{
            transform: `translate3d(-${offsetPct}%, 0, 0)`,
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
          <div className="auto-carousel__dots" role="tablist" aria-label="Slides">
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
