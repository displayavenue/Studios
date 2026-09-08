import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Gender } from "@/generated/prisma/enums";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

  const profiles = await prisma.birthProfile.findMany({
    where: { userId: session.id },
    orderBy: [{ isDefault: "desc" }, { updatedAt: "desc" }],
  });
  return NextResponse.json({ profiles });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

  const body = await req.json();
  if (!body.name || !body.dob || !body.placeName) {
    return NextResponse.json({ error: "INVALID_REQUEST" }, { status: 400 });
  }

  // Clear previous defaults then create/update default profile
  await prisma.birthProfile.updateMany({
    where: { userId: session.id, isDefault: true },
    data: { isDefault: false },
  });

  const existing = await prisma.birthProfile.findFirst({
    where: { userId: session.id },
    orderBy: { createdAt: "asc" },
  });

  const data = {
    name: String(body.name),
    gender: (body.gender as Gender) || Gender.OTHER,
    dob: new Date(String(body.dob)),
    birthTime: body.birthTimeUnknown ? null : String(body.birthTime || "") || null,
    birthTimeUnknown: Boolean(body.birthTimeUnknown),
    placeName: String(body.placeName),
    lat: 28.6139,
    lng: 77.209,
    timezone: "Asia/Kolkata",
    country: "IN",
    isDefault: true,
  };

  const profile = existing
    ? await prisma.birthProfile.update({ where: { id: existing.id }, data })
    : await prisma.birthProfile.create({ data: { ...data, userId: session.id } });

  return NextResponse.json({ ok: true, profile });
}
