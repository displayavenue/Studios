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
