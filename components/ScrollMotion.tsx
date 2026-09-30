"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";

type Props = {
  children: React.ReactNode;
  /** Position in its row; neighbours drift at slightly different speeds */
  index?: number;
  className?: string;
  style?: React.CSSProperties;
  /** Zoom the content gently from 1.08 to 1 as it scrolls through (for photos) */
  zoom?: boolean;
  as?: "div" | "figure";
};

/**
 * Scroll-driven motion for project images: they rise, straighten and settle
 * into place as you scroll, with a little parallax between neighbours.
 */
export function ScrollMotion({ children, index = 0, className = "", style, zoom = false, as = "div" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress: enter } = useScroll({ target: ref, offset: ["start end", "start 55%"] });
  const { scrollYProgress: pass } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const e = useSpring(enter, { stiffness: 140, damping: 26, mass: 0.4 });

  const tilt = index % 2 === 0 ? -3 : 3;
  const speed = [30, 60, 45][index % 3];

  const y = useTransform(e, [0, 1], [90, 0]);
  const rotate = useTransform(e, [0, 1], [tilt, 0]);
  const scale = useTransform(e, [0, 1], [0.9, 1]);
  const opacity = useTransform(e, [0, 0.6], [0, 1]);
  const drift = useTransform(pass, [0, 1], [speed, -speed]);
  const inner = useTransform(pass, [0, 1], [1.08, 1]);

  const Tag = as === "figure" ? motion.figure : motion.div;

  if (reduce) {
    const Plain = as;
    return (
      <Plain className={className} style={style}>
        {children}
      </Plain>
    );
  }

  return (
    <Tag ref={ref} className={className} style={{ ...style, y: drift }}>
      <motion.div style={{ y, rotate, scale, opacity }} className="h-full w-full">
        {zoom ? (
          <div className="h-full w-full overflow-hidden rounded-[inherit]">
            <motion.div style={{ scale: inner }} className="h-full w-full">
              {children}
            </motion.div>
          </div>
        ) : (
          children
        )}
      </motion.div>
    </Tag>
  );
}
