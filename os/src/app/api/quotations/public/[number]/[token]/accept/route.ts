import { z } from "zod";
import { prisma } from "@/lib/db";
import { handleApiError, jsonError, jsonOk } from "@/lib/api";

type Params = { params: Promise<{ number: string; token: string }> };

const schema = z.object({
  agreed: z.literal(true),
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
});

export async function POST(req: Request, { params }: Params) {
  try {
    const { number, token } = await params;
    const quotationNumber = decodeURIComponent(number);
    const body = schema.parse(await req.json());

    const quotation = await prisma.quotation.findUnique({
      where: { quotationNumber },
    });
    if (!quotation || quotation.secureToken !== token) {
      return jsonError("Quotation not found", 404);
    }
    if (["CANCELLED", "REJECTED", "EXPIRED"].includes(quotation.status)) {
      return jsonError("This quotation cannot be accepted", 409);
    }
    if (quotation.validUntil < new Date() && !quotation.acceptedAt) {
      await prisma.quotation.update({
        where: { id: quotation.id },
        data: { status: "EXPIRED", expiredAt: new Date() },
      });
      return jsonError("This quotation has expired", 410);
    }

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      null;
    const userAgent = req.headers.get("user-agent");

    if (quotation.acceptedAt || quotation.status === "ACCEPTED" || quotation.isImmutable) {
      const acceptance = await prisma.quotationAcceptance.findFirst({
        where: { quotationId: quotation.id },
        orderBy: { acceptedAt: "desc" },
      });
      return jsonOk({
        alreadyAccepted: true,
        quotation: await prisma.quotation.findUnique({ where: { id: quotation.id } }),
        acceptance,
      });
    }

    const result = await prisma.$transaction(async (tx) => {
      const acceptance = await tx.quotationAcceptance.create({
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

      const updated = await tx.quotation.update({
        where: { id: quotation.id },
        data: {
          status: "ACCEPTED",
          acceptedAt: new Date(),
          isImmutable: true,
        },
        include: { client: true },
      });

      await tx.quotationEvent.create({
        data: {
          quotationId: quotation.id,
          type: "quotation.accepted",
          message: "Quotation accepted by client",
          ipAddress: ip,
          meta: {
            acceptedName: body.name || null,
            acceptedEmail: body.email || null,
          },
        },
      });

      return { quotation: updated, acceptance };
    });

    return jsonOk({ alreadyAccepted: false, ...result });
  } catch (err) {
    return handleApiError(err);
  }
}
