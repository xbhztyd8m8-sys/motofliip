import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "MotoFlip — AI-Powered Motorcycle Flip Analyzer",
  description: "MotoFlip analyzes motorcycle listings in seconds. Get a flip score, profit estimate, suggested offer price, and red flags — right on Facebook Marketplace and Craigslist.",
  keywords: "motorcycle flip, motorcycle reseller, buy sell motorcycles, motorcycle profit calculator, facebook marketplace motorcycles",
  openGraph: {
    title: "MotoFlip — AI-Powered Motorcycle Flip Analyzer",
    description: "Stop guessing. Start flipping. Get instant flip scores on any motorcycle listing.",
    url: "https://motofliip.vercel.app",
    siteName: "MotoFlip",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
