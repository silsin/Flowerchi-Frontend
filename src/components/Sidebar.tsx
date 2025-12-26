"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Layers, 
  ShoppingCart, 
  Users, 
  Settings, 
  LogOut,
  TrendingUp,
  Instagram,
  Send,
  AppWindow,
  Plus
} from "lucide-react";
import { motion } from "framer-motion";
import { usePlatforms } from "@/context/PlatformContext";

const menuItems = [
  { icon: LayoutDashboard, label: "داشبورد", href: "/" },
  { icon: Layers, label: "دسته‌بندی‌ها", href: "/categories" },
  { icon: ShoppingCart, label: "سفارشات", href: "/orders" },
  { icon: Users, label: "کاربران", href: "/users" },
  { icon: TrendingUp, label: "آنالیز", href: "/analytics" },
  { icon: Settings, label: "تنظیمات", href: "/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { platforms } = usePlatforms();

  return (
    <aside className="glass" style={{
      width: "var(--sidebar-width)",
      height: "100vh",
      position: "fixed",
      right: 0,
      top: 0,
      display: "flex",
      flexDirection: "column",
      padding: "2rem 1.5rem",
      zIndex: 100,
      borderLeft: "1px solid var(--card-border)"
    }}>
      <div style={{ marginBottom: "3rem", display: "flex", alignItems: "center", gap: "1rem" }}>
        <div style={{ 
          width: "40px", 
          height: "40px", 
          background: "linear-gradient(135deg, var(--primary), var(--accent))",
          borderRadius: "12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <ShoppingCart size={24} color="white" />
        </div>
        <h2 style={{ margin: 0, fontSize: "1.25rem", background: "linear-gradient(to left, #fff, #888)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          مدیریت خدمات
        </h2>
      </div>

      <nav style={{ display: "flex", flexDirection: "column", gap: "0.5rem", flex: 1 }}>
        <p style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.5rem", opacity: 0.5 }}>منو اصلی</p>
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href} 
              href={item.href}
              style={{ textDecoration: "none" }}
            >
              <motion.div
                whileHover={{ x: -5 }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  padding: "0.875rem 1rem",
                  borderRadius: "12px",
                  color: isActive ? "white" : "rgba(255,255,255,0.6)",
                  background: isActive ? "rgba(139, 92, 246, 0.15)" : "transparent",
                  border: isActive ? "1px solid rgba(139, 92, 246, 0.3)" : "1px solid transparent",
                  transition: "all 0.2s"
                }}
              >
                <item.icon size={20} color={isActive ? "var(--primary)" : "currentColor"} />
                <span style={{ fontWeight: 500 }}>{item.label}</span>
              </motion.div>
            </Link>
          );
        })}

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "2rem", marginBottom: "0.5rem" }}>
          <p style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", opacity: 0.5, margin: 0 }}>پلتفرم‌ها</p>
          <Link href="/settings" style={{ color: "var(--primary)", display: "flex", alignItems: "center" }}>
            <Plus size={14} />
          </Link>
        </div>
        
        {platforms.map((platform) => (
          <div
            key={platform.name}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              padding: "0.875rem 1rem",
              color: "rgba(255,255,255,0.6)",
              cursor: "pointer"
            }}
          >
            <platform.icon size={20} color={platform.color} />
            <span style={{ fontWeight: 500 }}>{platform.name}</span>
          </div>
        ))}
      </nav>

      <div style={{ marginTop: "auto", borderTop: "1px solid var(--card-border)", paddingTop: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.875rem 1rem", color: "#ef4444", cursor: "pointer" }}>
          <LogOut size={20} />
          <span style={{ fontWeight: 500 }}>خروج</span>
        </div>
      </div>
    </aside>
  );
}
