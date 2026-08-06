import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./pages/Home.css";
import "./pages/Page.css";
import App from "./App";
import { CmsProvider } from "./cms/CmsProvider";
import { SiteLoader } from "./components/SiteLoader";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CmsProvider>
      <SiteLoader>
        <App />
      </SiteLoader>
    </CmsProvider>
  </StrictMode>,
);
