"use client";

import { motion } from "framer-motion";
import { Search, UserPlus, Shield, Ban, MoreHorizontal } from "lucide-react";

const users = [
  { id: 1, name: "الکس جانسون", email: "alex@example.com", balance: "۱,۲۴۰,۰۰۰ تومان", spent: "۵,۴۲۰,۰۰۰ تومان", joined: "۱۴۰۲/۰۷/۲۰", status: "فعال" },
  { id: 2, name: "سارا اسمیت", email: "sarah.s@gmail.com", balance: "۴۵,۵۰۰ تومان", spent: "۱,۸۹۰,۰۰۰ تومان", joined: "۱۴۰۲/۰۸/۱۴", status: "فعال" },
  { id: 3, name: "مایک راس", email: "mike.ross@legal.com", balance: "۰ تومان", spent: "۴۵۰,۰۰۰ تومان", joined: "۱۴۰۲/۱۱/۰۱", status: "غیرفعال" },
  { id: 4, name: "اما ویلسون", email: "emma@wilson.io", balance: "۸۹۰,۰۰۰ تومان", spent: "۱۲,۴۰۰,۰۰۰ تومان", joined: "۱۴۰۲/۰۵/۲۴", status: "مسدود شده" },
  { id: 5, name: "جان دو", email: "john@doe.com", balance: "۱۲,۰۰۰ تومان", spent: "۱۵۰,۰۰۰ تومان", joined: "۱۴۰۲/۱۱/۱۲", status: "فعال" },
];

export default function UsersPage() {
  return (
    <div className="animate-fade-in">
      <header style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        marginBottom: "2.5rem" 
      }}>
        <div>
          <h1 style={{ margin: 0 }}>مدیریت کاربران</h1>
          <p>مشاهده و مدیریت کاربران اپلیکیشن و موجودی آن‌ها.</p>
        </div>
        <button className="btn btn-primary">
          <UserPlus size={18} />
          کاربر جدید
        </button>
      </header>

      <div className="glass" style={{ padding: "1.5rem", borderRadius: "20px", marginBottom: "2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", background: "rgba(255,255,255,0.05)", padding: "0.5rem 1rem", borderRadius: "12px", border: "1px solid var(--card-border)", minWidth: "350px" }}>
            <Search size={18} color="rgba(255,255,255,0.4)" />
            <input 
              placeholder="جستجو بر اساس نام، ایمیل یا شناسه..." 
              style={{ background: "transparent", border: "none", color: "white", outline: "none", width: "100%" }}
            />
          </div>
          
          <div style={{ display: "flex", gap: "1rem" }}>
             <div style={{ display: "flex", background: "rgba(255,255,255,0.05)", borderRadius: "12px", padding: "4px", border: "1px solid var(--card-border)" }}>
                <button style={{ padding: "0.5rem 1rem", borderRadius: "8px", background: "var(--primary)", border: "none", color: "white", cursor: "pointer" }}>همه</button>
                <button style={{ padding: "0.5rem 1rem", borderRadius: "8px", background: "transparent", border: "none", color: "rgba(255,255,255,0.6)", cursor: "pointer" }}>فعال</button>
                <button style={{ padding: "0.5rem 1rem", borderRadius: "8px", background: "transparent", border: "none", color: "rgba(255,255,255,0.6)", cursor: "pointer" }}>مسدود</button>
             </div>
          </div>
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>کاربر</th>
              <th>وضعیت</th>
              <th>موجودی فعلی</th>
              <th>کل هزینه شده</th>
              <th>تاریخ عضویت</th>
              <th>عملیات</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <motion.tr 
                key={user.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <div style={{ 
                      width: "40px", 
                      height: "40px", 
                      borderRadius: "12px", 
                      background: "linear-gradient(135deg, var(--card-border), var(--card-hover))",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 600,
                      color: "var(--primary)"
                    }}>
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600 }}>{user.name}</div>
                      <div style={{ fontSize: "0.75rem", opacity: 0.5, direction: "ltr", textAlign: "right" }}>{user.email}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className={`badge ${
                    user.status === "فعال" ? "badge-success" : 
                    user.status === "مسدود شده" ? "badge-error" : "badge-warning"
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td style={{ fontWeight: 700, color: "var(--success)" }}>{user.balance}</td>
                <td style={{ fontWeight: 700 }}>{user.spent}</td>
                <td style={{ opacity: 0.6 }}>{user.joined}</td>
                <td>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button style={{ background: "transparent", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer" }} title="جزئیات کاربر">
                      <Shield size={18} />
                    </button>
                    <button style={{ background: "transparent", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer" }} title="مسدود کردن">
                      <Ban size={18} />
                    </button>
                    <button style={{ background: "transparent", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer" }}>
                      <MoreHorizontal size={18} />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
