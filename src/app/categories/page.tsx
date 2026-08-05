"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Instagram, Send, AppWindow, MoreVertical, Edit2, Trash2, Loader } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePlatforms } from "@/context/PlatformContext";
import { AddCategoryModal } from "@/components/AddCategoryModal";
import { AddServiceModal } from "@/components/AddServiceModal";
import { CategoryServicesList } from "@/components/CategoryServicesList";

interface Category {
  id: number;
  name: string;
  slug: string;
  platform_id: number;
  platform_name: string;
  status: string;
  created_at: string;
  service_count?: number;
}

export default function CategoriesPage() {
  const { platforms, addPlatform, loading: platformsLoading } = usePlatforms();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [activePlatform, setActivePlatform] = useState("همه");
  const [isAddingPlatform, setIsAddingPlatform] = useState(false);
  const [newPlatformName, setNewPlatformName] = useState("");
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [isAddingService, setIsAddingService] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>("");

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/categories");
      if (!response.ok) throw new Error("Failed to fetch categories");
      
      const result = await response.json();
      const data = result.data;
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("خطا در دریافت دسته‌بندی‌ها:", error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Refetch categories when platforms load
  useEffect(() => {
    if (!platformsLoading && platforms.length > 0) {
      fetchCategories();
    }
  }, [platformsLoading, platforms.length]);

  const filteredCategories = activePlatform === "همه" 
    ? categories 
    : categories.filter(c => c.platform_name === activePlatform);

  const handleAddPlatform = async () => {
    if (newPlatformName.trim()) {
      await addPlatform(newPlatformName);
      setNewPlatformName("");
      setIsAddingPlatform(false);
    }
  };

  const handleAddCategory = async (name: string, slug: string, platformId: string) => {
    if (!platformId) throw new Error("انتخاب پلتفرم الزامی است");
    
    const response = await fetch("/api/categories", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name, slug, platformId })
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "ذخیره دسته‌بندی ناموفق بود");
    }
    
    setIsAddingCategory(false);
    await fetchCategories();
  };

  const handleAddService = async (serviceData: {
    name: string;
    description: string;
    price: number;
    minQuantity: number;
    maxQuantity: number;
  }) => {
    if (!selectedCategoryId) throw new Error("دسته‌بندی انتخاب نشده است");

    const response = await fetch("/api/services", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        ...serviceData,
        categoryId: selectedCategoryId,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "ذخیره خدمت ناموفق بود");
    }

    setIsAddingService(false);
    setSelectedCategoryId(null);
    setSelectedCategoryName("");
    // Refetch categories to update service counts and lists
    await fetchCategories();
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
          <h1 style={{ margin: 0 }}>دسته‌بندی‌ها</h1>
          <p>مدیریت پلتفرم‌ها و دسته‌بندی خدمات.</p>
        </div>
        <div style={{ display: "flex", gap: "1rem" }}>
           <button className="btn btn-secondary" onClick={() => setIsAddingPlatform(true)}>
            <Plus size={18} />
            پلتفرم جدید
          </button>
          <button className="btn btn-primary" onClick={() => setIsAddingCategory(true)}>
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
        {loading && (
          <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "2rem" }}>
            <Loader size={24} style={{ animation: "spin 1s linear infinite", margin: "0 auto" }} />
          </div>
        )}
        {!loading && filteredCategories.length === 0 && (
          <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "2rem", opacity: 0.6 }}>
            هیچ دسته‌بندی‌ای یافت نشد
          </div>
        )}
        <AnimatePresence>
          {!loading && filteredCategories.map((cat) => (
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
                  color: "var(--primary)"
                }}>
                  {cat.platform_name === "اینستاگرام" ? <Instagram size={24} /> : cat.platform_name === "تلگرام" ? <Send size={24} /> : <AppWindow size={24} />}
                </div>
                <button style={{ background: "transparent", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer" }}>
                  <MoreVertical size={20} />
                </button>
              </div>
              
              <h3 style={{ margin: "0 0 0.25rem", fontSize: "1.25rem" }}>{cat.name}</h3>
              <p style={{ margin: "0 0 1rem", fontSize: "0.875rem", opacity: 0.6 }}>{cat.platform_name}</p>
              
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1.5rem", paddingTop: "1rem", borderTop: "1px solid var(--card-border)" }}>
                <div>
                  <p style={{ margin: 0, fontSize: "0.75rem", opacity: 0.5 }}>وضعیت</p>
                  <p style={{ margin: 0, fontWeight: 700 }}>{cat.status === "active" ? "فعال" : "غیرفعال"}</p>
                </div>
                <div style={{ textAlign: "left" }}>
                  <p style={{ margin: 0, fontSize: "0.75rem", opacity: 0.5 }}>تاریخ ایجاد</p>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: "0.875rem" }}>{new Date(cat.created_at).toLocaleDateString('fa-IR')}</p>
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

              {/* Services List */}
              <CategoryServicesList 
                categoryId={cat.id.toString()} 
                categoryName={cat.name}
                onAddServiceClick={() => {
                  setSelectedCategoryId(cat.id.toString());
                  setSelectedCategoryName(cat.name);
                  setIsAddingService(true);
                }}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <AddCategoryModal
        isOpen={isAddingCategory}
        onClose={() => setIsAddingCategory(false)}
        onSubmit={handleAddCategory}
        platformName={platforms[0]?.name || ""}
        platforms={platforms}
      />

      {typeof window !== "undefined" && (
        <AddServiceModal
          isOpen={isAddingService}
          onClose={() => {
            setIsAddingService(false);
            setSelectedCategoryId(null);
            setSelectedCategoryName("");
          }}
          onSubmit={handleAddService}
          categoryName={selectedCategoryName}
        />
      )}
    </div>
  );
}
