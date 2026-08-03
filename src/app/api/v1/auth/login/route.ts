import { NextRequest } from "next/server";
import { createClientToken, verifyPassword } from "@/lib/auth";
import { query } from "@/lib/db";
import { fail, ok, text } from "@/lib/http";
import { allow } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!allow(`client-login:${ip}`, 8, 60_000)) return fail("Too many login attempts.", 429);
  const body = await request.json().catch(() => null); const email = text(body?.email, 320).toLowerCase(); const password = typeof body?.password === "string" ? body.password : "";
  if (!email || !password) return fail("Email and password are required.");
  const result = await query<{ id: string; name: string; email: string; status: string; password_hash: string }>("SELECT id,name,email,status,password_hash FROM users WHERE email=$1 AND role='customer'", [email]);
  const user = result.rows[0];
  if (!user || user.status !== "active" || !(await verifyPassword(password, user.password_hash))) return fail("Invalid email or password.", 401);
  return ok({ accessToken: createClientToken(user.id), tokenType: "Bearer", expiresIn: 2592000, user: { id: user.id, name: user.name, email: user.email } });
}
