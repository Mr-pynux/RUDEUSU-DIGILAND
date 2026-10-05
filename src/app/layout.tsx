import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Noto_Sans_Arabic } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoSansArabic = Noto_Sans_Arabic({
  variable: "--font-arabic",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "RUDEUSU DIGILAND — Instant Digital Goods Marketplace",
  description:
    "Buy Gemini Pro, GPT Plus, IPTV, streaming, music, gaming and software keys with instant delivery. Verified sellers, escrow payments, 24/7 support.",
  keywords: [
    "digital marketplace",
    "Gemini Pro",
    "GPT Plus",
    "IPTV",
    "software keys",
    "instant delivery",
    "RUDEUSU DIGILAND",
  ],
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "RUDEUSU DIGILAND",
    description: "Instant delivery marketplace for digital goods",
    siteName: "RUDEUSU DIGILAND",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0d0b16",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${notoSansArabic.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
