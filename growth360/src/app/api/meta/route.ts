import { prisma } from "@/lib/db";
import { ASSESSMENT_QUESTIONS } from "@/lib/questions";
import { handleApiError, jsonOk } from "@/lib/api";

export async function GET() {
  try {
    const [industries, locations, channels] = await Promise.all([
      prisma.industry.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } }),
      prisma.location.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } }),
      prisma.marketingChannel.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } }),
    ]);
    return jsonOk({
      questions: ASSESSMENT_QUESTIONS,
      industries,
      locations,
      channels,
      bookingFeeInr: Number(process.env.BOOKING_FEE_INR || 99),
    });
  } catch (err) {
    return handleApiError(err);
  }
}
