import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/tokens.css";
import "./styles/motion.css";
import { CmsProvider } from "./cms/CmsProvider";
import App from "./App";

// Remove server-injected crawler HTML once React mounts (humans see the SPA).
document.getElementById("seo-static")?.remove();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CmsProvider>
      <App />
    </CmsProvider>
  </StrictMode>,
);
