import { NextRequest } from "next/server";
import { adminOrError, fail, ok, text } from "@/lib/http";
import { hashPassword } from "@/lib/auth";
import { query } from "@/lib/db";

export async function GET(request: NextRequest) {
  const actor = await adminOrError(); if (!actor) return fail("Unauthorized.", 401);
  const search = text(request.nextUrl.searchParams.get("search"), 100);
  const status = text(request.nextUrl.searchParams.get("status"), 20);
  const page = Math.max(1, Number(request.nextUrl.searchParams.get("page")) || 1); const limit = Math.min(100, Math.max(1, Number(request.nextUrl.searchParams.get("limit")) || 20));
  const result = await query(
    `SELECT id, name, email, role, status, balance, created_at, COUNT(*) OVER()::int AS total
     FROM users WHERE role = 'customer' AND ($1 = '' OR name ILIKE '%' || $1 || '%' OR email ILIKE '%' || $1 || '%')
       AND ($2 = '' OR status = $2) ORDER BY created_at DESC LIMIT $3 OFFSET $4`, [search, status, limit, (page - 1) * limit],
  );
  return ok({ items: result.rows, total: result.rows[0]?.total ?? 0, page, limit });
}

export async function POST(request: NextRequest) {
  const actor = await adminOrError(); if (!actor) return fail("Unauthorized.", 401);
  const body = await request.json().catch(() => null); const name = text(body?.name, 120); const email = text(body?.email, 320).toLowerCase();
  const password = typeof body?.password === "string" ? body.password : "";
  if (!name || !/^\S+@\S+\.\S+$/.test(email) || password.length < 12) return fail("Name, valid email, and a 12-character password are required.");
  try {
    const result = await query("INSERT INTO users (name, email, password_hash) VALUES ($1,$2,$3) RETURNING id,name,email,status,balance,created_at", [name, email, await hashPassword(password)]);
    await query("INSERT INTO audit_logs (actor_id, action, entity_type, entity_id) VALUES ($1, 'create', 'user', $2)", [actor.id, result.rows[0].id]);
    return ok(result.rows[0], { status: 201 });
  } catch { return fail("A user with this email already exists.", 409); }
}
