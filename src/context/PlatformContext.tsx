"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Instagram, Send, Smartphone, AppWindow, LucideIcon } from "lucide-react";

export interface Platform {
  id: string;
  name: string;
  slug?: string;
  color?: string;
  active?: boolean;
  created_at?: string;
  icon?: LucideIcon;
}

interface PlatformContextType {
  platforms: Platform[];
  addPlatform: (name: string, color?: string) => void;
  removePlatform: (id: string) => void;
  loading: boolean;
}

const platformIcons: { [key: string]: LucideIcon } = {
  "اینستاگرام": Instagram,
  "instagram": Instagram,
  "تلگرام": Send,
  "telegram": Send,
  "تیک‌تاک": Smartphone,
  "tiktok": Smartphone,
};

const PlatformContext = createContext<PlatformContextType | undefined>(undefined);

export function PlatformProvider({ children }: { children: ReactNode }) {
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlatforms = async () => {
      try {
        const response = await fetch("/api/platforms");
        if (response.ok) {
          const result = await response.json();
          const platformsData = result.data || [];
          const platformsWithIcons = (Array.isArray(platformsData) ? platformsData : []).map((p: Platform) => ({
            ...p,
            icon: platformIcons[p.name] || platformIcons[p.slug || ""] || AppWindow,
          }));
          setPlatforms(platformsWithIcons);
        }
      } catch (error) {
        console.error("Failed to fetch platforms:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlatforms();
  }, []);

  const addPlatform = async (name: string, color: string = "#8b5cf6") => {
    try {
      const response = await fetch("/api/platforms", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, color })
      });
      
      if (response.ok) {
        const newPlatform = await response.json();
        setPlatforms([...platforms, {
          ...newPlatform,
          icon: platformIcons[newPlatform.name] || AppWindow,
        }]);
      }
    } catch (error) {
      console.error("Failed to add platform:", error);
    }
  };

  const removePlatform = (id: string) => {
    setPlatforms(platforms.filter((p) => p.id !== id));
  };

  return (
    <PlatformContext.Provider value={{ platforms, addPlatform, removePlatform, loading }}>
      {children}
    </PlatformContext.Provider>
  );
}

export function usePlatforms() {
  const context = useContext(PlatformContext);
  if (context === undefined) {
    throw new Error("usePlatforms must be used within a PlatformProvider");
  }
  return context;
}
