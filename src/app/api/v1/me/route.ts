import { NextRequest } from "next/server";
import { requireClient } from "@/lib/auth";
import { query } from "@/lib/db";
import { fail, ok } from "@/lib/http";

export async function GET(request: NextRequest) {
  const client = await requireClient(request.headers.get("authorization")); if (!client) return fail("Unauthorized.", 401);
  const result = await query("SELECT id,name,email,balance,created_at FROM users WHERE id=$1", [client.id]);
  return ok(result.rows[0]);
}
