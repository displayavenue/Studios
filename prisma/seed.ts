import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import {
  CATEGORY_SEEDS,
  MEMBERSHIP_PRODUCT,
  PRODUCT_SEEDS,
  SYSTEM_SETTINGS,
} from "./seed-data";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding JyotishKundali...");

  // Categories
  const categoryMap = new Map<string, string>();
  for (const cat of CATEGORY_SEEDS) {
    const row = await prisma.category.upsert({
      where: { slug: cat.slug },
      create: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        sortOrder: cat.sortOrder,
        isActive: true,
      },
      update: {
        name: cat.name,
        description: cat.description,
        sortOrder: cat.sortOrder,
        isActive: true,
      },
    });
    categoryMap.set(cat.slug, row.id);
  }
  console.log(`  Categories: ${CATEGORY_SEEDS.length}`);

  // Report products (78 × ₹499)
  let productCount = 0;
  for (const p of PRODUCT_SEEDS) {
    const categoryId = categoryMap.get(p.categorySlug);
    if (!categoryId) {
      throw new Error(`Unknown category slug: ${p.categorySlug}`);
    }

    await prisma.product.upsert({
      where: { slug: p.slug },
      create: {
        categoryId,
        name: p.name,
        slug: p.slug,
        shortDescription: p.shortDescription,
        description: p.shortDescription,
        price: 499,
        compareAtPrice: 699,
        type: "REPORT",
        isMembership: false,
        whatsIncluded: ["PDF report", "Instant digital delivery", "English & Hindi UI"],
        faqs: [
          { q: "How long does delivery take?", a: "Reports are generated digitally and delivered within minutes." },
          { q: "What birth details are needed?", a: "Date, time, and place of birth. Time can be marked unknown if needed." },
        ],
        languages: ["en", "hi"],
        deliveryNote: "PDF delivered within minutes after payment.",
        status: "PUBLISHED",
        seoTitle: `${p.name} | JyotishKundali`,
        seoDescription: p.shortDescription,
        sortOrder: p.sortOrder,
        reportTemplateKey: p.reportTemplateKey,
        isActive: true,
      },
      update: {
        categoryId,
        name: p.name,
        shortDescription: p.shortDescription,
        description: p.shortDescription,
        price: 499,
        type: "REPORT",
        isMembership: false,
        status: "PUBLISHED",
        seoTitle: `${p.name} | JyotishKundali`,
        seoDescription: p.shortDescription,
        sortOrder: p.sortOrder,
        reportTemplateKey: p.reportTemplateKey,
        isActive: true,
      },
    });
    productCount++;
  }
  console.log(`  Report products: ${productCount}`);

  // Membership product (₹2999/year)
  const membershipCategoryId = categoryMap.get(MEMBERSHIP_PRODUCT.categorySlug)!;
  await prisma.product.upsert({
    where: { slug: MEMBERSHIP_PRODUCT.slug },
    create: {
      categoryId: membershipCategoryId,
      name: MEMBERSHIP_PRODUCT.name,
      slug: MEMBERSHIP_PRODUCT.slug,
      shortDescription: MEMBERSHIP_PRODUCT.shortDescription,
      description: MEMBERSHIP_PRODUCT.description,
      price: 0,
      compareAtPrice: null,
      type: "MEMBERSHIP",
      isMembership: true,
      membershipPriceYearly: MEMBERSHIP_PRODUCT.membershipPriceYearly,
      whatsIncluded: [
        "Access to self-discovery report catalog",
        "Daily horoscope & moon sign alerts",
        "Member pricing on select reports",
        "Priority PDF generation",
      ],
      faqs: [
        { q: "How long is the membership?", a: "One year from the date of purchase." },
        { q: "Can I cancel?", a: "Yes — access continues until the end of the paid period." },
      ],
      languages: ["en", "hi"],
      deliveryNote: "Membership activates immediately after payment.",
      status: "PUBLISHED",
      seoTitle: `${MEMBERSHIP_PRODUCT.name} | JyotishKundali`,
      seoDescription: MEMBERSHIP_PRODUCT.shortDescription,
      sortOrder: MEMBERSHIP_PRODUCT.sortOrder,
      reportTemplateKey: MEMBERSHIP_PRODUCT.reportTemplateKey,
      isActive: true,
    },
    update: {
      name: MEMBERSHIP_PRODUCT.name,
      shortDescription: MEMBERSHIP_PRODUCT.shortDescription,
      description: MEMBERSHIP_PRODUCT.description,
      type: "MEMBERSHIP",
      isMembership: true,
      membershipPriceYearly: MEMBERSHIP_PRODUCT.membershipPriceYearly,
      status: "PUBLISHED",
      isActive: true,
    },
  });
  console.log("  Membership product: 1");

  // Admin user
  const adminHash = await bcrypt.hash("JyotishAdmin!234", 12);
  await prisma.user.upsert({
    where: { email: "admin@jyotishkundali.com" },
    create: {
      email: "admin@jyotishkundali.com",
      passwordHash: adminHash,
      role: "SUPER_ADMIN",
      emailVerified: true,
      firstName: "Jyotish",
      lastName: "Admin",
    },
    update: {
      passwordHash: adminHash,
      role: "SUPER_ADMIN",
      emailVerified: true,
    },
  });

  // Demo customer
  const demoHash = await bcrypt.hash("DemoUser!234", 12);
  await prisma.user.upsert({
    where: { email: "demo@jyotishkundali.com" },
    create: {
      email: "demo@jyotishkundali.com",
      passwordHash: demoHash,
      role: "CUSTOMER",
      emailVerified: true,
      firstName: "Demo",
      lastName: "User",
      phone: "+919999999999",
    },
    update: {
      passwordHash: demoHash,
      role: "CUSTOMER",
      emailVerified: true,
    },
  });
  console.log("  Users: admin + demo customer");

  // System settings
  for (const setting of SYSTEM_SETTINGS) {
    await prisma.systemSetting.upsert({
      where: { key: setting.key },
      create: {
        key: setting.key,
        value: setting.value,
        group: setting.group,
        label: setting.label,
      },
      update: {
        value: setting.value,
        group: setting.group,
        label: setting.label,
      },
    });
  }
  console.log(`  System settings: ${SYSTEM_SETTINGS.length}`);

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
