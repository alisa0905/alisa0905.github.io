"use client";

import { useEffect, useRef, useState } from "react";
import { TOOLS, ToolIcon, type Tool } from "./ToolIcon";

const MAX = 4;
// Keep the bubble this far from the screen edges
const EDGE = 12;

function Heart({ full }: { full: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
      <path
        d="M12 21s-7.5-4.6-9.6-9.3C.9 8.2 3 4.5 6.6 4.5c2.1 0 3.6 1.2 5.4 3.2 1.8-2 3.3-3.2 5.4-3.2 3.6 0 5.7 3.7 4.2 7.2C19.5 16.4 12 21 12 21z"
        fill={full ? "#e173ae" : "none"}
        stroke={full ? "#e173ae" : "currentColor"}
        strokeOpacity={full ? 1 : 0.35}
        strokeWidth={2}
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * A toolbox icon that shows how well Alisa knows the tool: hover it (or tap
 * it on a phone) and a bubble pops up with its name and 1–4 hearts, filling
 * in one after another.
 */
export function ToolLevel({ tool, level }: { tool: Tool; level: number }) {
  const [open, setOpen] = useState(false);
  const bubble = useRef<HTMLSpanElement>(null);
  // Mouse users open it by hovering, so their clicks shouldn't close it again
  const lastPointer = useRef("");
  const label = TOOLS[tool].label;

  // Nudge the bubble sideways if it would poke off the edge of the screen
  useEffect(() => {
    const el = bubble.current;
    if (!el || !open) return;
    // Worked out from the icon, not the bubble, since the bubble is mid-animation
    const icon = el.parentElement!.getBoundingClientRect();
    const left = icon.left + icon.width / 2 - el.offsetWidth / 2;
    const right = left + el.offsetWidth;
    const nudge = left < EDGE ? EDGE - left : right > window.innerWidth - EDGE ? window.innerWidth - EDGE - right : 0;
    el.style.setProperty("--nudge", `${nudge}px`);
  }, [open]);

  // Tapping anywhere else closes it on phones
  useEffect(() => {
    if (!open) return;
    const close = (e: PointerEvent) => {
      if (!bubble.current?.parentElement?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [open]);

  return (
    <span
      className="relative block h-full w-full"
      onPointerEnter={(e) => e.pointerType === "mouse" && setOpen(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setOpen(false)}
    >
      <button
        type="button"
        aria-label={`${label}: ${level} out of ${MAX}`}
        aria-expanded={open}
        onPointerDown={(e) => {
          lastPointer.current = e.pointerType;
        }}
        onClick={() => lastPointer.current !== "mouse" && setOpen((v) => !v)}
        onFocus={(e) => e.currentTarget.matches(":focus-visible") && setOpen(true)}
        onBlur={() => setOpen(false)}
        className="block h-full w-full rounded-[24%] transition-transform duration-300 ease-out hover:-translate-y-0.5"
      >
        <ToolIcon tool={tool} title={false} className="h-full w-full" />
      </button>
      <span
        ref={bubble}
        role="tooltip"
        className={`pointer-events-none absolute bottom-full left-1/2 z-20 mb-3 whitespace-nowrap rounded-2xl bg-ink px-3.5 py-2.5 text-center text-cream shadow-[0_10px_30px_-12px_rgb(0_0_0/0.5)] transition-[opacity,transform] duration-300 ease-out [transform:translate(calc(-50%+var(--nudge,0px)),var(--lift))] ${
          open ? "opacity-100 [--lift:0px]" : "opacity-0 [--lift:6px]"
        }`}
      >
        <span className="block text-xs font-semibold">{label}</span>
        <span className="mt-1.5 flex justify-center gap-1">
          {Array.from({ length: MAX }, (_, i) => (
            <span
              key={i}
              className={`transition-transform ease-[cubic-bezier(0.34,1.8,0.64,1)] ${open ? "scale-100 duration-500" : "scale-0 duration-150"}`}
              style={{ transitionDelay: open ? `${80 + i * 90}ms` : "0ms" }}
            >
              <Heart full={i < level} />
            </span>
          ))}
        </span>
      </span>
    </span>
  );
}
