import { StoreFooter, StoreHeader, MobileBottomNav } from "@/components/store/header-footer";

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="announce">
        Free shipping on prepaid orders · Easy returns · Ships across India where serviceable
      </div>
      <StoreHeader />
      <main className="flex-1 pb-20 md:pb-0">{children}</main>
      <StoreFooter />
      <MobileBottomNav />
    </>
  );
}
