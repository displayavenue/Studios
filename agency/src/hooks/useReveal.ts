import { useEffect, useRef } from "react";

const SELECTOR =
  ".reveal, .reveal-up, .reveal-left, .reveal-right, .reveal-scale, .reveal-blur, [data-animation]";

/** Adds `.is-visible` when reveal targets enter the viewport (once). */
export function useReveal(rootMargin = "0px 0px -12% 0px") {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const nodes = Array.from(root.querySelectorAll<HTMLElement>(SELECTOR));
    if (!nodes.length) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      nodes.forEach((n) => n.classList.add("is-visible"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          const anim = el.getAttribute("data-animation");
          if (anim && !el.classList.contains(`reveal-${anim}`) && anim !== "fade-up") {
            el.classList.add(anim.startsWith("reveal-") ? anim : `reveal-${anim.replace("fade-", "")}`);
          }
          el.classList.add("is-visible");
          io.unobserve(el);
        }
      },
      { threshold: 0.18, rootMargin },
    );

    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, [rootMargin]);

  return ref;
}
