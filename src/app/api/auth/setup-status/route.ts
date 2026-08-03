import { ok } from "@/lib/http";
import { query } from "@/lib/db";
export async function GET() { const result=await query("SELECT 1 FROM users WHERE role='admin' LIMIT 1"); return ok({ needsSetup: !result.rowCount }); }
