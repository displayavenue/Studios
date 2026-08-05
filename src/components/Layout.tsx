import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { WhatsAppFloat } from "./WhatsAppFloat";
import { SiteConversion } from "./SiteConversion";
import { LocalBusinessSchema, WebSiteSchema } from "./SEO";

export function Layout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <LocalBusinessSchema />
      <WebSiteSchema />
      <Header />
      <main id="main-content">
        <Outlet />
      </main>
      <SiteConversion />
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
