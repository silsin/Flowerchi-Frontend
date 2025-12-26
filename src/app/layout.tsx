import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { PlatformProvider } from "@/context/PlatformContext";

export const metadata: Metadata = {
  title: "مدیریت خدمات | پنل مدیریت",
  description: "پنل مدیریت پیشرفته خدمات شبکه‌های اجتماعی",
  manifest: "/manifest.json",
  themeColor: "#8b5cf6",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@100;400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
        <PlatformProvider>
          <div className="dashboard-container">
            <Sidebar />
            <main className="main-content">
              {children}
            </main>
          </div>
        </PlatformProvider>
      </body>
    </html>
  );
}
