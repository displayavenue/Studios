-- Catalogue entity graph expansion
-- Brands remain first-class; potencies/forms are attributes; remedies are master entities.

ALTER TABLE "brands" ADD COLUMN IF NOT EXISTS "logoStorageKey" TEXT;
ALTER TABLE "brands" ADD COLUMN IF NOT EXISTS "countryCode" TEXT;
ALTER TABLE "brands" ADD COLUMN IF NOT EXISTS "officialWebsiteUrl" TEXT;
ALTER TABLE "brands" ADD COLUMN IF NOT EXISTS "regulatoryNotes" TEXT;
ALTER TABLE "brands" ADD COLUMN IF NOT EXISTS "seoTitle" TEXT;
ALTER TABLE "brands" ADD COLUMN IF NOT EXISTS "seoDescription" TEXT;
ALTER TABLE "brands" ADD COLUMN IF NOT EXISTS "publishedAt" TIMESTAMP(3);

ALTER TABLE "manufacturers" ADD COLUMN IF NOT EXISTS "legalName" TEXT;
ALTER TABLE "manufacturers" ADD COLUMN IF NOT EXISTS "addressLine1" TEXT;
ALTER TABLE "manufacturers" ADD COLUMN IF NOT EXISTS "city" TEXT;
ALTER TABLE "manufacturers" ADD COLUMN IF NOT EXISTS "state" TEXT;
ALTER TABLE "manufacturers" ADD COLUMN IF NOT EXISTS "postalCode" TEXT;
ALTER TABLE "manufacturers" ADD COLUMN IF NOT EXISTS "licenseInfo" TEXT;
ALTER TABLE "manufacturers" ADD COLUMN IF NOT EXISTS "gmpNotes" TEXT;
ALTER TABLE "manufacturers" ADD COLUMN IF NOT EXISTS "contactEmail" TEXT;
ALTER TABLE "manufacturers" ADD COLUMN IF NOT EXISTS "contactPhone" TEXT;

ALTER TABLE "categories" ADD COLUMN IF NOT EXISTS "treeKind" TEXT NOT NULL DEFAULT 'MEDICINES';
CREATE INDEX IF NOT EXISTS "categories_treeKind_status_idx" ON "categories"("treeKind", "status");

ALTER TABLE "ingredients" ADD COLUMN IF NOT EXISTS "scientificName" TEXT;

ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "storageNotes" TEXT;
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "countryOfOrigin" TEXT DEFAULT 'IN';

ALTER TABLE "product_variants" ADD COLUMN IF NOT EXISTS "gtin" TEXT;
ALTER TABLE "product_variants" ADD COLUMN IF NOT EXISTS "dosageFormId" TEXT;
ALTER TABLE "product_variants" ADD COLUMN IF NOT EXISTS "potencyId" TEXT;
ALTER TABLE "product_variants" ADD COLUMN IF NOT EXISTS "packQuantity" DECIMAL(12,3);
ALTER TABLE "product_variants" ADD COLUMN IF NOT EXISTS "packUnit" TEXT;
ALTER TABLE "product_variants" ADD COLUMN IF NOT EXISTS "netQuantityLabel" TEXT;
ALTER TABLE "product_variants" ADD COLUMN IF NOT EXISTS "mrpMinor" INTEGER;
ALTER TABLE "product_variants" ADD COLUMN IF NOT EXISTS "taxCode" TEXT;
ALTER TABLE "product_variants" ADD COLUMN IF NOT EXISTS "prescriptionRequired" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "product_variants" ADD COLUMN IF NOT EXISTS "ageRestrictionNote" TEXT;
ALTER TABLE "product_variants" ADD COLUMN IF NOT EXISTS "countryOfOrigin" TEXT DEFAULT 'IN';

