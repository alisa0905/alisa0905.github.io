"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Pins its content to the bottom of the screen and lets the page slide up off
 * it, like fancycomponents.dev's sticky footer. The outer box keeps the
 * content's height in the page and clips the pinned copy to that box. If the
 * content is taller than the screen it just scrolls normally.
 */
export function StickyReveal({ children }: { children: React.ReactNode }) {
  const inner = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | null>(null);

  useEffect(() => {
    const el = inner.current;
    if (!el) return;
    const measure = () => {
      const h = el.offsetHeight;
      setHeight(h <= window.innerHeight ? h : null);
    };
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const pinned = height !== null;
  return (
    <div
      className="relative"
      style={pinned ? { height, clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" } : undefined}
    >
      <div ref={inner} className={pinned ? "fixed bottom-0 left-0 w-full" : undefined}>
        {children}
      </div>
    </div>
  );
}
