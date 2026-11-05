import { GlobalRole, PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { PERMISSIONS } from "../src/lib/rbac";

const prisma = new PrismaClient();

const ROLE_SEED: GlobalRole[] = [
  "SUPER_ADMIN",
  "ADMIN",
  "SALES",
  "ACCOUNT_MANAGER",
  "PERFORMANCE_MARKETER",
  "CREATIVE",
  "FINANCE",
  "CLIENT_OWNER",
  "CLIENT_USER",
  "VIEWER",
];

async function main() {
  // Seed all permission pairs from matrix via dynamic import of roleHasPermission
  const { permissionsForRole } = await import("../src/lib/rbac");
  for (const role of ROLE_SEED) {
    for (const permission of permissionsForRole(role)) {
      await prisma.rolePermission.upsert({
        where: { role_permission: { role, permission } },
        create: { role, permission },
        update: {},
      });
    }
  }

  const org = await prisma.organization.upsert({
    where: { slug: "displayavenue" },
    create: {
      slug: "displayavenue",
      name: "DisplayAvenue",
      type: "INTERNAL",
      status: "ACTIVE",
      industry: "Professional Services",
      location: "India",
      website: "https://displayavenue.com",
      healthLabel: "healthy",
      healthScore: 100,
    },
    update: { status: "ACTIVE", type: "INTERNAL" },
  });

  const email = process.env.SUPER_ADMIN_EMAIL || "ceo@displayavenue.com";
  const password = process.env.SUPER_ADMIN_PASSWORD || "DisplayOS@2026";
  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.upsert({
    where: { email },
    create: {
      email,
      name: process.env.SUPER_ADMIN_NAME || "DisplayAvenue CEO",
      passwordHash,
      globalRole: "SUPER_ADMIN",
      isActive: true,
    },
    update: {
      passwordHash,
      globalRole: "SUPER_ADMIN",
      isActive: true,
    },
  });

  await prisma.membership.upsert({
    where: {
      organizationId_userId: { organizationId: org.id, userId: user.id },
    },
    create: {
      organizationId: org.id,
      userId: user.id,
      role: "SUPER_ADMIN",
      status: "ACTIVE",
    },
    update: { role: "SUPER_ADMIN", status: "ACTIVE" },
  });

  await prisma.setting.upsert({
    where: { key: "app" },
    create: {
      key: "app",
      value: {
        name: "DisplayAvenue OS",
        subdomain: "os.displayavenue.com",
        bookingFeeInr: Number(process.env.BOOKING_FEE_INR || 99),
        gstPercent: Number(process.env.GST_PERCENT || 18),
        metaAutomationPolicy: "manual",
      },
    },
    update: {},
  });

  await prisma.job.create({
    data: {
      type: "ping",
      organizationId: org.id,
      payload: { seeded: true },
    },
  });

  // Optional Growth360 catalog (industries/competitors/rules). Call separately if preferred:
  // import { seedGrowth360Catalog } from "../src/lib/growth360/seedCatalog";
  if (process.env.SEED_GROWTH360_CATALOG === "true") {
    const { seedGrowth360Catalog } = await import("../src/lib/growth360/seedCatalog");
    const catalog = await seedGrowth360Catalog(prisma);
    console.log("  Growth360 catalog:", catalog);
  }

  // Quotation platform: company profile, service catalog, demo draft quote
  const { getCompanyProfile, nextQuotationNumber, createSecureToken, nextClientCode } =
    await import("../src/lib/quotations/numbering");
  const { seedQuotationCatalog } = await import("../src/lib/quotations/seedCatalog");
  const { inrToPaise, persistQuotationTotals, defaultTermsText } =
    await import("../src/lib/quotations/engine");

  const company = await getCompanyProfile();
  const quoteCatalog = await seedQuotationCatalog(prisma);
  console.log("  Company profile:", company.brandName, company.gstin);
  console.log("  Quotation catalog:", quoteCatalog);

  const existingClients = await prisma.quoteClient.count();
  if (existingClients === 0) {
    const clientCode = await nextClientCode();
    const demoClient = await prisma.quoteClient.create({
      data: {
        clientCode,
        organizationId: org.id,
        companyName: "Demo Manufacturing Pvt Ltd",
        contactPerson: "Rahul Sharma",
        email: "rahul@demo-mfg.example",
        mobile: "9876543210",
        whatsapp: "9876543210",
        city: "Mumbai",
        state: "Maharashtra",
        country: "India",
      },
    });

    const services = await prisma.quoteCatalogService.findMany({
      take: 3,
      orderBy: { name: "asc" },
      include: { category: true },
    });

    if (services.length >= 3) {
      const quotationNumber = await nextQuotationNumber(
        company.quotationPrefix,
        company.quotationDigits,
      );
      const validUntil = new Date(
        Date.now() + (company.defaultValidityDays || 15) * 24 * 60 * 60 * 1000,
      );

      const draft = await prisma.quotation.create({
        data: {
          organizationId: org.id,
          clientId: demoClient.id,
          quotationNumber,
          secureToken: createSecureToken(),
          status: "DRAFT",
          paymentStatus: "UNPAID",
          validUntil,
          title: "Digital growth package",
          companyState: company.state,
          clientState: demoClient.state,
          advancePercent: company.defaultAdvancePct,
          termsSnapshot: defaultTermsText(),
          createdById: user.id,
          items: {
            create: services.slice(0, 3).map((svc, i) => ({
              sortOrder: i,
              serviceName: svc.name,
              category: svc.category?.name || null,
              description: svc.description,
              quantity: 1,
              unitPricePaise: inrToPaise(svc.defaultPriceInr),
              gstPercent: svc.gstPercent,
              billingType: svc.billingType,
              catalogServiceId: svc.id,
            })),
          },
        },
      });

      await persistQuotationTotals(draft.id);
      await prisma.quotationEvent.create({
        data: {
          quotationId: draft.id,
          type: "quotation.created",
          message: `Seed draft quotation ${quotationNumber}`,
          actorUserId: user.id,
        },
      });
      console.log(`  Demo quotation: ${quotationNumber} (${demoClient.companyName})`);
    } else {
      console.log("  Demo quotation skipped (catalog services missing)");
    }
  }

  console.log("DisplayAvenue OS seed complete");
  console.log(`  Org: ${org.slug}`);
  console.log(`  Super admin: ${email}`);
  console.log(`  Permissions catalog size: ${PERMISSIONS.length}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
