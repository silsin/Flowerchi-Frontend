import { NextRequest } from "next/server";
import { adminOrError, fail, ok, text } from "@/lib/http";
import { query } from "@/lib/db";
export async function PATCH(request:NextRequest, context:{params:Promise<{id:string}>}) { const actor=await adminOrError();if(!actor)return fail("Unauthorized.",401);const b=await request.json().catch(()=>null),id=(await context.params).id,status=text(b?.status,20);if(!["active","suspended","blocked"].includes(status))return fail("Invalid user status.");const r=await query("UPDATE users SET status=$1,updated_at=now() WHERE id=$2 AND role='customer' RETURNING id,name,email,status",[status,id]);if(!r.rowCount)return fail("User not found.",404);await query("INSERT INTO audit_logs (actor_id,action,entity_type,entity_id,metadata) VALUES ($1,'update_status','user',$2,$3)",[actor.id,id,JSON.stringify({status})]);return ok(r.rows[0]);}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const actor = await adminOrError(); if (!actor) return fail("Unauthorized.", 401);
  const id = (await context.params).id;
  try {
    const result = await query("DELETE FROM users WHERE id=$1 AND role='customer' RETURNING id", [id]);
    if (!result.rowCount) return fail("User not found.", 404);
    await query("INSERT INTO audit_logs (actor_id, action, entity_type, entity_id) VALUES ($1, 'delete', 'user', $2)", [actor.id, id]);
    return ok({ success: true });
  } catch (error) {
    return fail("Error deleting user.", 500);
  }
}
