import { prisma } from "@/lib/prisma";
import type { NotificationPayload, NotificationProvider } from "./types";

export type EmailPayload = {
  to: string;
  subject: string;
  html: string;
  text?: string;
};

async function sendResend(email: EmailPayload): Promise<{ id: string; mock: boolean }> {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.info("[email:mock]", email.to, email.subject);
    return { id: `mock_email_${Date.now()}`, mock: true };
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM || "JyotishKundali <noreply@jyotishkundali.com>",
      to: [email.to],
      subject: email.subject,
      html: email.html,
      text: email.text,
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    console.error("[email:resend:fail]", body);
    return { id: `fallback_${Date.now()}`, mock: true };
  }
  const data = (await res.json()) as { id?: string };
  return { id: data.id || `resend_${Date.now()}`, mock: false };
}

export class DbNotificationProvider implements NotificationProvider {
  async send(payload: NotificationPayload) {
    const row = await prisma.notification.create({
      data: {
        userId: payload.userId,
        type: payload.type,
        title: payload.title,
        body: payload.body,
        link: payload.link,
      },
    });
    return { id: row.id, mock: false };
  }
}

export async function sendEmail(email: EmailPayload) {
  return sendResend(email);
}

export async function notifyUser(payload: NotificationPayload & { email?: string; emailHtml?: string }) {
  const provider = new DbNotificationProvider();
  const notice = await provider.send(payload);
  if (payload.email && payload.emailHtml) {
    await sendEmail({
      to: payload.email,
      subject: payload.title,
      html: payload.emailHtml,
      text: payload.body,
    });
  }
  return notice;
}

export function createNotificationProvider(): NotificationProvider {
  return new DbNotificationProvider();
}
