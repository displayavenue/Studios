import { z } from "zod";
import { prisma } from "@/lib/db";
import { handleApiError, jsonError, jsonOk } from "@/lib/api";
import { createQuotationPaymentOrder } from "@/lib/quotations/payments";

type Params = { params: Promise<{ number: string; token: string }> };

const schema = z.object({
  purpose: z.enum(["advance", "balance", "full"]).optional(),
  agreed: z.boolean().optional(),
  name: z.string().optional(),
  email: z.string().email().optional(),
});

export async function POST(req: Request, { params }: Params) {
  try {
    const { number, token } = await params;
    const quotationNumber = decodeURIComponent(number);
    const body = schema.parse(await req.json().catch(() => ({})));

    const quotation = await prisma.quotation.findUnique({
      where: { quotationNumber },
      include: { acceptances: { take: 1 } },
    });
    if (!quotation || quotation.secureToken !== token) {
      return jsonError("Quotation not found", 404);
    }
    if (["CANCELLED", "REJECTED", "EXPIRED"].includes(quotation.status)) {
      return jsonError("This quotation cannot accept payments", 409);
    }

    const alreadyAccepted =
      Boolean(quotation.acceptedAt) ||
      quotation.status === "ACCEPTED" ||
      quotation.status === "PARTIALLY_PAID" ||
      quotation.status === "PAID" ||
      quotation.acceptances.length > 0;

    if (!alreadyAccepted) {
      if (!body.agreed) {
        return jsonError("Quotation must be accepted before payment", 400);
      }

      const ip =
        req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        req.headers.get("x-real-ip") ||
        null;
      const userAgent = req.headers.get("user-agent");

      await prisma.$transaction(async (tx) => {
        await tx.quotationAcceptance.create({
          data: {
            quotationId: quotation.id,
            quotationVersion: quotation.version,
            acceptedName: body.name || null,
            acceptedEmail: body.email || null,
            termsVersion: quotation.termsVersion,
            ipAddress: ip,
            userAgent,
          },
        });
        await tx.quotation.update({
          where: { id: quotation.id },
          data: {
            status: "ACCEPTED",
            acceptedAt: new Date(),
            isImmutable: true,
          },
        });
        await tx.quotationEvent.create({
          data: {
            quotationId: quotation.id,
            type: "quotation.accepted",
            message: "Quotation auto-accepted before payment",
            ipAddress: ip,
          },
        });
      });
    }

    const order = await createQuotationPaymentOrder({
      quotationId: quotation.id,
      purpose: body.purpose || "advance",
    });

    return jsonOk(order);
  } catch (err) {
    if (
      err instanceof Error &&
      /cannot accept|expired|already paid|already fully|Invalid payment/i.test(err.message)
    ) {
      return jsonError(err.message, 400);
    }
    return handleApiError(err);
  }
}
