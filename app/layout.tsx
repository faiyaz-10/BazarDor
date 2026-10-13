import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: {
    default: "বাজার দর — প্রতিদিনের বাজারের হিসাব",
    template: "%s | বাজার দর",
  },
  description:
    "বাংলাদেশের নিত্যপ্রয়োজনীয় পণ্যের বাজারদর এক নজরে দেখুন, তুলনা করুন এবং পরিকল্পনা করুন।",
  applicationName: "বাজার দর",
  keywords: ["বাজার দর", "বাংলাদেশ বাজারদর", "পণ্যের দাম", "BazarDor"],
};
export const viewport: Viewport = {
  themeColor: "#f0f6f1",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="bn">
      <body>
        <Navbar />
        <main className="site-main min-h-[58vh]">{children}</main>
        <Footer />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3200,
            style: {
              borderRadius: "14px",
              border: "1px solid #e7e9df",
              padding: "14px 16px",
              fontSize: "14px",
            },
          }}
        />
      </body>
    </html>
  );
}
