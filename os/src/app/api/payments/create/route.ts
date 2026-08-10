import { z } from "zod";
import { prisma } from "@/lib/db";
import { handleApiError, jsonError, jsonOk } from "@/lib/api";
import { getDisplayAvenueOrg } from "@/lib/org";
import {
  createStrategyCallOrder,
  createProposalOrder,
  getBookingFeeInr,
} from "@/lib/payments/razorpay";

const schema = z.object({
  purpose: z.enum(["strategy_call", "proposal"]),
  organizationId: z.string().optional(),
  assessmentId: z.string().optional(),
  proposalId: z.string().optional(),
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  whatsapp: z.string().optional(),
  amountInr: z.number().positive().optional(),
});

export async function POST(req: Request) {
  try {
    const body = schema.parse(await req.json());
    const orgId = body.organizationId || (await getDisplayAvenueOrg()).id;

    if (body.purpose === "strategy_call") {
      if (!body.name || !body.email || !body.whatsapp) {
        return jsonError("name, email, and whatsapp are required for strategy_call", 400);
      }
      const order = await createStrategyCallOrder({
        organizationId: orgId,
        assessmentId: body.assessmentId,
        name: body.name,
        email: body.email,
        whatsapp: body.whatsapp,
      });
      return jsonOk({
        ...order,
        purpose: "strategy_call",
        bookingFeeInr: getBookingFeeInr(),
      });
    }

    if (!body.proposalId) return jsonError("proposalId required for proposal payment", 400);
    const proposal = await prisma.proposal.findUnique({ where: { id: body.proposalId } });
    if (!proposal) return jsonError("Proposal not found", 404);

    const amountInr = body.amountInr ?? proposal.totalInr;
    if (!amountInr || amountInr <= 0) {
      return jsonError("Proposal has no payable amount", 400);
    }

    const order = await createProposalOrder({
      organizationId: proposal.organizationId,
      proposalId: proposal.id,
      amountInr,
      metadata: { name: body.name, email: body.email },
    });

    return jsonOk({ ...order, purpose: "proposal", proposalId: proposal.id });
  } catch (err) {
    return handleApiError(err);
  }
}
