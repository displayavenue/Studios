import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/tokens.css";
import "./styles/motion.css";
import { CmsProvider } from "./cms/CmsProvider";
import App from "./App";
import "./styles/theme-glow.css";

// Remove server-injected crawler HTML once React mounts (humans see the SPA).
document.getElementById("seo-static")?.remove();

const rootEl = document.getElementById("root")!;
// The server sends fully prerendered HTML (scripts/prerender.mjs). React re-renders on
// top of it; skip first-screen entrance animations so they don't replay on hand-off.
if (rootEl.firstElementChild) document.documentElement.classList.add("da-handoff");

createRoot(rootEl).render(
  <StrictMode>
    <CmsProvider>
      <App />
    </CmsProvider>
  </StrictMode>,
);

// Cursor spotlight for glass cards (theme-glow.css reads --mx / --my).
if (typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches) {
  const GLOW = ".home-stat,.home-service,.home-process__item,.home-faq__item,.grev__card,.explore-tile,.category-card,.featured-card,.price-card,.testimonial-card,.tool-card,.dash-card,.blog-card,.acred__card,.detail-hero-card,.cta-box";
  document.addEventListener(
    "pointermove",
    (e) => {
      const el = (e.target as Element | null)?.closest?.(GLOW) as HTMLElement | null;
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - r.left}px`);
      el.style.setProperty("--my", `${e.clientY - r.top}px`);
    },
    { passive: true },
  );
}
