/**
 * Seed data SHAPE only — no fake production catalog, doctors, or reviews.
 * Creates RBAC roles/permissions and structural taxonomy placeholders for local/dev.
 *
 * Run: pnpm --filter @homeopathypharma/database seed
 */

import { PrismaClient, PublishStatus, MedicalReviewStatus } from "@prisma/client";

const prisma = new PrismaClient();

const ROLES = [
  { code: "CUSTOMER", name: "Customer" },
  { code: "DOCTOR", name: "Doctor" },
  { code: "ADMIN", name: "Admin" },
  { code: "CONTENT_EDITOR", name: "Content Editor" },
  { code: "MEDICAL_REVIEWER", name: "Medical Reviewer" },
  { code: "SUPPORT", name: "Support" },
  { code: "FINANCE", name: "Finance" },
] as const;

const PERMISSIONS = [
  "catalog.read",
  "catalog.write",
  "catalog.publish",
  "doctor.verify",
  "content.write",
  "content.publish",
  "content.medical_review",
  "order.read",
  "order.refund",
  "shipment.manage",
  "payout.approve",
  "review.moderate",
  "coupon.manage",
  "audit.read",
  "user.manage",
  "seo.manage",
] as const;

async function main() {
  for (const perm of PERMISSIONS) {
    await prisma.permission.upsert({
      where: { code: perm },
      update: { name: perm },
      create: { code: perm, name: perm, description: `Permission ${perm}` },
    });
  }

  for (const role of ROLES) {
    await prisma.role.upsert({
      where: { code: role.code },
      update: { name: role.name },
      create: { code: role.code, name: role.name },
    });
  }

  const admin = await prisma.role.findUniqueOrThrow({ where: { code: "ADMIN" } });
  const allPerms = await prisma.permission.findMany();
  for (const perm of allPerms) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: { roleId: admin.id, permissionId: perm.id },
      },
      update: {},
      create: { roleId: admin.id, permissionId: perm.id },
    });
  }

  // Structural taxonomy shells (unpublished) — content teams fill later under review.
  const bodySystems = [
    { name: "Cardiovascular System", slug: "cardiovascular-system" },
    { name: "Respiratory System", slug: "respiratory-system" },
    { name: "Digestive System", slug: "digestive-system" },
    { name: "Nervous System", slug: "nervous-system" },
    { name: "Musculoskeletal System", slug: "musculoskeletal-system" },
    { name: "Immune System", slug: "immune-system" },
    { name: "Endocrine System", slug: "endocrine-system" },
    { name: "Integumentary System", slug: "integumentary-system" },
  ];

  for (const system of bodySystems) {
    await prisma.bodySystem.upsert({
      where: { slug: system.slug },
      update: {},
      create: {
        ...system,
        summary:
          "Educational overview placeholder. Not medical advice. Requires medical review before publish.",
        status: PublishStatus.DRAFT,
      },
    });
  }

  for (const species of [
    { name: "Dogs", slug: "dogs" },
    { name: "Cats", slug: "cats" },
  ]) {
    await prisma.petSpecies.upsert({
      where: { slug: species.slug },
      update: {},
      create: {
        ...species,
        summary:
          "Pet health educational section placeholder. Veterinary guidance required before publish.",
        status: PublishStatus.DRAFT,
      },
    });
  }

  for (const group of [
    { name: "Pediatric Care", slug: "pediatric-care" },
    { name: "Adult Care", slug: "adult-care" },
    { name: "Senior Care", slug: "senior-care" },
  ]) {
    await prisma.ageGroup.upsert({
      where: { slug: group.slug },
      update: {},
      create: {
        ...group,
        summary: "Age-group educational taxonomy placeholder pending medical review.",
        status: PublishStatus.DRAFT,
      },
    });
  }

  await prisma.warehouse.upsert({
    where: { code: "IN-BLR-01" },
    update: {},
    create: {
      code: "IN-BLR-01",
      name: "Bengaluru Primary Warehouse",
      line1: "Warehouse address TBD",
      city: "Bengaluru",
      state: "KA",
      postalCode: "560001",
      countryCode: "IN",
      status: "ACTIVE",
    },
  });

  // Example unpublished article shape with medical review pending — not public content.
  await prisma.knowledgeArticle.upsert({
    where: { slug: "content-governance-template" },
    update: {},
    create: {
      slug: "content-governance-template",
      title: "Content governance template",
      excerpt: "Internal template demonstrating review fields.",
      body: "This is an internal draft template. It must not be published without medical and editorial review. It makes no therapeutic claims.",
      status: PublishStatus.DRAFT,
      medicalReviewStatus: MedicalReviewStatus.PENDING,
    },
  });

  console.log("Seed complete: roles, permissions, taxonomy shells, warehouse shape.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
