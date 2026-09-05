import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import BrandBackdrop from "@/components/BrandBackdrop";
import SiteHeader from "@/components/SiteHeader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

/*
  Absolute URLs for social previews are built from this. Set
  NEXT_PUBLIC_SITE_URL in the hosting environment to the real domain — without
  it, links shared to WhatsApp or Facebook point at localhost and show nothing.
*/
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Making Sense Together — Handwriting",
    // Pages that set their own title get it followed by the site name, so a
    // shared link always says whose site it is.
    template: "%s — Making Sense Together",
  },
  description:
    "Free handwriting education, plus a screening tool and Two Term program for school support staff.",
  openGraph: {
    title: "Making Sense Together — Handwriting",
    description:
      "Free handwriting education, plus a screening tool and Two Term program for school support staff.",
    url: siteUrl,
    siteName: "Making Sense Together",
    locale: "en_AU",
    type: "website",
  },
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
