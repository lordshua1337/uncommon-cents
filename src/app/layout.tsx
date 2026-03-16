import type { Metadata } from "next";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { AchievementToastContainer } from "@/components/achievement-toast";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["700", "800"],
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
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
  themeColor: "#F5EDE0",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${outfit.variable} ${plusJakarta.variable} font-sans antialiased linen-texture`}
      >
        <Nav />
        <main>{children}</main>
        <Footer />
        <AchievementToastContainer />
      </body>
    </html>
  );
}
