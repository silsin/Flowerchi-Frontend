"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X, Loader } from "lucide-react";

interface Platform {
  id: string;
  name: string;
}

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, slug: string, platformId: string) => Promise<void>;
  platformName: string;
  platforms: Platform[];
}

export function AddCategoryModal({ isOpen, onClose, onSubmit, platformName, platforms = [] }: AddCategoryModalProps) {
  const [name, setName] = useState("");
  const [selectedPlatformId, setSelectedPlatformId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\u0600-\u06ff]+/g, "-")
      .replace(/^-|-$/g, "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("نام دسته‌بندی الزامی است");
      return;
    }

    if (!selectedPlatformId) {
      setError("انتخاب پلتفرم الزامی است");
      return;
    }

    const slug = generateSlug(name);

    if (!slug) {
      setError("نام دسته‌بندی باید حاوی کاراکترهای معتبری باشد");
      return;
    }

    setIsLoading(true);
    try {
      await onSubmit(name, slug, selectedPlatformId);
      setName("");
      setSelectedPlatformId(null);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطای نامشخصی رخ داد");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      style={{ 
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="glass"
        style={{
          padding: "2rem",
          borderRadius: "20px",
          width: "90%",
          maxWidth: "500px",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
          background: "rgba(20, 20, 35, 0.95)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h2 style={{ margin: 0, fontSize: "1.5rem" }}>دسته‌بندی جدید</h2>
          <button
            onClick={onClose}
            disabled={isLoading}
            style={{
              background: "transparent",
              border: "none",
              color: "rgba(255,255,255,0.6)",
              cursor: isLoading ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "32px",
              height: "32px",
            }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", opacity: 0.8 }}>
              پلتفرم *
            </label>
            <select
              value={selectedPlatformId || ""}
              onChange={(e) => setSelectedPlatformId(e.target.value || null)}
              disabled={isLoading}
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                borderRadius: "12px",
                border: "1px solid var(--card-border)",
                background: "rgba(255,255,255,0.05)",
                color: "white",
                outline: "none",
                fontSize: "1rem",
                direction: "rtl",
                boxSizing: "border-box",
                cursor: isLoading ? "not-allowed" : "pointer",
              }}
            >
              <option value="">انتخاب پلتفرم...</option>
              {platforms.map((p) => (
                <option key={p.id} value={p.id} style={{ background: "#1a1a2e", color: "white" }}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", opacity: 0.8 }}>
              نام دسته‌بندی *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: فالور واقعی"
              autoFocus
              disabled={isLoading}
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                borderRadius: "12px",
                border: "1px solid var(--card-border)",
                background: "rgba(255,255,255,0.05)",
                color: "white",
                outline: "none",
                fontSize: "1rem",
                direction: "rtl",
                boxSizing: "border-box",
              }}
            />
          </div>

          {error && (
            <div style={{
              marginBottom: "1.5rem",
              padding: "0.75rem 1rem",
              borderRadius: "12px",
              background: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              color: "#ef4444",
              fontSize: "0.875rem",
            }}>
              {error}
            </div>
          )}

          <div style={{ display: "flex", gap: "1rem" }}>
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="btn btn-secondary"
              style={{ flex: 1 }}
            >
              انصراف
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary"
              style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}
            >
              {isLoading && <Loader size={16} className="animate-spin" />}
              {isLoading ? "در حال ذخیره..." : "ایجاد"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
