import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource/marcellus/latin-400.css";
import "@fontsource/jost/latin-300.css";
import "@fontsource/jost/latin-400.css";
import "@fontsource/jost/latin-500.css";
import "./index.css";
import { installClickTracking } from "./utils/track";

installClickTracking();
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
