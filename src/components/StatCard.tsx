"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: ReactNode;
}

export default function StatCard({ title, value, change, isPositive, icon }: StatCardProps) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="glass glass-hover animate-fade-in"
      style={{
        padding: "1.5rem",
        borderRadius: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "1rem"
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ 
          padding: "0.75rem", 
          borderRadius: "12px", 
          background: "rgba(139, 92, 246, 0.1)",
          color: "var(--primary)"
        }}>
          {icon}
        </div>
        <span style={{ 
          fontSize: "0.875rem", 
          fontWeight: 600,
          color: isPositive ? "var(--success)" : "var(--error)",
          background: isPositive ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)",
          padding: "0.25rem 0.5rem",
          borderRadius: "6px",
          direction: "ltr"
        }}>
          {isPositive ? "+" : ""}{change}
        </span>
      </div>
      <div>
        <p style={{ margin: 0, opacity: 0.6, fontSize: "0.875rem" }}>{title}</p>
        <h3 style={{ margin: "0.25rem 0 0", fontSize: "1.75rem", fontWeight: 700 }}>{value}</h3>
      </div>
    </motion.div>
  );
}
