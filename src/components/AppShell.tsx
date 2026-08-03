"use client";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const publicPage = pathname === "/" || pathname === "/login" || pathname === "/setup" || pathname === "/payment-result";
  if (publicPage) return <>{children}</>;
  return <div className="dashboard-container"><Sidebar /><main className="main-content">{children}</main></div>;
}
