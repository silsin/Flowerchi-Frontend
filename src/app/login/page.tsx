"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter(); const [error, setError] = useState(""); const [loading, setLoading] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setLoading(true); setError(""); const form = new FormData(event.currentTarget); const response = await fetch("/api/auth/login", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email: form.get("email"), password: form.get("password") }) }); setLoading(false); if (!response.ok) { setError("ایمیل یا رمز عبور نادرست است."); return; } router.replace("/admin"); }
  return <div className="auth-page"><section className="auth-card glass"><h1>ورود مدیر</h1><form onSubmit={submit} style={{ display: "grid", gap: "1rem" }}><input name="email" type="email" placeholder="ایمیل" required /><input name="password" type="password" placeholder="رمز عبور" required minLength={12} />{error && <p style={{ color: "var(--error)" }}>{error}</p>}<button className="btn btn-primary" disabled={loading}>{loading ? "در حال ورود…" : "ورود"}</button></form></section></div>;
}
