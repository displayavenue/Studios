import { useEffect } from "react";

/**
 * Flags reduced-motion / low-power for CSS.
 * Do NOT treat all touch phones as low-power — that killed the premium mobile feel.
 * Low-power only for save-data or clearly constrained devices.
 */
export function useMotionPrefs() {
  useEffect(() => {
    const root = document.documentElement;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const saveData =
      "connection" in navigator &&
      Boolean((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData);
    const deviceMemory =
      typeof (navigator as Navigator & { deviceMemory?: number }).deviceMemory === "number"
        ? (navigator as Navigator & { deviceMemory?: number }).deviceMemory!
        : undefined;

    const apply = () => {
      const constrainedMemory = typeof deviceMemory === "number" && deviceMemory > 0 && deviceMemory <= 1;
      const constrainedCpu =
        typeof navigator.hardwareConcurrency === "number" && navigator.hardwareConcurrency > 0 && navigator.hardwareConcurrency <= 2;
      const low = reduced.matches || saveData || constrainedMemory || constrainedCpu;
      root.classList.toggle("da-low-power", low);
      root.classList.toggle("da-reduced-motion", reduced.matches);
    };

    apply();
    reduced.addEventListener?.("change", apply);
    return () => reduced.removeEventListener?.("change", apply);
  }, []);
}
