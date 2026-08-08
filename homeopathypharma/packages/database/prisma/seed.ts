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
  { code: "SUPER_ADMIN", name: "Super Admin" },
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
  const superAdmin = await prisma.role.findUniqueOrThrow({ where: { code: "SUPER_ADMIN" } });
  const allPerms = await prisma.permission.findMany();
  for (const perm of allPerms) {
    for (const role of [admin, superAdmin]) {
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: { roleId: role.id, permissionId: perm.id },
        },
        update: {},
        create: { roleId: role.id, permissionId: perm.id },
      });
    }
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

  // Store category roots — separate from health graph entities
  const categoryRoots: { name: string; slug: string; treeKind: string; children: string[] }[] = [
    {
      treeKind: "MEDICINES",
      name: "Medicines",
      slug: "medicines",
      children: [
        "single-remedies",
        "combination-remedies",
        "mother-tinctures",
        "dilutions",
        "biochemic",
        "tablets",
        "globules",
        "drops",
        "ointments",
        "creams",
      ],
    },
    {
      treeKind: "WELLNESS",
      name: "Wellness & Health Products",
      slug: "wellness",
      children: ["personal-care", "skin-care", "hair-care", "oral-care", "lifestyle"],
    },
    {
      treeKind: "PET_CARE",
      name: "Pet Care",
      slug: "pet-care-products",
      children: ["dog-products", "cat-products", "bird-products"],
    },
    {
      treeKind: "BUNDLES",
      name: "Bundles",
      slug: "bundle-categories",
      children: ["family-bundles", "seasonal-bundles", "pet-bundles", "doctor-curated-bundles"],
    },
    {
      treeKind: "BOOKS",
      name: "Books & Education",
      slug: "books",
      children: ["materia-medica", "pharmacopoeia", "clinical-guides", "reference-books"],
    },
  ];

  for (const root of categoryRoots) {
    const parent = await prisma.category.upsert({
      where: { slug: root.slug },
      update: { treeKind: root.treeKind, name: root.name },
      create: {
        name: root.name,
        slug: root.slug,
        treeKind: root.treeKind,
        description: "Store taxonomy root — admin-managed. Not a medical claim taxonomy.",
        status: PublishStatus.DRAFT,
      },
    });
    for (const childSlug of root.children) {
      await prisma.category.upsert({
        where: { slug: childSlug },
        update: { parentId: parent.id, treeKind: root.treeKind },
        create: {
          name: childSlug
            .split("-")
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" "),
          slug: childSlug,
          parentId: parent.id,
          treeKind: root.treeKind,
          status: PublishStatus.DRAFT,
        },
      });
    }
  }

  // Remedy source classifications (controlled vocabulary)
  for (const src of [
    { code: "PLANT", name: "Plant Source" },
    { code: "MINERAL", name: "Mineral Source" },
    { code: "CHEMICAL", name: "Chemical Source" },
    { code: "ANIMAL", name: "Animal Source" },
    { code: "NOSODE", name: "Nosode" },
    { code: "SARCODE", name: "Sarcodes" },
    { code: "IMPONDERABILIA", name: "Imponderabilia / other recognized" },
    { code: "COMBINATION", name: "Combination" },
    { code: "OTHER", name: "Other regulated source classifications" },
  ]) {
    await prisma.remedySourceType.upsert({
      where: { code: src.code },
      update: { name: src.name },
      create: { ...src, status: "ACTIVE" },
    });
  }

  // Potency systems + a small offered set (do NOT seed every possible potency)
  const systems = [
    { code: "DECIMAL", name: "Decimal (X)" },
    { code: "CENTESIMAL", name: "Centesimal (C)" },
    { code: "LM", name: "LM / Q" },
  ];
  for (const s of systems) {
    await prisma.potencySystem.upsert({
      where: { code: s.code },
      update: { name: s.name },
      create: { ...s, status: "ACTIVE" },
    });
  }
  const cent = await prisma.potencySystem.findUniqueOrThrow({ where: { code: "CENTESIMAL" } });
  const dec = await prisma.potencySystem.findUniqueOrThrow({ where: { code: "DECIMAL" } });
  for (const [systemId, codes] of [
    [cent.id, ["30C", "200C", "1M"]],
    [dec.id, ["6X", "12X", "30X"]],
  ] as const) {
    for (const [i, code] of codes.entries()) {
      await prisma.potency.upsert({
        where: { systemId_code: { systemId, code } },
        update: { label: code, sortOrder: i },
        create: { systemId, code, label: code, sortOrder: i, status: "ACTIVE" },
      });
    }
  }

  // Admin-extensible dosage forms
  for (const form of [
    { code: "DILUTION", name: "Dilution" },
    { code: "MOTHER_TINCTURE", name: "Mother Tincture" },
    { code: "GLOBULES", name: "Globules" },
    { code: "TABLETS", name: "Tablets" },
    { code: "TRITURATION", name: "Trituration" },
    { code: "DROPS", name: "Drops" },
    { code: "SYRUP", name: "Syrup" },
    { code: "OINTMENT", name: "Ointment" },
    { code: "CREAM", name: "Cream" },
    { code: "GEL", name: "Gel" },
    { code: "LOTION", name: "Lotion" },
    { code: "OTHER", name: "Other" },
  ]) {
    await prisma.dosageForm.upsert({
      where: { code: form.code },
      update: { name: form.name },
      create: { ...form, status: "ACTIVE" },
    });
  }

  // Shop-by health areas (discovery labels — not treatment claim taxonomies)
  for (const area of [
    { name: "Digestive Health", slug: "digestive-health" },
    { name: "Respiratory Health", slug: "respiratory-health" },
    { name: "Skin Health", slug: "skin-health" },
    { name: "Hair & Scalp", slug: "hair-scalp" },
    { name: "Joint & Muscle", slug: "joint-muscle" },
    { name: "Sleep & Relaxation", slug: "sleep-relaxation" },
    { name: "Women's Health", slug: "womens-health" },
    { name: "Men's Health", slug: "mens-health" },
    { name: "Children's Health", slug: "childrens-health" },
    { name: "Senior Health", slug: "senior-health" },
    { name: "Pet Care", slug: "pet-care" },
    { name: "General Wellness", slug: "general-wellness" },
  ]) {
    await prisma.healthArea.upsert({
      where: { slug: area.slug },
      update: {},
      create: {
        ...area,
        description:
          "Shop discovery label only. Not a diagnosis or treatment claim. Medical content requires review before publish.",
        status: PublishStatus.DRAFT,
      },
    });
  }

  for (const badge of [
    { code: "BESTSELLER", name: "Bestseller" },
    { code: "NEW", name: "New" },
    { code: "POPULAR", name: "Popular" },
    { code: "BUNDLE", name: "Bundle" },
    { code: "VALUE_PACK", name: "Value Pack" },
    { code: "LIMITED_STOCK", name: "Limited Stock" },
    { code: "TRENDING", name: "Trending" },
    { code: "EDITORS_PICK", name: "Editor's Pick" },
    // DOCTOR_REVIEWED / VERIFIED require auditable relationships — seeded inactive intentionally
  ]) {
    await prisma.productBadge.upsert({
      where: { code: badge.code },
      update: { name: badge.name },
      create: { ...badge, status: "ACTIVE" },
    });
  }

  // Brands remain first-class (directory + detail pages) — draft shell only
  await prisma.brand.upsert({
    where: { slug: "sample-brand" },
    update: {},
    create: {
      name: "Sample Brand",
      slug: "sample-brand",
      description:
        "Brand directory placeholder. Replace with licensed brand data before publish. Brands are first-class entities with their own pages, manufacturers, and products.",
      countryCode: "IN",
      status: PublishStatus.DRAFT,
    },
  });

  await prisma.manufacturer.upsert({
    where: { slug: "sample-manufacturer" },
    update: {},
    create: {
      name: "Sample Manufacturer",
      slug: "sample-manufacturer",
      legalName: "Sample Manufacturer Pvt Ltd",
      countryCode: "IN",
      licenseInfo: "License details TBD — validate against applicable Indian manufacturing/sale rules before publish.",
      status: PublishStatus.DRAFT,
    },
  });

  const plant = await prisma.remedySourceType.findUniqueOrThrow({ where: { code: "PLANT" } });
  await prisma.remedy.upsert({
    where: { slug: "arnica-montana" },
    update: {},
    create: {
      name: "Arnica montana",
      slug: "arnica-montana",
      scientificName: "Arnica montana",
      sourceTypeId: plant.id,
      educationalSummary:
        "Educational remedy encyclopedia shell only. Not a treatment claim. Pharmacopoeial references and medical review required before publish.",
      status: PublishStatus.DRAFT,
      medicalReviewStatus: MedicalReviewStatus.PENDING,
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

  console.log(
    "Seed complete: RBAC, store category roots, remedy sources, potencies/forms (offered set), health areas, badges, brand/manufacturer/remedy shells.",
  );
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
