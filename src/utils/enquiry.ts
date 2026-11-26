import { track } from "./track";

export type EnquiryResult = { ok: boolean; error?: string };

/** Send a form to /enquiry.php (saved on the server + emailed) and record the conversion. */
export async function sendEnquiry(form: HTMLFormElement, kind: string): Promise<EnquiryResult> {
  const data: Record<string, string> = { form: kind, page: window.location.pathname };
  new FormData(form).forEach((v, k) => {
    data[k] = String(v);
  });
  try {
    const res = await fetch("/enquiry.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const body = (await res.json().catch(() => ({}))) as EnquiryResult;
    if (!res.ok || !body.ok) return { ok: false, error: body.error || "Could not send" };
    track(kind === "newsletter" ? "sign_up" : "generate_lead", {
      form_name: kind,
      service: data.service,
      package: data.package,
      city: data.city,
    });
    return { ok: true };
  } catch {
    return { ok: false, error: "Network error" };
  }
}

/** WhatsApp link pre-filled with the enquiry, so nothing is lost even if email fails. */
export function whatsappEnquiryLink(waHref: string, form: HTMLFormElement | null, intro: string) {
  const lines = [intro];
  if (form) {
    new FormData(form).forEach((v, k) => {
      if (k !== "company_website" && String(v).trim()) lines.push(`${k[0].toUpperCase()}${k.slice(1)}: ${v}`);
    });
  }
  const base = waHref.split("?")[0];
  return `${base}?text=${encodeURIComponent(lines.join("\n"))}`;
}
