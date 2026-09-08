export default function DashboardAiPage() {
  return (
    <div className="container-jk py-10">
      <h1 className="font-display text-2xl font-semibold">AI Assistant</h1>
      <div className="site-section mt-8">
        <p className="text-[var(--jk-muted)]">
          Ask reflective questions about your chart themes. AI responses are interpretive — not factual predictions.
        </p>
        <div className="mt-6 rounded-lg border border-dashed border-[var(--jk-line)] p-8 text-center text-sm text-[var(--jk-muted)]">
          AI chat coming soon. Mock provider available in development mode.
        </div>
      </div>
    </div>
  );
}
