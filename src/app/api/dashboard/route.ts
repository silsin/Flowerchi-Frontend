import { adminOrError, fail, ok } from "@/lib/http";
import { query } from "@/lib/db";

export async function GET() {
  const actor = await adminOrError(); if (!actor) return fail("Unauthorized.", 401);
  const [summary, recent] = await Promise.all([
    query(`SELECT COALESCE(SUM(amount) FILTER (WHERE status IN ('paid','processing','completed')),0)::bigint AS revenue,
      COUNT(*)::int AS orders, COUNT(DISTINCT user_id)::int AS customers,
      COUNT(*) FILTER (WHERE status='completed')::int AS completed_orders FROM orders`),
    query(`SELECT o.id,o.reference,o.quantity,o.amount,o.status,o.created_at,u.name AS customer_name,s.name AS service_name,p.name AS platform_name
      FROM orders o JOIN users u ON u.id=o.user_id JOIN services s ON s.id=o.service_id JOIN categories c ON c.id=s.category_id JOIN platforms p ON p.id=c.platform_id
      ORDER BY o.created_at DESC LIMIT 10`),
  ]);
  return ok({ summary: summary.rows[0], recentOrders: recent.rows });
}
