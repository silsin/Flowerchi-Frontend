"use client";

import { motion } from "framer-motion";
import { 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  DollarSign, 
  ShoppingCart, 
  Calendar,
  BarChart3,
  PieChart
} from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="animate-fade-in">
      <header style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        marginBottom: "2.5rem" 
      }}>
        <div>
          <h1 style={{ margin: 0 }}>آنالیز و آمار مالی</h1>
          <p>بررسی جامع عملکرد پلتفرم و درآمدهای شما.</p>
        </div>
        <div style={{ display: "flex", gap: "1rem" }}>
          <div style={{ display: "flex", background: "rgba(255,255,255,0.05)", borderRadius: "12px", border: "1px solid var(--card-border)", padding: "4px" }}>
            {["۲۴ ساعت", "۷ روز", "۳۰ روز", "همه"].map((range) => (
              <button key={range} style={{ 
                padding: "0.5rem 1rem", 
                borderRadius: "8px", 
                background: range === "۳۰ روز" ? "rgba(255,255,255,0.1)" : "transparent",
                border: "none",
                color: "white",
                cursor: "pointer",
                fontSize: "0.875rem"
              }}>
                {range}
              </button>
            ))}
          </div>
          <button className="btn btn-secondary">
            <Calendar size={18} />
            بازه سفارشی
          </button>
        </div>
      </header>

      <div className="grid grid-cols-3" style={{ marginBottom: "2.5rem" }}>
        <div className="glass" style={{ padding: "1.5rem", borderRadius: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
            <div style={{ padding: "0.75rem", borderRadius: "12px", background: "rgba(16, 185, 129, 0.1)", color: "var(--success)" }}>
              <DollarSign size={24} />
            </div>
            <span style={{ color: "var(--success)", display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.875rem", fontWeight: 600, direction: "ltr" }}>
              <ArrowUpRight size={16} />
              +14.2%
            </span>
          </div>
          <p style={{ margin: 0, opacity: 0.6, fontSize: "0.875rem" }}>درآمد ناخالص</p>
          <h2 style={{ margin: "0.25rem 0", fontSize: "2rem" }}>۸۴,۲۳۱,۵۰۰ تومان</h2>
          <div style={{ height: "60px", display: "flex", alignItems: "flex-end", gap: "4px", marginTop: "1rem" }}>
            {[40, 70, 45, 90, 65, 80, 55, 95, 75, 85].map((h, i) => (
              <motion.div 
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                style={{ flex: 1, background: "var(--success)", opacity: 0.3, borderRadius: "2px" }}
              />
            ))}
          </div>
        </div>

        <div className="glass" style={{ padding: "1.5rem", borderRadius: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
            <div style={{ padding: "0.75rem", borderRadius: "12px", background: "rgba(139, 92, 246, 0.1)", color: "var(--primary)" }}>
              <ShoppingCart size={24} />
            </div>
            <span style={{ color: "var(--error)", display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.875rem", fontWeight: 600, direction: "ltr" }}>
              <ArrowDownRight size={16} />
              -2.4%
            </span>
          </div>
          <p style={{ margin: 0, opacity: 0.6, fontSize: "0.875rem" }}>کل سفارشات</p>
          <h2 style={{ margin: "0.25rem 0", fontSize: "2rem" }}>۱۲,۸۴۲</h2>
          <div style={{ height: "60px", display: "flex", alignItems: "flex-end", gap: "4px", marginTop: "1rem" }}>
             {[60, 50, 85, 40, 75, 45, 90, 65, 55, 40].map((h, i) => (
              <motion.div 
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                style={{ flex: 1, background: "var(--primary)", opacity: 0.3, borderRadius: "2px" }}
              />
            ))}
          </div>
        </div>

        <div className="glass" style={{ padding: "1.5rem", borderRadius: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
            <div style={{ padding: "0.75rem", borderRadius: "12px", background: "rgba(217, 70, 239, 0.1)", color: "var(--accent)" }}>
              <TrendingUp size={24} />
            </div>
            <span style={{ color: "var(--success)", display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.875rem", fontWeight: 600, direction: "ltr" }}>
              <ArrowUpRight size={16} />
              +5.7%
            </span>
          </div>
          <p style={{ margin: 0, opacity: 0.6, fontSize: "0.875rem" }}>حاشیه سود</p>
          <h2 style={{ margin: "0.25rem 0", fontSize: "2rem" }}>۲۴.۸٪</h2>
          <div style={{ height: "60px", display: "flex", alignItems: "flex-end", gap: "4px", marginTop: "1rem" }}>
             {[30, 45, 60, 55, 70, 65, 80, 75, 90, 85].map((h, i) => (
              <motion.div 
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                style={{ flex: 1, background: "var(--accent)", opacity: 0.3, borderRadius: "2px" }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2">
        <div className="glass" style={{ padding: "2rem", borderRadius: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
            <h3 style={{ margin: 0, display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <PieChart size={20} color="var(--primary)" />
              درآمد به تفکیک پلتفرم
            </h3>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {[
              { label: "اینستاگرام", value: "۴۲,۱۲۰,۰۰۰", percent: 50, color: "#E1306C" },
              { label: "تلگرام", value: "۲۸,۴۵۰,۰۰۰", percent: 34, color: "#0088cc" },
              { label: "تیک‌تاک", value: "۱۰,۲۴۰,۰۰۰", percent: 12, color: "#ff0050" },
              { label: "سایر", value: "۳,۴۲۱,۰۰۰", percent: 4, color: "#8b5cf6" },
            ].map((item) => (
              <div key={item.label}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem", fontSize: "0.875rem" }}>
                  <span style={{ fontWeight: 600 }}>{item.label}</span>
                  <span style={{ opacity: 0.6 }}>{item.value} تومان ({item.percent}٪)</span>
                </div>
                <div style={{ height: "8px", background: "rgba(255,255,255,0.05)", borderRadius: "10px", overflow: "hidden" }}>
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${item.percent}%` }}
                    style={{ height: "100%", background: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass" style={{ padding: "2rem", borderRadius: "24px" }}>
           <h3 style={{ margin: "0 0 2rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <BarChart3 size={20} color="var(--primary)" />
              پرفروش‌ترین سرویس‌ها
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {[
                { name: "فالور اینستاگرام با کیفیت", sales: "۵,۲۴۰", revenue: "۲۱,۴۲۰,۰۰۰" },
                { name: "ممبر واقعی تلگرام", sales: "۳,۱۲۰", revenue: "۱۲,۴۸۰,۰۰۰" },
                { name: "لایک واقعی اینستاگرام", sales: "۲,۸۴۰", revenue: "۴,۲۶۰,۰۰۰" },
                { name: "بازدید تیک‌تاک", sales: "۲,۱۰۰", revenue: "۲,۱۰۰,۰۰۰" },
                { name: "ترافیک وب‌سایت", sales: "۱,۲۴۰", revenue: "۳,۷۲۰,۰۰۰" },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "1rem", borderRadius: "12px", background: "rgba(255,255,255,0.02)", border: "1px solid var(--card-border)" }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{item.name}</div>
                    <div style={{ fontSize: "0.75rem", opacity: 0.5 }}>{item.sales} فروش</div>
                  </div>
                  <div style={{ textAlign: "left", fontWeight: 700, color: "var(--primary)" }}>
                    {item.revenue} تومان
                  </div>
                </div>
              ))}
            </div>
        </div>
      </div>
    </div>
  );
}
