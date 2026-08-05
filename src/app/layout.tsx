import type { Metadata } from "next";
import "./globals.css";
import AppShell from "@/components/AppShell";
import { PlatformProvider } from "@/context/PlatformContext";
import AuthGate from "@/components/AuthGate";

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
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@100;300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <style>{`
          /* Ensure Farsi font is applied to all text */
          * { font-family: 'Vazirmatn', system-ui, sans-serif; }
        `}</style>
      </head>
      <body className="antialiased" suppressHydrationWarning>
        <AuthGate><PlatformProvider>
          <AppShell>{children}</AppShell>
        </PlatformProvider></AuthGate>
      </body>
    </html>
  );
}
