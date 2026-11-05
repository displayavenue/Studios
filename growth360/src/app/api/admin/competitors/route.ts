import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { handleApiError, jsonOk } from "@/lib/api";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  try {
    await requireAdmin(req);
    const competitors = await prisma.competitor.findMany({
      include: { scores: true, industry: true, location: true },
      orderBy: { name: "asc" },
    });
    return jsonOk(competitors);
  } catch (err) {
    return handleApiError(err);
  }
}

const upsertSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2),
  website: z.string().optional(),
  industryId: z.string().optional(),
  locationId: z.string().optional(),
  city: z.string().optional(),
  description: z.string().optional(),
  digitalScore: z.number(),
  marketingScore: z.number(),
  seoScore: z.number(),
  socialScore: z.number(),
  isActive: z.boolean().optional(),
});

export async function POST(req: Request) {
  try {
    const session = await requireAdmin(req);
    const body = upsertSchema.parse(await req.json());
    const overall =
      Math.round(((body.digitalScore + body.marketingScore + body.seoScore + body.socialScore) / 4) * 10) /
      10;

    const competitor = body.id
      ? await prisma.competitor.update({
          where: { id: body.id },
          data: {
            name: body.name,
            website: body.website,
            industryId: body.industryId,
            locationId: body.locationId,
            city: body.city,
            description: body.description,
            isActive: body.isActive ?? true,
            scores: {
              upsert: {
                create: {
                  digitalScore: body.digitalScore,
                  marketingScore: body.marketingScore,
                  seoScore: body.seoScore,
                  socialScore: body.socialScore,
                  overallScore: overall,
                },
                update: {
                  digitalScore: body.digitalScore,
                  marketingScore: body.marketingScore,
                  seoScore: body.seoScore,
                  socialScore: body.socialScore,
                  overallScore: overall,
                },
              },
            },
          },
        })
      : await prisma.competitor.create({
          data: {
            name: body.name,
            website: body.website,
            industryId: body.industryId,
            locationId: body.locationId,
            city: body.city,
            description: body.description,
            scores: {
              create: {
                digitalScore: body.digitalScore,
                marketingScore: body.marketingScore,
                seoScore: body.seoScore,
                socialScore: body.socialScore,
                overallScore: overall,
              },
            },
          },
        });

    await prisma.auditLog.create({
      data: {
        adminId: session.adminId,
        action: body.id ? "competitor.update" : "competitor.create",
        entity: "competitor",
        entityId: competitor.id,
      },
    });

    return jsonOk(competitor);
  } catch (err) {
    return handleApiError(err);
  }
}
