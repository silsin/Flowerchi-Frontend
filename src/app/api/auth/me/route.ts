import { adminOrError, fail, ok } from "@/lib/http";
import { query } from "@/lib/db";

export async function GET() {
  const user = await adminOrError();
  if (!user) return fail("Unauthorized.", 401);
  const result = await query("SELECT id, name, email, role FROM users WHERE id = $1", [user.id]);
  return ok(result.rows[0]);
}
