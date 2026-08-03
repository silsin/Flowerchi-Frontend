import { NextRequest } from "next/server";
import { adminOrError, fail, ok, text } from "@/lib/http";
import { query } from "@/lib/db";

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const actor = await adminOrError(); if (!actor) return fail("Unauthorized.", 401);
  const body = await request.json().catch(() => null); const id = (await context.params).id;
  const result = await query("UPDATE platforms SET name=COALESCE(NULLIF($1,''),name), color=COALESCE(NULLIF($2,''),color), active=COALESCE($3,active) WHERE id=$4 RETURNING *", [text(body?.name, 100), text(body?.color, 20), typeof body?.active === "boolean" ? body.active : null, id]);
  if (!result.rowCount) return fail("Platform not found.", 404); await query("INSERT INTO audit_logs (actor_id,action,entity_type,entity_id) VALUES ($1,'update','platform',$2)", [actor.id,id]); return ok(result.rows[0]);
}
export async function DELETE(_: NextRequest, context: { params: Promise<{ id: string }> }) { const actor=await adminOrError(); if(!actor)return fail("Unauthorized.",401); const id=(await context.params).id; try { await query("DELETE FROM platforms WHERE id=$1",[id]); await query("INSERT INTO audit_logs (actor_id,action,entity_type,entity_id) VALUES ($1,'delete','platform',$2)",[actor.id,id]); return ok({success:true}); } catch { return fail("A platform with categories cannot be deleted.",409); } }
