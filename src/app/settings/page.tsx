"use client";

import { 
  User, 
  Bell, 
  Shield, 
  Globe, 
  CreditCard, 
  Zap,
  Save
} from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="animate-fade-in">
      <header style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        marginBottom: "2.5rem" 
      }}>
        <div>
          <h1 style={{ margin: 0 }}>تنظیمات</h1>
          <p>تنظیمات پنل مدیریت و پیکربندی‌های اپلیکیشن بر اساس نیاز شما.</p>
        </div>
        <button className="btn btn-primary">
          <Save size={18} />
          ذخیره تغییرات
        </button>
      </header>

      <div className="grid grid-cols-[300px_1fr]" style={{ gap: "2.5rem" }}>
        <aside style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {[
            { icon: User, label: "پروفایل", active: true },
            { icon: Globe, label: "عمومی", active: false },
            { icon: Bell, label: "اعلان‌ها", active: false },
            { icon: Shield, label: "امنیت", active: false },
            { icon: CreditCard, label: "سیستم‌های پرداخت", active: false },
            { icon: Zap, label: "API و وب‌هوک", active: false },
          ].map((item) => (
            <div 
              key={item.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "1rem",
                borderRadius: "12px",
                background: item.active ? "rgba(139, 92, 246, 0.1)" : "transparent",
                border: item.active ? "1px solid rgba(139, 92, 246, 0.3)" : "1px solid transparent",
                color: item.active ? "white" : "rgba(255,255,255,0.6)",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
            >
              <item.icon size={20} color={item.active ? "var(--primary)" : "currentColor"} />
              <span style={{ fontWeight: 600 }}>{item.label}</span>
            </div>
          ))}
        </aside>

        <section style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          <div className="glass" style={{ padding: "2rem", borderRadius: "24px" }}>
            <h3 style={{ margin: "0 0 1.5rem" }}>اطلاعات عمومی</h3>
            <div className="grid grid-cols-2">
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.5)" }}>نام پنل</label>
                <input 
                  defaultValue="پنل مدیریت خدمات هوشمند"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid var(--card-border)", color: "white", padding: "0.875rem", borderRadius: "12px", outline: "none" }}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.5)" }}>ایمیل پشتیبانی</label>
                <input 
                  defaultValue="support@socialadmin.ir"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid var(--card-border)", color: "white", padding: "0.875rem", borderRadius: "12px", outline: "none", direction: "ltr" }}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.5)" }}>واحد پولی</label>
                <select 
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid var(--card-border)", color: "white", padding: "0.875rem", borderRadius: "12px", outline: "none" }}
                >
                  <option>تومان</option>
                  <option>ریال</option>
                  <option>دلار ($)</option>
                </select>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.5)" }}>منطقه زمانی</label>
                <select 
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid var(--card-border)", color: "white", padding: "0.875rem", borderRadius: "12px", outline: "none" }}
                >
                  <option>تهران (GMT+3:30)</option>
                  <option>لندن (GMT)</option>
                  <option>نیویورک (GMT-5)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="glass" style={{ padding: "2rem", borderRadius: "24px" }}>
            <h3 style={{ margin: "0 0 1.5rem" }}>وضعیت تعمیرات</h3>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                 <p style={{ margin: 0, fontWeight: 600 }}>فعالسازی حالت تعمیرات</p>
                 <p style={{ margin: "0.25rem 0 0", fontSize: "0.875rem", opacity: 0.5 }}>در این حالت تمام سفارشات متوقف شده و به کاربران اطلاع‌رسانی می‌شود.</p>
              </div>
              <div style={{ 
                width: "50px", 
                height: "26px", 
                background: "rgba(255,255,255,0.1)", 
                borderRadius: "20px",
                position: "relative",
                cursor: "pointer",
                border: "1px solid var(--card-border)"
              }}>
                <div style={{ 
                   width: "18px", 
                   height: "18px", 
                   background: "white", 
                   borderRadius: "50%", 
                   position: "absolute",
                   top: "3px",
                   right: "4px"
                }} />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
