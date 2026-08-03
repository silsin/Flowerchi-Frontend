import { NextRequest } from "next/server";
import { adminOrError, fail, ok } from "@/lib/http";
import { query } from "@/lib/db";

export async function GET(request: NextRequest) {
  const actor = await adminOrError(); if (!actor) return fail("Unauthorized.", 401);
  const days = [1, 7, 30, 90].includes(Number(request.nextUrl.searchParams.get("days"))) ? Number(request.nextUrl.searchParams.get("days")) : 30;
  const [totals, platforms, services] = await Promise.all([
    query(`SELECT COALESCE(SUM(amount) FILTER (WHERE status IN ('paid','processing','completed')),0)::bigint AS revenue, COUNT(*)::int AS orders,
      COUNT(*) FILTER (WHERE status='completed')::int AS completed FROM orders WHERE created_at >= now() - ($1::text || ' days')::interval`, [days]),
    query(`SELECT p.name, COALESCE(SUM(o.amount),0)::bigint AS revenue, COUNT(o.id)::int AS orders FROM platforms p
      LEFT JOIN categories c ON c.platform_id=p.id LEFT JOIN services s ON s.category_id=c.id LEFT JOIN orders o ON o.service_id=s.id AND o.status IN ('paid','processing','completed')
      AND o.created_at >= now() - ($1::text || ' days')::interval GROUP BY p.id ORDER BY revenue DESC`, [days]),
    query(`SELECT s.name, COUNT(o.id)::int AS sales, COALESCE(SUM(o.amount),0)::bigint AS revenue FROM services s LEFT JOIN orders o ON o.service_id=s.id
      AND o.status IN ('paid','processing','completed') AND o.created_at >= now() - ($1::text || ' days')::interval GROUP BY s.id ORDER BY revenue DESC LIMIT 10`, [days]),
  ]);
  return ok({ totals: totals.rows[0], platforms: platforms.rows, services: services.rows });
}
