-- CreateEnum
CREATE TYPE "QuotationStatus" AS ENUM ('DRAFT', 'SENT', 'VIEWED', 'ACCEPTED', 'PARTIALLY_PAID', 'PAID', 'EXPIRED', 'CANCELLED', 'REJECTED');

-- CreateEnum
CREATE TYPE "QuotePaymentStatus" AS ENUM ('UNPAID', 'INITIATED', 'PARTIALLY_PAID', 'PAID', 'FAILED', 'REFUNDED', 'OVERDUE');

-- CreateEnum
CREATE TYPE "QuotePaymentPlanType" AS ENUM ('ADVANCE_BALANCE', 'FULL', 'CUSTOM_PERCENT', 'MILESTONE', 'SUBSCRIPTION', 'CUSTOM_SCHEDULE');

-- CreateEnum
CREATE TYPE "QuoteSubStatus" AS ENUM ('DRAFT', 'CREATED', 'PENDING', 'ACTIVE', 'PAUSED', 'CANCELLED', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "QuoteInvoiceStatus" AS ENUM ('DRAFT', 'ISSUED', 'PARTIALLY_PAID', 'PAID', 'OVERDUE', 'CANCELLED');

-- CreateTable
CREATE TABLE "CompanyProfile" (
    "id" TEXT NOT NULL,
    "legalName" TEXT NOT NULL DEFAULT 'Mediashouter',
    "brandName" TEXT NOT NULL DEFAULT 'DisplayAvenue',
    "gstin" TEXT NOT NULL DEFAULT '27ALJPY9454C1ZJ',
    "pan" TEXT,
    "phone" TEXT NOT NULL DEFAULT '9222122333',
    "whatsapp" TEXT,
    "email" TEXT,
    "website" TEXT NOT NULL DEFAULT 'https://displayavenue.com',
    "registeredAddress" TEXT,
    "billingAddress" TEXT,
    "state" TEXT NOT NULL DEFAULT 'Maharashtra',
    "city" TEXT,
    "pincode" TEXT,
    "country" TEXT NOT NULL DEFAULT 'India',
    "logoUrl" TEXT,
    "faviconUrl" TEXT,
    "authorizedPerson" TEXT,
    "designation" TEXT,
    "signatureUrl" TEXT,
    "bankName" TEXT,
    "accountName" TEXT,
    "accountNumber" TEXT,
    "ifsc" TEXT,
    "upiId" TEXT,
    "defaultGstPercent" DOUBLE PRECISION NOT NULL DEFAULT 18,
    "defaultAdvancePct" DOUBLE PRECISION NOT NULL DEFAULT 60,
    "defaultValidityDays" INTEGER NOT NULL DEFAULT 15,
    "quotationPrefix" TEXT NOT NULL DEFAULT 'DA',
    "quotationDigits" INTEGER NOT NULL DEFAULT 5,
    "invoicePrefix" TEXT NOT NULL DEFAULT 'DAV',
    "receiptPrefix" TEXT NOT NULL DEFAULT 'DAR',
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "razorpayEnabled" BOOLEAN NOT NULL DEFAULT true,
    "subscriptionEnabled" BOOLEAN NOT NULL DEFAULT true,
    "showWhyChoose" BOOLEAN NOT NULL DEFAULT true,
    "whyChooseItems" JSONB,
    "trustItems" JSONB,
    "whatsappTemplate" TEXT,
    "emailSubjectTemplate" TEXT,
    "emailBodyTemplate" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CompanyProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuoteClient" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT,
    "clientCode" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "contactPerson" TEXT,
    "email" TEXT,
    "mobile" TEXT,
    "whatsapp" TEXT,
    "gstin" TEXT,
    "pan" TEXT,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "pincode" TEXT,
    "country" TEXT NOT NULL DEFAULT 'India',
    "website" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuoteClient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuoteServiceCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuoteServiceCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuoteCatalogService" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "defaultPriceInr" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "gstPercent" DOUBLE PRECISION NOT NULL DEFAULT 18,
    "billingType" TEXT NOT NULL DEFAULT 'one_time',
    "monthlyPriceInr" DOUBLE PRECISION,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuoteCatalogService_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TermsTemplate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "archived" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TermsTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuotationSequence" (
    "id" TEXT NOT NULL,
    "prefix" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "lastNumber" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "QuotationSequence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvoiceSequence" (
    "id" TEXT NOT NULL,
    "prefix" TEXT NOT NULL,
    "fyLabel" TEXT NOT NULL,
    "lastNumber" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "InvoiceSequence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReceiptSequence" (
    "id" TEXT NOT NULL,
    "prefix" TEXT NOT NULL,
    "fyLabel" TEXT NOT NULL,
    "lastNumber" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ReceiptSequence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Quotation" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT,
    "clientId" TEXT NOT NULL,
    "quotationNumber" TEXT NOT NULL,
    "secureToken" TEXT NOT NULL,
    "passwordHash" TEXT,
    "status" "QuotationStatus" NOT NULL DEFAULT 'DRAFT',
    "paymentStatus" "QuotePaymentStatus" NOT NULL DEFAULT 'UNPAID',
    "version" INTEGER NOT NULL DEFAULT 1,
    "quotationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "validUntil" TIMESTAMP(3) NOT NULL,
    "title" TEXT,
    "notes" TEXT,
    "internalNotes" TEXT,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "companyState" TEXT NOT NULL DEFAULT 'Maharashtra',
    "clientState" TEXT,
    "gstMode" TEXT NOT NULL DEFAULT 'CGST_SGST',
    "subtotalPaise" INTEGER NOT NULL DEFAULT 0,
    "discountPaise" INTEGER NOT NULL DEFAULT 0,
    "taxablePaise" INTEGER NOT NULL DEFAULT 0,
    "cgstPaise" INTEGER NOT NULL DEFAULT 0,
    "sgstPaise" INTEGER NOT NULL DEFAULT 0,
    "igstPaise" INTEGER NOT NULL DEFAULT 0,
    "totalGstPaise" INTEGER NOT NULL DEFAULT 0,
    "grandTotalPaise" INTEGER NOT NULL DEFAULT 0,
    "paymentPlanType" "QuotePaymentPlanType" NOT NULL DEFAULT 'ADVANCE_BALANCE',
    "advancePercent" DOUBLE PRECISION NOT NULL DEFAULT 60,
    "advancePaise" INTEGER NOT NULL DEFAULT 0,
    "balancePaise" INTEGER NOT NULL DEFAULT 0,
    "paidPaise" INTEGER NOT NULL DEFAULT 0,
    "termsTemplateId" TEXT,
    "termsSnapshot" TEXT,
    "termsVersion" TEXT,
    "whyChooseEnabled" BOOLEAN NOT NULL DEFAULT true,
    "showTrust" BOOLEAN NOT NULL DEFAULT true,
    "createdById" TEXT,
    "sentAt" TIMESTAMP(3),
    "firstViewedAt" TIMESTAMP(3),
    "lastViewedAt" TIMESTAMP(3),
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "acceptedAt" TIMESTAMP(3),
    "expiredAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "pdfDownloadedAt" TIMESTAMP(3),
    "isImmutable" BOOLEAN NOT NULL DEFAULT false,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Quotation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuotationItem" (
    "id" TEXT NOT NULL,
    "quotationId" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "serviceName" TEXT NOT NULL,
    "category" TEXT,
    "description" TEXT,
    "quantity" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "unitPricePaise" INTEGER NOT NULL DEFAULT 0,
    "discountPercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "discountPaise" INTEGER NOT NULL DEFAULT 0,
    "gstPercent" DOUBLE PRECISION NOT NULL DEFAULT 18,
    "taxablePaise" INTEGER NOT NULL DEFAULT 0,
    "gstPaise" INTEGER NOT NULL DEFAULT 0,
    "totalPaise" INTEGER NOT NULL DEFAULT 0,
    "billingType" TEXT NOT NULL DEFAULT 'one_time',
    "catalogServiceId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuotationItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuotationVersion" (
    "id" TEXT NOT NULL,
    "quotationId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "snapshot" JSONB NOT NULL,
    "createdById" TEXT,
    "changeNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuotationVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuotationAcceptance" (
    "id" TEXT NOT NULL,
    "quotationId" TEXT NOT NULL,
    "quotationVersion" INTEGER NOT NULL,
    "acceptedName" TEXT,
    "acceptedEmail" TEXT,
    "termsVersion" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "acceptedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuotationAcceptance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuoteMilestone" (
    "id" TEXT NOT NULL,
    "quotationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "percent" DOUBLE PRECISION NOT NULL,
    "amountPaise" INTEGER NOT NULL,
    "dueDate" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'pending',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuoteMilestone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuotePayment" (
    "id" TEXT NOT NULL,
    "quotationId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "organizationId" TEXT,
    "invoiceId" TEXT,
    "amountPaise" INTEGER NOT NULL,
    "gstPaise" INTEGER NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "purpose" TEXT NOT NULL DEFAULT 'advance',
    "milestoneId" TEXT,
    "method" TEXT,
    "status" TEXT NOT NULL DEFAULT 'CREATED',
    "razorpayOrderId" TEXT,
    "razorpayPaymentId" TEXT,
    "razorpaySignature" TEXT,
    "failureReason" TEXT,
    "paidAt" TIMESTAMP(3),
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuotePayment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuoteInvoice" (
    "id" TEXT NOT NULL,
    "quotationId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "organizationId" TEXT,
    "invoiceNumber" TEXT NOT NULL,
    "status" "QuoteInvoiceStatus" NOT NULL DEFAULT 'DRAFT',
    "amountPaise" INTEGER NOT NULL,
    "gstPaise" INTEGER NOT NULL DEFAULT 0,
    "taxablePaise" INTEGER NOT NULL DEFAULT 0,
    "issuedAt" TIMESTAMP(3),
    "dueAt" TIMESTAMP(3),
    "paidAt" TIMESTAMP(3),
    "lineItems" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuoteInvoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuoteReceipt" (
    "id" TEXT NOT NULL,
    "receiptNumber" TEXT NOT NULL,
    "quotationId" TEXT NOT NULL,
    "paymentId" TEXT NOT NULL,
    "invoiceId" TEXT,
    "clientId" TEXT NOT NULL,
    "organizationId" TEXT,
    "amountPaise" INTEGER NOT NULL,
    "gstPaise" INTEGER NOT NULL DEFAULT 0,
    "balancePaise" INTEGER NOT NULL DEFAULT 0,
    "paidAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "method" TEXT,
    "transactionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuoteReceipt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuoteSubscription" (
    "id" TEXT NOT NULL,
    "quotationId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "organizationId" TEXT,
    "planName" TEXT NOT NULL,
    "amountPaise" INTEGER NOT NULL,
    "gstPaise" INTEGER NOT NULL DEFAULT 0,
    "frequency" TEXT NOT NULL DEFAULT 'monthly',
    "status" "QuoteSubStatus" NOT NULL DEFAULT 'DRAFT',
    "razorpayPlanId" TEXT,
    "razorpaySubscriptionId" TEXT,
    "startDate" TIMESTAMP(3),
    "nextBillingDate" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "pausedAt" TIMESTAMP(3),
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuoteSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuotationEvent" (
    "id" TEXT NOT NULL,
    "quotationId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "message" TEXT,
    "meta" JSONB,
    "actorUserId" TEXT,
    "ipAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuotationEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RazorpayWebhookEvent" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "processedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RazorpayWebhookEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "QuoteClient_clientCode_key" ON "QuoteClient"("clientCode");

-- CreateIndex
CREATE INDEX "QuoteClient_companyName_idx" ON "QuoteClient"("companyName");

-- CreateIndex
CREATE INDEX "QuoteClient_email_idx" ON "QuoteClient"("email");

-- CreateIndex
CREATE INDEX "QuoteClient_mobile_idx" ON "QuoteClient"("mobile");

-- CreateIndex
CREATE INDEX "QuoteClient_organizationId_idx" ON "QuoteClient"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "QuoteServiceCategory_name_key" ON "QuoteServiceCategory"("name");

-- CreateIndex
CREATE INDEX "QuoteCatalogService_categoryId_isActive_idx" ON "QuoteCatalogService"("categoryId", "isActive");

-- CreateIndex
CREATE INDEX "QuoteCatalogService_name_idx" ON "QuoteCatalogService"("name");

-- CreateIndex
CREATE UNIQUE INDEX "QuotationSequence_prefix_year_key" ON "QuotationSequence"("prefix", "year");

-- CreateIndex
CREATE UNIQUE INDEX "InvoiceSequence_prefix_fyLabel_key" ON "InvoiceSequence"("prefix", "fyLabel");

-- CreateIndex
CREATE UNIQUE INDEX "ReceiptSequence_prefix_fyLabel_key" ON "ReceiptSequence"("prefix", "fyLabel");

-- CreateIndex
CREATE UNIQUE INDEX "Quotation_quotationNumber_key" ON "Quotation"("quotationNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Quotation_secureToken_key" ON "Quotation"("secureToken");

-- CreateIndex
CREATE INDEX "Quotation_clientId_idx" ON "Quotation"("clientId");

-- CreateIndex
CREATE INDEX "Quotation_status_idx" ON "Quotation"("status");

-- CreateIndex
CREATE INDEX "Quotation_paymentStatus_idx" ON "Quotation"("paymentStatus");

-- CreateIndex
CREATE INDEX "Quotation_createdAt_idx" ON "Quotation"("createdAt");

-- CreateIndex
CREATE INDEX "Quotation_validUntil_idx" ON "Quotation"("validUntil");

-- CreateIndex
CREATE INDEX "Quotation_organizationId_idx" ON "Quotation"("organizationId");

-- CreateIndex
CREATE INDEX "QuotationItem_quotationId_sortOrder_idx" ON "QuotationItem"("quotationId", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "QuotationVersion_quotationId_version_key" ON "QuotationVersion"("quotationId", "version");

-- CreateIndex
CREATE INDEX "QuotationAcceptance_quotationId_idx" ON "QuotationAcceptance"("quotationId");

-- CreateIndex
CREATE INDEX "QuoteMilestone_quotationId_idx" ON "QuoteMilestone"("quotationId");

-- CreateIndex
CREATE UNIQUE INDEX "QuotePayment_razorpayOrderId_key" ON "QuotePayment"("razorpayOrderId");

-- CreateIndex
CREATE INDEX "QuotePayment_quotationId_status_idx" ON "QuotePayment"("quotationId", "status");

-- CreateIndex
CREATE INDEX "QuotePayment_clientId_idx" ON "QuotePayment"("clientId");

-- CreateIndex
CREATE INDEX "QuotePayment_organizationId_idx" ON "QuotePayment"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "QuoteInvoice_invoiceNumber_key" ON "QuoteInvoice"("invoiceNumber");

-- CreateIndex
CREATE INDEX "QuoteInvoice_quotationId_idx" ON "QuoteInvoice"("quotationId");

-- CreateIndex
CREATE INDEX "QuoteInvoice_clientId_idx" ON "QuoteInvoice"("clientId");

-- CreateIndex
CREATE INDEX "QuoteInvoice_status_idx" ON "QuoteInvoice"("status");

-- CreateIndex
CREATE UNIQUE INDEX "QuoteReceipt_receiptNumber_key" ON "QuoteReceipt"("receiptNumber");

-- CreateIndex
CREATE INDEX "QuoteReceipt_quotationId_idx" ON "QuoteReceipt"("quotationId");

-- CreateIndex
CREATE INDEX "QuoteReceipt_paymentId_idx" ON "QuoteReceipt"("paymentId");

-- CreateIndex
CREATE INDEX "QuoteReceipt_clientId_idx" ON "QuoteReceipt"("clientId");

-- CreateIndex
CREATE UNIQUE INDEX "QuoteSubscription_razorpaySubscriptionId_key" ON "QuoteSubscription"("razorpaySubscriptionId");

-- CreateIndex
CREATE INDEX "QuoteSubscription_quotationId_idx" ON "QuoteSubscription"("quotationId");

-- CreateIndex
CREATE INDEX "QuoteSubscription_clientId_idx" ON "QuoteSubscription"("clientId");

-- CreateIndex
CREATE INDEX "QuoteSubscription_status_idx" ON "QuoteSubscription"("status");

-- CreateIndex
CREATE INDEX "QuotationEvent_quotationId_createdAt_idx" ON "QuotationEvent"("quotationId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "RazorpayWebhookEvent_eventId_key" ON "RazorpayWebhookEvent"("eventId");

-- AddForeignKey
ALTER TABLE "QuoteClient" ADD CONSTRAINT "QuoteClient_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuoteCatalogService" ADD CONSTRAINT "QuoteCatalogService_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "QuoteServiceCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quotation" ADD CONSTRAINT "Quotation_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quotation" ADD CONSTRAINT "Quotation_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "QuoteClient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuotationItem" ADD CONSTRAINT "QuotationItem_quotationId_fkey" FOREIGN KEY ("quotationId") REFERENCES "Quotation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuotationVersion" ADD CONSTRAINT "QuotationVersion_quotationId_fkey" FOREIGN KEY ("quotationId") REFERENCES "Quotation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuotationAcceptance" ADD CONSTRAINT "QuotationAcceptance_quotationId_fkey" FOREIGN KEY ("quotationId") REFERENCES "Quotation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuoteMilestone" ADD CONSTRAINT "QuoteMilestone_quotationId_fkey" FOREIGN KEY ("quotationId") REFERENCES "Quotation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuotePayment" ADD CONSTRAINT "QuotePayment_quotationId_fkey" FOREIGN KEY ("quotationId") REFERENCES "Quotation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuotePayment" ADD CONSTRAINT "QuotePayment_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "QuoteClient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuotePayment" ADD CONSTRAINT "QuotePayment_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuoteInvoice" ADD CONSTRAINT "QuoteInvoice_quotationId_fkey" FOREIGN KEY ("quotationId") REFERENCES "Quotation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuoteInvoice" ADD CONSTRAINT "QuoteInvoice_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "QuoteClient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuoteInvoice" ADD CONSTRAINT "QuoteInvoice_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuoteReceipt" ADD CONSTRAINT "QuoteReceipt_quotationId_fkey" FOREIGN KEY ("quotationId") REFERENCES "Quotation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuoteReceipt" ADD CONSTRAINT "QuoteReceipt_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "QuotePayment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuoteReceipt" ADD CONSTRAINT "QuoteReceipt_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "QuoteInvoice"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuoteReceipt" ADD CONSTRAINT "QuoteReceipt_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "QuoteClient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuoteReceipt" ADD CONSTRAINT "QuoteReceipt_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuoteSubscription" ADD CONSTRAINT "QuoteSubscription_quotationId_fkey" FOREIGN KEY ("quotationId") REFERENCES "Quotation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuoteSubscription" ADD CONSTRAINT "QuoteSubscription_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "QuoteClient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuoteSubscription" ADD CONSTRAINT "QuoteSubscription_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuotationEvent" ADD CONSTRAINT "QuotationEvent_quotationId_fkey" FOREIGN KEY ("quotationId") REFERENCES "Quotation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
