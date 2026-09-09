import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { Prisma } from "@/generated/prisma/client";
import { Role } from "@/generated/prisma/enums";
import {
  MARKETPLACE_ASTROLOGERS,
  type MarketplaceAstrologer,
} from "@/content/marketplace-astrologers";

export type PublicExpert = MarketplaceAstrologer & {
  id?: string;
  source: "live" | "sample";
  isVerified?: boolean;
};

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map(String).filter(Boolean);
}

function initialsFromName(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() || "")
    .join("");
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}

export function mapExpertRow(row: {
  id: string;
  slug: string;
  displayName: string;
  bio: string | null;
  specialties: unknown;
  languages: unknown;
  categories: unknown;
  experienceYrs: number | null;
  rating: Prisma.Decimal | number | null;
  reviewCount: number;
  pricePerMin: Prisma.Decimal | number | null;
  badge: string | null;
  accent: string | null;
  initials: string | null;
  isOnline: boolean;
  isSample: boolean;
  isVerified: boolean;
}): PublicExpert {
  const specialties = asStringArray(row.specialties);
  const languages = asStringArray(row.languages);
  const categories = asStringArray(row.categories) as MarketplaceAstrologer["categories"];
  const badge = (row.badge as MarketplaceAstrologer["badge"]) || (row.isVerified ? "Verified" : "Rising Star");
  return {
    id: row.id,
    slug: row.slug,
    name: row.displayName,
    badge,
    specialties: specialties.length ? specialties : ["Vedic"],
    languages: languages.length ? languages : ["English", "Hindi"],
    yearsExp: row.experienceYrs ?? 1,
    rating: Number(row.rating ?? 5),
    reviewsLabel: row.isSample ? "sample" : `${row.reviewCount || 0}`,
    pricePerMinInr: Number(row.pricePerMin ?? 29),
    online: row.isOnline,
    bio: row.bio || "",
    categories: categories.length ? categories : ["vedic"],
    initials: row.initials || initialsFromName(row.displayName),
    accent: row.accent || "#f59e0b",
    source: row.isSample ? "sample" : "live",
    isVerified: row.isVerified,
  };
}

export async function listPublicExperts(opts?: {
  category?: string | null;
  q?: string | null;
  onlineOnly?: boolean;
}): Promise<PublicExpert[]> {
  const rows = await prisma.expert.findMany({
    where: { isActive: true, OR: [{ isVerified: true }, { isSample: true }] },
    orderBy: [{ isOnline: "desc" }, { isSample: "asc" }, { rating: "desc" }],
  });

  let list = rows.map(mapExpertRow);
  if (!list.length) {
    list = MARKETPLACE_ASTROLOGERS.map((a) => ({ ...a, source: "sample" as const }));
  }

  const q = (opts?.q || "").trim().toLowerCase();
  return list.filter((a) => {
    if (opts?.onlineOnly && !a.online) return false;
    if (opts?.category && opts.category !== "all") {
      if (!a.categories.includes(opts.category as MarketplaceAstrologer["categories"][number])) {
        return false;
      }
    }
    if (!q) return true;
    return (
      a.name.toLowerCase().includes(q) ||
      a.specialties.some((s) => s.toLowerCase().includes(q)) ||
      a.languages.some((l) => l.toLowerCase().includes(q))
    );
  });
}

export async function getPublicExpertBySlug(slug: string): Promise<PublicExpert | null> {
  const row = await prisma.expert.findUnique({ where: { slug } });
  if (row && row.isActive && (row.isVerified || row.isSample)) {
    return mapExpertRow(row);
  }
  const sample = MARKETPLACE_ASTROLOGERS.find((a) => a.slug === slug);
  return sample ? { ...sample, source: "sample" } : null;
}

