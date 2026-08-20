import { prisma } from "@/lib/db";
import { handleApiError, jsonError, jsonOk } from "@/lib/api";
import { getCompanyProfile } from "@/lib/quotations/numbering";

type Params = { params: Promise<{ number: string; token: string }> };

export async function GET(req: Request, { params }: Params) {
  try {
    const { number, token } = await params;
    const quotationNumber = decodeURIComponent(number);

    const quotation = await prisma.quotation.findUnique({
      where: { quotationNumber },
      include: {
        client: {
          select: {
            id: true,
            clientCode: true,
            companyName: true,
            contactPerson: true,
            email: true,
            mobile: true,
            whatsapp: true,
            gstin: true,
            address: true,
            city: true,
            state: true,
            pincode: true,
            country: true,
            website: true,
          },
        },
        items: {
          orderBy: { sortOrder: "asc" },
          select: {
            id: true,
            sortOrder: true,
            serviceName: true,
            category: true,
            description: true,
            quantity: true,
            unitPricePaise: true,
            discountPercent: true,
            discountPaise: true,
            gstPercent: true,
            taxablePaise: true,
            gstPaise: true,
            totalPaise: true,
            billingType: true,
          },
        },
        acceptances: {
          orderBy: { acceptedAt: "desc" },
          take: 1,
          select: {
            id: true,
            acceptedName: true,
            acceptedEmail: true,
            acceptedAt: true,
            quotationVersion: true,
          },
        },
      },
    });

    if (!quotation || quotation.secureToken !== token) {
      return jsonError("Quotation not found", 404);
    }
    if (["CANCELLED", "REJECTED"].includes(quotation.status)) {
      return jsonError("This quotation is no longer available", 410);
    }

    const now = new Date();
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      null;

    const data: {
      status?: "VIEWED";
      viewCount: { increment: number };
      lastViewedAt: Date;
      firstViewedAt?: Date;
    } = {
      viewCount: { increment: 1 },
      lastViewedAt: now,
    };
    if (!quotation.firstViewedAt) data.firstViewedAt = now;
    if (quotation.status === "SENT") data.status = "VIEWED";

    const updated = await prisma.quotation.update({
      where: { id: quotation.id },
      data,
    });

    await prisma.quotationEvent.create({
      data: {
        quotationId: quotation.id,
        type: "quotation.viewed",
        message: "Public quotation viewed",
        ipAddress: ip,
        meta: { viewCount: updated.viewCount },
      },
    });

    const company = await getCompanyProfile();

    return jsonOk({
      noindex: true,
      quotation: {
        id: quotation.id,
        quotationNumber: quotation.quotationNumber,
        status: updated.status,
        paymentStatus: quotation.paymentStatus,
        version: quotation.version,
        quotationDate: quotation.quotationDate,
        validUntil: quotation.validUntil,
        title: quotation.title,
        notes: quotation.notes,
        currency: quotation.currency,
        companyState: quotation.companyState,
        clientState: quotation.clientState,
        gstMode: quotation.gstMode,
        subtotalPaise: quotation.subtotalPaise,
        discountPaise: quotation.discountPaise,
        taxablePaise: quotation.taxablePaise,
        cgstPaise: quotation.cgstPaise,
        sgstPaise: quotation.sgstPaise,
        igstPaise: quotation.igstPaise,
        totalGstPaise: quotation.totalGstPaise,
        grandTotalPaise: quotation.grandTotalPaise,
        paymentPlanType: quotation.paymentPlanType,
        advancePercent: quotation.advancePercent,
        advancePaise: quotation.advancePaise,
        balancePaise: quotation.balancePaise,
        paidPaise: quotation.paidPaise,
        payNowPaise: Math.max(0, quotation.advancePaise - quotation.paidPaise) || Math.max(0, quotation.grandTotalPaise - quotation.paidPaise),
        termsSnapshot: quotation.termsSnapshot,
        whyChooseEnabled: quotation.whyChooseEnabled,
        showTrust: quotation.showTrust,
        sentAt: quotation.sentAt,
        acceptedAt: quotation.acceptedAt,
        isImmutable: quotation.isImmutable,
        viewCount: updated.viewCount,
        client: quotation.client,
        items: quotation.items,
        accepted: Boolean(quotation.acceptances.length || quotation.acceptedAt),
      },
      company: {
        legalName: company.legalName,
        brandName: company.brandName,
        gstin: company.gstin,
        phone: company.phone,
        whatsapp: company.whatsapp,
        email: company.email,
        website: company.website,
        registeredAddress: company.registeredAddress,
        billingAddress: company.billingAddress,
        state: company.state,
        city: company.city,
        pincode: company.pincode,
        country: company.country,
        logoUrl: company.logoUrl,
        authorizedPerson: company.authorizedPerson,
        designation: company.designation,
        signatureUrl: company.signatureUrl,
        upiId: company.upiId,
        razorpayEnabled: company.razorpayEnabled,
        showWhyChoose: company.showWhyChoose,
        whyChooseItems: company.whyChooseItems,
        trustItems: company.trustItems,
      },
    });
  } catch (err) {
    return handleApiError(err);
  }
}
