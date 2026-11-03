"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

const PAPER = "#f6f3ea";

/** Background colour of the page at a point on screen, ignoring the floating header */
function colorAt(y: number) {
  for (const hit of document.elementsFromPoint(1, y)) {
    if (hit.closest("header")) continue;
    for (let n: Element | null = hit; n && n !== document.documentElement; n = n.parentElement) {
      const bg = getComputedStyle(n).backgroundColor;
      if (bg && bg !== "transparent" && !bg.endsWith(", 0)")) return bg;
    }
    break;
  }
  return PAPER;
}

/**
 * Makes the phone browser's top and bottom bars match the page instead of
 * staying cream. As you scroll it tells the browser the colour of whatever
 * section is at the top of the screen (older iPhones and Android read the
 * theme-color tag), and keeps a hairline at the very top and bottom edges in
 * that section's colour (newer Safari samples the page edges).
 */
export function BrowserTint() {
  const top = useRef<HTMLDivElement>(null);
  const bottom = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    let meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "theme-color";
      document.head.appendChild(meta);
    }
    let frame = 0;
    const update = () => {
      frame = 0;
      const t = colorAt(2);
      const b = colorAt(window.innerHeight - 2);
      meta.content = t;
      document.documentElement.style.backgroundColor = t;
      if (top.current) top.current.style.backgroundColor = t;
      if (bottom.current) bottom.current.style.backgroundColor = b;
    };
    const queue = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    queue();
    // Once more after the new page has laid out
    const later = window.setTimeout(queue, 300);
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(later);
      window.removeEventListener("scroll", queue);
      window.removeEventListener("resize", queue);
    };
  }, [pathname]);

  return (
    <>
      <div ref={top} aria-hidden className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-px print:hidden" />
      <div ref={bottom} aria-hidden className="pointer-events-none fixed inset-x-0 bottom-0 z-[60] h-px print:hidden" />
    </>
  );
}
