import { WalletPanel } from "@/components/marketplace/wallet-panel";

export const metadata = {
  title: "Wallet",
  description: "Recharge your JyotishKundali consult wallet.",
};

export default function WalletPage() {
  return (
    <div className="at-home min-h-screen">
      <div className="container-jk py-10">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--jk-muted)]">Account</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          Consult <span className="text-[var(--at-yellow-ink)]">Wallet</span>
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-[var(--jk-muted)]">
          Recharge once, then chat or call sample experts. Free intro minutes apply; further time uses wallet balance.
        </p>
        <div className="mt-8">
          <WalletPanel />
        </div>
      </div>
    </div>
  );
}
