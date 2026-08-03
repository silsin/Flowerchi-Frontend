"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function SetupPage() {
  const router = useRouter(); const [error, setError] = useState(""); const [loading, setLoading] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setLoading(true); setError(""); const form = new FormData(event.currentTarget); const response = await fetch("/api/auth/setup", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ name: form.get("name"), email: form.get("email"), password: form.get("password") }) }); setLoading(false); if (!response.ok) { setError((await response.json()).error || "خطا در ایجاد حساب"); return; } router.replace("/"); }
  return <div className="auth-page"><section className="auth-card glass"><h1>راه‌اندازی پنل</h1><p style={{ marginBottom: "1.5rem" }}>حساب مدیر اصلی را ایجاد کنید. این صفحه پس از تکمیل غیرفعال می‌شود.</p><form onSubmit={submit} style={{ display: "grid", gap: "1rem" }}><input name="name" placeholder="نام مدیر" required /><input name="email" type="email" placeholder="ایمیل" required /><input name="password" type="password" placeholder="رمز عبور (حداقل ۱۲ کاراکتر)" minLength={12} required />{error && <p style={{ color: "var(--error)" }}>{error}</p>}<button className="btn btn-primary" disabled={loading}>{loading ? "در حال ایجاد…" : "ایجاد حساب مدیر"}</button></form></section></div>;
}
