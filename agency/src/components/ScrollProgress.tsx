import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./ScrollProgress.css";

/** Thin top progress bar on long pages only. */
export function ScrollProgress() {
  const { pathname } = useLocation();
  const [progress, setProgress] = useState(0);
  const enabled = pathname === "/" || pathname === "/portfolio" || pathname === "/why-displayavenue";

  useEffect(() => {
    if (!enabled) {
      setProgress(0);
      return;
    }
    const onScroll = () => {
      const doc = document.documentElement;
      const max = Math.max(1, doc.scrollHeight - window.innerHeight);
      setProgress(Math.min(1, window.scrollY / max));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [enabled, pathname]);

  if (!enabled) return null;

  return (
    <div className="scroll-progress" aria-hidden>
      <div className="scroll-progress__bar" style={{ transform: `scaleX(${progress})` }} />
    </div>
  );
}
