import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import LanguageSwitcher from "@/components/language-switcher";
import Navbar from "@/components/navbar";

import Chatbot from "@/components/chatbot";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";
import PWAInstallPrompt from "@/components/pwa-install-prompt";
import PWAOfflineIndicator from "@/components/pwa-offline-indicator";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#22c55e" },
    { media: "(prefers-color-scheme: dark)", color: "#16a34a" },
  ],
};

export const metadata: Metadata = {
  title: {
    default: "AgriSakhi - AI-Powered Plant Disease Detection",
    template: "%s | AgriSakhi",
  },
  description:
    "Free AI-powered plant disease detection and agricultural assistance for farmers worldwide. Detect, treat, and prevent crop diseases with expert guidance.",
  keywords: [
    "agriculture",
    "plant disease",
    "AI detection",
    "crop management",
    "farming",
    "agricultural technology",
    "pest control",
    "disease prevention",
  ],
  authors: [{ name: "AgriSakhi Team" }],
  creator: "AgriSakhi",
  publisher: "AgriSakhi",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "AgriSakhi - AI-Powered Plant Disease Detection",
    description:
      "Free AI-powered plant disease detection and agricultural assistance for farmers worldwide.",
    siteName: "AgriSakhi",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AgriSakhi - Agriculture Friend",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AgriSakhi - AI-Powered Plant Disease Detection",
    description:
      "Free AI-powered plant disease detection and agricultural assistance for farmers worldwide.",
    images: ["/og-image.png"],
    creator: "@agrisakhi",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/icons/icon-72x72.svg", sizes: "72x72", type: "image/svg+xml" },
      { url: "/icons/icon-96x96.svg", sizes: "96x96", type: "image/svg+xml" },
      { url: "/icons/icon-128x128.svg", sizes: "128x128", type: "image/svg+xml" },
      { url: "/icons/icon-192x192.svg", sizes: "192x192", type: "image/svg+xml" },
      { url: "/icons/icon-512x512.svg", sizes: "512x512", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/icons/icon-152x152.svg", sizes: "152x152", type: "image/svg+xml" },
    ],
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "AgriSakhi",
  },
  formatDetection: {
    telephone: false,
  },
  category: "agriculture",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="overflow-x-hidden">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.variable} antialiased overflow-x-hidden`} suppressHydrationWarning>
        <Providers>
          <Navbar />
          <div style={{ position: 'fixed', top: '5rem', right: '1rem', zIndex: 30 }}>
            <LanguageSwitcher />
          </div>
          <div className="w-full max-w-full overflow-x-hidden" suppressHydrationWarning>
            {children}
          </div>

          <Chatbot />
          <PWAInstallPrompt />
          <PWAOfflineIndicator />
          <Toaster />
          <SonnerToaster position="top-right" richColors />
        </Providers>
      </body>
    </html>
  );
}
