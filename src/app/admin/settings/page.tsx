export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl text-[var(--jk-ivory)]">Settings</h1>
      <div className="admin-panel p-6">
        <p className="text-sm text-[var(--jk-ivory)]/60">
          System settings, Razorpay keys, and provider configuration — manage via environment variables and SystemSetting records.
        </p>
      </div>
    </div>
  );
}
