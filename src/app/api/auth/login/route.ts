import { NextRequest, NextResponse } from "next/server";
import { setSession, verifyPassword } from "@/lib/auth";
import { query } from "@/lib/db";
import { fail, text } from "@/lib/http";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const email = text(body?.email, 320).toLowerCase();
  const password = typeof body?.password === "string" ? body.password : "";
  if (!email || !password) return fail("Email and password are required.");
  const result = await query<{ id: string; name: string; role: "admin" | "manager"; status: string; password_hash: string }>(
    "SELECT id, name, role, status, password_hash FROM users WHERE email = $1", [email],
  );
  const user = result.rows[0];
  if (!user || user.status !== "active" || !["admin", "manager"].includes(user.role) || !(await verifyPassword(password, user.password_hash))) {
    return fail("Invalid email or password.", 401);
  }
  await query("INSERT INTO audit_logs (actor_id, action, entity_type, entity_id) VALUES ($1::UUID, 'login', 'user', $1)", [user.id]);
  const response = NextResponse.json({ data: { id: user.id, name: user.name, role: user.role } });
  setSession(response, user);
  return response;
}
