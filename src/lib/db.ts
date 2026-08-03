import { Pool, QueryResultRow } from "pg";

const globalForDb = global as typeof globalThis & { pool?: Pool };

export const db = globalForDb.pool ?? new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  ssl: process.env.NODE_ENV === "production" && !process.env.DATABASE_URL?.includes("@db:")
    ? { rejectUnauthorized: true }
    : undefined,
});

if (process.env.NODE_ENV !== "production") globalForDb.pool = db;

export async function query<T extends QueryResultRow = QueryResultRow>(text: string, values: unknown[] = []) {
  return db.query<T>(text, values);
}

export async function transaction<T>(run: (client: Pool) => Promise<T>) {
  // Kept for small single-query routes; multi-query payment operations use an explicit client.
  return run(db);
}
