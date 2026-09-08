import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { createAiProvider } from "@/providers/ai/mock-provider";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

  const body = await req.json();
  const message = String(body.message || "").trim();
  if (!message) return NextResponse.json({ error: "EMPTY_MESSAGE" }, { status: 400 });

  const [profile, membership, reportCount] = await Promise.all([
    prisma.birthProfile.findFirst({ where: { userId: session.id, isDefault: true } }),
    prisma.subscription.findFirst({ where: { userId: session.id, status: "ACTIVE" } }),
    prisma.report.count({ where: { userId: session.id, jobStatus: "COMPLETED" } }),
  ]);

  if (!membership && reportCount < 1) {
    return NextResponse.json(
      { error: "UNLOCK_REQUIRED", message: "Buy a report or membership to use AI chat." },
      { status: 403 },
    );
  }

  const ai = createAiProvider();
  const context = profile
    ? `User birth profile: ${profile.name}, ${profile.dob.toISOString().slice(0, 10)}, ${profile.placeName}.`
    : "No birth profile saved yet.";

  const result = await ai.complete({
    messages: [
      {
        role: "user",
        content: `Context: ${context}\n\nQuestion (answer as interpretive entertainment only, never claim certainty): ${message}`,
      },
    ],
  });

  return NextResponse.json({
    reply: result.content,
    mock: result.mock,
    disclaimer: result.disclaimer,
  });
}
