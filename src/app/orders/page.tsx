"use client";

import { useState } from "react";
import { Search, Filter, Download, ChevronLeft, ChevronRight } from "lucide-react";
import OrderTable from "@/components/OrderTable";

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="animate-fade-in">
      <header style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        marginBottom: "2.5rem" 
      }}>
        <div>
          <h1 style={{ margin: 0 }}>مدیریت سفارشات</h1>
          <p>ردیابی و مدیریت تمام سفارشات خدمات کاربران.</p>
        </div>
        <button className="btn btn-primary">
          <Download size={18} />
          خروجی همه
        </button>
      </header>

      <div className="glass" style={{ padding: "1.5rem", borderRadius: "20px", marginBottom: "2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", background: "rgba(255,255,255,0.05)", padding: "0.5rem 1rem", borderRadius: "12px", border: "1px solid var(--card-border)", minWidth: "300px" }}>
            <Search size={18} color="rgba(255,255,255,0.4)" />
            <input 
              placeholder="جستجو بر اساس شناسه، کاربر یا لینک..." 
              style={{ background: "transparent", border: "none", color: "white", outline: "none", width: "100%" }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div style={{ display: "flex", gap: "1rem" }}>
            <select style={{ 
              background: "rgba(255,255,255,0.05)", 
              border: "1px solid var(--card-border)", 
              color: "white", 
              padding: "0.5rem 1rem", 
              borderRadius: "12px",
              outline: "none"
            }}>
              <option value="all">همه وضعیت‌ها</option>
              <option value="pending">در انتظار</option>
              <option value="processing">در حال پردازش</option>
              <option value="completed">تکمیل شده</option>
              <option value="cancelled">لغو شده</option>
            </select>
            <button className="btn btn-secondary">
              <Filter size={18} />
              فیلترهای بیشتر
            </button>
          </div>
        </div>
      </div>

      <OrderTable />

      <footer style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        marginTop: "2rem",
        padding: "1rem",
        background: "rgba(255,255,255,0.02)",
        borderRadius: "12px",
        border: "1px solid var(--card-border)"
      }}>
        <p style={{ margin: 0, fontSize: "0.875rem", opacity: 0.5 }}>نمایش ۱-۱۰ از ۱,۲۴۸ سفارش</p>
        <div style={{ display: "flex", gap: "0.5rem", direction: "ltr" }}>
          <button style={{ padding: "0.5rem", borderRadius: "8px", background: "transparent", border: "1px solid var(--card-border)", color: "white", cursor: "pointer" }}>
            <ChevronLeft size={18} />
          </button>
          {[1, 2, 3, "...", 125].map((page, i) => (
            <button 
              key={i}
              style={{ 
                width: "36px", 
                height: "36px", 
                borderRadius: "8px", 
                background: page === 1 ? "var(--primary)" : "transparent",
                border: page === 1 ? "none" : "1px solid var(--card-border)",
                color: "white",
                cursor: "pointer",
                fontWeight: 600
              }}
            >
              {page}
            </button>
          ))}
          <button style={{ padding: "0.5rem", borderRadius: "8px", background: "transparent", border: "1px solid var(--card-border)", color: "white", cursor: "pointer" }}>
            <ChevronRight size={18} />
          </button>
        </div>
      </footer>
    </div>
  );
}
