import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/tokens.css";
import "./styles/motion.css";
import { CmsProvider } from "./cms/CmsProvider";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CmsProvider>
      <App />
    </CmsProvider>
  </StrictMode>,
);