CREATE TABLE IF NOT EXISTS "brand_manufacturer_map" (
  "id" TEXT PRIMARY KEY,
  "brandId" TEXT NOT NULL,
  "manufacturerId" TEXT NOT NULL,
  "isPrimary" BOOLEAN NOT NULL DEFAULT false,
  "status" TEXT NOT NULL DEFAULT 'ACTIVE',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "createdById" TEXT,
  "updatedById" TEXT,
  CONSTRAINT "brand_manufacturer_map_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "brands"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "brand_manufacturer_map_manufacturerId_fkey" FOREIGN KEY ("manufacturerId") REFERENCES "manufacturers"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "brand_manufacturer_map_brandId_manufacturerId_key" ON "brand_manufacturer_map"("brandId", "manufacturerId");

CREATE TABLE IF NOT EXISTS "brand_documents" (
  "id" TEXT PRIMARY KEY,
  "brandId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "storageKey" TEXT NOT NULL,
  "documentType" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'ACTIVE',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "createdById" TEXT,
  "updatedById" TEXT,
  "deletedAt" TIMESTAMP(3),
  CONSTRAINT "brand_documents_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "brands"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE INDEX IF NOT EXISTS "brand_documents_brandId_idx" ON "brand_documents"("brandId");

CREATE TABLE IF NOT EXISTS "remedy_source_types" (
  "id" TEXT PRIMARY KEY,
  "code" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "status" TEXT NOT NULL DEFAULT 'ACTIVE',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "createdById" TEXT,
  "updatedById" TEXT
);
CREATE UNIQUE INDEX IF NOT EXISTS "remedy_source_types_code_key" ON "remedy_source_types"("code");

CREATE TABLE IF NOT EXISTS "remedies" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "commonNames" TEXT,
  "scientificName" TEXT,
  "sourceTypeId" TEXT,
  "ingredientId" TEXT,
  "pharmacopoeialRefs" TEXT,
  "educationalSummary" TEXT,
  "status" "PublishStatus" NOT NULL DEFAULT 'DRAFT',
  "medicalReviewStatus" "MedicalReviewStatus" NOT NULL DEFAULT 'PENDING',
  "ownerUserId" TEXT,
  "publishedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "createdById" TEXT,
  "updatedById" TEXT,
  "deletedAt" TIMESTAMP(3),
  CONSTRAINT "remedies_sourceTypeId_fkey" FOREIGN KEY ("sourceTypeId") REFERENCES "remedy_source_types"("id") ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT "remedies_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES "ingredients"("id") ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "remedies_slug_key" ON "remedies"("slug");
CREATE INDEX IF NOT EXISTS "remedies_status_publishedAt_idx" ON "remedies"("status", "publishedAt");

CREATE TABLE IF NOT EXISTS "product_remedy_map" (
  "id" TEXT PRIMARY KEY,
  "productId" TEXT NOT NULL,
  "remedyId" TEXT NOT NULL,
  "isPrimary" BOOLEAN NOT NULL DEFAULT true,
  "status" TEXT NOT NULL DEFAULT 'ACTIVE',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "createdById" TEXT,
  "updatedById" TEXT,
  CONSTRAINT "product_remedy_map_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "product_remedy_map_remedyId_fkey" FOREIGN KEY ("remedyId") REFERENCES "remedies"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "product_remedy_map_productId_remedyId_key" ON "product_remedy_map"("productId", "remedyId");

CREATE TABLE IF NOT EXISTS "potency_systems" (
  "id" TEXT PRIMARY KEY,
  "code" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "status" TEXT NOT NULL DEFAULT 'ACTIVE',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "createdById" TEXT,
  "updatedById" TEXT
);
CREATE UNIQUE INDEX IF NOT EXISTS "potency_systems_code_key" ON "potency_systems"("code");

CREATE TABLE IF NOT EXISTS "potencies" (
  "id" TEXT PRIMARY KEY,
  "systemId" TEXT NOT NULL,
  "code" TEXT NOT NULL,
  "label" TEXT NOT NULL,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "status" TEXT NOT NULL DEFAULT 'ACTIVE',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "createdById" TEXT,
  "updatedById" TEXT,
  CONSTRAINT "potencies_systemId_fkey" FOREIGN KEY ("systemId") REFERENCES "potency_systems"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "potencies_systemId_code_key" ON "potencies"("systemId", "code");

CREATE TABLE IF NOT EXISTS "dosage_forms" (
  "id" TEXT PRIMARY KEY,
  "code" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "status" TEXT NOT NULL DEFAULT 'ACTIVE',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "createdById" TEXT,
  "updatedById" TEXT
);
CREATE UNIQUE INDEX IF NOT EXISTS "dosage_forms_code_key" ON "dosage_forms"("code");

CREATE TABLE IF NOT EXISTS "health_areas" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "description" TEXT,
  "status" "PublishStatus" NOT NULL DEFAULT 'DRAFT',
  "ownerUserId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "createdById" TEXT,
  "updatedById" TEXT,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "health_areas_slug_key" ON "health_areas"("slug");

CREATE TABLE IF NOT EXISTS "product_health_area_map" (
  "id" TEXT PRIMARY KEY,
  "productId" TEXT NOT NULL,
  "healthAreaId" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'ACTIVE',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "createdById" TEXT,
  "updatedById" TEXT,
  CONSTRAINT "product_health_area_map_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "product_health_area_map_healthAreaId_fkey" FOREIGN KEY ("healthAreaId") REFERENCES "health_areas"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "product_health_area_map_productId_healthAreaId_key" ON "product_health_area_map"("productId", "healthAreaId");

CREATE TABLE IF NOT EXISTS "product_badges" (
  "id" TEXT PRIMARY KEY,
  "code" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "status" TEXT NOT NULL DEFAULT 'ACTIVE',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "createdById" TEXT,
  "updatedById" TEXT
);
CREATE UNIQUE INDEX IF NOT EXISTS "product_badges_code_key" ON "product_badges"("code");

CREATE TABLE IF NOT EXISTS "product_badge_map" (
  "id" TEXT PRIMARY KEY,
  "productId" TEXT NOT NULL,
  "badgeId" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'ACTIVE',
  "startsAt" TIMESTAMP(3),
  "endsAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "createdById" TEXT,
  "updatedById" TEXT,
  CONSTRAINT "product_badge_map_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "product_badge_map_badgeId_fkey" FOREIGN KEY ("badgeId") REFERENCES "product_badges"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "product_badge_map_productId_badgeId_key" ON "product_badge_map"("productId", "badgeId");

CREATE TABLE IF NOT EXISTS "condition_product_map" (
  "id" TEXT PRIMARY KEY,
  "conditionId" TEXT NOT NULL,
  "productId" TEXT NOT NULL,
  "relationshipNote" TEXT,
  "status" TEXT NOT NULL DEFAULT 'ACTIVE',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "createdById" TEXT,
  "updatedById" TEXT,
  CONSTRAINT "condition_product_map_conditionId_fkey" FOREIGN KEY ("conditionId") REFERENCES "conditions"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "condition_product_map_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "condition_product_map_conditionId_productId_key" ON "condition_product_map"("conditionId", "productId");

CREATE TABLE IF NOT EXISTS "condition_remedy_map" (
  "id" TEXT PRIMARY KEY,
  "conditionId" TEXT NOT NULL,
  "remedyId" TEXT NOT NULL,
  "relationshipNote" TEXT,
  "status" TEXT NOT NULL DEFAULT 'ACTIVE',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "createdById" TEXT,
  "updatedById" TEXT,
  CONSTRAINT "condition_remedy_map_conditionId_fkey" FOREIGN KEY ("conditionId") REFERENCES "conditions"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "condition_remedy_map_remedyId_fkey" FOREIGN KEY ("remedyId") REFERENCES "remedies"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "condition_remedy_map_conditionId_remedyId_key" ON "condition_remedy_map"("conditionId", "remedyId");

CREATE TABLE IF NOT EXISTS "subscription_plans" (
  "id" TEXT PRIMARY KEY,
  "code" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "intervalDays" INTEGER NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'DRAFT',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "createdById" TEXT,
  "updatedById" TEXT
);
CREATE UNIQUE INDEX IF NOT EXISTS "subscription_plans_code_key" ON "subscription_plans"("code");

CREATE TABLE IF NOT EXISTS "customer_subscriptions" (
  "id" TEXT PRIMARY KEY,
  "customerId" TEXT NOT NULL,
  "planId" TEXT NOT NULL,
  "variantId" TEXT,
  "status" TEXT NOT NULL DEFAULT 'PENDING',
  "nextOrderAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "createdById" TEXT,
  "updatedById" TEXT,
  CONSTRAINT "customer_subscriptions_planId_fkey" FOREIGN KEY ("planId") REFERENCES "subscription_plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE INDEX IF NOT EXISTS "customer_subscriptions_customerId_status_idx" ON "customer_subscriptions"("customerId", "status");

-- FK for variant attribute refs (after dosage_forms / potencies exist)
DO $$ BEGIN
  ALTER TABLE "product_variants" ADD CONSTRAINT "product_variants_dosageFormId_fkey" FOREIGN KEY ("dosageFormId") REFERENCES "dosage_forms"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE "product_variants" ADD CONSTRAINT "product_variants_potencyId_fkey" FOREIGN KEY ("potencyId") REFERENCES "potencies"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
