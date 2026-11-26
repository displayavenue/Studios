import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/tokens.css";
import "./styles/motion.css";
import { CmsProvider } from "./cms/CmsProvider";
import App from "./App";

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
