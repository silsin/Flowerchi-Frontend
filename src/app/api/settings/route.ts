import { NextRequest } from "next/server";
import { adminOrError, fail, ok, text } from "@/lib/http";
import { query } from "@/lib/db";

export async function GET() {
  const actor = await adminOrError(); if (!actor) return fail("Unauthorized.", 401);
  const result = await query("SELECT key, value, updated_at FROM app_settings ORDER BY key");
  return ok(Object.fromEntries(result.rows.map((row) => [row.key, row.value])));
}

export async function PUT(request: NextRequest) {
  const actor = await adminOrError(); if (!actor) return fail("Unauthorized.", 401);
  const body = await request.json().catch(() => null);
  const general = body?.general;
  if (!general || typeof general !== "object") return fail("general settings are required.");
  const value = {
    panelName: text(general.panelName, 120), supportEmail: text(general.supportEmail, 320),
    currency: ["IRT", "IRR", "USD"].includes(general.currency) ? general.currency : "IRT",
    timezone: text(general.timezone, 80) || "Asia/Tehran", maintenanceMode: Boolean(general.maintenanceMode),
  };
  await query("INSERT INTO app_settings (key,value,updated_at) VALUES ('general',$1,now()) ON CONFLICT (key) DO UPDATE SET value=EXCLUDED.value,updated_at=now()", [JSON.stringify(value)]);
  await query("INSERT INTO audit_logs (actor_id, action, entity_type) VALUES ($1,'update','settings')", [actor.id]);
  return ok(value);
}
