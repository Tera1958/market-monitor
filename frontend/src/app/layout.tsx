import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "UX Research Workbench - 用户研究工作台",
  description: "AI转录翻译商务办公领域用户研究一站式工作平台",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" className={`${geist.variable} h-full`}>
      <body className="h-full flex bg-gray-50 font-[family-name:var(--font-geist)]">
        <Sidebar />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </body>
    </html>
  );
}
