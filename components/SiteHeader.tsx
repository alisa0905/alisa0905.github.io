"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { BOOKING_URL } from "@/lib/projects";
import { scrollToId } from "./SmoothScroll";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/#about", label: "About" },
  { href: "/work", label: "Work" },
  { href: "/cv", label: "CV" },
];

/** Floating pill header. Solid background once you start scrolling; "Let's talk" is always one tap away. */
export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Pages tell the header whether their hero is light or dark via data-hero-ink.
  const [darkHero, setDarkHero] = useState(true);
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const ink = document.querySelector("[data-hero-ink]")?.getAttribute("data-hero-ink");
      setDarkHero(ink !== "dark");
      setOpen(false);
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname]);
  const solid = scrolled || !darkHero;

  // On the home page the highlight follows the scroll: "About" once the About
  // section reaches the middle of the screen, "Home" above it
  const [onAbout, setOnAbout] = useState(false);
  const clickedAt = useRef(0);
  useEffect(() => {
    if (pathname !== "/") return;
    const check = () => {
      // Right after a click the highlight has already slid over; let the scroll catch up
      if (performance.now() - clickedAt.current < 1600) return;
      const about = document.getElementById("about");
      setOnAbout(!!about && about.getBoundingClientRect().top < window.innerHeight / 2);
    };
    check();
    window.addEventListener("scroll", check, { passive: true });
    return () => window.removeEventListener("scroll", check);
  }, [pathname]);

  const isActive = (href: string) =>
    pathname === "/"
      ? href === "/#about"
        ? onAbout
        : href === "/" && !onAbout
      : href !== "/" && !href.startsWith("/#") && pathname.startsWith(href);

  // Home and About are on the same page, so glide there instead of jumping
  const onNavClick = (href: string) => (e: React.MouseEvent) => {
    if (pathname !== "/" || (href !== "/" && href !== "/#about")) return;
    e.preventDefault();
    clickedAt.current = performance.now();
    setOnAbout(href === "/#about");
    setOpen(false);
    if (href === "/") {
      if (window.__lenis) window.__lenis.scrollTo(0, { duration: 1.4 });
      else window.scrollTo({ top: 0, behavior: "smooth" });
    } else scrollToId("about");
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4 print:hidden">
      <div
        className={`mx-auto flex max-w-7xl items-center justify-between rounded-full border py-1.5 pl-2 pr-1.5 transition-all duration-500 ${
          scrolled
            ? "border-black/5 bg-paper/85 shadow-[0_8px_30px_-12px_rgb(0_0_0/0.25)] backdrop-blur-xl"
            : "border-transparent bg-transparent"
        }`}
      >
        <Link
          href="/"
          className={`rounded-full px-3 py-1 font-display text-2xl leading-none transition-colors ${
            solid ? "text-ink" : "text-cream"
          }`}
          aria-label="Alisa Bakhareva, home"
        >
          Alisa Bakhareva
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={onNavClick(l.href)}
              className={`relative rounded-full px-4 py-2 text-[15px] font-semibold transition-colors ${
                solid ? "text-ink/70 hover:text-ink" : "text-cream/85 hover:text-cream"
              } ${isActive(l.href) ? (solid ? "!text-ink" : "!text-cream") : ""}`}
            >
              {isActive(l.href) && (
                <motion.span
                  layoutId="nav-active"
                  className={`absolute inset-0 rounded-full ${solid ? "bg-ink/8" : "bg-white/15"}`}
                  transition={{ type: "spring", stiffness: 260, damping: 30 }}
                />
              )}
              <span className="relative">{l.label}</span>
            </Link>
          ))}
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noreferrer"
            className="ml-2 rounded-full bg-ink px-5 py-2.5 text-[15px] font-semibold text-cream transition-all duration-500 ease-out hover:-translate-y-0.5 hover:bg-ink/85"
          >
            Let&apos;s talk
          </a>
        </nav>

        <div className="flex items-center gap-1.5 md:hidden">
          <a href={BOOKING_URL} target="_blank" rel="noreferrer" className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-cream">
            Let&apos;s talk
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label="Menu"
            className={`flex h-10 w-10 items-center justify-center rounded-full text-2xl leading-none ${
              solid ? "bg-ink/8 text-ink" : "bg-white/15 text-cream"
            }`}
          >
            <span className={`transition-transform duration-300 ${open ? "rotate-45" : ""}`}>+</span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            aria-label="Mobile"
            initial={{ opacity: 0, y: -10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.97 }}
            className="mx-auto mt-2 grid max-w-7xl gap-2 rounded-3xl bg-ink p-3 md:hidden"
          >
            {[...LINKS, { href: "/contact", label: "Contact" }].map((l, i) => (
              <motion.div key={l.href} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0, transition: { delay: i * 0.05 } }}>
                <Link
                  href={l.href}
                  onClick={(e) => {
                    setOpen(false);
                    onNavClick(l.href)(e);
                  }}
                  className="block rounded-2xl px-4 py-3 font-display text-3xl text-cream hover:bg-white/10"
                >
                  {l.label}
                </Link>
              </motion.div>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
