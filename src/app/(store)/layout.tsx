import { SiteFooter, SiteHeader, MobileBottomNav } from "@/components/site/header-footer";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 pb-[4.5rem] md:pb-0">{children}</main>
      <SiteFooter />
      <MobileBottomNav />
    </>
  );
}
