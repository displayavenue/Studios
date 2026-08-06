/**
 * Submit website leads to /lead.php (saved in CMS + emailed to info@).
 */
export type LeadPayload = {
  name?: string;
  email: string;
  phone?: string;
  message?: string;
  source?: "contact" | "newsletter" | "proposal" | "consultation" | "other";
  page?: string;
};

export type LeadResult = {
  ok: boolean;
  saved?: boolean;
  emailed?: boolean;
  id?: string;
  error?: string;
};

export async function submitLead(payload: LeadPayload): Promise<LeadResult> {
  const body = {
    name: payload.name?.trim() || "",
    email: payload.email.trim(),
    phone: payload.phone?.trim() || "",
    message: payload.message?.trim() || "",
    source: payload.source || "contact",
    page: payload.page || (typeof window !== "undefined" ? window.location.href : ""),
    website: "", // honeypot
  };

  const res = await fetch("/lead.php", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(body),
  });

  const json = (await res.json().catch(() => null)) as LeadResult | null;
  if (!res.ok || !json?.ok) {
    throw new Error(json?.error || "Could not send your request. Please try again.");
  }
  return json;
}
