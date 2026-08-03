import { NextRequest } from "next/server";
import { randomUUID } from "crypto";
import { db, query } from "@/lib/db";
import { fail, ok, positiveInteger, text } from "@/lib/http";
import { allow } from "@/lib/rate-limit";

const zarinpalApi = "https://api.zarinpal.com/pg/v4/payment/request.json";
const zarinpalStart = "https://www.zarinpal.com/pg/StartPay/";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!allow(`checkout:${ip}`, 5, 60_000)) return fail("Too many requests. Please try again later.", 429);
  const body = await request.json().catch(() => null);
  const name = text(body?.name, 120); const email = text(body?.email, 320).toLowerCase(); const serviceId = text(body?.serviceId, 36);
  const quantity = positiveInteger(body?.quantity); const target = text(body?.target, 2000);
  if (!name || !/^\S+@\S+\.\S+$/.test(email) || !serviceId || !quantity || !target) return fail("Valid customer and order details are required.");
  const maintenance = await query<{ value: { maintenanceMode?: boolean } }>("SELECT value FROM app_settings WHERE key='general'");
  if (maintenance.rows[0]?.value?.maintenanceMode) return fail("The store is temporarily unavailable.", 503);
  const serviceResult = await query<{ id: string; name: string; price: string; min_quantity: number; max_quantity: number }>("SELECT id,name,price,min_quantity,max_quantity FROM services WHERE id=$1 AND active=true", [serviceId]);
  const service = serviceResult.rows[0];
  if (!service || quantity < service.min_quantity || quantity > service.max_quantity) return fail("The selected service or quantity is unavailable.");
  const merchantId = process.env.ZARINPAL_MERCHANT_ID;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");
  if (!merchantId || !appUrl) return fail("Payment gateway is not configured.", 503);
  const amount = Number(service.price) * quantity; const reference = `ORD-${randomUUID().replace(/-/g, "").slice(0, 10).toUpperCase()}`;
  const client = await db.connect();
  try {
    await client.query("BEGIN");
    const customer = await client.query<{ id: string }>("INSERT INTO users (name,email) VALUES ($1,$2) ON CONFLICT (email) DO UPDATE SET name=EXCLUDED.name,updated_at=now() RETURNING id", [name, email]);
    const order = await client.query<{ id: string }>("INSERT INTO orders (reference,user_id,service_id,quantity,target,amount) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id", [reference, customer.rows[0].id, service.id, quantity, target, amount]);
    await client.query("INSERT INTO payments (order_id,amount,status) VALUES ($1,$2,'created')", [order.rows[0].id, amount]);
    await client.query("COMMIT");
    const paymentResponse = await fetch(zarinpalApi, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ merchant_id: merchantId, amount: amount * 10, callback_url: `${appUrl}/api/payments/zarinpal/callback`, description: `Order ${reference}`, metadata: { email } }) });
    const gateway = await paymentResponse.json() as { data?: { code: number; authority: string }; errors?: unknown };
    if (!paymentResponse.ok || gateway.data?.code !== 100 || !gateway.data.authority) {
      await query("UPDATE payments SET status='failed',raw_response=$1 WHERE order_id=$2", [JSON.stringify(gateway), order.rows[0].id]);
      await query("UPDATE orders SET status='payment_failed',updated_at=now() WHERE id=$1", [order.rows[0].id]);
      return fail("Unable to create the payment request.", 502);
    }
    await query("UPDATE payments SET status='pending',authority=$1,raw_response=$2 WHERE order_id=$3", [gateway.data.authority, JSON.stringify(gateway), order.rows[0].id]);
    return ok({ reference, paymentUrl: `${zarinpalStart}${gateway.data.authority}` }, { status: 201 });
  } catch {
    await client.query("ROLLBACK").catch(() => undefined);
    return fail("Could not create the order.", 500);
  } finally { client.release(); }
}
