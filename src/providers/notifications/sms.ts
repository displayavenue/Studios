import { useMockProviders } from "@/config/site";

export async function sendSmsOtp(input: { to: string; message: string }) {
  if (useMockProviders() || !process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
    console.info("[sms:mock]", input.to, input.message);
    return { id: `mock_sms_${Date.now()}`, mock: true as const };
  }

  // Twilio SMS when credentials are present
  const sid = process.env.TWILIO_ACCOUNT_SID!;
  const token = process.env.TWILIO_AUTH_TOKEN!;
  const from = process.env.TWILIO_SMS_FROM || process.env.TWILIO_WHATSAPP_FROM;
  if (!from) {
    console.info("[sms:fallback-mock]", input.to, input.message);
    return { id: `mock_sms_${Date.now()}`, mock: true as const };
  }

  const auth = Buffer.from(`${sid}:${token}`).toString("base64");
  const body = new URLSearchParams({ To: input.to, From: from.replace("whatsapp:", ""), Body: input.message });
  const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });
  if (!res.ok) {
    const text = await res.text();
    console.error("[sms:twilio:fail]", text);
    return { id: `fallback_sms_${Date.now()}`, mock: true as const };
  }
  const data = (await res.json()) as { sid?: string };
  return { id: data.sid || `twilio_${Date.now()}`, mock: false as const };
}
