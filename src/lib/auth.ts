import { createHmac, randomBytes, scrypt as scryptCallback, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { query } from "@/lib/db";

const scrypt = promisify(scryptCallback);
const COOKIE = "flowerchi_admin";
const SESSION_TTL = 60 * 60 * 8;

type Session = { sub: string; role: "admin" | "manager"; exp: number };
type ClientSession = { sub: string; role: "customer"; exp: number; aud: "client" };

function secret() {
  const value = process.env.AUTH_SECRET;
  if (!value || value.length < 32) throw new Error("AUTH_SECRET must be at least 32 characters.");
  return value;
}

function sign(value: string) { return createHmac("sha256", secret()).update(value).digest("base64url"); }

function token(session: Session | ClientSession) {
  const payload = Buffer.from(JSON.stringify(session)).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

function parse(value?: string): Session | null {
  if (!value) return null;
  const [payload, signature] = value.split(".");
  if (!payload || !signature) return null;
  const expected = sign(payload);
  if (signature.length !== expected.length || !timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;
  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString()) as Session;
    return session.exp > Math.floor(Date.now() / 1000) && ["admin", "manager"].includes(session.role) ? session : null;
  } catch { return null; }
}

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = (await scrypt(password, salt, 64)) as Buffer;
  return `scrypt$${salt}$${hash.toString("hex")}`;
}

export async function verifyPassword(password: string, stored?: string | null) {
  if (!stored) return false;
  const [algorithm, salt, expected] = stored.split("$");
  if (algorithm !== "scrypt" || !salt || !expected) return false;
  const actual = (await scrypt(password, salt, 64)) as Buffer;
  const expectedBuffer = Buffer.from(expected, "hex");
  return actual.length === expectedBuffer.length && timingSafeEqual(actual, expectedBuffer);
}

export async function ensureInitialAdmin() {
  const email = process.env.INITIAL_ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.INITIAL_ADMIN_PASSWORD;
  if (!email || !password || password.length < 12) return;
  const existing = await query<{ id: string }>("SELECT id FROM users WHERE role = 'admin' LIMIT 1");
  if (existing.rowCount) return;
  await query("INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, 'admin')", ["Administrator", email, await hashPassword(password)]);
}

export async function currentSession() { return parse((await cookies()).get(COOKIE)?.value); }

export function createClientToken(userId: string) {
  return token({ sub: userId, role: "customer", aud: "client", exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30 });
}

export function clientFromAuthorization(value?: string | null): ClientSession | null {
  if (!value?.startsWith("Bearer ")) return null;
  const raw = value.slice(7); const [payload, signature] = raw.split(".");
  if (!payload || !signature) return null;
  const expected = sign(payload);
  if (signature.length !== expected.length || !timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;
  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString()) as ClientSession;
    return session.aud === "client" && session.role === "customer" && session.exp > Math.floor(Date.now() / 1000) ? session : null;
  } catch { return null; }
}

export async function requireClient(authorization?: string | null) {
  const session = clientFromAuthorization(authorization);
  if (!session) return null;
  const result = await query<{ id: string; status: string }>("SELECT id, status FROM users WHERE id=$1 AND role='customer'", [session.sub]);
  return result.rows[0]?.status === "active" ? result.rows[0] : null;
}

export async function requireAdmin() {
  const session = await currentSession();
  if (!session) return null;
  const result = await query<{ id: string; role: "admin" | "manager"; status: string }>("SELECT id, role, status FROM users WHERE id = $1", [session.sub]);
  const user = result.rows[0];
  return user && user.status === "active" && ["admin", "manager"].includes(user.role) ? user : null;
}

export function setSession(response: NextResponse, user: { id: string; role: "admin" | "manager" }) {
  response.cookies.set(COOKIE, token({ sub: user.id, role: user.role, exp: Math.floor(Date.now() / 1000) + SESSION_TTL }), {
    httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: SESSION_TTL,
  });
}

export function clearSession(response: NextResponse) { response.cookies.set(COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 }); }
