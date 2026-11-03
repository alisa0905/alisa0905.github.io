"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

// Same ellipse as the green hill in Alisa's Figma footer, but drawn the other
// way round: everything *outside* the hill is painted, so it reads as the
// bottom of the section above curving up
const EDGE = "transparent 99.6%, var(--end) 100%";

/**
 * The bottom edge of each page's last section, curved upward into a hill.
 * It sits over the top of the footer and moves with the page, so as you
 * scroll the section lifts off the green footer underneath. Its colour is
 * picked up from whatever section is just above it on each page.
 */
export function FooterHill() {
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // First guess, before the exact spot can be read: the last section's own colour
    const last = document.querySelector("main")?.lastElementChild;
    const guess = last ? getComputedStyle(last).backgroundColor : "";
    el.style.setProperty("--end", guess && !guess.endsWith(", 0)") ? guess : "var(--paper)");
    // Read the colour of the page just above the footer, at the far left
    // edge where the curve is, once that spot is actually on screen
    const pick = () => {
      const top = el.getBoundingClientRect().top - 2;
      if (top < 1 || top > window.innerHeight - 1) return false;
      const main = document.querySelector("main");
      for (const hit of document.elementsFromPoint(2, top)) {
        if (!main?.contains(hit)) continue;
        for (let n: Element | null = hit; n && n !== document.body; n = n.parentElement) {
          const bg = getComputedStyle(n).backgroundColor;
          if (bg && bg !== "transparent" && !bg.endsWith(", 0)")) {
            el.style.setProperty("--end", bg);
            return true;
          }
        }
        break;
      }
      return true;
    };
    // Try while the footer is near the screen; the spot above it might be
    // scrolled just out of view, so keep trying as the page moves
    const onScroll = () => {
      if (pick()) stop();
    };
    const stop = () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return window.removeEventListener("scroll", onScroll);
      if (pick()) stop();
      else window.addEventListener("scroll", onScroll, { passive: true });
    });
    io.observe(el);
    return stop;
  }, [pathname]);

  return (
    // Starts 3px above the footer so it overlaps the section and no green
    // hairline can show between them when the page lands between pixels
    <div ref={ref} aria-hidden className="pointer-events-none absolute inset-x-0 -top-[3px] bottom-0 z-10">
      {/* Phones and tablets: matches the stacked footer's hill */}
      <div className="absolute inset-0 lg:hidden" style={{ background: `radial-gradient(130% 100% at 50% calc(100% + 4rem), ${EDGE})` }} />
      {/* Computers: matches the Figma layout, sized in the footer's --u units */}
      <div
        className="absolute inset-0 hidden [--u:min(1vw,1.25svh)] lg:block"
        style={{
          background: `radial-gradient(max(calc(var(--u) * 71.4), 59vw) calc(var(--u) * 52.5) at 50% calc(var(--u) * 60.5), ${EDGE})`,
        }}
      />
    </div>
  );
}
