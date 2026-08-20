import { prisma } from "../db";
import {
  calcAdvancePaise,
  calcLine,
  calcQuoteTotals,
  inrToPaise,
  type LineInput,
} from "./money";
import { DEFAULT_TERMS } from "./money";

export type ItemDraft = LineInput & {
  serviceName: string;
  category?: string;
  description?: string;
  billingType?: string;
  catalogServiceId?: string;
};

export function recomputeFromItems(
  items: ItemDraft[],
  companyState: string,
  clientState: string | null | undefined,
  advancePercent: number,
) {
  const lines = items.map((item) => calcLine(item));
  const totals = calcQuoteTotals(lines, companyState, clientState);
  const { advancePaise, balancePaise } = calcAdvancePaise(
    totals.grandTotalPaise,
    advancePercent,
  );
  return { lines, totals, advancePaise, balancePaise };
}

export async function persistQuotationTotals(quotationId: string) {
  const quotation = await prisma.quotation.findUniqueOrThrow({
    where: { id: quotationId },
    include: { items: { orderBy: { sortOrder: "asc" } } },
  });
  if (quotation.isImmutable) {
    throw new Error("Accepted quotation cannot be modified");
  }

  const drafts: ItemDraft[] = quotation.items.map((it) => ({
    serviceName: it.serviceName,
    category: it.category || undefined,
    description: it.description || undefined,
    quantity: it.quantity,
    unitPriceInr: it.unitPricePaise / 100,
    discountPercent: it.discountPercent,
    discountAmountInr: it.discountPaise / 100,
    gstPercent: it.gstPercent,
    billingType: it.billingType,
  }));

  const { lines, totals, advancePaise, balancePaise } = recomputeFromItems(
    drafts,
    quotation.companyState,
    quotation.clientState,
    quotation.advancePercent,
  );

  await prisma.$transaction(
    quotation.items.map((item, i) =>
      prisma.quotationItem.update({
        where: { id: item.id },
        data: {
          discountPaise: lines[i].discountPaise,
          taxablePaise: lines[i].taxablePaise,
          gstPaise: lines[i].gstPaise,
          totalPaise: lines[i].totalPaise,
          unitPricePaise: lines[i].unitPricePaise,
        },
      }),
    ),
  );

  return prisma.quotation.update({
    where: { id: quotationId },
    data: {
      subtotalPaise: totals.subtotalPaise,
      discountPaise: totals.discountPaise,
      taxablePaise: totals.taxablePaise,
      cgstPaise: totals.cgstPaise,
      sgstPaise: totals.sgstPaise,
      igstPaise: totals.igstPaise,
      totalGstPaise: totals.totalGstPaise,
      grandTotalPaise: totals.grandTotalPaise,
      gstMode: totals.gstMode,
      advancePaise,
      balancePaise,
    },
    include: { items: { orderBy: { sortOrder: "asc" } }, client: true },
  });
}

export function defaultTermsText() {
  return DEFAULT_TERMS.map((t, i) => `${i + 1}. ${t}`).join("\n\n");
}

export function replaceTemplate(
  template: string,
  vars: Record<string, string>,
) {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => vars[key] ?? "");
}

export { inrToPaise };
