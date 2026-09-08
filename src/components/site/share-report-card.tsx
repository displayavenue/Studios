"use client";

export function ShareReportCard({ title, personName }: { title: string; personName?: string | null }) {
  async function share() {
    const text = `${title}${personName ? ` for ${personName}` : ""} — prepared on JyotishKundali (interpretive guidance).`;
    if (navigator.share) {
      await navigator.share({ title: "JyotishKundali report", text, url: window.location.origin });
      return;
    }
    await navigator.clipboard.writeText(text);
    alert("Share text copied.");
  }

  return (
    <button type="button" onClick={share} className="rounded-full border px-3 py-1.5 text-xs font-semibold">
      Share card
    </button>
  );
}
