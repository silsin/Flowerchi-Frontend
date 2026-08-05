"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, ChevronDown, ChevronUp, Trash2, Edit2, Loader } from "lucide-react";
import { AddServiceModal } from "./AddServiceModal";

interface Service {
  id: string;
  name: string;
  description?: string;
  price: number;
  min_quantity: number;
  max_quantity: number;
  created_at: string;
}

interface CategoryServicesListProps {
  categoryId: string;
  categoryName: string;
}

export function CategoryServicesList({ categoryId, categoryName }: CategoryServicesListProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAddingService, setIsAddingService] = useState(false);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/services?categoryId=${categoryId}`);
      if (!response.ok) throw new Error("Failed to fetch services");
      
      const data = await response.json();
      setServices(data.items || []);
    } catch (error) {
      console.error("خطا در دریافت خدمات:", error);
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isExpanded && services.length === 0) {
      fetchServices();
    }
  }, [isExpanded]);

  const handleAddService = async (serviceData: {
    name: string;
    description: string;
    price: number;
    minQuantity: number;
    maxQuantity: number;
  }) => {
    const response = await fetch("/api/services", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        ...serviceData,
        categoryId,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "ذخیره خدمت ناموفق بود");
    }

    setIsAddingService(false);
    await fetchServices();
  };

  const handleDeleteService = async (serviceId: string) => {
    if (!confirm("آیا مطمئن هستید؟")) return;

    const response = await fetch(`/api/services/${serviceId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      alert("حذف خدمت ناموفق بود");
      return;
    }

    await fetchServices();
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: "rgba(255,255,255,0.02)",
          border: "1px solid var(--card-border)",
          borderRadius: "12px",
          overflow: "hidden",
          marginTop: "1rem",
        }}
      >
        {/* Expandable Header */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "1rem",
            background: "transparent",
            border: "none",
            color: "white",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = "transparent";
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <span style={{ fontWeight: 600 }}>خدمات ({services.length})</span>
          </div>
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>

        {/* Services List */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              style={{
                borderTop: "1px solid var(--card-border)",
                padding: "1rem",
              }}
            >
              {loading && (
                <div style={{ textAlign: "center", padding: "1rem", opacity: 0.6 }}>
                  <Loader size={20} style={{ animation: "spin 1s linear infinite", margin: "0 auto" }} />
                </div>
              )}

              {!loading && services.length === 0 && (
                <div style={{ textAlign: "center", padding: "1rem", opacity: 0.5, fontSize: "0.875rem" }}>
                  هیچ خدمتی برای این دسته‌بندی موجود نیست
                </div>
              )}

              {!loading && services.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {services.map((service) => (
                    <motion.div
                      key={service.id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "0.75rem",
                        background: "rgba(255,255,255,0.03)",
                        borderRadius: "8px",
                        border: "1px solid rgba(255,255,255,0.05)",
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: 0, fontWeight: 600, fontSize: "0.95rem" }}>
                          {service.name}
                        </p>
                        {service.description && (
                          <p style={{
                            margin: "0.25rem 0 0",
                            fontSize: "0.75rem",
                            opacity: 0.5,
                          }}>
                            {service.description}
                          </p>
                        )}
                        <p style={{
                          margin: "0.5rem 0 0",
                          fontSize: "0.75rem",
                          opacity: 0.4,
                        }}>
                          قیمت: {service.price.toLocaleString('fa-IR')} تومان
                        </p>
                      </div>
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button
                          onClick={() => handleDeleteService(service.id)}
                          style={{
                            padding: "0.5rem",
                            borderRadius: "6px",
                            background: "rgba(239, 68, 68, 0.1)",
                            border: "1px solid rgba(239, 68, 68, 0.2)",
                            color: "var(--error)",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                          }}
                          title="حذف"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Add Service Button */}
              <button
                onClick={() => setIsAddingService(true)}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  marginTop: "1rem",
                  borderRadius: "8px",
                  border: "1px dashed rgba(255,255,255,0.2)",
                  background: "transparent",
                  color: "white",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  fontSize: "0.875rem",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)";
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.3)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "transparent";
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.2)";
                }}
              >
                <Plus size={16} />
                خدمت جدید
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <AddServiceModal
        isOpen={isAddingService}
        onClose={() => setIsAddingService(false)}
        onSubmit={handleAddService}
        categoryName={categoryName}
      />
    </>
  );
}
