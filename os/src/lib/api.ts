import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { AuthError, ForbiddenError } from "./auth";

export function jsonOk<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ ok: true, data }, init);
}

export function jsonError(message: string, status = 400, extra?: Record<string, unknown>) {
  return NextResponse.json({ ok: false, error: message, ...extra }, { status });
}

export function handleApiError(err: unknown) {
  if (err instanceof AuthError) return jsonError(err.message, err.status);
  if (err instanceof ForbiddenError) return jsonError(err.message, err.status);
  if (err instanceof ZodError) {
    return jsonError("Validation failed", 400, { issues: err.issues });
  }
  console.error("[api]", err);
  return jsonError("Something went wrong. Please try again.", 500);
}
