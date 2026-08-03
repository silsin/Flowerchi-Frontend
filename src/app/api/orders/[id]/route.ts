import { NextRequest } from "next/server";
import { adminOrError, fail, ok, text } from "@/lib/http";
import { query } from "@/lib/db";

const permitted = ["paid", "processing", "completed", "cancelled", "refunded"];

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const actor = await adminOrError(); if (!actor) return fail("Unauthorized.", 401);
  const body = await request.json().catch(() => null); const status = text(body?.status, 30); const notes = text(body?.notes, 5000); const id = (await context.params).id;
  if (!permitted.includes(status)) return fail("Invalid order status.");
  const result = await query("UPDATE orders SET status=$1, notes=CASE WHEN $2='' THEN notes ELSE $2 END, updated_at=now() WHERE id=$3 RETURNING *", [status, notes, id]);
  if (!result.rowCount) return fail("Order not found.", 404);
  await query("INSERT INTO audit_logs (actor_id, action, entity_type, entity_id, metadata) VALUES ($1,'update_status','order',$2,$3)", [actor.id, id, JSON.stringify({ status })]);
  return ok(result.rows[0]);
}
