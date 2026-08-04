import { NextResponse } from "next/server";
import { clearSession, currentSession } from "@/lib/auth";
import { query } from "@/lib/db";

export async function POST() {
  const session = await currentSession();
  if (session) await query("INSERT INTO audit_logs (actor_id, action, entity_type, entity_id) VALUES ($1, 'logout', 'user', $1::TEXT)", [session.sub]);
  const response = NextResponse.json({ data: { success: true } });
  clearSession(response);
  return response;
}
