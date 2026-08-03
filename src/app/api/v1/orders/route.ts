import { NextRequest } from "next/server";
import { requireClient } from "@/lib/auth";
import { query } from "@/lib/db";
import { fail, ok } from "@/lib/http";

export async function GET(request: NextRequest) {
  const client = await requireClient(request.headers.get("authorization")); if (!client) return fail("Unauthorized.", 401);
  const result = await query(`SELECT o.id,o.reference,o.quantity,o.target,o.amount,o.status,o.created_at,o.updated_at,s.name AS service_name,p.name AS platform_name
    FROM orders o JOIN services s ON s.id=o.service_id JOIN categories c ON c.id=s.category_id JOIN platforms p ON p.id=c.platform_id
    WHERE o.user_id=$1 ORDER BY o.created_at DESC`, [client.id]);
  return ok(result.rows);
}
