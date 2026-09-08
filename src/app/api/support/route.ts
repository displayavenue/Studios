import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SupportTicketPriority } from "@/generated/prisma/enums";
import { sendEmail } from "@/providers/notifications";

export async function POST(req: NextRequest) {
  const session = await getSession();
  const body = await req.json();
  const email = String(body.email || session?.email || "").trim().toLowerCase();
  const subject = String(body.subject || "Support request").trim();
  const message = String(body.message || "").trim();

  if (!email.includes("@") || message.length < 10) {
    return NextResponse.json({ error: "INVALID_REQUEST" }, { status: 400 });
  }

  let ticketId: string | null = null;
  if (session) {
    const ticket = await prisma.supportTicket.create({
      data: {
        userId: session.id,
        subject,
        description: `${message}\n\nContact email: ${email}\nOrder ID: ${body.orderId || "n/a"}`,
        priority: SupportTicketPriority.MEDIUM,
        orderId: body.orderId || null,
      },
    });
    ticketId = ticket.id;
  }

  await sendEmail({
    to: process.env.SUPPORT_EMAIL || "hello@jyotishkundali.com",
    subject: `[Support] ${subject}`,
    html: `<p>From: ${email}</p><p>${message}</p><p>Ticket: ${ticketId || "email-only"}</p>`,
    text: message,
  });

  await sendEmail({
    to: email,
    subject: "We received your JyotishKundali support request",
    html: `<p>Thanks for writing in. Our team typically replies within one business day.</p><p>Subject: ${subject}</p>`,
    text: "We received your support request.",
  });

  return NextResponse.json({ ok: true, ticketId });
}
