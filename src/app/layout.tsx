import type { Metadata } from "next";
import { DM_Sans, Playfair_Display, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { AchievementToastContainer } from "@/components/achievement-toast";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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
  themeColor: "#1B1B18",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${dmSans.variable} ${playfair.variable} ${jetbrains.variable} font-sans antialiased paper-texture`}
      >
        <Nav />
        <main>{children}</main>
        <Footer />
        <AchievementToastContainer />
      </body>
    </html>
  );
}
