import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { InternalLinks } from "./InternalLinks";
import { WhatsAppFloat } from "./Placeholder";
import { TrackingScripts } from "./TrackingScripts";
import { LocalBusinessSchema, WebSiteSchema } from "./SEO";
import "./Placeholder.css";

export function Layout() {
  return (
    <>
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
    </>
  );
}
