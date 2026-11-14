/** Log WhatsApp contact intents into DisplayAvenue CRM (local + HubSpot/Sheets). */

type WhatsAppLeadInput = {
  name?: string;
  phone?: string;
  email?: string;
  business?: string;
  message?: string;
  page?: string;
  cta_location?: string;
  utm_source?: string;
  utm_campaign?: string;
};

function readUtm(): { utm_source: string; utm_campaign: string } {
  try {
    const params = new URLSearchParams(window.location.search);
    const fromUrl = {
      utm_source: params.get("utm_source") || "",
      utm_campaign: params.get("utm_campaign") || "",
    };
    if (fromUrl.utm_source || fromUrl.utm_campaign) return fromUrl;
    const raw = sessionStorage.getItem("da_growth_attr_last");
    if (!raw) return fromUrl;
    const parsed = JSON.parse(raw) as { utm_source?: string; utm_campaign?: string };
    return {
      utm_source: parsed.utm_source || "",
      utm_campaign: parsed.utm_campaign || "",
    };
  } catch {
    return { utm_source: "", utm_campaign: "" };
  }
}

export async function logWhatsAppLead(input: WhatsAppLeadInput = {}): Promise<void> {
  try {
    const utm = readUtm();
    const base = (import.meta.env.BASE_URL || "/").replace(/\/?$/, "/");
    await fetch(`${base}admin/whatsapp-lead.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: input.name || "",
        phone: input.phone || "",
        email: input.email || "",
        business: input.business || "",
        message: input.message || "Clicked WhatsApp on website",
        page: input.page || window.location.pathname + window.location.search,
        cta_location: input.cta_location || "whatsapp",
        utm_source: input.utm_source || utm.utm_source,
        utm_campaign: input.utm_campaign || utm.utm_campaign,
        website: "",
      }),
      keepalive: true,
    });
  } catch {
    /* never block WhatsApp open */
  }
}

export function openWhatsApp(
  href: string,
  input: WhatsAppLeadInput = {},
): void {
  void logWhatsAppLead(input);
  window.open(href, "_blank", "noopener,noreferrer");
}
