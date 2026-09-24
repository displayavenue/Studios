-- Security & catalog schema gaps: ingredients, category map, customer coupons, review queue, doctor referral rules

-- CreateEnum
CREATE TYPE "ReviewQueueType" AS ENUM ('PRODUCT', 'DOCTOR');
CREATE TYPE "ReviewQueueItemStatus" AS ENUM ('PENDING', 'IN_REVIEW', 'RESOLVED');

-- CreateTable
CREATE TABLE "ingredients" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "status" "PublishStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT,
    "updatedById" TEXT,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ingredients_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "product_category_map" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT,
    "updatedById" TEXT,

    CONSTRAINT "product_category_map_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "customer_coupons" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "couponId" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT,
    "updatedById" TEXT,

    CONSTRAINT "customer_coupons_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "review_moderation_queue" (
    "id" TEXT NOT NULL,
    "reviewType" "ReviewQueueType" NOT NULL,
    "reviewId" TEXT NOT NULL,
    "status" "ReviewQueueItemStatus" NOT NULL DEFAULT 'PENDING',
    "priority" INTEGER NOT NULL DEFAULT 0,
    "assigneeUserId" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT,
    "updatedById" TEXT,

    CONSTRAINT "review_moderation_queue_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "doctor_referral_rules" (
    "id" TEXT NOT NULL,
    "referralCodeId" TEXT NOT NULL,
    "ruleType" TEXT NOT NULL,
    "ruleValue" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT,
    "updatedById" TEXT,

    CONSTRAINT "doctor_referral_rules_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ingredients_slug_key" ON "ingredients"("slug");
CREATE INDEX "ingredients_status_idx" ON "ingredients"("status");

CREATE UNIQUE INDEX "product_category_map_productId_categoryId_key" ON "product_category_map"("productId", "categoryId");
CREATE INDEX "product_category_map_categoryId_status_idx" ON "product_category_map"("categoryId", "status");

CREATE UNIQUE INDEX "customer_coupons_customerId_couponId_source_key" ON "customer_coupons"("customerId", "couponId", "source");
CREATE INDEX "customer_coupons_customerId_status_idx" ON "customer_coupons"("customerId", "status");
CREATE INDEX "customer_coupons_couponId_idx" ON "customer_coupons"("couponId");

CREATE INDEX "review_moderation_queue_status_priority_idx" ON "review_moderation_queue"("status", "priority");
CREATE INDEX "review_moderation_queue_reviewType_reviewId_idx" ON "review_moderation_queue"("reviewType", "reviewId");
CREATE INDEX "review_moderation_queue_assigneeUserId_status_idx" ON "review_moderation_queue"("assigneeUserId", "status");

CREATE INDEX "doctor_referral_rules_referralCodeId_idx" ON "doctor_referral_rules"("referralCodeId");

-- AddForeignKey
ALTER TABLE "product_category_map" ADD CONSTRAINT "product_category_map_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "product_category_map" ADD CONSTRAINT "product_category_map_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "customer_coupons" ADD CONSTRAINT "customer_coupons_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customer_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "customer_coupons" ADD CONSTRAINT "customer_coupons_couponId_fkey" FOREIGN KEY ("couponId") REFERENCES "coupons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "doctor_referral_rules" ADD CONSTRAINT "doctor_referral_rules_referralCodeId_fkey" FOREIGN KEY ("referralCodeId") REFERENCES "doctor_referral_codes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
