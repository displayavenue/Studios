/**
 * Conversion tracking → Google Analytics 4 (gtag) + Google Tag Manager (dataLayer).
 * Events: whatsapp_click, phone_call_click, email_click, generate_lead, sign_up.
 */
type Params = Record<string, string | number | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function track(event: string, params: Params = {}) {
  const payload = { page_path: window.location.pathname, ...params };
  try {
    window.gtag?.("event", event, payload);
    window.dataLayer?.push({ event, ...payload });
  } catch {
    /* tracking must never break the site */
  }
}

/** One listener for every WhatsApp / call / email link on the site. */
export function installClickTracking() {
  document.addEventListener(
    "click",
    (e) => {
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a) return;
      const href = a.getAttribute("href") || "";
      const label = (a.textContent || a.getAttribute("aria-label") || "").trim().slice(0, 60);
      if (/wa\.me|api\.whatsapp\.com|whatsapp:/i.test(href)) track("whatsapp_click", { link_text: label });
      else if (href.startsWith("tel:")) track("phone_call_click", { link_text: label });
      else if (href.startsWith("mailto:")) track("email_click", { link_text: label });
    },
    { capture: true },
  );
}
