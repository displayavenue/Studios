import { useMockProviders } from "@/config/site";

export type AiContentRequest = {
  title: string;
  brand?: string | null;
  description?: string | null;
  attributes?: Record<string, string>;
  costPrice?: number;
  sellingPrice?: number;
};

export type AiContentResult = {
  productTitle: string;
  description: string;
  benefits: string[];
  faq: Array<{ q: string; a: string }>;
  seoTitle: string;
  metaDescription: string;
  googleShoppingTitle: string;
  googleShoppingDescription: string;
  metaAdCopy: string;
  ugcScript: string;
  reelScript: string;
  mock: boolean;
  disclaimer: string;
};

const DISCLAIMER =
  "AI content is generated only from provided product data. No medical claims, certifications, warranties, or fabricated specs.";

/**
 * AI content generation — uses OpenAI when configured, otherwise deterministic templates from verified fields only.
 */
export async function generateProductContent(input: AiContentRequest): Promise<AiContentResult> {
  const baseTitle = input.title;
  const brand = input.brand || "VELORA";
  const facts = input.description || `${baseTitle} from ${brand}.`;

  if (!process.env.OPENAI_API_KEY || useMockProviders()) {
    return {
      productTitle: baseTitle.slice(0, 100),
      description: `${facts}\n\nSold by VELORA. Product details are based on supplier-provided information.`,
      benefits: [
        `Useful everyday ${baseTitle.toLowerCase()}`,
        "Curated for quality and practicality",
        "Ships across India where serviceable",
      ],
      faq: [
        {
          q: "What is included?",
          a: "Please refer to the product description and specifications provided by the supplier. We do not invent missing details.",
        },
        {
          q: "What is the return policy?",
          a: "Returns follow VELORA’s published returns policy and applicable supplier conditions.",
        },
      ],
      seoTitle: `${baseTitle} | VELORA`,
      metaDescription: facts.slice(0, 155),
      googleShoppingTitle: baseTitle.slice(0, 150),
      googleShoppingDescription: facts.slice(0, 500),
      metaAdCopy: `Discover ${baseTitle} at VELORA. Smart products. Better living.`,
      ugcScript: `Hook: Need a better ${baseTitle}? Here's what stood out based on the listed features...`,
      reelScript: `Scene 1: Product reveal. Scene 2: Listed benefits only. Scene 3: Shop VELORA CTA.`,
      mock: true,
      disclaimer: DISCLAIMER + " (Mock/template generator — OpenAI not connected.)",
    };
  }

  // Live OpenAI path — constrained prompt
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You write e-commerce copy using ONLY provided facts. Never invent specs, medical claims, certifications, warranties, shipping times, or materials not listed. Return JSON.",
        },
        {
          role: "user",
          content: JSON.stringify(input),
        },
      ],
    }),
  });

  if (!res.ok) {
    throw new Error("AI_GENERATION_FAILED");
  }

  const data = (await res.json()) as {
    choices: Array<{ message: { content: string } }>;
  };
  const parsed = JSON.parse(data.choices[0]?.message?.content || "{}") as Partial<AiContentResult>;

  return {
    productTitle: parsed.productTitle || baseTitle,
    description: parsed.description || facts,
    benefits: parsed.benefits || [],
    faq: parsed.faq || [],
    seoTitle: parsed.seoTitle || `${baseTitle} | VELORA`,
    metaDescription: parsed.metaDescription || facts.slice(0, 155),
    googleShoppingTitle: parsed.googleShoppingTitle || baseTitle.slice(0, 150),
    googleShoppingDescription: parsed.googleShoppingDescription || facts.slice(0, 500),
    metaAdCopy: parsed.metaAdCopy || `Shop ${baseTitle} at VELORA.`,
    ugcScript: parsed.ugcScript || "",
    reelScript: parsed.reelScript || "",
    mock: false,
    disclaimer: DISCLAIMER,
  };
}

export async function answerBusinessQuestion(
  question: string,
  context: Record<string, unknown>,
): Promise<{
  observation: string;
  data: unknown;
  recommendation: string;
  expectedImpact: string;
  risk: string;
  confidence: "Low" | "Medium" | "High";
}> {
  // Rule-based assistant using actual context only — never invents metrics
  const q = question.toLowerCase();

  if (q.includes("revenue") && context.revenue != null) {
    return {
      observation: `Today's revenue is available in the command center.`,
      data: { revenue: context.revenue, target: context.revenueTarget },
      recommendation:
        Number(context.revenue) < Number(context.revenueTarget)
          ? "Focus on conversion, AOV, and promoting higher-contribution products. Do not increase ad spend without CAC limits."
          : "Revenue is at or above target — verify net contribution before scaling spend.",
      expectedImpact: "Improved pacing toward the ₹1,00,000 daily revenue objective (not guaranteed).",
      risk: "Optimizing only for revenue can hurt contribution.",
      confidence: "Medium",
    };
  }

  if (q.includes("contribution") || q.includes("profit")) {
    if (context.netContribution == null) {
      return {
        observation: "Net contribution data is insufficient.",
        data: { note: "INSUFFICIENT DATA" },
        recommendation: "Complete order cost finalization before drawing conclusions.",
        expectedImpact: "Accurate profitability decisions.",
        risk: "Acting on incomplete cost data.",
        confidence: "Low",
      };
    }
    return {
      observation: "Net contribution is the primary KPI.",
      data: {
        netContribution: context.netContribution,
        target: context.contributionTarget,
      },
      recommendation:
        Number(context.netContribution) < Number(context.contributionTarget)
          ? "Reduce inefficient CAC, raise AOV via bundles, promote high-contribution products."
          : "Maintain spend caps and protect contribution while testing carefully.",
      expectedImpact: "Progress toward ₹10,000 daily net contribution objective (not guaranteed).",
      risk: "Over-scaling winners with thin inventory or high RTO.",
      confidence: "Medium",
    };
  }

  return {
    observation: "Question received by VELORA AI.",
    data: context,
    recommendation:
      "Use winners dashboard, underperforming list, and store health. Never invent missing metrics.",
    expectedImpact: "Clearer next actions based on available data.",
    risk: "Incomplete data may lead to premature optimization.",
    confidence: "Low",
  };
}
