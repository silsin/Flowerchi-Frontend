import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";

export const ok = (data: unknown, init?: ResponseInit) => NextResponse.json({ data }, init);
export const fail = (message: string, status = 400) => NextResponse.json({ error: message }, { status });

export async function adminOrError() {
  const user = await requireAdmin();
  return user ?? null;
}

export function text(value: unknown, max = 250) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export function positiveInteger(value: unknown) {
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : null;
}
