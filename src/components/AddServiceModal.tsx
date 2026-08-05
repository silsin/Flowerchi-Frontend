"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X, Loader } from "lucide-react";

interface AddServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (service: {
    name: string;
    description: string;
    price: number;
    minQuantity: number;
    maxQuantity: number;
  }) => Promise<void>;
  categoryName: string;
}

export function AddServiceModal({
  isOpen,
  onClose,
  onSubmit,
  categoryName,
}: AddServiceModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [minQuantity, setMinQuantity] = useState("1");
  const [maxQuantity, setMaxQuantity] = useState("100000");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("نام خدمت الزامی است");
      return;
    }

    if (!price || parseFloat(price) <= 0) {
      setError("قیمت باید بیشتر از صفر باشد");
      return;
    }

    const min = parseInt(minQuantity) || 1;
    const max = parseInt(maxQuantity) || 100000;

    if (min <= 0 || max <= 0) {
      setError("حداقل و حداکثر تعداد باید بیشتر از صفر باشند");
      return;
    }

    if (min > max) {
      setError("حداقل تعداد نمی‌تواند بیشتر از حداکثر تعداد باشد");
      return;
    }

    setIsLoading(true);
    try {
      await onSubmit({
        name: name.trim(),
        description: description.trim(),
        price: parseInt(price),
        minQuantity: min,
        maxQuantity: max,
      });
      setName("");
      setDescription("");
      setPrice("");
      setMinQuantity("1");
      setMaxQuantity("100000");
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
          width: "90%",
          maxWidth: "500px",
          borderRadius: "20px",
          padding: "2rem",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.5rem",
          }}
        >
          <div>
            <h2 style={{ margin: 0, marginBottom: "0.25rem" }}>خدمت جدید</h2>
            <p style={{ margin: 0, fontSize: "0.875rem", opacity: 0.6 }}>
              دسته‌بندی: {categoryName}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              color: "white",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
            }}
          >
            <X size={24} />
          </button>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              borderRadius: "12px",
              padding: "0.75rem",
              marginBottom: "1rem",
              color: "var(--error)",
              fontSize: "0.875rem",
            }}
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {/* Name */}
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", opacity: 0.7 }}>
              نام خدمت *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: فالوور اینستاگرام"
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "12px",
                border: "1px solid var(--card-border)",
                background: "rgba(255,255,255,0.05)",
                color: "white",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Description */}
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", opacity: 0.7 }}>
              توضیحات
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="توضیحات خدمت..."
              rows={3}
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "12px",
                border: "1px solid var(--card-border)",
                background: "rgba(255,255,255,0.05)",
                color: "white",
                outline: "none",
                boxSizing: "border-box",
                fontFamily: "inherit",
                resize: "vertical",
              }}
            />
          </div>

          {/* Price */}
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", opacity: 0.7 }}>
              قیمت (تومان) *
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0"
              min="1"
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "12px",
                border: "1px solid var(--card-border)",
                background: "rgba(255,255,255,0.05)",
                color: "white",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Quantities */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", opacity: 0.7 }}>
                حداقل تعداد
              </label>
              <input
                type="number"
                value={minQuantity}
                onChange={(e) => setMinQuantity(e.target.value)}
                min="1"
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  borderRadius: "12px",
                  border: "1px solid var(--card-border)",
                  background: "rgba(255,255,255,0.05)",
                  color: "white",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", opacity: 0.7 }}>
                حداکثر تعداد
              </label>
              <input
                type="number"
                value={maxQuantity}
                onChange={(e) => setMaxQuantity(e.target.value)}
                min="1"
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  borderRadius: "12px",
                  border: "1px solid var(--card-border)",
                  background: "rgba(255,255,255,0.05)",
                  color: "white",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
            <button
              type="button"
              onClick={onClose}
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
              {isLoading && <Loader size={16} style={{ animation: "spin 1s linear infinite" }} />}
              {isLoading ? "در حال ذخیره..." : "ذخیره خدمت"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
