import { NextRequest } from "next/server";
import { adminOrError, fail, ok, text } from "@/lib/http";
import { query } from "@/lib/db";

const slugify = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9\u0600-\u06ff]+/g, "-").replace(/^-|-$/g, "");

export async function GET() {
  const result = await query("SELECT id, name, slug, color, active, created_at FROM platforms ORDER BY name");
  return ok(result.rows);
}

export async function POST(request: NextRequest) {
  const actor = await adminOrError(); if (!actor) return fail("Unauthorized.", 401);
  const body = await request.json().catch(() => null);
  const name = text(body?.name, 100); const slug = slugify(text(body?.slug, 100) || name);
  const color = /^#[0-9a-fA-F]{6}$/.test(body?.color) ? body.color : "#8b5cf6";
  if (!name || !slug) return fail("A platform name is required.");
  try {
    const result = await query("INSERT INTO platforms (name, slug, color) VALUES ($1, $2, $3) RETURNING *", [name, slug, color]);
    await query("INSERT INTO audit_logs (actor_id, action, entity_type, entity_id) VALUES ($1, 'create', 'platform', $2)", [actor.id, result.rows[0].id]);
    return ok(result.rows[0], { status: 201 });
  } catch { return fail("A platform with that name or slug already exists.", 409); }
}
