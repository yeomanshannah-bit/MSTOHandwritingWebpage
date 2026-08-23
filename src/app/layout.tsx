import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import BrandBackdrop from "@/components/BrandBackdrop";
import SiteHeader from "@/components/SiteHeader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Making Sense OT — Handwriting",
  description:
    "Free handwriting education, plus a screening tool and 20-week program for school support staff.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <BrandBackdrop />
        <SiteHeader />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
