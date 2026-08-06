export type InquiryType = "contact" | "book-now" | "newsletter";

export type SubmitInquiryResult = {
  ok: boolean;
  message?: string;
  error?: string;
  mail?: boolean;
};

export async function submitInquiry(
  type: InquiryType,
  fields: Record<string, string>,
): Promise<SubmitInquiryResult> {
  const res = await fetch("/send-inquiry.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type,
      ...fields,
      company_website: "",
    }),
  });

  const data = (await res.json().catch(() => ({}))) as SubmitInquiryResult;

  if (!res.ok || data.ok === false) {
    throw new Error(data.error || "Could not send your message. Please call or WhatsApp us.");
  }

  return data;
}
