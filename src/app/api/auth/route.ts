import { NextRequest, NextResponse } from "next/server";
import { loginUser, registerUser, logoutUser } from "@/lib/auth";
import { Role } from "@/generated/prisma/enums";

export async function POST(req: NextRequest) {
  // This file handles login via /api/auth/login — see sibling routes
  return NextResponse.json({ error: "Use /api/auth/login or /api/auth/signup" }, { status: 404 });
}

// placeholder to satisfy imports if needed
export { loginUser, registerUser, logoutUser, Role };
