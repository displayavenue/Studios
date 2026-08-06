import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { WhatsAppFloat } from "./WhatsAppFloat";
import { LocalBusinessSchema, WebSiteSchema } from "./SEO";
import { TrackingScripts } from "./TrackingScripts";

export function Layout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <TrackingScripts />
      <LocalBusinessSchema />
      <WebSiteSchema />
      <Header />
      <main id="main-content">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
