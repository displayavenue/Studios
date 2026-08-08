-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "UserAccountStatus" AS ENUM ('PENDING', 'ACTIVE', 'SUSPENDED', 'LOCKED', 'DELETED');

-- CreateEnum
CREATE TYPE "IdentityProvider" AS ENUM ('GOOGLE', 'EMAIL_OTP', 'PHONE_OTP', 'PASSWORD');

-- CreateEnum
CREATE TYPE "PublishStatus" AS ENUM ('DRAFT', 'IN_REVIEW', 'APPROVED', 'PUBLISHED', 'UNPUBLISHED', 'ARCHIVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "MedicalReviewStatus" AS ENUM ('NOT_REQUIRED', 'PENDING', 'IN_REVIEW', 'APPROVED', 'REJECTED', 'NEEDS_UPDATE');

-- CreateEnum
CREATE TYPE "DoctorVerificationStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'IN_REVIEW', 'NEEDS_MORE_INFO', 'APPROVED', 'REJECTED', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "AppointmentMode" AS ENUM ('ONLINE', 'OFFLINE');

-- CreateEnum
CREATE TYPE "AppointmentStatus" AS ENUM ('DRAFT', 'PENDING_PAYMENT', 'CONFIRMED', 'WAITING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW', 'RESCHEDULED');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('DRAFT', 'PENDING_PAYMENT', 'PAID', 'PAYMENT_FAILED', 'CONFIRMED', 'PROCESSING', 'PACKED', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED', 'RETURN_REQUESTED', 'RETURNED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('CREATED', 'PENDING', 'AUTHORIZED', 'CAPTURED', 'FAILED', 'REFUNDED', 'PARTIALLY_REFUNDED', 'DISPUTED');

-- CreateEnum
CREATE TYPE "PaymentProvider" AS ENUM ('RAZORPAY', 'WALLET', 'MANUAL');

-- CreateEnum
CREATE TYPE "ShipmentStatus" AS ENUM ('PENDING', 'READY_TO_SHIP', 'PICKUP_SCHEDULED', 'PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED', 'NDR', 'RTO', 'CANCELLED', 'RETURNED');

-- CreateEnum
CREATE TYPE "InventoryMovementType" AS ENUM ('RECEIPT', 'SALE', 'RESERVATION', 'RELEASE', 'ADJUSTMENT', 'RETURN', 'EXPIRE', 'TRANSFER');

-- CreateEnum
CREATE TYPE "ReviewModerationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'FLAGGED', 'REMOVED');

-- CreateEnum
CREATE TYPE "CouponType" AS ENUM ('PERCENT', 'FIXED', 'FREE_SHIPPING', 'REFERRAL', 'BUNDLE');

-- CreateEnum
CREATE TYPE "ReferralLedgerEntryType" AS ENUM ('ACCRUAL', 'REVERSAL', 'PAYOUT', 'ADJUSTMENT');

-- CreateEnum
CREATE TYPE "NotificationChannel" AS ENUM ('IN_APP', 'EMAIL', 'SMS', 'WHATSAPP');

-- CreateEnum
CREATE TYPE "SupportTicketStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'WAITING_ON_CUSTOMER', 'RESOLVED', 'CLOSED');

-- CreateEnum
CREATE TYPE "PageKind" AS ENUM ('COMMERCE', 'CONTENT', 'LEGAL', 'LANDING', 'SYSTEM');

-- CreateEnum
CREATE TYPE "SitemapSegment" AS ENUM ('PRODUCTS', 'CATEGORIES', 'CONDITIONS', 'BODY_SYSTEMS', 'ORGANS', 'DOCTORS', 'CITIES', 'PETS', 'ARTICLES', 'STATIC', 'LEGAL');

-- CreateEnum
CREATE TYPE "ConsentType" AS ENUM ('TERMS', 'PRIVACY', 'MARKETING', 'MEDICAL_TELECONSULT', 'COOKIES');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT,
    "emailVerifiedAt" TIMESTAMP(3),
    "phone" TEXT,
    "phoneVerifiedAt" TIMESTAMP(3),
    "displayName" TEXT,
    "avatarUrl" TEXT,
    "status" "UserAccountStatus" NOT NULL DEFAULT 'PENDING',
    "preferredLocale" TEXT NOT NULL DEFAULT 'en-IN',
    "preferredCountry" TEXT NOT NULL DEFAULT 'IN',
    "preferredCurrency" TEXT NOT NULL DEFAULT 'INR',
    "lastLoginAt" TIMESTAMP(3),
    "lockedUntil" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT,
    "updatedById" TEXT,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_identities" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "provider" "IdentityProvider" NOT NULL,
    "providerUserId" TEXT NOT NULL,
    "email" TEXT,
    "rawProfile" JSONB,
    "verifiedAt" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT,
    "updatedById" TEXT,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "user_identities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "deviceId" TEXT,
    "deviceLabel" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revokedAt" TIMESTAMP(3),
    "lastSeenAt" TIMESTAMP(3),
    "forcedLogoutAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT,
    "updatedById" TEXT,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT,
    "updatedById" TEXT,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permissions" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT,
    "updatedById" TEXT,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role_permissions" (
    "roleId" TEXT NOT NULL,
    "permissionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" TEXT,

    CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("roleId","permissionId")
);

-- CreateTable
CREATE TABLE "user_roles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT,
    "updatedById" TEXT,

    CONSTRAINT "user_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mfa_devices" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "label" TEXT,
    "secretEnc" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "verifiedAt" TIMESTAMP(3),
    "lastUsedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT,
    "updatedById" TEXT,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "mfa_devices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "login_attempts" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "emailOrPhone" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "provider" "IdentityProvider",
    "success" BOOLEAN NOT NULL,
    "failureReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "login_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "actorUserId" TEXT,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT,
    "beforeJson" JSONB,
    "afterJson" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "correlationId" TEXT,
    "immutable" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customer_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "dateOfBirth" TIMESTAMP(3),
    "gender" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "referredByCode" TEXT,
    "ownerUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT,
    "updatedById" TEXT,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "customer_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customer_addresses" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "label" TEXT,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "line1" TEXT NOT NULL,
    "line2" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT,
    "postalCode" TEXT NOT NULL,
    "countryCode" TEXT NOT NULL DEFAULT 'IN',
    "latitude" DECIMAL(10,7),
    "longitude" DECIMAL(10,7),
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT,
    "updatedById" TEXT,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "customer_addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customer_preferences" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "marketingEmailOptIn" BOOLEAN NOT NULL DEFAULT false,
    "marketingSmsOptIn" BOOLEAN NOT NULL DEFAULT false,
    "whatsappOptIn" BOOLEAN NOT NULL DEFAULT false,
    "petInterest" BOOLEAN NOT NULL DEFAULT false,
    "locale" TEXT NOT NULL DEFAULT 'en-IN',
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT,
    "updatedById" TEXT,

    CONSTRAINT "customer_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customer_wallets" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "balanceMinor" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT,
    "updatedById" TEXT,

    CONSTRAINT "customer_wallets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customer_referrals" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "referralCodeId" TEXT NOT NULL,
    "referringDoctorId" TEXT,
    "orderId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ATTRIBUTED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT,
    "updatedById" TEXT,

    CONSTRAINT "customer_referrals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customer_notifications" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "channel" "NotificationChannel" NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "payload" JSONB,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT,
    "updatedById" TEXT,

    CONSTRAINT "customer_notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "saved_items" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "productId" TEXT,
    "variantId" TEXT,
    "bundleId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT,
    "updatedById" TEXT,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "saved_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "doctor_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT,
    "fullName" TEXT NOT NULL,
    "bio" TEXT,
    "consultationFeeMinor" INTEGER NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "yearsExperience" INTEGER,
    "verificationStatus" "DoctorVerificationStatus" NOT NULL DEFAULT 'DRAFT',
    "verifiedBadge" BOOLEAN NOT NULL DEFAULT false,
    "vacationMode" BOOLEAN NOT NULL DEFAULT false,
    "status" "PublishStatus" NOT NULL DEFAULT 'DRAFT',
    "ownerUserId" TEXT,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT,
    "updatedById" TEXT,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "doctor_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "doctor_verifications" (
    "id" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "status" "DoctorVerificationStatus" NOT NULL DEFAULT 'SUBMITTED',
    "notes" TEXT,
    "reviewerId" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT,
    "updatedById" TEXT,

    CONSTRAINT "doctor_verifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "doctor_documents" (
    "id" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "documentType" TEXT NOT NULL,
    "storageKey" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'UPLOADED',
    "scannedAt" TIMESTAMP(3),
    "scanResult" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT,
    "updatedById" TEXT,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "doctor_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "doctor_licenses" (
    "id" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "licenseNumber" TEXT NOT NULL,
    "issuingBody" TEXT NOT NULL,
    "countryCode" TEXT NOT NULL DEFAULT 'IN',
    "state" TEXT,
    "issuedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT,
    "updatedById" TEXT,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "doctor_licenses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "doctor_specialties" (
    "id" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "specialty" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT,
    "updatedById" TEXT,

    CONSTRAINT "doctor_specialties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "doctor_languages" (
    "id" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "languageCode" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT,
    "updatedById" TEXT,

    CONSTRAINT "doctor_languages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "doctor_clinics" (
    "id" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "line1" TEXT NOT NULL,
    "line2" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT,
    "postalCode" TEXT,
    "countryCode" TEXT NOT NULL DEFAULT 'IN',
    "latitude" DECIMAL(10,7),
    "longitude" DECIMAL(10,7),
    "phone" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT,
    "updatedById" TEXT,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "doctor_clinics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "doctor_availability_slots" (
    "id" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "clinicId" TEXT,
    "mode" "AppointmentMode" NOT NULL,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "capacity" INTEGER NOT NULL DEFAULT 1,
    "bookedCount" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT,
    "updatedById" TEXT,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "doctor_availability_slots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "doctor_appointments" (
    "id" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "slotId" TEXT,
    "clinicId" TEXT,
    "mode" "AppointmentMode" NOT NULL,
    "status" "AppointmentStatus" NOT NULL DEFAULT 'DRAFT',
    "scheduledStart" TIMESTAMP(3) NOT NULL,
    "scheduledEnd" TIMESTAMP(3) NOT NULL,
    "feeMinor" INTEGER NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "paymentId" TEXT,
    "idempotencyKey" TEXT,
    "cancellationReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT,
    "updatedById" TEXT,

    CONSTRAINT "doctor_appointments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "doctor_consultations" (
    "id" TEXT NOT NULL,
    "appointmentId" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "roomId" TEXT,
    "waitingRoomJoinedAt" TIMESTAMP(3),
    "startedAt" TIMESTAMP(3),
    "endedAt" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'SCHEDULED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT,
    "updatedById" TEXT,

    CONSTRAINT "doctor_consultations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "consultation_notes" (
    "id" TEXT NOT NULL,
    "consultationId" TEXT NOT NULL,
    "authorUserId" TEXT NOT NULL,
    "noteBody" TEXT NOT NULL,
    "isPrivate" BOOLEAN NOT NULL DEFAULT true,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT,
    "updatedById" TEXT,

    CONSTRAINT "consultation_notes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "doctor_prescriptions" (
    "id" TEXT NOT NULL,
    "consultationId" TEXT NOT NULL,
    "storageKey" TEXT,
    "body" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT,
    "updatedById" TEXT,

    CONSTRAINT "doctor_prescriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "doctor_reviews" (
    "id" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "appointmentId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "title" TEXT,
    "body" TEXT,
    "verifiedConsult" BOOLEAN NOT NULL DEFAULT true,
    "moderationStatus" "ReviewModerationStatus" NOT NULL DEFAULT 'PENDING',
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT,
    "updatedById" TEXT,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "doctor_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "doctor_referral_codes" (
    "id" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "discountPercent" DECIMAL(5,2),
    "discountFixedMinor" INTEGER,
    "commissionPercent" DECIMAL(5,2) NOT NULL,
    "maxRedemptions" INTEGER,
    "perCustomerLimit" INTEGER NOT NULL DEFAULT 1,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "startsAt" TIMESTAMP(3),
    "endsAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT,
    "updatedById" TEXT,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "doctor_referral_codes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "doctor_payouts" (
    "id" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "amountMinor" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "periodStart" TIMESTAMP(3),
    "periodEnd" TIMESTAMP(3),
    "paidAt" TIMESTAMP(3),
    "reference" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT,
    "updatedById" TEXT,

    CONSTRAINT "doctor_payouts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "doctor_earnings_ledger" (
    "id" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "entryType" "ReferralLedgerEntryType" NOT NULL,
    "amountMinor" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "orderId" TEXT,
    "appointmentId" TEXT,
    "referralCodeId" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" TEXT,

    CONSTRAINT "doctor_earnings_ledger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "brands" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "status" "PublishStatus" NOT NULL DEFAULT 'DRAFT',
    "ownerUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT,
    "updatedById" TEXT,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "brands_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "manufacturers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "countryCode" TEXT,
    "status" "PublishStatus" NOT NULL DEFAULT 'DRAFT',
    "ownerUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT,
    "updatedById" TEXT,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "manufacturers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "parentId" TEXT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "status" "PublishStatus" NOT NULL DEFAULT 'DRAFT',
    "ownerUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT,
    "updatedById" TEXT,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_groups" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "status" "PublishStatus" NOT NULL DEFAULT 'DRAFT',
    "ownerUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT,
    "updatedById" TEXT,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "product_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "brandId" TEXT,
    "manufacturerId" TEXT,
    "categoryId" TEXT,
    "productGroupId" TEXT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "subtitle" TEXT,
    "description" TEXT,
    "directions" TEXT,
    "warnings" TEXT,
    "returnPolicy" TEXT,
    "status" "PublishStatus" NOT NULL DEFAULT 'DRAFT',
    "medicalReviewStatus" "MedicalReviewStatus" NOT NULL DEFAULT 'NOT_REQUIRED',
    "ownerUserId" TEXT,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT,
    "updatedById" TEXT,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_variants" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "barcode" TEXT,
    "potency" TEXT,
    "packSize" TEXT,
    "form" TEXT,
    "title" TEXT NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "priceMinor" INTEGER NOT NULL,
    "compareAtMinor" INTEGER,
    "weightGrams" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT,
    "updatedById" TEXT,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "product_variants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_images" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "storageKey" TEXT NOT NULL,
    "altText" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT,
    "updatedById" TEXT,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "product_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_tags" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT,
    "updatedById" TEXT,

    CONSTRAINT "product_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_content_blocks" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "blockType" TEXT NOT NULL,
    "title" TEXT,
    "body" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT,
    "updatedById" TEXT,

    CONSTRAINT "product_content_blocks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_ingredients" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "potency" TEXT,
    "quantity" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT,
    "updatedById" TEXT,

    CONSTRAINT "product_ingredients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_relationships" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "relatedProductId" TEXT NOT NULL,
    "relationType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT,
    "updatedById" TEXT,

    CONSTRAINT "product_relationships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_faqs" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT,
    "updatedById" TEXT,

    CONSTRAINT "product_faqs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_reviews" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "orderItemId" TEXT,
    "rating" INTEGER NOT NULL,
    "title" TEXT,
    "body" TEXT,
    "verifiedPurchase" BOOLEAN NOT NULL DEFAULT false,
    "moderationStatus" "ReviewModerationStatus" NOT NULL DEFAULT 'PENDING',
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT,
    "updatedById" TEXT,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "product_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "body_systems" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "summary" TEXT,
    "status" "PublishStatus" NOT NULL DEFAULT 'DRAFT',
    "ownerUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT,
    "updatedById" TEXT,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "body_systems_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organs" (
    "id" TEXT NOT NULL,
    "bodySystemId" TEXT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "summary" TEXT,
    "status" "PublishStatus" NOT NULL DEFAULT 'DRAFT',
    "ownerUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT,
    "updatedById" TEXT,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "organs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conditions" (
    "id" TEXT NOT NULL,
    "bodySystemId" TEXT,
    "organId" TEXT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "summary" TEXT,
    "status" "PublishStatus" NOT NULL DEFAULT 'DRAFT',
    "medicalReviewStatus" "MedicalReviewStatus" NOT NULL DEFAULT 'PENDING',
    "ownerUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT,
    "updatedById" TEXT,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "conditions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "symptoms" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "summary" TEXT,
    "status" "PublishStatus" NOT NULL DEFAULT 'DRAFT',
    "ownerUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT,
    "updatedById" TEXT,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "symptoms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "condition_symptoms" (
    "conditionId" TEXT NOT NULL,
    "symptomId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "condition_symptoms_pkey" PRIMARY KEY ("conditionId","symptomId")
);

-- CreateTable
CREATE TABLE "age_groups" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "summary" TEXT,
    "status" "PublishStatus" NOT NULL DEFAULT 'DRAFT',
    "ownerUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT,
    "updatedById" TEXT,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "age_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gender_topics" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "summary" TEXT,
    "status" "PublishStatus" NOT NULL DEFAULT 'DRAFT',
    "ownerUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT,
    "updatedById" TEXT,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "gender_topics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pet_species" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "summary" TEXT,
    "status" "PublishStatus" NOT NULL DEFAULT 'DRAFT',
    "ownerUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT,
    "updatedById" TEXT,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "pet_species_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pet_conditions" (
    "id" TEXT NOT NULL,
    "petSpeciesId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "summary" TEXT,
    "status" "PublishStatus" NOT NULL DEFAULT 'DRAFT',
    "medicalReviewStatus" "MedicalReviewStatus" NOT NULL DEFAULT 'PENDING',
    "ownerUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT,
    "updatedById" TEXT,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "pet_conditions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "knowledge_articles" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "excerpt" TEXT,
    "body" TEXT NOT NULL,
    "status" "PublishStatus" NOT NULL DEFAULT 'DRAFT',
    "medicalReviewStatus" "MedicalReviewStatus" NOT NULL DEFAULT 'PENDING',
    "ownerUserId" TEXT,
    "reviewerUserId" TEXT,
    "lastReviewedAt" TIMESTAMP(3),
    "publishedAt" TIMESTAMP(3),
    "bodySystemId" TEXT,
    "organId" TEXT,
    "conditionId" TEXT,
    "ageGroupId" TEXT,
    "genderTopicId" TEXT,
    "petSpeciesId" TEXT,
    "petConditionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT,
    "updatedById" TEXT,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "knowledge_articles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "article_references" (
    "id" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "url" TEXT,
    "citation" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT,
    "updatedById" TEXT,

    CONSTRAINT "article_references_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medical_reviews" (
    "id" TEXT NOT NULL,
    "articleId" TEXT,
    "productId" TEXT,
    "reviewerId" TEXT NOT NULL,
    "status" "MedicalReviewStatus" NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT,
    "updatedById" TEXT,

    CONSTRAINT "medical_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content_versions" (
    "id" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "changeNote" TEXT,
    "status" TEXT NOT NULL DEFAULT 'SNAPSHOT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" TEXT,

    CONSTRAINT "content_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bundles" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "bundleType" TEXT NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "priceMinor" INTEGER NOT NULL,
    "compareAtMinor" INTEGER,
    "status" "PublishStatus" NOT NULL DEFAULT 'DRAFT',
    "ownerUserId" TEXT,
    "startsAt" TIMESTAMP(3),
    "endsAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT,
    "updatedById" TEXT,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "bundles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bundle_items" (
    "id" TEXT NOT NULL,
    "bundleId" TEXT NOT NULL,
    "productId" TEXT,
    "variantId" TEXT,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT,
    "updatedById" TEXT,

    CONSTRAINT "bundle_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaigns" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "startsAt" TIMESTAMP(3),
    "endsAt" TIMESTAMP(3),
    "ownerUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT,
    "updatedById" TEXT,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "campaigns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coupons" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT,
    "code" TEXT NOT NULL,
    "couponType" "CouponType" NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "startsAt" TIMESTAMP(3),
    "endsAt" TIMESTAMP(3),
    "ownerUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT,
    "updatedById" TEXT,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "coupons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coupon_rules" (
    "id" TEXT NOT NULL,
    "couponId" TEXT NOT NULL,
    "ruleType" TEXT NOT NULL,
    "ruleValue" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT,
    "updatedById" TEXT,

    CONSTRAINT "coupon_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coupon_redemptions" (
    "id" TEXT NOT NULL,
    "couponId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "orderId" TEXT,
    "amountMinor" INTEGER NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "ipAddress" TEXT,
    "deviceId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'APPLIED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" TEXT,

    CONSTRAINT "coupon_redemptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "discount_applications" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "sourceType" TEXT NOT NULL,
    "sourceId" TEXT,
    "amountMinor" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "status" TEXT NOT NULL DEFAULT 'APPLIED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" TEXT,

    CONSTRAINT "discount_applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "referral_rules" (
    "id" TEXT NOT NULL,
    "referralCodeId" TEXT NOT NULL,
    "ruleType" TEXT NOT NULL,
    "ruleValue" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT,
    "updatedById" TEXT,

    CONSTRAINT "referral_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "carts" (
    "id" TEXT NOT NULL,
    "customerId" TEXT,
    "sessionKey" TEXT,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT,
    "updatedById" TEXT,

    CONSTRAINT "carts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cart_items" (
    "id" TEXT NOT NULL,
    "cartId" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT,
    "updatedById" TEXT,

    CONSTRAINT "cart_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "checkouts" (
    "id" TEXT NOT NULL,
    "cartId" TEXT NOT NULL,
    "customerId" TEXT,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "subtotalMinor" INTEGER NOT NULL DEFAULT 0,
    "discountMinor" INTEGER NOT NULL DEFAULT 0,
    "shippingMinor" INTEGER NOT NULL DEFAULT 0,
    "taxMinor" INTEGER NOT NULL DEFAULT 0,
    "totalMinor" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "idempotencyKey" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT,
    "updatedById" TEXT,

    CONSTRAINT "checkouts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "checkout_events" (
    "id" TEXT NOT NULL,
    "checkoutId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "payload" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "checkout_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL,
    "orderNumber" TEXT NOT NULL,
    "checkoutId" TEXT,
    "customerId" TEXT NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "countryCode" TEXT NOT NULL DEFAULT 'IN',
    "locale" TEXT NOT NULL DEFAULT 'en-IN',
    "subtotalMinor" INTEGER NOT NULL,
    "discountMinor" INTEGER NOT NULL DEFAULT 0,
    "shippingMinor" INTEGER NOT NULL DEFAULT 0,
    "taxMinor" INTEGER NOT NULL DEFAULT 0,
    "totalMinor" INTEGER NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING_PAYMENT',
    "shippingSnapshot" JSONB,
    "billingSnapshot" JSONB,
    "pricingSnapshot" JSONB NOT NULL,
    "idempotencyKey" TEXT,
    "placedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT,
    "updatedById" TEXT,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_items" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "variantId" TEXT,
    "skuSnapshot" TEXT NOT NULL,
    "titleSnapshot" TEXT NOT NULL,
    "potencySnapshot" TEXT,
    "packSizeSnapshot" TEXT,
    "unitPriceMinor" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "lineTotalMinor" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "order_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_status_history" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "fromStatus" "OrderStatus",
    "toStatus" "OrderStatus" NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" TEXT,

    CONSTRAINT "order_status_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "orderId" TEXT,
    "appointmentId" TEXT,
    "provider" "PaymentProvider" NOT NULL,
    "providerOrderId" TEXT,
    "providerPaymentId" TEXT,
    "amountMinor" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "status" "PaymentStatus" NOT NULL DEFAULT 'CREATED',
    "idempotencyKey" TEXT,
    "rawPayload" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT,
    "updatedById" TEXT,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_attempts" (
    "id" TEXT NOT NULL,
    "paymentId" TEXT NOT NULL,
    "status" "PaymentStatus" NOT NULL,
    "providerPayload" JSONB,
    "errorCode" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payment_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refunds" (
    "id" TEXT NOT NULL,
    "paymentId" TEXT NOT NULL,
    "amountMinor" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "reason" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "providerRefundId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT,
    "updatedById" TEXT,

    CONSTRAINT "refunds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "warehouses" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "line1" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT,
    "postalCode" TEXT,
    "countryCode" TEXT NOT NULL DEFAULT 'IN',
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "ownerUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT,
    "updatedById" TEXT,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "warehouses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_batches" (
    "id" TEXT NOT NULL,
    "warehouseId" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "batchNumber" TEXT NOT NULL,
    "quantityOnHand" INTEGER NOT NULL DEFAULT 0,
    "quantityReserved" INTEGER NOT NULL DEFAULT 0,
    "manufacturedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT,
    "updatedById" TEXT,

    CONSTRAINT "inventory_batches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_movements" (
    "id" TEXT NOT NULL,
    "batchId" TEXT NOT NULL,
    "movementType" "InventoryMovementType" NOT NULL,
    "quantity" INTEGER NOT NULL,
    "referenceType" TEXT,
    "referenceId" TEXT,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" TEXT,

    CONSTRAINT "inventory_movements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_reservations" (
    "id" TEXT NOT NULL,
    "batchId" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "orderId" TEXT,
    "quantity" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'RESERVED',
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT,
    "updatedById" TEXT,

    CONSTRAINT "stock_reservations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shipments" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "warehouseId" TEXT,
    "provider" TEXT NOT NULL DEFAULT 'SHIPROCKET',
    "providerShipmentId" TEXT,
    "awb" TEXT,
    "status" "ShipmentStatus" NOT NULL DEFAULT 'PENDING',
    "idempotencyKey" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT,
    "updatedById" TEXT,

    CONSTRAINT "shipments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shipment_events" (
    "id" TEXT NOT NULL,
    "shipmentId" TEXT NOT NULL,
    "status" "ShipmentStatus" NOT NULL,
    "payload" JSONB,
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "shipment_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shipping_labels" (
    "id" TEXT NOT NULL,
    "shipmentId" TEXT NOT NULL,
    "storageKey" TEXT NOT NULL,
    "labelType" TEXT NOT NULL DEFAULT 'LABEL',
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" TEXT,

    CONSTRAINT "shipping_labels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "serviceability_rules" (
    "id" TEXT NOT NULL,
    "postalCodeFrom" TEXT,
    "postalCodeTo" TEXT,
    "city" TEXT,
    "countryCode" TEXT NOT NULL DEFAULT 'IN',
    "warehouseId" TEXT,
    "isServiceable" BOOLEAN NOT NULL DEFAULT true,
    "etaDaysMin" INTEGER,
    "etaDaysMax" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT,
    "updatedById" TEXT,

    CONSTRAINT "serviceability_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "support_tickets" (
    "id" TEXT NOT NULL,
    "requesterId" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "status" "SupportTicketStatus" NOT NULL DEFAULT 'OPEN',
    "priority" TEXT NOT NULL DEFAULT 'NORMAL',
    "orderId" TEXT,
    "appointmentId" TEXT,
    "ownerUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT,
    "updatedById" TEXT,

    CONSTRAINT "support_tickets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ticket_messages" (
    "id" TEXT NOT NULL,
    "ticketId" TEXT NOT NULL,
    "authorUserId" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT,
    "updatedById" TEXT,

    CONSTRAINT "ticket_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "channel" "NotificationChannel" NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "payload" JSONB,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "sentAt" TIMESTAMP(3),
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT,
    "updatedById" TEXT,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "email_logs" (
    "id" TEXT NOT NULL,
    "toAddress" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "templateKey" TEXT,
    "providerId" TEXT,
    "status" TEXT NOT NULL,
    "payload" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "email_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sms_logs" (
    "id" TEXT NOT NULL,
    "toPhone" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "providerId" TEXT,
    "status" TEXT NOT NULL,
    "payload" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sms_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "whatsapp_logs" (
    "id" TEXT NOT NULL,
    "toPhone" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "providerId" TEXT,
    "status" TEXT NOT NULL,
    "payload" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "whatsapp_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pages" (
    "id" TEXT NOT NULL,
    "kind" "PageKind" NOT NULL,
    "title" TEXT NOT NULL,
    "slugId" TEXT,
    "status" "PublishStatus" NOT NULL DEFAULT 'DRAFT',
    "ownerUserId" TEXT,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT,
    "updatedById" TEXT,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "pages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "page_versions" (
    "id" TEXT NOT NULL,
    "pageId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "changeNote" TEXT,
    "status" TEXT NOT NULL DEFAULT 'SNAPSHOT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" TEXT,

    CONSTRAINT "page_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "page_redirects" (
    "id" TEXT NOT NULL,
    "fromPageId" TEXT,
    "fromPath" TEXT NOT NULL,
    "toPath" TEXT NOT NULL,
    "statusCode" INTEGER NOT NULL DEFAULT 301,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT,
    "updatedById" TEXT,

    CONSTRAINT "page_redirects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "slugs" (
    "id" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "locale" TEXT NOT NULL DEFAULT 'en-IN',
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT,
    "updatedById" TEXT,

    CONSTRAINT "slugs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "slug_history" (
    "id" TEXT NOT NULL,
    "slugId" TEXT NOT NULL,
    "oldSlug" TEXT NOT NULL,
    "newSlug" TEXT NOT NULL,
    "locale" TEXT NOT NULL DEFAULT 'en-IN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" TEXT,

    CONSTRAINT "slug_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seo_metadata" (
    "id" TEXT NOT NULL,
    "pageId" TEXT NOT NULL,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "ogImageKey" TEXT,
    "robotsDirective" TEXT DEFAULT 'index,follow',
    "canonicalUrl" TEXT,
    "schemaJson" JSONB,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT,
    "updatedById" TEXT,

    CONSTRAINT "seo_metadata_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "canonical_rules" (
    "id" TEXT NOT NULL,
    "pattern" TEXT NOT NULL,
    "canonicalTo" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT,
    "updatedById" TEXT,

    CONSTRAINT "canonical_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sitemaps" (
    "id" TEXT NOT NULL,
    "segment" "SitemapSegment" NOT NULL,
    "locale" TEXT NOT NULL DEFAULT 'en-IN',
    "fileKey" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "lastBuiltAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT,
    "updatedById" TEXT,

    CONSTRAINT "sitemaps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sitemap_entries" (
    "id" TEXT NOT NULL,
    "sitemapId" TEXT NOT NULL,
    "loc" TEXT NOT NULL,
    "lastmod" TIMESTAMP(3),
    "changefreq" TEXT,
    "priority" DECIMAL(2,1),
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sitemap_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "internal_links" (
    "id" TEXT NOT NULL,
    "fromEntityType" TEXT NOT NULL,
    "fromEntityId" TEXT NOT NULL,
    "toEntityType" TEXT NOT NULL,
    "toEntityId" TEXT NOT NULL,
    "anchorText" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT,
    "updatedById" TEXT,

    CONSTRAINT "internal_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "search_queries" (
    "id" TEXT NOT NULL,
    "query" TEXT NOT NULL,
    "locale" TEXT NOT NULL DEFAULT 'en-IN',
    "resultCount" INTEGER NOT NULL DEFAULT 0,
    "userId" TEXT,
    "ipHash" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "search_queries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "consents" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "consentType" "ConsentType" NOT NULL,
    "version" TEXT NOT NULL,
    "granted" BOOLEAN NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "consents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "privacy_events" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "eventType" TEXT NOT NULL,
    "payload" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "privacy_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "document_access_logs" (
    "id" TEXT NOT NULL,
    "doctorDocumentId" TEXT,
    "accessorUserId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "ipAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "document_access_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "data_retention_jobs" (
    "id" TEXT NOT NULL,
    "jobType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "payload" JSONB,
    "scheduledFor" TIMESTAMP(3),
    "startedAt" TIMESTAMP(3),
    "finishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT,
    "updatedById" TEXT,

    CONSTRAINT "data_retention_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "legal_hold_flags" (
    "id" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT,
    "updatedById" TEXT,

    CONSTRAINT "legal_hold_flags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "entity_content_maps" (
    "id" TEXT NOT NULL,
    "commerceType" TEXT NOT NULL,
    "commerceId" TEXT NOT NULL,
    "contentType" TEXT NOT NULL,
    "contentId" TEXT NOT NULL,
    "relationshipType" TEXT NOT NULL DEFAULT 'RELATED',
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT,
    "updatedById" TEXT,

    CONSTRAINT "entity_content_maps_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");

-- CreateIndex
CREATE INDEX "users_status_idx" ON "users"("status");

-- CreateIndex
CREATE INDEX "users_deletedAt_idx" ON "users"("deletedAt");

-- CreateIndex
CREATE INDEX "user_identities_userId_idx" ON "user_identities"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "user_identities_provider_providerUserId_key" ON "user_identities"("provider", "providerUserId");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_tokenHash_key" ON "sessions"("tokenHash");

-- CreateIndex
CREATE INDEX "sessions_userId_status_idx" ON "sessions"("userId", "status");

-- CreateIndex
CREATE INDEX "sessions_expiresAt_idx" ON "sessions"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "roles_code_key" ON "roles"("code");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_code_key" ON "permissions"("code");

-- CreateIndex
CREATE INDEX "user_roles_roleId_idx" ON "user_roles"("roleId");

-- CreateIndex
CREATE UNIQUE INDEX "user_roles_userId_roleId_key" ON "user_roles"("userId", "roleId");

-- CreateIndex
CREATE INDEX "mfa_devices_userId_status_idx" ON "mfa_devices"("userId", "status");

-- CreateIndex
CREATE INDEX "login_attempts_emailOrPhone_createdAt_idx" ON "login_attempts"("emailOrPhone", "createdAt");

-- CreateIndex
CREATE INDEX "login_attempts_ipAddress_createdAt_idx" ON "login_attempts"("ipAddress", "createdAt");

-- CreateIndex
CREATE INDEX "login_attempts_userId_createdAt_idx" ON "login_attempts"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "audit_logs_entityType_entityId_createdAt_idx" ON "audit_logs"("entityType", "entityId", "createdAt");

-- CreateIndex
CREATE INDEX "audit_logs_actorUserId_createdAt_idx" ON "audit_logs"("actorUserId", "createdAt");

-- CreateIndex
CREATE INDEX "audit_logs_action_createdAt_idx" ON "audit_logs"("action", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "customer_profiles_userId_key" ON "customer_profiles"("userId");

-- CreateIndex
CREATE INDEX "customer_profiles_status_idx" ON "customer_profiles"("status");

-- CreateIndex
CREATE INDEX "customer_addresses_customerId_status_idx" ON "customer_addresses"("customerId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "customer_preferences_customerId_key" ON "customer_preferences"("customerId");

-- CreateIndex
CREATE UNIQUE INDEX "customer_wallets_customerId_key" ON "customer_wallets"("customerId");

-- CreateIndex
CREATE INDEX "customer_referrals_customerId_idx" ON "customer_referrals"("customerId");

-- CreateIndex
CREATE INDEX "customer_referrals_referralCodeId_idx" ON "customer_referrals"("referralCodeId");

-- CreateIndex
CREATE INDEX "customer_notifications_customerId_status_idx" ON "customer_notifications"("customerId", "status");

-- CreateIndex
CREATE INDEX "saved_items_userId_status_idx" ON "saved_items"("userId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "doctor_profiles_userId_key" ON "doctor_profiles"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "doctor_profiles_slug_key" ON "doctor_profiles"("slug");

-- CreateIndex
CREATE INDEX "doctor_profiles_verificationStatus_status_idx" ON "doctor_profiles"("verificationStatus", "status");

-- CreateIndex
CREATE INDEX "doctor_profiles_slug_idx" ON "doctor_profiles"("slug");

-- CreateIndex
CREATE INDEX "doctor_verifications_doctorId_status_idx" ON "doctor_verifications"("doctorId", "status");

-- CreateIndex
CREATE INDEX "doctor_documents_doctorId_status_idx" ON "doctor_documents"("doctorId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "doctor_licenses_doctorId_licenseNumber_issuingBody_key" ON "doctor_licenses"("doctorId", "licenseNumber", "issuingBody");

-- CreateIndex
CREATE UNIQUE INDEX "doctor_specialties_doctorId_specialty_key" ON "doctor_specialties"("doctorId", "specialty");

-- CreateIndex
CREATE UNIQUE INDEX "doctor_languages_doctorId_languageCode_key" ON "doctor_languages"("doctorId", "languageCode");

-- CreateIndex
CREATE INDEX "doctor_clinics_doctorId_city_idx" ON "doctor_clinics"("doctorId", "city");

-- CreateIndex
CREATE INDEX "doctor_availability_slots_doctorId_startsAt_status_idx" ON "doctor_availability_slots"("doctorId", "startsAt", "status");

-- CreateIndex
CREATE INDEX "doctor_availability_slots_mode_startsAt_idx" ON "doctor_availability_slots"("mode", "startsAt");

-- CreateIndex
CREATE UNIQUE INDEX "doctor_appointments_idempotencyKey_key" ON "doctor_appointments"("idempotencyKey");

-- CreateIndex
CREATE INDEX "doctor_appointments_doctorId_scheduledStart_idx" ON "doctor_appointments"("doctorId", "scheduledStart");

-- CreateIndex
CREATE INDEX "doctor_appointments_customerId_status_idx" ON "doctor_appointments"("customerId", "status");

-- CreateIndex
CREATE INDEX "doctor_appointments_status_scheduledStart_idx" ON "doctor_appointments"("status", "scheduledStart");

-- CreateIndex
CREATE UNIQUE INDEX "doctor_consultations_appointmentId_key" ON "doctor_consultations"("appointmentId");

-- CreateIndex
CREATE INDEX "doctor_consultations_doctorId_status_idx" ON "doctor_consultations"("doctorId", "status");

-- CreateIndex
CREATE INDEX "consultation_notes_consultationId_idx" ON "consultation_notes"("consultationId");

-- CreateIndex
CREATE INDEX "doctor_prescriptions_consultationId_idx" ON "doctor_prescriptions"("consultationId");

-- CreateIndex
CREATE INDEX "doctor_reviews_doctorId_moderationStatus_idx" ON "doctor_reviews"("doctorId", "moderationStatus");

-- CreateIndex
CREATE UNIQUE INDEX "doctor_reviews_appointmentId_customerId_key" ON "doctor_reviews"("appointmentId", "customerId");

-- CreateIndex
CREATE UNIQUE INDEX "doctor_referral_codes_code_key" ON "doctor_referral_codes"("code");

-- CreateIndex
CREATE INDEX "doctor_referral_codes_doctorId_status_idx" ON "doctor_referral_codes"("doctorId", "status");

-- CreateIndex
CREATE INDEX "doctor_payouts_doctorId_status_idx" ON "doctor_payouts"("doctorId", "status");

-- CreateIndex
CREATE INDEX "doctor_earnings_ledger_doctorId_createdAt_idx" ON "doctor_earnings_ledger"("doctorId", "createdAt");

-- CreateIndex
CREATE INDEX "doctor_earnings_ledger_orderId_idx" ON "doctor_earnings_ledger"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "brands_slug_key" ON "brands"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "manufacturers_slug_key" ON "manufacturers"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_key" ON "categories"("slug");

-- CreateIndex
CREATE INDEX "categories_parentId_idx" ON "categories"("parentId");

-- CreateIndex
CREATE UNIQUE INDEX "product_groups_slug_key" ON "product_groups"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "products_slug_key" ON "products"("slug");

-- CreateIndex
CREATE INDEX "products_status_publishedAt_idx" ON "products"("status", "publishedAt");

-- CreateIndex
CREATE INDEX "products_brandId_idx" ON "products"("brandId");

-- CreateIndex
CREATE INDEX "products_categoryId_idx" ON "products"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "product_variants_sku_key" ON "product_variants"("sku");

-- CreateIndex
CREATE INDEX "product_variants_productId_status_idx" ON "product_variants"("productId", "status");

-- CreateIndex
CREATE INDEX "product_images_productId_sortOrder_idx" ON "product_images"("productId", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "product_tags_productId_tag_key" ON "product_tags"("productId", "tag");

-- CreateIndex
CREATE INDEX "product_content_blocks_productId_sortOrder_idx" ON "product_content_blocks"("productId", "sortOrder");

-- CreateIndex
CREATE INDEX "product_ingredients_productId_idx" ON "product_ingredients"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "product_relationships_productId_relatedProductId_relationTy_key" ON "product_relationships"("productId", "relatedProductId", "relationType");

-- CreateIndex
CREATE INDEX "product_faqs_productId_sortOrder_idx" ON "product_faqs"("productId", "sortOrder");

-- CreateIndex
CREATE INDEX "product_reviews_productId_moderationStatus_idx" ON "product_reviews"("productId", "moderationStatus");

-- CreateIndex
CREATE INDEX "product_reviews_customerId_idx" ON "product_reviews"("customerId");

-- CreateIndex
CREATE UNIQUE INDEX "body_systems_slug_key" ON "body_systems"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "organs_slug_key" ON "organs"("slug");

-- CreateIndex
CREATE INDEX "organs_bodySystemId_idx" ON "organs"("bodySystemId");

-- CreateIndex
CREATE UNIQUE INDEX "conditions_slug_key" ON "conditions"("slug");

-- CreateIndex
CREATE INDEX "conditions_bodySystemId_idx" ON "conditions"("bodySystemId");

-- CreateIndex
CREATE INDEX "conditions_organId_idx" ON "conditions"("organId");

-- CreateIndex
CREATE UNIQUE INDEX "symptoms_slug_key" ON "symptoms"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "age_groups_slug_key" ON "age_groups"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "gender_topics_slug_key" ON "gender_topics"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "pet_species_slug_key" ON "pet_species"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "pet_conditions_slug_key" ON "pet_conditions"("slug");

-- CreateIndex
CREATE INDEX "pet_conditions_petSpeciesId_idx" ON "pet_conditions"("petSpeciesId");

-- CreateIndex
CREATE UNIQUE INDEX "knowledge_articles_slug_key" ON "knowledge_articles"("slug");

-- CreateIndex
CREATE INDEX "knowledge_articles_status_publishedAt_idx" ON "knowledge_articles"("status", "publishedAt");

-- CreateIndex
CREATE INDEX "knowledge_articles_medicalReviewStatus_idx" ON "knowledge_articles"("medicalReviewStatus");

-- CreateIndex
CREATE INDEX "article_references_articleId_idx" ON "article_references"("articleId");

-- CreateIndex
CREATE INDEX "medical_reviews_articleId_status_idx" ON "medical_reviews"("articleId", "status");

-- CreateIndex
CREATE INDEX "medical_reviews_productId_status_idx" ON "medical_reviews"("productId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "content_versions_articleId_version_key" ON "content_versions"("articleId", "version");

-- CreateIndex
CREATE UNIQUE INDEX "bundles_slug_key" ON "bundles"("slug");

-- CreateIndex
CREATE INDEX "bundle_items_bundleId_idx" ON "bundle_items"("bundleId");

-- CreateIndex
CREATE UNIQUE INDEX "campaigns_slug_key" ON "campaigns"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "coupons_code_key" ON "coupons"("code");

-- CreateIndex
CREATE INDEX "coupons_status_startsAt_endsAt_idx" ON "coupons"("status", "startsAt", "endsAt");

-- CreateIndex
CREATE INDEX "coupon_rules_couponId_idx" ON "coupon_rules"("couponId");

-- CreateIndex
CREATE INDEX "coupon_redemptions_couponId_customerId_idx" ON "coupon_redemptions"("couponId", "customerId");

-- CreateIndex
CREATE INDEX "coupon_redemptions_orderId_idx" ON "coupon_redemptions"("orderId");

-- CreateIndex
CREATE INDEX "discount_applications_orderId_idx" ON "discount_applications"("orderId");

-- CreateIndex
CREATE INDEX "referral_rules_referralCodeId_idx" ON "referral_rules"("referralCodeId");

-- CreateIndex
CREATE INDEX "carts_customerId_status_idx" ON "carts"("customerId", "status");

-- CreateIndex
CREATE INDEX "carts_sessionKey_idx" ON "carts"("sessionKey");

-- CreateIndex
CREATE UNIQUE INDEX "cart_items_cartId_variantId_key" ON "cart_items"("cartId", "variantId");

-- CreateIndex
CREATE UNIQUE INDEX "checkouts_cartId_key" ON "checkouts"("cartId");

-- CreateIndex
CREATE UNIQUE INDEX "checkouts_idempotencyKey_key" ON "checkouts"("idempotencyKey");

-- CreateIndex
CREATE INDEX "checkout_events_checkoutId_createdAt_idx" ON "checkout_events"("checkoutId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "orders_orderNumber_key" ON "orders"("orderNumber");

-- CreateIndex
CREATE UNIQUE INDEX "orders_checkoutId_key" ON "orders"("checkoutId");

-- CreateIndex
CREATE UNIQUE INDEX "orders_idempotencyKey_key" ON "orders"("idempotencyKey");

-- CreateIndex
CREATE INDEX "orders_customerId_createdAt_idx" ON "orders"("customerId", "createdAt");

-- CreateIndex
CREATE INDEX "orders_status_createdAt_idx" ON "orders"("status", "createdAt");

-- CreateIndex
CREATE INDEX "order_items_orderId_idx" ON "order_items"("orderId");

-- CreateIndex
CREATE INDEX "order_status_history_orderId_createdAt_idx" ON "order_status_history"("orderId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "payments_idempotencyKey_key" ON "payments"("idempotencyKey");

-- CreateIndex
CREATE INDEX "payments_orderId_idx" ON "payments"("orderId");

-- CreateIndex
CREATE INDEX "payments_providerOrderId_idx" ON "payments"("providerOrderId");

-- CreateIndex
CREATE INDEX "payments_status_idx" ON "payments"("status");

-- CreateIndex
CREATE INDEX "payment_attempts_paymentId_createdAt_idx" ON "payment_attempts"("paymentId", "createdAt");

-- CreateIndex
CREATE INDEX "refunds_paymentId_status_idx" ON "refunds"("paymentId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "warehouses_code_key" ON "warehouses"("code");

-- CreateIndex
CREATE INDEX "inventory_batches_variantId_expiresAt_idx" ON "inventory_batches"("variantId", "expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "inventory_batches_warehouseId_variantId_batchNumber_key" ON "inventory_batches"("warehouseId", "variantId", "batchNumber");

-- CreateIndex
CREATE INDEX "inventory_movements_batchId_createdAt_idx" ON "inventory_movements"("batchId", "createdAt");

-- CreateIndex
CREATE INDEX "stock_reservations_orderId_idx" ON "stock_reservations"("orderId");

-- CreateIndex
CREATE INDEX "stock_reservations_variantId_status_idx" ON "stock_reservations"("variantId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "shipments_idempotencyKey_key" ON "shipments"("idempotencyKey");

-- CreateIndex
CREATE INDEX "shipments_orderId_idx" ON "shipments"("orderId");

-- CreateIndex
CREATE INDEX "shipments_status_idx" ON "shipments"("status");

-- CreateIndex
CREATE INDEX "shipments_awb_idx" ON "shipments"("awb");

-- CreateIndex
CREATE INDEX "shipment_events_shipmentId_occurredAt_idx" ON "shipment_events"("shipmentId", "occurredAt");

-- CreateIndex
CREATE INDEX "shipping_labels_shipmentId_idx" ON "shipping_labels"("shipmentId");

-- CreateIndex
CREATE INDEX "serviceability_rules_postalCodeFrom_postalCodeTo_idx" ON "serviceability_rules"("postalCodeFrom", "postalCodeTo");

-- CreateIndex
CREATE INDEX "support_tickets_status_createdAt_idx" ON "support_tickets"("status", "createdAt");

-- CreateIndex
CREATE INDEX "support_tickets_requesterId_idx" ON "support_tickets"("requesterId");

-- CreateIndex
CREATE INDEX "ticket_messages_ticketId_createdAt_idx" ON "ticket_messages"("ticketId", "createdAt");

-- CreateIndex
CREATE INDEX "notifications_userId_status_idx" ON "notifications"("userId", "status");

-- CreateIndex
CREATE INDEX "email_logs_toAddress_createdAt_idx" ON "email_logs"("toAddress", "createdAt");

-- CreateIndex
CREATE INDEX "sms_logs_toPhone_createdAt_idx" ON "sms_logs"("toPhone", "createdAt");

-- CreateIndex
CREATE INDEX "whatsapp_logs_toPhone_createdAt_idx" ON "whatsapp_logs"("toPhone", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "pages_slugId_key" ON "pages"("slugId");

-- CreateIndex
CREATE INDEX "pages_kind_status_idx" ON "pages"("kind", "status");

-- CreateIndex
CREATE UNIQUE INDEX "page_versions_pageId_version_key" ON "page_versions"("pageId", "version");

-- CreateIndex
CREATE UNIQUE INDEX "page_redirects_fromPath_key" ON "page_redirects"("fromPath");

-- CreateIndex
CREATE UNIQUE INDEX "slugs_slug_locale_key" ON "slugs"("slug", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "slugs_entityType_entityId_locale_key" ON "slugs"("entityType", "entityId", "locale");

-- CreateIndex
CREATE INDEX "slug_history_oldSlug_locale_idx" ON "slug_history"("oldSlug", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "seo_metadata_pageId_key" ON "seo_metadata"("pageId");

-- CreateIndex
CREATE UNIQUE INDEX "sitemaps_segment_locale_key" ON "sitemaps"("segment", "locale");

-- CreateIndex
CREATE INDEX "sitemap_entries_sitemapId_idx" ON "sitemap_entries"("sitemapId");

-- CreateIndex
CREATE UNIQUE INDEX "sitemap_entries_sitemapId_loc_key" ON "sitemap_entries"("sitemapId", "loc");

-- CreateIndex
CREATE INDEX "internal_links_fromEntityType_fromEntityId_idx" ON "internal_links"("fromEntityType", "fromEntityId");

-- CreateIndex
CREATE INDEX "internal_links_toEntityType_toEntityId_idx" ON "internal_links"("toEntityType", "toEntityId");

-- CreateIndex
CREATE INDEX "search_queries_query_createdAt_idx" ON "search_queries"("query", "createdAt");

-- CreateIndex
CREATE INDEX "consents_userId_consentType_createdAt_idx" ON "consents"("userId", "consentType", "createdAt");

-- CreateIndex
CREATE INDEX "privacy_events_userId_createdAt_idx" ON "privacy_events"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "document_access_logs_doctorDocumentId_createdAt_idx" ON "document_access_logs"("doctorDocumentId", "createdAt");

-- CreateIndex
CREATE INDEX "document_access_logs_accessorUserId_createdAt_idx" ON "document_access_logs"("accessorUserId", "createdAt");

-- CreateIndex
CREATE INDEX "data_retention_jobs_status_scheduledFor_idx" ON "data_retention_jobs"("status", "scheduledFor");

-- CreateIndex
CREATE UNIQUE INDEX "legal_hold_flags_entityType_entityId_key" ON "legal_hold_flags"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "entity_content_maps_contentType_contentId_idx" ON "entity_content_maps"("contentType", "contentId");

-- CreateIndex
CREATE UNIQUE INDEX "entity_content_maps_commerceType_commerceId_contentType_con_key" ON "entity_content_maps"("commerceType", "commerceId", "contentType", "contentId", "relationshipType");

-- AddForeignKey
ALTER TABLE "user_identities" ADD CONSTRAINT "user_identities_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "permissions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mfa_devices" ADD CONSTRAINT "mfa_devices_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "login_attempts" ADD CONSTRAINT "login_attempts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_actorUserId_fkey" FOREIGN KEY ("actorUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_profiles" ADD CONSTRAINT "customer_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_addresses" ADD CONSTRAINT "customer_addresses_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customer_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_preferences" ADD CONSTRAINT "customer_preferences_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customer_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_wallets" ADD CONSTRAINT "customer_wallets_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customer_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_referrals" ADD CONSTRAINT "customer_referrals_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customer_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_referrals" ADD CONSTRAINT "customer_referrals_referralCodeId_fkey" FOREIGN KEY ("referralCodeId") REFERENCES "doctor_referral_codes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_notifications" ADD CONSTRAINT "customer_notifications_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customer_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saved_items" ADD CONSTRAINT "saved_items_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctor_profiles" ADD CONSTRAINT "doctor_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctor_verifications" ADD CONSTRAINT "doctor_verifications_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctor_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctor_documents" ADD CONSTRAINT "doctor_documents_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctor_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctor_licenses" ADD CONSTRAINT "doctor_licenses_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctor_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctor_specialties" ADD CONSTRAINT "doctor_specialties_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctor_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctor_languages" ADD CONSTRAINT "doctor_languages_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctor_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctor_clinics" ADD CONSTRAINT "doctor_clinics_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctor_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctor_availability_slots" ADD CONSTRAINT "doctor_availability_slots_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctor_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctor_appointments" ADD CONSTRAINT "doctor_appointments_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctor_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctor_appointments" ADD CONSTRAINT "doctor_appointments_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customer_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctor_appointments" ADD CONSTRAINT "doctor_appointments_slotId_fkey" FOREIGN KEY ("slotId") REFERENCES "doctor_availability_slots"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctor_appointments" ADD CONSTRAINT "doctor_appointments_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "doctor_clinics"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctor_consultations" ADD CONSTRAINT "doctor_consultations_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "doctor_appointments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctor_consultations" ADD CONSTRAINT "doctor_consultations_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctor_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consultation_notes" ADD CONSTRAINT "consultation_notes_consultationId_fkey" FOREIGN KEY ("consultationId") REFERENCES "doctor_consultations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctor_prescriptions" ADD CONSTRAINT "doctor_prescriptions_consultationId_fkey" FOREIGN KEY ("consultationId") REFERENCES "doctor_consultations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctor_reviews" ADD CONSTRAINT "doctor_reviews_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctor_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctor_reviews" ADD CONSTRAINT "doctor_reviews_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customer_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctor_reviews" ADD CONSTRAINT "doctor_reviews_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "doctor_appointments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctor_referral_codes" ADD CONSTRAINT "doctor_referral_codes_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctor_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctor_payouts" ADD CONSTRAINT "doctor_payouts_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctor_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctor_earnings_ledger" ADD CONSTRAINT "doctor_earnings_ledger_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctor_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "brands"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_manufacturerId_fkey" FOREIGN KEY ("manufacturerId") REFERENCES "manufacturers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_productGroupId_fkey" FOREIGN KEY ("productGroupId") REFERENCES "product_groups"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_variants" ADD CONSTRAINT "product_variants_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_images" ADD CONSTRAINT "product_images_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_tags" ADD CONSTRAINT "product_tags_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_content_blocks" ADD CONSTRAINT "product_content_blocks_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_ingredients" ADD CONSTRAINT "product_ingredients_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_relationships" ADD CONSTRAINT "product_relationships_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_relationships" ADD CONSTRAINT "product_relationships_relatedProductId_fkey" FOREIGN KEY ("relatedProductId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_faqs" ADD CONSTRAINT "product_faqs_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_reviews" ADD CONSTRAINT "product_reviews_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_reviews" ADD CONSTRAINT "product_reviews_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customer_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organs" ADD CONSTRAINT "organs_bodySystemId_fkey" FOREIGN KEY ("bodySystemId") REFERENCES "body_systems"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conditions" ADD CONSTRAINT "conditions_bodySystemId_fkey" FOREIGN KEY ("bodySystemId") REFERENCES "body_systems"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conditions" ADD CONSTRAINT "conditions_organId_fkey" FOREIGN KEY ("organId") REFERENCES "organs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "condition_symptoms" ADD CONSTRAINT "condition_symptoms_conditionId_fkey" FOREIGN KEY ("conditionId") REFERENCES "conditions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "condition_symptoms" ADD CONSTRAINT "condition_symptoms_symptomId_fkey" FOREIGN KEY ("symptomId") REFERENCES "symptoms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pet_conditions" ADD CONSTRAINT "pet_conditions_petSpeciesId_fkey" FOREIGN KEY ("petSpeciesId") REFERENCES "pet_species"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "knowledge_articles" ADD CONSTRAINT "knowledge_articles_bodySystemId_fkey" FOREIGN KEY ("bodySystemId") REFERENCES "body_systems"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "knowledge_articles" ADD CONSTRAINT "knowledge_articles_organId_fkey" FOREIGN KEY ("organId") REFERENCES "organs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "knowledge_articles" ADD CONSTRAINT "knowledge_articles_conditionId_fkey" FOREIGN KEY ("conditionId") REFERENCES "conditions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "knowledge_articles" ADD CONSTRAINT "knowledge_articles_ageGroupId_fkey" FOREIGN KEY ("ageGroupId") REFERENCES "age_groups"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "knowledge_articles" ADD CONSTRAINT "knowledge_articles_genderTopicId_fkey" FOREIGN KEY ("genderTopicId") REFERENCES "gender_topics"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "knowledge_articles" ADD CONSTRAINT "knowledge_articles_petSpeciesId_fkey" FOREIGN KEY ("petSpeciesId") REFERENCES "pet_species"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "knowledge_articles" ADD CONSTRAINT "knowledge_articles_petConditionId_fkey" FOREIGN KEY ("petConditionId") REFERENCES "pet_conditions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_references" ADD CONSTRAINT "article_references_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "knowledge_articles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medical_reviews" ADD CONSTRAINT "medical_reviews_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "knowledge_articles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_versions" ADD CONSTRAINT "content_versions_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "knowledge_articles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bundle_items" ADD CONSTRAINT "bundle_items_bundleId_fkey" FOREIGN KEY ("bundleId") REFERENCES "bundles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bundle_items" ADD CONSTRAINT "bundle_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bundle_items" ADD CONSTRAINT "bundle_items_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "product_variants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coupons" ADD CONSTRAINT "coupons_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaigns"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coupon_rules" ADD CONSTRAINT "coupon_rules_couponId_fkey" FOREIGN KEY ("couponId") REFERENCES "coupons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coupon_redemptions" ADD CONSTRAINT "coupon_redemptions_couponId_fkey" FOREIGN KEY ("couponId") REFERENCES "coupons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "referral_rules" ADD CONSTRAINT "referral_rules_referralCodeId_fkey" FOREIGN KEY ("referralCodeId") REFERENCES "doctor_referral_codes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carts" ADD CONSTRAINT "carts_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customer_profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "carts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "product_variants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "checkouts" ADD CONSTRAINT "checkouts_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "carts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "checkout_events" ADD CONSTRAINT "checkout_events_checkoutId_fkey" FOREIGN KEY ("checkoutId") REFERENCES "checkouts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customer_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_checkoutId_fkey" FOREIGN KEY ("checkoutId") REFERENCES "checkouts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "product_variants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_status_history" ADD CONSTRAINT "order_status_history_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_attempts" ADD CONSTRAINT "payment_attempts_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "payments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refunds" ADD CONSTRAINT "refunds_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "payments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_batches" ADD CONSTRAINT "inventory_batches_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "warehouses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_batches" ADD CONSTRAINT "inventory_batches_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "product_variants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_movements" ADD CONSTRAINT "inventory_movements_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "inventory_batches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_reservations" ADD CONSTRAINT "stock_reservations_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "inventory_batches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_reservations" ADD CONSTRAINT "stock_reservations_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "product_variants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipments" ADD CONSTRAINT "shipments_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipments" ADD CONSTRAINT "shipments_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "warehouses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipment_events" ADD CONSTRAINT "shipment_events_shipmentId_fkey" FOREIGN KEY ("shipmentId") REFERENCES "shipments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipping_labels" ADD CONSTRAINT "shipping_labels_shipmentId_fkey" FOREIGN KEY ("shipmentId") REFERENCES "shipments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "support_tickets" ADD CONSTRAINT "support_tickets_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ticket_messages" ADD CONSTRAINT "ticket_messages_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "support_tickets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pages" ADD CONSTRAINT "pages_slugId_fkey" FOREIGN KEY ("slugId") REFERENCES "slugs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "page_versions" ADD CONSTRAINT "page_versions_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "pages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "page_redirects" ADD CONSTRAINT "page_redirects_fromPageId_fkey" FOREIGN KEY ("fromPageId") REFERENCES "pages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "slug_history" ADD CONSTRAINT "slug_history_slugId_fkey" FOREIGN KEY ("slugId") REFERENCES "slugs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seo_metadata" ADD CONSTRAINT "seo_metadata_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "pages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sitemap_entries" ADD CONSTRAINT "sitemap_entries_sitemapId_fkey" FOREIGN KEY ("sitemapId") REFERENCES "sitemaps"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consents" ADD CONSTRAINT "consents_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "privacy_events" ADD CONSTRAINT "privacy_events_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document_access_logs" ADD CONSTRAINT "document_access_logs_doctorDocumentId_fkey" FOREIGN KEY ("doctorDocumentId") REFERENCES "doctor_documents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

