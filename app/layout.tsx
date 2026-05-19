import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://motofliip.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "MotoFlip — Motorcycle Flip Score & Profit Calculator",
    template: "%s · MotoFlip",
  },
  description: "MotoFlip analyzes motorcycle listings in seconds. Get an AI flip score, profit estimate, suggested offer price, and red flags — right on Facebook Marketplace and Craigslist.",
  keywords: [
    "motorcycle flip",
    "motorcycle flip score",
    "motorcycle reseller",
    "buy sell motorcycles",
    "motorcycle profit calculator",
    "facebook marketplace motorcycles",
    "craigslist motorcycles",
    "used motorcycle value",
  ],
  applicationName: "MotoFlip",
  authors: [{ name: "MotoFlip" }],
  creator: "MotoFlip",
  formatDetection: { telephone: false, email: false, address: false },
  openGraph: {
    title: "MotoFlip — Motorcycle Flip Score & Profit Calculator",
    description: "Stop guessing. Start flipping. Get instant AI flip scores on any motorcycle listing.",
    url: SITE_URL,
    siteName: "MotoFlip",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "MotoFlip — Motorcycle Flip Score & Profit Calculator",
    description: "Stop guessing. Start flipping. Get instant AI flip scores on any motorcycle listing.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0a0a",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body>
    </html>
  );
}
