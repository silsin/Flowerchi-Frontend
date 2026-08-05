"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  DollarSign, 
  ShoppingCart, 
  Calendar,
  BarChart3,
  PieChart,
  Loader
} from "lucide-react";

interface AnalyticsData {
  totalRevenue: number;
  revenueChange: number;
  totalOrders: number;
  ordersChange: number;
  profitMargin: number;
  marginChange: number;
  platformRevenue: Array<{ name: string; value: number; percent: number; color: string }>;
  topServices: Array<{ name: string; sales: number; revenue: number }>;
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState("۳۰ روز");

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/analytics");
      if (!response.ok) throw new Error("Failed to fetch analytics");
      
      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error("خطا در دریافت آنالیز:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "4rem 2rem" }}>
        <Loader size={32} style={{ animation: "spin 1s linear infinite", margin: "0 auto" }} />
      </div>
    );
  }

  if (!analytics) {
    return (
      <div style={{ textAlign: "center", padding: "4rem 2rem", opacity: 0.6 }}>
        خطا در بارگیری آنالیز. لطفاً مجدد تلاش کنید.
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fa-IR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

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
            {["۲۴ ساعت", "۷ روز", "۳۰ روز", "همه"].map((r) => (
              <button 
                key={r}
                onClick={() => setRange(r)}
                style={{ 
                  padding: "0.5rem 1rem", 
                  borderRadius: "8px", 
                  background: range === r ? "rgba(255,255,255,0.1)" : "transparent",
                  border: "none",
                  color: "white",
                  cursor: "pointer",
                  fontSize: "0.875rem"
                }}
              >
                {r}
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
            <span style={{ color: analytics.revenueChange >= 0 ? "var(--success)" : "var(--error)", display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.875rem", fontWeight: 600, direction: "ltr" }}>
              {analytics.revenueChange >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
              {Math.abs(analytics.revenueChange)}%
            </span>
          </div>
          <p style={{ margin: 0, opacity: 0.6, fontSize: "0.875rem" }}>درآمد ناخالص</p>
          <h2 style={{ margin: "0.25rem 0", fontSize: "2rem" }}>{formatCurrency(analytics.totalRevenue)} تومان</h2>
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
            <span style={{ color: analytics.ordersChange >= 0 ? "var(--success)" : "var(--error)", display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.875rem", fontWeight: 600, direction: "ltr" }}>
              {analytics.ordersChange >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
              {Math.abs(analytics.ordersChange)}%
            </span>
          </div>
          <p style={{ margin: 0, opacity: 0.6, fontSize: "0.875rem" }}>کل سفارشات</p>
          <h2 style={{ margin: "0.25rem 0", fontSize: "2rem" }}>{formatCurrency(analytics.totalOrders)}</h2>
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
            <span style={{ color: analytics.marginChange >= 0 ? "var(--success)" : "var(--error)", display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.875rem", fontWeight: 600, direction: "ltr" }}>
              {analytics.marginChange >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
              {Math.abs(analytics.marginChange)}%
            </span>
          </div>
          <p style={{ margin: 0, opacity: 0.6, fontSize: "0.875rem" }}>حاشیه سود</p>
          <h2 style={{ margin: "0.25rem 0", fontSize: "2rem" }}>{analytics.profitMargin.toFixed(1)}٪</h2>
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
            {analytics.platformRevenue.map((item) => (
              <div key={item.name}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem", fontSize: "0.875rem" }}>
                  <span style={{ fontWeight: 600 }}>{item.name}</span>
                  <span style={{ opacity: 0.6 }}>{formatCurrency(item.value)} تومان ({item.percent}٪)</span>
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
              {analytics.topServices.map((item, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "1rem", borderRadius: "12px", background: "rgba(255,255,255,0.02)", border: "1px solid var(--card-border)" }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{item.name}</div>
                    <div style={{ fontSize: "0.75rem", opacity: 0.5 }}>{formatCurrency(item.sales)} فروش</div>
                  </div>
                  <div style={{ textAlign: "left", fontWeight: 700, color: "var(--primary)" }}>
                    {formatCurrency(item.revenue)} تومان
                  </div>
                </div>
              ))}
            </div>
        </div>
      </div>
    </div>
  );
}
