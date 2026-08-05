"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, UserPlus, Shield, Ban, MoreHorizontal, Loader } from "lucide-react";

interface User {
  id: number;
  name: string;
  email: string;
  status: string;
  balance: number;
  created_at: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("همه");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchUsers = async (searchVal: string = "", statusVal: string = "", pageNum: number = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        search: searchVal,
        status: statusVal === "همه" ? "" : statusVal,
        page: pageNum.toString(),
        limit: "20"
      });
      
      const response = await fetch(`/api/users?${params}`);
      if (!response.ok) throw new Error("Failed to fetch users");
      
      const data = await response.json();
      setUsers(data.items);
      setTotal(data.total);
    } catch (error) {
      alert("خطا در بارگیری کاربران");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setPage(1);
    fetchUsers(value, filterStatus === "همه" ? "" : filterStatus, 1);
  };

  const handleFilterStatus = (status: string) => {
    setFilterStatus(status);
    setPage(1);
    fetchUsers(searchQuery, status === "همه" ? "" : status, 1);
  };


  const handleStatusChange = async (user: User, newStatus: string) => {
    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (!response.ok) {
        alert("تغییر وضعیت کاربر ناموفق بود.");
        return;
      }
      
      setUsers(users.map(u => u.id === user.id ? { ...u, status: newStatus } : u));
      alert("وضعیت کاربر با موفقیت تغییر کرد.");
    } catch (error) {
      alert("خطا در تغییر وضعیت کاربر.");
    }
  };

  const handleDeleteUser = async (user: User) => {
    if (!confirm(`آیا مطمئن هستید که می‌خواهید "${user.name}" را حذف کنید؟`)) return;
    
    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: "DELETE"
      });
      
      if (!response.ok) {
        alert("حذف کاربر ناموفق بود.");
        return;
      }
      
      setUsers(users.filter(u => u.id !== user.id));
      alert("کاربر با موفقیت حذف شد.");
    } catch (error) {
      alert("خطا در حذف کاربر.");
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fa-IR', {
      style: 'currency',
      currency: 'IRR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(date);
  };

  const filteredUsers = users;

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
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              style={{ background: "transparent", border: "none", color: "white", outline: "none", width: "100%" }}
            />
          </div>
          
          <div style={{ display: "flex", gap: "1rem" }}>
             <div style={{ display: "flex", background: "rgba(255,255,255,0.05)", borderRadius: "12px", padding: "4px", border: "1px solid var(--card-border)" }}>
                <button onClick={() => handleFilterStatus("همه")} style={{ padding: "0.5rem 1rem", borderRadius: "8px", background: filterStatus === "همه" ? "var(--primary)" : "transparent", border: "none", color: "white", cursor: "pointer" }}>همه</button>
                <button onClick={() => handleFilterStatus("active")} style={{ padding: "0.5rem 1rem", borderRadius: "8px", background: filterStatus === "active" ? "var(--primary)" : "transparent", border: "none", color: "rgba(255,255,255,0.6)", cursor: "pointer" }}>فعال</button>
                <button onClick={() => handleFilterStatus("blocked")} style={{ padding: "0.5rem 1rem", borderRadius: "8px", background: filterStatus === "blocked" ? "var(--primary)" : "transparent", border: "none", color: "rgba(255,255,255,0.6)", cursor: "pointer" }}>مسدود</button>
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
              <th>تاریخ عضویت</th>
              <th>عملیات</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", padding: "2rem" }}>
                  <Loader size={24} style={{ animation: "spin 1s linear infinite" }} />
                </td>
              </tr>
            )}
            {!loading && filteredUsers.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", padding: "2rem", opacity: 0.6 }}>
                  هیچ کاربری یافت نشد
                </td>
              </tr>
            )}
            {!loading && filteredUsers.map((user, index) => (
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
                    user.status === "active" ? "badge-success" : 
                    user.status === "blocked" ? "badge-error" : "badge-warning"
                  }`}>
                    {user.status === "active" ? "فعال" : user.status === "blocked" ? "مسدود شده" : "غیرفعال"}
                  </span>
                </td>
                <td style={{ fontWeight: 700, color: "var(--success)" }}>{formatCurrency(user.balance)}</td>
                <td style={{ opacity: 0.6 }}>{formatDate(user.created_at)}</td>
                <td>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button onClick={() => handleStatusChange(user, "active")} style={{ background: "transparent", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer" }} title="فعال کردن">
                      <Shield size={18} />
                    </button>
                    <button onClick={() => handleStatusChange(user, "blocked")} style={{ background: "transparent", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer" }} title="مسدود کردن">
                      <Ban size={18} />
                    </button>
                    <button onClick={() => handleDeleteUser(user)} style={{ background: "transparent", border: "none", color: "var(--error)", cursor: "pointer" }} title="حذف کاربر">
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
