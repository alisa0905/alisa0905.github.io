import type { Metadata } from "next";
import { Figtree, Londrina_Solid } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { AgentationProvider } from "@/components/AgentationProvider";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Cursor } from "@/components/Cursor";
import { LightboxProvider } from "@/components/Lightbox";
import { SiteHeader } from "@/components/SiteHeader";
import { BrowserTint } from "@/components/BrowserTint";
import { A11yButton } from "@/components/A11yButton";
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

// Author (body copy font from the Figma portfolio), served from this site
// rather than Fontshare, so pages don't wait on another website to show text
const author = localFont({
  src: [
    { path: "./fonts/Author-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/Author-Medium.woff2", weight: "500", style: "normal" },
  ],
  variable: "--font-author-face",
  display: "swap",
  preload: false,
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
    <html lang="en" className={`${figtree.variable} ${londrina.variable} ${author.variable} print:bg-white`}>
      <body className="antialiased print:bg-white">
        {/* First thing keyboard users reach: jumps past the menu to the page itself */}
        <a
          href="#main"
          className="sr-only z-[200] rounded-full bg-ink px-5 py-3 font-semibold text-cream focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to content
        </a>
        <SmoothScroll />
        <BrowserTint />
        <LightboxProvider>
          <SiteHeader />
          <main id="main" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <SiteFooter />
        </LightboxProvider>
        <Cursor />
        <A11yButton />
        <AgentationProvider />
      </body>
    </html>
  );
}
