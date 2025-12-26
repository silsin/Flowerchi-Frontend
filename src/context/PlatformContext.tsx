"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { Instagram, Send, Smartphone, AppWindow, LucideIcon } from "lucide-react";

export interface Platform {
  id: string;
  name: string;
  icon: LucideIcon;
  color: string;
}

interface PlatformContextType {
  platforms: Platform[];
  addPlatform: (name: string) => void;
  removePlatform: (id: string) => void;
}

const initialPlatforms: Platform[] = [
  { id: "insta", name: "اینستاگرام", icon: Instagram, color: "#E1306C" },
  { id: "tele", name: "تلگرام", icon: Send, color: "#0088cc" },
  { id: "tiktok", name: "تیک‌تاک", icon: Smartphone, color: "#ff0050" },
];

const PlatformContext = createContext<PlatformContextType | undefined>(undefined);

export function PlatformProvider({ children }: { children: ReactNode }) {
  const [platforms, setPlatforms] = useState<Platform[]>(initialPlatforms);

  const addPlatform = (name: string) => {
    const newPlatform: Platform = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      icon: AppWindow, // Default icon for new platforms
      color: "#8b5cf6",
    };
    setPlatforms([...platforms, newPlatform]);
  };

  const removePlatform = (id: string) => {
    setPlatforms(platforms.filter((p) => p.id !== id));
  };

  return (
    <PlatformContext.Provider value={{ platforms, addPlatform, removePlatform }}>
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
