"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const path = usePathname(); const router = useRouter(); const publicPage = path === "/" || path === "/payment-result"; const [ready, setReady] = useState(path === "/login" || path === "/setup" || publicPage);
  useEffect(() => { if(path === "/login" || path === "/setup" || path === "/" || path === "/payment-result") return; fetch("/api/auth/me").then(async r => { if (r.ok) { setReady(true); return; } const setup=await fetch("/api/auth/setup-status").then(x=>x.json()); router.replace(setup.data.needsSetup ? "/setup" : "/login"); }).catch(() => router.replace("/login")); }, [path, router]);
  if (!ready) return <main style={{padding:"3rem",textAlign:"center"}}>در حال بارگذاری…</main>;
  return <>{children}</>;
}
