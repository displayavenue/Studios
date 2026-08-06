import { useEffect, useRef } from "react";

export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -24px 0px" },
    );

    const observeAll = () => {
      el.querySelectorAll(".reveal:not(.is-visible)").forEach((t) => {
        observer.observe(t);
      });
    };

    observeAll();

    // CMS content loads after mount — pick up newly inserted .reveal nodes
    const mutation = new MutationObserver(() => observeAll());
    mutation.observe(el, { childList: true, subtree: true });

    return () => {
      mutation.disconnect();
      observer.disconnect();
    };
  }, []);

  return ref;
}
