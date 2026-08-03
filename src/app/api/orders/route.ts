import { NextRequest } from "next/server";
import { adminOrError, fail, ok, text } from "@/lib/http";
import { query } from "@/lib/db";

export async function GET(request: NextRequest) {
  const actor = await adminOrError(); if (!actor) return fail("Unauthorized.", 401);
  const search = text(request.nextUrl.searchParams.get("search"), 100); const status = text(request.nextUrl.searchParams.get("status"), 30);
  const page = Math.max(1, Number(request.nextUrl.searchParams.get("page")) || 1); const limit = Math.min(100, Math.max(1, Number(request.nextUrl.searchParams.get("limit")) || 20));
  const result = await query(
    `SELECT o.*, u.name AS customer_name, u.email AS customer_email, s.name AS service_name, p.name AS platform_name,
       COUNT(*) OVER()::int AS total FROM orders o JOIN users u ON u.id=o.user_id JOIN services s ON s.id=o.service_id
       JOIN categories c ON c.id=s.category_id JOIN platforms p ON p.id=c.platform_id
       WHERE ($1='' OR o.reference ILIKE '%' || $1 || '%' OR u.name ILIKE '%' || $1 || '%' OR o.target ILIKE '%' || $1 || '%')
         AND ($2='' OR o.status=$2) ORDER BY o.created_at DESC LIMIT $3 OFFSET $4`, [search, status, limit, (page - 1) * limit],
  );
  return ok({ items: result.rows, total: result.rows[0]?.total ?? 0, page, limit });
}
