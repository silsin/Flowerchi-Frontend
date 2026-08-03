import { NextRequest } from "next/server";
import { adminOrError, fail, ok, positiveInteger, text } from "@/lib/http";
import { query } from "@/lib/db";

export async function GET(request: NextRequest) {
  const categoryId = request.nextUrl.searchParams.get("categoryId");
  const result = await query(
    `SELECT s.*, c.name AS category_name, p.name AS platform_name FROM services s
     JOIN categories c ON c.id=s.category_id JOIN platforms p ON p.id=c.platform_id
     WHERE ($1::uuid IS NULL OR s.category_id=$1) ORDER BY s.name`, [categoryId],
  );
  return ok(result.rows);
}

export async function POST(request: NextRequest) {
  const actor = await adminOrError(); if (!actor) return fail("Unauthorized.", 401);
  const body = await request.json().catch(() => null);
  const name = text(body?.name, 160); const categoryId = text(body?.categoryId, 36); const price = positiveInteger(body?.price);
  const min = positiveInteger(body?.minQuantity) ?? 1; const max = positiveInteger(body?.maxQuantity) ?? 100000;
  if (!name || !categoryId || !price || min > max) return fail("Valid service details are required.");
  const result = await query("INSERT INTO services (name, category_id, description, price, min_quantity, max_quantity) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *", [name, categoryId, text(body?.description, 5000), price, min, max]);
  await query("INSERT INTO audit_logs (actor_id, action, entity_type, entity_id) VALUES ($1, 'create', 'service', $2)", [actor.id, result.rows[0].id]);
  return ok(result.rows[0], { status: 201 });
}
