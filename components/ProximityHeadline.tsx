"use client";

import { useEffect, useRef } from "react";
import { useCalm } from "@/lib/a11y";

/**
 * A headline whose letters swell as the cursor gets close, like
 * fancycomponents.dev's "variable font cursor proximity". Londrina Solid
 * isn't a variable font, so the extra weight is faked with a text outline
 * in the same colour plus a small scale-up.
 */
export function ProximityHeadline({
  lines,
  className,
  radius = 260,
}: {
  /** Each string is shown on its own line */
  lines: string[];
  className?: string;
  /** How far (in px) from the cursor letters start to react */
  radius?: number;
}) {
  const letters = useRef<(HTMLSpanElement | null)[]>([]);
  const calm = useCalm();

  useEffect(() => {
    // Phones and people who prefer less motion get the plain headline
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (calm) return;

    const els = letters.current;
    const mouse = { x: -9999, y: -9999 };
    // Eased amount (0–1) per letter, so they swell and settle smoothly
    const amount = letters.current.map(() => 0);
    let frame = 0;

    const onMove = (e: PointerEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const tick = () => {
      letters.current.forEach((el, i) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        const d = Math.hypot(mouse.x - (r.left + r.width / 2), mouse.y - (r.top + r.height / 2));
        // Gaussian falloff: strongest right under the cursor, fading out by `radius`
        const target = d < radius ? Math.exp(-((d / (radius / 2.2)) ** 2)) : 0;
        amount[i] += (target - amount[i]) * 0.18;
        const a = amount[i] < 0.001 ? 0 : amount[i];
        el.style.webkitTextStroke = `${(a * 0.028).toFixed(4)}em currentColor`;
        el.style.transform = `scale(${1 + a * 0.12}) translateY(${-a * 0.04}em)`;
      });
      frame = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    frame = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
      // Back to plain letters
      els.forEach((el) => {
        if (!el) return;
        el.style.webkitTextStroke = "";
        el.style.transform = "";
      });
    };
  }, [radius, calm]);

  const text = lines.join(" ");
  let i = 0;

  return (
    <h1 className={className} aria-label={text}>
      {lines.map((line, l) => (
        <span key={l} className="block whitespace-nowrap">
          {line.split("").map((ch, c) => {
            const n = i++;
            return (
              <span
                key={c}
                aria-hidden
                className="rv inline-block"
                style={{ "--d": 150 + n * 45, rotate: `${((n % 3) - 1) * 2}deg` } as React.CSSProperties}
              >
                <span
                  ref={(el) => {
                    letters.current[n] = el;
                  }}
                  className="inline-block origin-bottom will-change-transform"
                >
                  {ch === " " ? " " : ch}
                </span>
              </span>
            );
          })}
        </span>
      ))}
    </h1>
  );
}
