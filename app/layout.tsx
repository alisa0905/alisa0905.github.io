import type { Metadata } from "next";
import { Figtree, Londrina_Solid } from "next/font/google";
import "./globals.css";
import { AgentationProvider } from "@/components/AgentationProvider";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Cursor } from "@/components/Cursor";
import { LightboxProvider } from "@/components/Lightbox";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
  display: "swap",
});

const londrina = Londrina_Solid({
  subsets: ["latin"],
  weight: ["400", "900"],
  variable: "--font-londrina",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://alisabakhareva.me"),
  title: {
    default: "Alisa Bakhareva",
    template: "%s · Alisa Bakhareva",
  },
  description:
    "Brand & marketing designer in Dubai. Brand identity, social media, UI/UX and print for Jabrni, B1 Properties, Cemex, Amana Homes, Quotify and more.",
  openGraph: {
    title: "Alisa Bakhareva",
    description: "Brand identity, social media, UI/UX and print, designed in Dubai.",
    url: "https://alisabakhareva.me",
    siteName: "Alisa Bakhareva",
    images: [{ url: "/og.jpg", width: 1200, height: 600, alt: "Alisa Bakhareva — Portfolio" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Alisa Bakhareva",
    description: "Brand identity, social media, UI/UX and print, designed in Dubai.",
    images: ["/og.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${figtree.variable} ${londrina.variable}`}>
      <body className="antialiased">
        {/* Author (body copy font from the Figma portfolio). React moves this into <head>. */}
        <link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=author@400,500&display=swap" precedence="default" />
        <SmoothScroll />
        <LightboxProvider>
          <SiteHeader />
          <main>{children}</main>
          <SiteFooter />
        </LightboxProvider>
        <Cursor />
        <AgentationProvider />
      </body>
    </html>
  );
}
