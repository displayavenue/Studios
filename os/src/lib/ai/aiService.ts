import OpenAI from "openai";
import { Prisma } from "@prisma/client";
import { prisma } from "../db";
import { z } from "zod";

export type AiFeature =
  | "business_analysis"
  | "strategy"
  | "competitor_analysis"
  | "cold_call"
  | "plan_90_day"
  | "pdf_summary"
  | "monthly_report";

type AiCallOptions = {
  organizationId?: string | null;
  assessmentId?: string | null;
  feature: AiFeature;
  systemPrompt?: string;
  userPayload: Record<string, unknown>;
  schemaDescription: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  validate: (data: unknown) => any;
  forceRefresh?: boolean;
};

const COST_PER_1K_INPUT = 0.00015;
const COST_PER_1K_OUTPUT = 0.0006;

export async function isAiEnabled() {
  const setting = await prisma.setting.findUnique({ where: { key: "ai_enabled" } });
  if (setting) return Boolean(setting.value);
  return process.env.AI_ENABLED !== "false";
}

export async function getAiConfig() {
  const keys = [
    "ai_enabled",
    "ai_model",
    "ai_max_output_tokens",
    "ai_temperature",
    "ai_max_calls_per_assessment",
  ];
  const rows = await prisma.setting.findMany({ where: { key: { in: keys } } });
  const map = Object.fromEntries(rows.map((r) => [r.key, r.value]));
  return {
    enabled: map.ai_enabled != null ? Boolean(map.ai_enabled) : process.env.AI_ENABLED !== "false",
    model: String(map.ai_model ?? process.env.AI_MODEL ?? "gpt-4o-mini"),
    maxOutputTokens: Number(map.ai_max_output_tokens ?? process.env.AI_MAX_OUTPUT_TOKENS ?? 2000),
    temperature: Number(map.ai_temperature ?? process.env.AI_TEMPERATURE ?? 0.4),
    maxCallsPerAssessment: Number(
      map.ai_max_calls_per_assessment ?? process.env.AI_MAX_CALLS_PER_ASSESSMENT ?? 6,
    ),
  };
}

export async function getActivePrompt(key: string) {
  return prisma.aiPromptVersion.findFirst({
    where: { key, isActive: true },
    orderBy: { version: "desc" },
  });
}

function scrubPayload(payload: Record<string, unknown>) {
  const forbidden = [
    "password",
    "token",
    "razorpay",
    "payment",
    "secret",
    "authorization",
    "card",
    "cvv",
  ];
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(payload)) {
    if (forbidden.some((f) => k.toLowerCase().includes(f))) continue;
    out[k] = v;
  }
  return out;
}

/**
 * Structured AI call with OS AiGeneration logging (organizationId + feature).
 * AI must never invent pricing, ROI, fees, or competitor facts.
 */
export async function runAiStructured<T>(options: AiCallOptions): Promise<{
  data: T | null;
  source: "ai" | "cache" | "disabled" | "fallback";
  generationId?: string;
  error?: string;
}> {
  const config = await getAiConfig();
  const safePayload = scrubPayload(options.userPayload);

  if (options.assessmentId && !options.forceRefresh) {
    const cached = await prisma.aiGeneration.findFirst({
      where: {
        assessmentId: options.assessmentId,
        feature: options.feature,
        status: "success",
      },
      orderBy: { createdAt: "desc" },
    });
    if (cached?.responsePayload) {
      try {
        const validated = options.validate(cached.responsePayload) as T;
        return { data: validated, source: "cache", generationId: cached.id };
      } catch {
        // continue
      }
    }
  }

  if (!config.enabled) {
    return { data: null, source: "disabled" };
  }

  if (!process.env.OPENAI_API_KEY) {
    await logFailure(options, config.model, "OPENAI_API_KEY not configured", safePayload);
    return { data: null, source: "fallback", error: "AI not configured" };
  }

  if (options.assessmentId) {
    const count = await prisma.aiGeneration.count({
      where: {
        assessmentId: options.assessmentId,
        status: { in: ["success", "failed"] },
      },
    });
    if (count >= config.maxCallsPerAssessment) {
      return { data: null, source: "fallback", error: "AI call limit reached" };
    }
  }

  const prompt = await getActivePrompt(options.feature);
  const system = options.systemPrompt || prompt?.content || defaultSystemPrompt(options.feature);

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  try {
    const completion = await client.chat.completions.create({
      model: config.model,
      temperature: config.temperature,
      max_tokens: config.maxOutputTokens,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `${system}

CRITICAL RULES:
- Return ONLY valid JSON matching this shape: ${options.schemaDescription}
- Do NOT invent numeric pricing, fees, ROI, ad spend, scores, or competitor facts.
- Use ONLY supplied data. Numbers from the backend must remain unchanged if referenced.
- Do not invent competitors or contact information.
- Empty competitor lists are valid — do not fabricate peers.`,
        },
        {
          role: "user",
          content: JSON.stringify(safePayload),
        },
      ],
    });

    const raw = completion.choices[0]?.message?.content || "{}";
    const parsed = JSON.parse(raw);
    const validated = options.validate(parsed) as T;
    const inputTokens = completion.usage?.prompt_tokens || 0;
    const outputTokens = completion.usage?.completion_tokens || 0;
    const estimatedCostUsd =
      (inputTokens / 1000) * COST_PER_1K_INPUT + (outputTokens / 1000) * COST_PER_1K_OUTPUT;

    const generation = await prisma.aiGeneration.create({
      data: {
        organizationId: options.organizationId || null,
        assessmentId: options.assessmentId || null,
        feature: options.feature,
        promptVersionId: prompt?.id,
        model: config.model,
        status: "success",
        inputTokens,
        outputTokens,
        estimatedCostUsd,
        requestPayload: safePayload as Prisma.InputJsonValue,
        responsePayload: validated as Prisma.InputJsonValue,
      },
    });

    return { data: validated, source: "ai", generationId: generation.id };
  } catch (err) {
    const message = err instanceof Error ? err.message : "AI request failed";
    console.error("[ai]", options.feature, message);
    await logFailure(options, config.model, message, safePayload);
    return { data: null, source: "fallback", error: message };
  }
}

