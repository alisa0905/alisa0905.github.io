"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { FLOWER } from "@/lib/flower";

/**
 * A little spinning flower that trails the mouse (desktop only).
 * It blooms bigger over anything clickable.
 */
export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [hover, setHover] = useState(false);
  const [down, setDown] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 });

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || calm) return;
    const frame = requestAnimationFrame(() => setEnabled(true));

    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const t = e.target as HTMLElement | null;
      setHover(!!t?.closest("a, button, [data-cursor='zoom']"));
    };
    const press = () => setDown(true);
    const release = () => setDown(false);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerdown", press);
    window.addEventListener("pointerup", release);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", press);
      window.removeEventListener("pointerup", release);
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[100] mix-blend-difference"
      style={{ x: sx, y: sy }}
    >
      <motion.svg
        viewBox={FLOWER.viewBox}
        className="-translate-x-1/2 -translate-y-1/2"
        animate={{ width: hover ? 56 : 26, height: hover ? 56 : 26, rotate: 360, scale: down ? 0.8 : 1 }}
        transition={{
          width: { type: "spring", stiffness: 300, damping: 20 },
          height: { type: "spring", stiffness: 300, damping: 20 },
          scale: { type: "spring", stiffness: 400, damping: 20 },
          rotate: { duration: 8, repeat: Infinity, ease: "linear" },
        }}
      >
        {FLOWER.petals.map((d, i) => (
          <path
            key={i}
            d={d}
            fill={hover ? "#ecedd8" : "none"}
            stroke="#ecedd8"
            strokeWidth={FLOWER.strokeWidth}
            strokeLinejoin="round"
          />
        ))}
      </motion.svg>
    </motion.div>
  );
}
