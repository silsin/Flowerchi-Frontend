"use client";

import { useState } from "react";
import { Plus, Search, Instagram, Send, AppWindow, MoreVertical, Edit2, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePlatforms } from "@/context/PlatformContext";

const initialCategories = [
  { id: 1, platform: "اینستاگرام", name: "فالور با کیفیت", price: "۴,۰۰۰ تومان", status: "فعال", services: 12 },
  { id: 2, platform: "اینستاگرام", name: "لایک واقعی", price: "۱,۵۰۰ تومان", status: "فعال", services: 8 },
  { id: 3, platform: "تلگرام", name: "ممبر کانال", price: "۲,۰۰۰ تومان", status: "فعال", services: 5 },
  { id: 4, platform: "تلگرام", name: "بازدید پست", price: "۱۰۰ تومان", status: "فعال", services: 3 },
  { id: 5, platform: "تیک‌تاک", name: "بازدید عالی", price: "۵۰ تومان", status: "فعال", services: 15 },
];

export default function CategoriesPage() {
  const { platforms, addPlatform } = usePlatforms();
  const [activePlatform, setActivePlatform] = useState("همه");
  const [isAddingPlatform, setIsAddingPlatform] = useState(false);
  const [newPlatformName, setNewPlatformName] = useState("");

  const filteredCategories = activePlatform === "همه" 
    ? initialCategories 
    : initialCategories.filter(c => c.platform === activePlatform);

  const handleAddPlatform = async () => {
    if (newPlatformName.trim()) {
      const response = await fetch("/api/platforms", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ name: newPlatformName }) });
      if (!response.ok) { alert("ذخیره پلتفرم ناموفق بود."); return; }
      addPlatform(newPlatformName);
      setNewPlatformName("");
      setIsAddingPlatform(false);
    }
  };
  const addCategory = async () => { const name=prompt("نام دسته‌بندی"); const platform=platforms[0]; if(!name||!platform)return; const slug=prompt("شناسه یکتا (انگلیسی)",name.toLowerCase().replace(/\s+/g,"-")); if(!slug)return; const response=await fetch("/api/categories",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({name,slug,platformId:platform.id})}); if(!response.ok)alert("ذخیره دسته‌بندی ناموفق بود."); else window.location.reload(); };

  return (
    <div className="animate-fade-in">
      <header style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        marginBottom: "2.5rem" 
      }}>
        <div>
          <h1 style={{ margin: 0 }}>دسته‌بندی‌ها</h1>
          <p>مدیریت پلتفرم‌ها و دسته‌بندی خدمات.</p>
        </div>
        <div style={{ display: "flex", gap: "1rem" }}>
           <button className="btn btn-secondary" onClick={() => setIsAddingPlatform(true)}>
            <Plus size={18} />
            پلتفرم جدید
          </button>
          <button className="btn btn-primary" onClick={addCategory}>
            <Plus size={18} />
            دسته‌بندی جدید
          </button>
        </div>
      </header>

      {isAddingPlatform && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass shadow-lg" 
          style={{ padding: "1.5rem", borderRadius: "20px", marginBottom: "2rem", display: "flex", gap: "1rem", alignItems: "center" }}
        >
          <input 
            placeholder="نام پلتفرم جدید را وارد کنید..."
            value={newPlatformName}
            onChange={(e) => setNewPlatformName(e.target.value)}
            autoFocus
            style={{ flex: 1, background: "rgba(255,255,255,0.05)", border: "1px solid var(--card-border)", color: "white", padding: "0.75rem 1rem", borderRadius: "12px", outline: "none" }}
          />
          <button className="btn btn-primary" onClick={handleAddPlatform}>ذخیره</button>
          <button className="btn btn-secondary" onClick={() => setIsAddingPlatform(false)}>انصراف</button>
        </motion.div>
      )}

      <div className="glass" style={{ padding: "1.5rem", borderRadius: "20px", marginBottom: "2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <button
              onClick={() => setActivePlatform("همه")}
              style={{
                padding: "0.6rem 1.25rem",
                borderRadius: "10px",
                border: "1px solid var(--card-border)",
                background: activePlatform === "همه" ? "var(--primary)" : "transparent",
                color: "white",
                cursor: "pointer",
                fontWeight: 600,
                transition: "all 0.2s"
              }}
            >
              همه پلتفرم‌ها
            </button>
            {platforms.map((p) => (
              <button
                key={p.id}
                onClick={() => setActivePlatform(p.name)}
                style={{
                  padding: "0.6rem 1.25rem",
                  borderRadius: "10px",
                  border: "1px solid var(--card-border)",
                  background: activePlatform === p.name ? "var(--primary)" : "transparent",
                  color: "white",
                  cursor: "pointer",
                  fontWeight: 600,
                  transition: "all 0.2s"
                }}
              >
                {p.name}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", background: "rgba(255,255,255,0.05)", padding: "0.5rem 1.25rem", borderRadius: "12px", border: "1px solid var(--card-border)" }}>
            <Search size={18} color="rgba(255,255,255,0.4)" />
            <input 
              placeholder="جستجو در خدمات..." 
              style={{ background: "transparent", border: "none", color: "white", outline: "none" }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3">
        <AnimatePresence>
          {filteredCategories.map((cat) => (
            <motion.div
              layout
              key={cat.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="glass glass-hover"
              style={{ padding: "1.5rem", borderRadius: "20px" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                <div style={{ 
                  padding: "0.75rem", 
                  borderRadius: "12px", 
                  background: "rgba(255, 255, 255, 0.05)",
                  color: platforms.find(p => p.name === cat.platform)?.color || "var(--primary)"
                }}>
                  {cat.platform === "اینستاگرام" ? <Instagram size={24} /> : cat.platform === "تلگرام" ? <Send size={24} /> : <AppWindow size={24} />}
                </div>
                <button style={{ background: "transparent", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer" }}>
                  <MoreVertical size={20} />
                </button>
              </div>
              
              <h3 style={{ margin: "0 0 0.25rem", fontSize: "1.25rem" }}>{cat.name}</h3>
              <p style={{ margin: "0 0 1rem", fontSize: "0.875rem", opacity: 0.6 }}>{cat.platform}</p>
              
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1.5rem", paddingTop: "1rem", borderTop: "1px solid var(--card-border)" }}>
                <div>
                  <p style={{ margin: 0, fontSize: "0.75rem", opacity: 0.5 }}>تعداد سرویس‌ها</p>
                  <p style={{ margin: 0, fontWeight: 700 }}>{cat.services}</p>
                </div>
                <div style={{ textAlign: "left" }}>
                  <p style={{ margin: 0, fontSize: "0.75rem", opacity: 0.5 }}>شروع قیمت از</p>
                  <p style={{ margin: 0, fontWeight: 700, color: "var(--success)" }}>{cat.price}</p>
                </div>
              </div>

              <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
                <button style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", padding: "0.6rem", borderRadius: "10px", background: "rgba(255,255,255,0.05)", border: "1px solid var(--card-border)", color: "white", cursor: "pointer", fontSize: "0.875rem" }}>
                  <Edit2 size={16} />
                  ویرایش
                </button>
                <button style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", padding: "0.6rem", borderRadius: "10px", background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)", color: "var(--error)", cursor: "pointer", fontSize: "0.875rem" }}>
                  <Trash2 size={16} />
                  حذف
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
