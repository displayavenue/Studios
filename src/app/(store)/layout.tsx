import { SiteFooter, SiteHeader, MobileBottomNav } from "@/components/site/header-footer";
import { LanguageProvider } from "@/components/site/i18n";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <SiteHeader />
      <main className="flex-1 pb-[4.5rem] md:pb-0">{children}</main>
      <SiteFooter />
      <MobileBottomNav />
    </LanguageProvider>
  );
}
