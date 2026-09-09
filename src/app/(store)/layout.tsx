import { SiteFooter, SiteHeader, MobileBottomNav } from "@/components/site/header-footer";
import { LanguageProvider } from "@/components/site/i18n";
import { AuthModalProvider } from "@/components/site/auth-provider";
import { AuthModal } from "@/components/site/auth-modal";
import { AnalyticsBeacon } from "@/components/site/analytics-beacon";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <AuthModalProvider>
        <SiteHeader />
        <main className="flex-1 pb-[4.5rem] md:pb-0">{children}</main>
        <SiteFooter />
        <MobileBottomNav />
        <AuthModal />
        <AnalyticsBeacon />
      </AuthModalProvider>
    </LanguageProvider>
  );
}
