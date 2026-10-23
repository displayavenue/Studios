import { useEffect, useRef } from "react";

/** Adds `.is-visible` when elements with `.reveal` enter the viewport. */
export function useReveal(rootMargin = "0px 0px -8% 0px") {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const nodes = Array.from(root.querySelectorAll<HTMLElement>(".reveal"));
    if (!nodes.length) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      nodes.forEach((n) => n.classList.add("is-visible"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.14, rootMargin },
    );

    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, [rootMargin]);

  return ref;
}
