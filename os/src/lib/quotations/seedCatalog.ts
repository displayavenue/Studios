import { PrismaClient } from "@prisma/client";
import { defaultTermsText } from "./engine";

type Db = PrismaClient;

const CATEGORIES: { name: string; sortOrder: number; services: {
  name: string;
  description: string;
  defaultPriceInr: number;
  billingType: "one_time" | "recurring";
  monthlyPriceInr?: number;
  gstPercent?: number;
}[] }[] = [
  {
    name: "Digital Marketing",
    sortOrder: 1,
    services: [
      {
        name: "Google Ads Management",
        description: "Monthly Google Ads setup, optimisation and reporting",
        defaultPriceInr: 25000,
        billingType: "recurring",
        monthlyPriceInr: 25000,
      },
      {
        name: "Meta Ads Management",
        description: "Facebook & Instagram ads management",
        defaultPriceInr: 20000,
        billingType: "recurring",
        monthlyPriceInr: 20000,
      },
      {
        name: "SEO Retainer",
        description: "On-page, technical and content SEO monthly retainer",
        defaultPriceInr: 30000,
        billingType: "recurring",
        monthlyPriceInr: 30000,
      },
    ],
  },
  {
    name: "Web & Creative",
    sortOrder: 2,
    services: [
      {
        name: "Business Website Design",
        description: "Responsive marketing website (up to 8 pages)",
        defaultPriceInr: 75000,
        billingType: "one_time",
      },
      {
        name: "Landing Page",
        description: "High-conversion campaign landing page",
        defaultPriceInr: 25000,
        billingType: "one_time",
      },
      {
        name: "Brand Creatives Pack",
        description: "Social creatives pack (10 designs)",
        defaultPriceInr: 15000,
        billingType: "one_time",
      },
    ],
  },
  {
    name: "Growth & Strategy",
    sortOrder: 3,
    services: [
      {
        name: "Growth360 Assessment",
        description: "Competitive and channel growth assessment",
        defaultPriceInr: 9999,
        billingType: "one_time",
      },
      {
        name: "Marketing Strategy Workshop",
        description: "Half-day strategy workshop with action plan",
        defaultPriceInr: 40000,
        billingType: "one_time",
      },
      {
        name: "CRM Setup & Automation",
        description: "Lead CRM setup with basic automation flows",
        defaultPriceInr: 35000,
        billingType: "one_time",
      },
    ],
  },
];

/**
 * Seed quotation catalog categories/services and a default TermsTemplate when empty.
 * Safe to call repeatedly from prisma/seed.ts.
 */
export async function seedQuotationCatalog(db?: Db) {
  const prisma = db || (await import("../db")).prisma;

  let categoriesCreated = 0;
  let servicesCreated = 0;

  const existingCats = await prisma.quoteServiceCategory.count();
  if (existingCats === 0) {
    for (const cat of CATEGORIES) {
      const created = await prisma.quoteServiceCategory.create({
        data: {
          name: cat.name,
          sortOrder: cat.sortOrder,
          isActive: true,
          services: {
            create: cat.services.map((s) => ({
              name: s.name,
              description: s.description,
              defaultPriceInr: s.defaultPriceInr,
              gstPercent: s.gstPercent ?? 18,
              billingType: s.billingType,
              monthlyPriceInr: s.monthlyPriceInr ?? null,
              isActive: true,
            })),
          },
        },
        include: { services: true },
      });
      categoriesCreated += 1;
      servicesCreated += created.services.length;
    }
  }

  const termsCount = await prisma.termsTemplate.count();
  let termsCreated = 0;
  if (termsCount === 0) {
    await prisma.termsTemplate.create({
      data: {
        name: "Standard Terms",
        body: defaultTermsText(),
        isDefault: true,
        isActive: true,
      },
    });
    termsCreated = 1;
  }

  return { categoriesCreated, servicesCreated, termsCreated };
}
