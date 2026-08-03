import { ok } from "@/lib/http";
import { query } from "@/lib/db";

export async function GET() {
  const result = await query(`SELECT p.id AS platform_id,p.name AS platform_name,p.slug AS platform_slug,p.color,
    c.id AS category_id,c.name AS category_name,c.slug AS category_slug,s.id AS service_id,s.name AS service_name,
    s.description,s.price,s.min_quantity,s.max_quantity FROM platforms p JOIN categories c ON c.platform_id=p.id
    JOIN services s ON s.category_id=c.id WHERE p.active AND c.active AND s.active ORDER BY p.name,c.name,s.name`);
  return ok(result.rows);
}
