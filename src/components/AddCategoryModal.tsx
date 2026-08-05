"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X, Loader } from "lucide-react";

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, slug: string) => Promise<void>;
  platformName: string;
}

export function AddCategoryModal({ isOpen, onClose, onSubmit, platformName }: AddCategoryModalProps) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleNameChange = (value: string) => {
    setName(value);
    // Auto-generate slug from name
    setSlug(value.toLowerCase().replace(/\s+/g, "-"));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("نام دسته‌بندی الزامی است");
      return;
    }

    if (!slug.trim()) {
      setError("شناسه یکتا الزامی است");
      return;
    }

    setIsLoading(true);
    try {
      await onSubmit(name, slug);
      setName("");
      setSlug("");
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
              نام دسته‌بندی
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
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

          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", opacity: 0.8 }}>
              شناسه یکتا (انگلیسی)
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="followers-real"
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
                direction: "ltr",
                boxSizing: "border-box",
              }}
            />
            <p style={{ margin: "0.5rem 0 0", fontSize: "0.75rem", opacity: 0.5 }}>
              پلتفرم: {platformName}
            </p>
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
