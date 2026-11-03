"use client";

import { useEffect, useRef, useState } from "react";
import { A11Y_OPTIONS, applyPrefs, readPrefs, type A11yKey, type A11yPrefs } from "@/lib/a11y";

function Icon() {
  // The universal accessibility symbol: a person with open arms in a circle
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" aria-hidden>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="7" r="1.3" fill="currentColor" stroke="none" />
      <path d="M7 9.5c1.6.5 3.3.8 5 .8s3.4-.3 5-.8M12 10.3v3.4M12 13.7l-2.2 4.3M12 13.7l2.2 4.3" />
    </svg>
  );
}

/**
 * A round button in the bottom corner that opens a small panel of
 * accessibility settings (stop animations, mute, bigger text, stronger
 * contrast, underlined links). Choices are remembered in this browser.
 */
export function A11yButton() {
  const [open, setOpen] = useState(false);
  const [prefs, setPrefs] = useState<A11yPrefs | null>(null);
  const button = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  // Put saved settings back on every visit
  useEffect(() => {
    const saved = readPrefs();
    applyPrefs(saved, false);
    const frame = requestAnimationFrame(() => setPrefs(saved));
    return () => cancelAnimationFrame(frame);
  }, []);

  // Escape or a click outside closes the panel; focus goes back to the button
  useEffect(() => {
    if (!open) return;
    panel.current?.querySelector<HTMLElement>("button")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        button.current?.focus();
      }
    };
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (!panel.current?.contains(t) && !button.current?.contains(t)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  const set = (next: A11yPrefs) => {
    setPrefs(next);
    applyPrefs(next);
  };
  const toggle = (key: A11yKey) => prefs && set({ ...prefs, [key]: !prefs[key] });
  const anyOn = !!prefs && Object.values(prefs).some(Boolean);

  return (
    // In the editing preview the Next.js badge sits in this corner, so step above it there
    <div className={`fixed left-4 z-[70] print:hidden ${process.env.NODE_ENV === "development" ? "bottom-20" : "bottom-4"}`}>
      {open && prefs && (
        <div
          ref={panel}
          id="a11y-panel"
          role="dialog"
          aria-label="Accessibility settings"
          className="absolute bottom-full left-0 mb-3 w-[min(20rem,calc(100vw-2rem))] rounded-3xl bg-ink p-4 text-cream shadow-[0_20px_50px_-15px_rgb(0_0_0/0.6)]"
        >
          <p className="px-2 pb-2 pt-1 font-display text-2xl leading-none">Accessibility</p>
          <ul className="grid gap-1">
            {A11Y_OPTIONS.map((o) => {
              const on = prefs[o.key];
              return (
                <li key={o.key}>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={on}
                    onClick={() => toggle(o.key)}
                    className="flex w-full items-center justify-between gap-4 rounded-2xl px-3 py-2.5 text-left transition-colors hover:bg-white/10"
                  >
                    <span>
                      <span className="block text-[15px] font-semibold">{o.label}</span>
                      <span className="block text-xs text-cream/80">{o.hint}</span>
                    </span>
                    <span
                      aria-hidden
                      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${on ? "bg-pink" : "bg-white/25"}`}
                    >
                      <span
                        className={`absolute top-0.5 h-5 w-5 rounded-full bg-cream transition-transform ${on ? "translate-x-[22px]" : "translate-x-0.5"}`}
                      />
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
          {anyOn && (
            <button
              type="button"
              onClick={() => set(Object.fromEntries(A11Y_OPTIONS.map((o) => [o.key, false])) as A11yPrefs)}
              className="mt-2 w-full rounded-2xl px-3 py-2 text-sm font-semibold underline underline-offset-4 hover:bg-white/10"
            >
              Reset all
            </button>
          )}
        </div>
      )}
      <button
        ref={button}
        type="button"
        aria-label="Accessibility settings"
        aria-expanded={open}
        aria-controls="a11y-panel"
        onClick={() => setOpen((v) => !v)}
        className={`flex h-12 w-12 items-center justify-center rounded-full bg-ink text-cream shadow-[0_8px_24px_-8px_rgb(0_0_0/0.5)] transition-transform hover:scale-105 ${
          anyOn ? "ring-2 ring-pink ring-offset-2 ring-offset-transparent" : ""
        }`}
      >
        <Icon />
      </button>
    </div>
  );
}
