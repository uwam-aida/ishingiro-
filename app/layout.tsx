import type { Metadata } from "next";
import { Inter } from "next/font/google";
// @ts-ignore
import "./globals.css"; 

// 1. IMPORT YOUR NEW WRAPPER HERE
import OneSignalWrapper from "@/components/OneSignalWrapper"; 

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ishingiro Shop",
  description: "Shop Management System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* 2. WRAP THE CHILDREN */}
        <OneSignalWrapper>
          {children}
        </OneSignalWrapper>
      </body>
    </html>
  );
}