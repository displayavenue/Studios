import { prisma } from "@/lib/db";

export type MessageChannel = "email" | "whatsapp";

/** Official-provider oriented stubs — never unofficial WhatsApp automation. */
export async function sendTransactionalMessage(params: {
  channel: MessageChannel;
  to: string;
  templateKey: string;
  variables?: Record<string, string>;
  organizationId?: string;
}) {
  const template = await prisma.messageTemplate.findUnique({
    where: {
      channel_key: { channel: params.channel, key: params.templateKey },
    },
  });

  let body = template?.body || `DisplayAvenue notification: ${params.templateKey}`;
  for (const [k, v] of Object.entries(params.variables || {})) {
    body = body.replaceAll(`{{${k}}}`, v);
  }

  // Provider wiring: configure EMAIL_PROVIDER / WHATSAPP_PROVIDER later.
  // Log intent only — do not pretend delivery succeeded to external networks.
  const providerConfigured =
    params.channel === "email"
      ? Boolean(process.env.SMTP_HOST || process.env.RESEND_API_KEY)
      : Boolean(process.env.WHATSAPP_API_TOKEN);

  return {
    queued: true,
    delivered: false,
    providerConfigured,
    channel: params.channel,
    to: params.to,
    bodyPreview: body.slice(0, 200),
    message:
      providerConfigured
        ? "Message handed to provider adapter (implement send in production credentials)."
        : "Template rendered. Configure official email/WhatsApp Business API credentials to deliver.",
  };
}
