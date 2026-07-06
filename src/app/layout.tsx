import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://redz-restaurant.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Redz Restaurant | Inspired American Fare in Mt Laurel, NJ",
    template: "%s | Redz Restaurant",
  },
  description: "Experience authentic, premium American cuisine at Redz Restaurant in Mt Laurel, NJ. Join us for lunch, dinner, or a casual night out.",
  // No title/description/url here: leaving them unset lets Next.js backfill
  // og:title/og:description per page from each route's own metadata
  openGraph: {
    siteName: "Redz Restaurant",
    locale: "en_US",
    type: "website",
    images: ["/images/original/premium_dinner_hero.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} h-full antialiased overflow-x-hidden`}>
      <body className="min-h-full flex flex-col overflow-x-hidden">{children}</body>
    </html>
  );
}
