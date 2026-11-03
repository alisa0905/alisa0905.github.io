"use client";

import { useEffect, useRef, useState } from "react";
import { useCalm } from "@/lib/a11y";
import { BOOKING_URL } from "@/lib/projects";

const TEXT = "Let's Talk →";
const FONT_SIZE = 168;

type Glyph = { ch: string; x: number; y: number; turn: number };

/**
 * "Let's Talk" bent into a gentle rising curve, like the Figma text-on-path,
 * with the same letter animations as the home headline: each letter pops in
 * one after another, and on computers letters swell as the cursor gets close.
 *
 * The browser lays the text along the curve first; then each letter is
 * measured and redrawn on its own so it can move separately.
 */
export function TalkArc({ id, className }: { id: string; className?: string }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const pathText = useRef<SVGTextElement>(null);
  const [glyphs, setGlyphs] = useState<Glyph[] | null>(null);
  const letters = useRef<(SVGGElement | null)[]>([]);
  const calm = useCalm();

  // Measure where each letter sits on the curve once the font has loaded and
  // the footer is actually on screen (the phone and computer versions are
  // each hidden on the other's screens, and hidden text can't be measured)
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    let done = false;
    const measure = () => {
      const t = pathText.current;
      if (done || !t || !svg.getBoundingClientRect().width) return;
      try {
        const out: Glyph[] = [];
        for (let i = 0; i < t.getNumberOfChars(); i++) {
          const a = t.getStartPositionOfChar(i);
          const b = t.getEndPositionOfChar(i);
          out.push({ ch: TEXT[i], x: (a.x + b.x) / 2, y: (a.y + b.y) / 2, turn: t.getRotationOfChar(i) });
        }
        done = true;
        setGlyphs(out);
      } catch {
        // Not laid out yet; the next resize tries again
      }
    };
    const ro = new ResizeObserver(() => document.fonts.ready.then(measure));
    ro.observe(svg);
    return () => ro.disconnect();
  }, []);

  // Letters swell near the cursor, exactly like ProximityHeadline
  useEffect(() => {
    if (!glyphs) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (calm) return;

    const radius = 260;
    const els = letters.current;
    const mouse = { x: -9999, y: -9999 };
    const amount = glyphs.map(() => 0);
    let frame = 0;

    const onMove = (e: PointerEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const tick = () => {
      letters.current.forEach((el, i) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        if (!r.width) return;
        const d = Math.hypot(mouse.x - (r.left + r.width / 2), mouse.y - (r.top + r.height / 2));
        const target = d < radius ? Math.exp(-((d / (radius / 2.2)) ** 2)) : 0;
        amount[i] += (target - amount[i]) * 0.18;
        const a = amount[i] < 0.001 ? 0 : amount[i];
        el.style.strokeWidth = `${(a * 0.028 * FONT_SIZE).toFixed(2)}`;
        el.style.transform = `scale(${1 + a * 0.12}) translateY(${-a * 0.04 * FONT_SIZE}px)`;
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
        el.style.strokeWidth = "";
        el.style.transform = "";
      });
    };
  }, [glyphs, calm]);

  return (
    <a href={BOOKING_URL} target="_blank" rel="noreferrer" aria-label="Let's talk" className={`block ${className ?? ""}`}>
      <svg ref={svgRef} viewBox="0 0 1000 215" className="w-full overflow-visible font-display font-black" aria-hidden>
        <path id={id} d="M 30 200 Q 500 100 970 200" fill="none" />
        {/* Lays out the curve; hidden once each letter has been measured */}
        <text
          ref={pathText}
          fill="currentColor"
          fontSize={FONT_SIZE}
          textAnchor="middle"
          opacity={glyphs ? 0 : 1}
        >
          <textPath href={`#${id}`} startOffset="50%">
            {TEXT}
          </textPath>
        </text>
        {glyphs?.map((g, n) =>
          g.ch === " " ? null : (
            <g key={n} transform={`translate(${g.x} ${g.y}) rotate(${g.turn})`}>
              <g
                className="rv"
                style={{ "--d": 150 + n * 45, rotate: `${((n % 3) - 1) * 2}deg` } as React.CSSProperties}
              >
                <g
                  ref={(el) => {
                    letters.current[n] = el;
                  }}
                  stroke="currentColor"
                  strokeWidth={0}
                  strokeLinejoin="round"
                  style={{ transformBox: "fill-box", transformOrigin: "50% 100%" }}
                >
                  <text fill="currentColor" fontSize={FONT_SIZE} textAnchor="middle">
                    {g.ch}
                  </text>
                </g>
              </g>
            </g>
          ),
        )}
      </svg>
    </a>
  );
}
