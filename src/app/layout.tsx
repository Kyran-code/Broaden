import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Broaden — Expand Your Mind Daily",
  description: "Broaden your knowledge with daily discoveries and AI-powered news briefs. Learn what you don't know you don't know.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Broaden",
  },
};

export const viewport: Viewport = {
  themeColor: "#080d1a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#080d1a] text-white">{children}</body>
    </html>
  );
}