/** Seed marketplace sample experts into Expert table (idempotent). */
export async function seedSampleExperts() {
  const passwordHash = await hashPassword("ExpertDemo!234");
  let created = 0;
  let updated = 0;

  for (const a of MARKETPLACE_ASTROLOGERS) {
    const email = `expert.${a.slug}@jyotishkundali.com`;
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          passwordHash,
          role: Role.EXPERT,
          firstName: a.name.split(" ")[0],
          lastName: a.name.split(" ").slice(1).join(" ") || null,
          emailVerified: true,
        },
      });
    } else if (user.role !== Role.EXPERT && user.role !== Role.ADMIN && user.role !== Role.SUPER_ADMIN) {
      await prisma.user.update({ where: { id: user.id }, data: { role: Role.EXPERT } });
    }

    const existing = await prisma.expert.findUnique({ where: { userId: user.id } });
    const data = {
      slug: a.slug,
      displayName: a.name,
      bio: a.bio,
      specialties: a.specialties,
      languages: a.languages,
      categories: a.categories,
      experienceYrs: a.yearsExp,
      rating: a.rating,
      reviewCount: 0,
      pricePerMin: a.pricePerMinInr,
      badge: a.badge,
      accent: a.accent,
      initials: a.initials,
      isOnline: a.online,
      isSample: true,
      isActive: true,
      isVerified: true,
    };

    if (existing) {
      await prisma.expert.update({ where: { id: existing.id }, data });
      updated += 1;
    } else {
      const bySlug = await prisma.expert.findUnique({ where: { slug: a.slug } });
      if (bySlug) {
        await prisma.expert.update({ where: { id: bySlug.id }, data: { ...data, userId: user.id } });
        updated += 1;
      } else {
        await prisma.expert.create({ data: { userId: user.id, ...data } });
        created += 1;
      }
    }
  }

  return { created, updated, total: MARKETPLACE_ASTROLOGERS.length };
}

export async function applyAsExpert(input: {
  userId: string;
  displayName: string;
  bio?: string;
  specialties: string[];
  languages: string[];
  categories?: string[];
  experienceYrs?: number;
  pricePerMinInr?: number;
}) {
  const existing = await prisma.expert.findUnique({ where: { userId: input.userId } });
  if (existing) throw new Error("ALREADY_APPLIED");

  const base = slugify(input.displayName) || `expert-${input.userId.slice(-6)}`;
  let slug = base;
  let n = 1;
  while (await prisma.expert.findUnique({ where: { slug } })) {
    slug = `${base}-${n++}`;
  }

  const user = await prisma.user.update({
    where: { id: input.userId },
    data: { role: Role.EXPERT },
  });

  const expert = await prisma.expert.create({
    data: {
      userId: user.id,
      slug,
      displayName: input.displayName.trim(),
      bio: input.bio?.trim() || null,
      specialties: input.specialties,
      languages: input.languages,
      categories: input.categories || ["vedic"],
      experienceYrs: input.experienceYrs ?? 1,
      pricePerMin: input.pricePerMinInr ?? 29,
      badge: "Rising Star",
      accent: "#0ea5e9",
      initials: initialsFromName(input.displayName),
      isOnline: false,
      isSample: false,
      isActive: true,
      isVerified: false,
      rating: 5,
      reviewCount: 0,
    },
  });

  return mapExpertRow(expert);
}

export async function adminListExperts() {
  return prisma.expert.findMany({
    include: { user: { select: { email: true, firstName: true, lastName: true } } },
    orderBy: [{ isVerified: "asc" }, { createdAt: "desc" }],
  });
}

export async function adminUpdateExpert(
  id: string,
  patch: {
    isVerified?: boolean;
    isActive?: boolean;
    isOnline?: boolean;
    pricePerMin?: number;
    badge?: string;
  },
) {
  const data: Prisma.ExpertUpdateInput = {};
  if (typeof patch.isVerified === "boolean") data.isVerified = patch.isVerified;
  if (typeof patch.isActive === "boolean") data.isActive = patch.isActive;
  if (typeof patch.isOnline === "boolean") data.isOnline = patch.isOnline;
  if (typeof patch.pricePerMin === "number") data.pricePerMin = patch.pricePerMin;
  if (typeof patch.badge === "string") data.badge = patch.badge;
  return prisma.expert.update({ where: { id }, data });
}

export async function startConsultationRecord(input: {
  userId: string;
  expertSlug: string;
  mode: "chat" | "call";
}) {
  const expert = await prisma.expert.findUnique({ where: { slug: input.expertSlug } });
  if (!expert) return null;
  return prisma.consultation.create({
    data: {
      userId: input.userId,
      expertId: expert.id,
      status: "IN_PROGRESS",
      scheduledAt: new Date(),
      durationMin: 30,
      amount: 0,
      notes: `Demo ${input.mode} session`,
      startedAt: new Date(),
    },
  });
}
