import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { FamilyRelation, Gender } from "@/generated/prisma/enums";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  const members = await prisma.familyMember.findMany({
    where: { userId: session.id },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ members });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  const body = await req.json();
  if (!body.name || !body.dob || !body.placeName || !body.relation) {
    return NextResponse.json({ error: "INVALID_REQUEST" }, { status: 400 });
  }

  const member = await prisma.familyMember.create({
    data: {
      userId: session.id,
      name: String(body.name),
      relation: body.relation as FamilyRelation,
      gender: (body.gender as Gender) || null,
      dob: new Date(String(body.dob)),
      birthTime: body.birthTimeUnknown ? null : String(body.birthTime || "") || null,
      birthTimeUnknown: Boolean(body.birthTimeUnknown),
      placeName: String(body.placeName),
      lat: 28.6139,
      lng: 77.209,
      timezone: "Asia/Kolkata",
      country: "IN",
    },
  });
  return NextResponse.json({ ok: true, member });
}

export async function DELETE(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "INVALID_REQUEST" }, { status: 400 });
  await prisma.familyMember.deleteMany({ where: { id, userId: session.id } });
  return NextResponse.json({ ok: true });
}
