/** Build WhatsApp deep links with prefilled messages */
export function whatsappPrefill(
  baseHref: string,
  message: string,
): string {
  const url = new URL(baseHref);
  // wa.me links use /number — text goes in query
  url.searchParams.set("text", message);
  return url.toString();
}

export function serviceWhatsAppMessage(serviceTitle: string, city?: string) {
  return `Hi DisplayAvenue, I’m interested in ${serviceTitle}${city ? ` in ${city}` : ""}. My preferred date is ____. Please share availability and a quote.`;
}

export function bookingWhatsAppMessage(details: {
  name?: string;
  service?: string;
  city?: string;
  date?: string;
}) {
  const parts = [
    "Hi DisplayAvenue, I’d like to book a consult.",
    details.name ? `Name: ${details.name}` : null,
    details.service ? `Service: ${details.service}` : null,
    details.city ? `City: ${details.city}` : null,
    details.date ? `Date: ${details.date}` : null,
  ].filter(Boolean);
  return parts.join("\n");
}
