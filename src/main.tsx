import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./pages/Home.css";
import App from "./App";
import { CmsProvider } from "./cms/CmsProvider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CmsProvider>
      <App />
    </CmsProvider>
  </StrictMode>,
);
