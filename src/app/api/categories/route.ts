import { NextRequest } from "next/server";
import { adminOrError, fail, ok, text } from "@/lib/http";
import { query } from "@/lib/db";

export async function GET(request: NextRequest) {
  const platformId = request.nextUrl.searchParams.get("platformId");
  const result = await query(
    `SELECT c.id, c.name, c.slug, c.active, c.platform_id, c.created_at, p.name AS platform_name,
      COUNT(s.id)::int AS service_count, COALESCE(MIN(s.price), 0)::bigint AS starting_price
     FROM categories c JOIN platforms p ON p.id = c.platform_id LEFT JOIN services s ON s.category_id = c.id
     WHERE ($1::uuid IS NULL OR c.platform_id = $1) GROUP BY c.id, p.name, c.created_at ORDER BY c.name`, [platformId],
  );
  return ok(result.rows);
}

export async function POST(request: NextRequest) {
  const actor = await adminOrError(); if (!actor) return fail("Unauthorized.", 401);
  const body = await request.json().catch(() => null);
  const name = text(body?.name, 120); const platformId = text(body?.platformId, 36); const slug = text(body?.slug, 120).toLowerCase();
  if (!name || !platformId || !slug) return fail("name, slug, and platformId are required.");
  try {
    const result = await query("INSERT INTO categories (name, slug, platform_id) VALUES ($1, $2, $3) RETURNING *", [name, slug, platformId]);
    await query("INSERT INTO audit_logs (actor_id, action, entity_type, entity_id) VALUES ($1, 'create', 'category', $2)", [actor.id, result.rows[0].id]);
    return ok(result.rows[0], { status: 201 });
  } catch { return fail("The category or platform is invalid.", 409); }
}
