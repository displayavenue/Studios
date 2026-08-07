import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { WhatsAppFloat } from "./Placeholder";
import { ChatWidget } from "./ChatWidget";
import { TrackingScripts } from "./TrackingScripts";
import { LocalBusinessSchema, WebSiteSchema } from "./SEO";
import { ScrollToTop } from "./ScrollToTop";
import "./Placeholder.css";

export function Layout() {
  return (
    <>
      <ScrollToTop />
      <TrackingScripts />
      <LocalBusinessSchema />
      <WebSiteSchema />
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      <WhatsAppFloat />
      <ChatWidget />
    </>
  );
}
