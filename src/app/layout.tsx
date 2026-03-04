import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Uncommon Cents | Financial Strategies They Don't Teach You",
  description:
    "Roth conversions, 401k overfunding risks, whole life cash value protection, and the financial strategies that actually build wealth. No fluff, no sales pitch.",
  keywords: [
    "roth conversion",
    "401k overfunding",
    "whole life insurance",
    "tax strategy",
    "financial planning",
    "wealth building",
  ],
  openGraph: {
    title: "Uncommon Cents | Financial Strategies They Don't Teach You",
    description:
      "The financial strategies that actually build wealth. No fluff, no sales pitch.",
    type: "website",
  },
  manifest: "/manifest.json",
};

export const viewport = {
  themeColor: "#16A34A",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${jetbrains.variable} font-sans antialiased paper-texture`}
      >
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
