"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

type Item = { src: string; alt: string; w: number; h: number; from: DOMRect };

const LightboxContext = createContext<(item: Item) => void>(() => {});

export const useLightbox = () => useContext(LightboxContext);

/** Click any project image to see it full screen. It grows out of where it sat on the page. */
export function LightboxProvider({ children }: { children: React.ReactNode }) {
  const [item, setItem] = useState<Item | null>(null);
  const [view, setView] = useState({ w: 1200, h: 800 });

  const open = useCallback((next: Item) => {
    setView({ w: window.innerWidth, h: window.innerHeight });
    setItem(next);
  }, []);
  const close = useCallback(() => setItem(null), []);

  useEffect(() => {
    if (!item) return;
    window.__lenis?.stop();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => {
      window.__lenis?.start();
      window.removeEventListener("keydown", onKey);
    };
  }, [item, close]);

  // Final size: as large as possible inside 92% x 86% of the screen.
  let target = { w: 0, h: 0, x: 0, y: 0 };
  let from = { x: 0, y: 0, sx: 1, sy: 1 };
  if (item) {
    const ratio = item.w / item.h;
    let w = view.w * 0.92;
    let h = w / ratio;
    if (h > view.h * 0.86) {
      h = view.h * 0.86;
      w = h * ratio;
    }
    target = { w, h, x: (view.w - w) / 2, y: (view.h - h) / 2 };
    from = {
      x: item.from.left + item.from.width / 2 - (target.x + w / 2),
      y: item.from.top + item.from.height / 2 - (target.y + h / 2),
      sx: item.from.width / w,
      sy: item.from.height / h,
    };
  }

  return (
    <LightboxContext.Provider value={open}>
      {children}
      <AnimatePresence>
        {item && (
          <motion.div
            key="lightbox"
            className="fixed inset-0 z-[90] cursor-zoom-out"
            onClick={close}
            role="dialog"
            aria-modal="true"
            aria-label={item.alt}
          >
            <motion.div
              className="absolute inset-0 bg-[#111110]/90 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
            />
            <motion.img
              src={item.src}
              alt={item.alt}
              className="absolute rounded-[6px] shadow-2xl"
              style={{ left: target.x, top: target.y, width: target.w, height: target.h }}
              initial={{ x: from.x, y: from.y, scaleX: from.sx, scaleY: from.sy }}
              animate={{ x: 0, y: 0, scaleX: 1, scaleY: 1 }}
              exit={{ x: from.x, y: from.y, scaleX: from.sx, scaleY: from.sy, opacity: 0.4 }}
              transition={{ type: "spring", stiffness: 260, damping: 30 }}
            />
            <motion.button
              type="button"
              className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-cream text-2xl leading-none text-ink"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              onClick={close}
              aria-label="Close"
            >
              ×
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </LightboxContext.Provider>
  );
}