async function logFailure(
  options: AiCallOptions,
  model: string,
  errorMessage: string,
  payload: Record<string, unknown>,
) {
  try {
    await prisma.aiGeneration.create({
      data: {
        organizationId: options.organizationId || null,
        assessmentId: options.assessmentId || null,
        feature: options.feature,
        model,
        status: "failed",
        requestPayload: payload as Prisma.InputJsonValue,
        errorMessage: errorMessage.slice(0, 1000),
      },
    });
  } catch (e) {
    console.error("[ai] failed to log error", e);
  }
}

function defaultSystemPrompt(feature: AiFeature) {
  switch (feature) {
    case "business_analysis":
      return "You are a senior growth strategist for DisplayAvenue. Produce concise business analysis from supplied assessment data.";
    case "strategy":
      return "Explain why the recommended marketing channels fit this business. Do not invent pricing.";
    case "competitor_analysis":
      return "Analyze competitive position using ONLY supplied competitor database fields. Do not invent facts.";
    case "cold_call":
      return "Write a natural cold-call script for DisplayAvenue sales. Use placeholders where helpful.";
    case "plan_90_day":
      return "Polish the supplied 90-day plan tasks into a personalized narrative. Do not add new services.";
    case "pdf_summary":
      return "Write a short PDF executive narrative from supplied facts. Do not change numbers.";
    case "monthly_report":
      return "Write a short monthly performance narrative from supplied measured metrics only. Do not invent KPIs.";
    default:
      return "Return structured JSON only.";
  }
}

export const businessAnalysisSchema = z.object({
  executiveSummary: z.string(),
  businessOpportunity: z.string(),
  keyChallenges: z.array(z.string()),
  keyOpportunities: z.array(z.string()),
  strategicPriorities: z.array(z.string()),
});

export const strategySchema = z.object({
  channels: z.array(
    z.object({
      channel: z.string(),
      explanation: z.string(),
      role: z.string(),
      priority: z.string(),
      guidance: z.string(),
    }),
  ),
});

export const competitorAnalysisSchema = z.object({
  competitiveSummary: z.string(),
  competitiveAdvantages: z.array(z.string()),
  competitiveWeaknesses: z.array(z.string()),
  opportunities: z.array(z.string()),
  recommendedActions: z.array(z.string()),
});

export const coldCallSchema = z.object({
  opening: z.string(),
  discoveryQuestions: z.array(z.string()),
  qualificationQuestions: z.array(z.string()),
  objectionHandling: z.array(
    z.object({
      objection: z.string(),
      response: z.string(),
    }),
  ),
  meetingBooking: z.string(),
});

export const planNarrativeSchema = z.object({
  overview: z.string(),
  phase1Narrative: z.string(),
  phase2Narrative: z.string(),
  phase3Narrative: z.string(),
});

export const monthlyNarrativeSchema = z.object({
  executiveSummary: z.string(),
  highlights: z.array(z.string()),
  risks: z.array(z.string()),
  nextMonthFocus: z.array(z.string()),
});
