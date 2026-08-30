import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { InternalLinks } from "./InternalLinks";
import { WhatsAppFloat } from "./Placeholder";
import { TrackingScripts } from "./TrackingScripts";
import { LocalBusinessSchema, WebSiteSchema } from "./SEO";
import { ScrollToTop } from "./ScrollToTop";
import { StickyMobileCta } from "./StickyMobileCta";
import { ScrollProgress } from "./ScrollProgress";
import { useMotionPrefs } from "../hooks/useMotionPrefs";
import "./Placeholder.css";

export function Layout() {
  useMotionPrefs();
  return (
    <div className="app-shell">
      <ScrollToTop />
      <ScrollProgress />
      <TrackingScripts />
      <LocalBusinessSchema />
      <WebSiteSchema />
      <Header />
      <main>
        <Outlet />
        <InternalLinks limit={140} />
      </main>
      <Footer />
      <WhatsAppFloat />
      <StickyMobileCta />
    </div>
  );
}
