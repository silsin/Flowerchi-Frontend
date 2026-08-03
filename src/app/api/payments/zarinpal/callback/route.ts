import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

const verifyApi = "https://api.zarinpal.com/pg/v4/payment/verify.json";

export async function GET(request: NextRequest) {
  const authority = request.nextUrl.searchParams.get("Authority") || "";
  const status = request.nextUrl.searchParams.get("Status");
  const appUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || request.nextUrl.origin;
  const redirect = new URL("/payment-result", appUrl);
  if (!authority || status !== "OK") { redirect.searchParams.set("status", "cancelled"); return NextResponse.redirect(redirect); }
  const payment = await query<{ order_id: string; amount: string; status: string }>("SELECT order_id,amount,status FROM payments WHERE authority=$1", [authority]);
  const record = payment.rows[0];
  if (!record) { redirect.searchParams.set("status", "invalid"); return NextResponse.redirect(redirect); }
  if (record.status === "verified") { redirect.searchParams.set("status", "success"); return NextResponse.redirect(redirect); }
  const merchantId = process.env.ZARINPAL_MERCHANT_ID;
  if (!merchantId) { redirect.searchParams.set("status", "error"); return NextResponse.redirect(redirect); }
  try {
    const response = await fetch(verifyApi, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ merchant_id: merchantId, amount: Number(record.amount) * 10, authority }) });
    const gateway = await response.json() as { data?: { code: number; ref_id?: number } };
    if (response.ok && [100, 101].includes(gateway.data?.code ?? 0)) {
      await query("UPDATE payments SET status='verified',reference_id=$1,raw_response=$2,verified_at=now() WHERE authority=$3", [String(gateway.data?.ref_id ?? ""), JSON.stringify(gateway), authority]);
      await query("UPDATE orders SET status='paid',updated_at=now() WHERE id=$1 AND status='pending_payment'", [record.order_id]);
      redirect.searchParams.set("status", "success");
    } else {
      await query("UPDATE payments SET status='failed',raw_response=$1 WHERE authority=$2", [JSON.stringify(gateway), authority]);
      await query("UPDATE orders SET status='payment_failed',updated_at=now() WHERE id=$1", [record.order_id]);
      redirect.searchParams.set("status", "failed");
    }
  } catch { redirect.searchParams.set("status", "error"); }
  return NextResponse.redirect(redirect);
}
