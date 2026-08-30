import { useEffect } from "react";

/** Flags reduced-motion / low-power for CSS (`html.da-low-power`). */
export function useMotionPrefs() {
  useEffect(() => {
    const root = document.documentElement;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarse = window.matchMedia("(pointer: coarse)");
    const saveData =
      "connection" in navigator &&
      Boolean((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData);

    const apply = () => {
      const low =
        reduced.matches ||
        saveData ||
        (coarse.matches && typeof navigator.hardwareConcurrency === "number" && navigator.hardwareConcurrency <= 4);
      root.classList.toggle("da-low-power", low);
      root.classList.toggle("da-reduced-motion", reduced.matches);
    };

    apply();
    reduced.addEventListener?.("change", apply);
    return () => reduced.removeEventListener?.("change", apply);
  }, []);
}
