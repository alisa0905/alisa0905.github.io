"use client";

import { useSyncExternalStore } from "react";

/**
 * Settings from the accessibility button in the corner. Each one is a class
 * on <html> (e.g. "a11y-calm"), so CSS can react, and they're remembered in
 * this browser between visits.
 */
export const A11Y_OPTIONS = [
  { key: "calm", label: "Stop animations", hint: "Flowers, scrolling text and other movement stay still" },
  { key: "mute", label: "Mute sounds", hint: "No flower sound effects" },
  { key: "big", label: "Bigger text", hint: "Makes everything about 15% larger" },
  { key: "contrast", label: "Stronger contrast", hint: "Darker, easier-to-read text" },
  { key: "links", label: "Underline links", hint: "Shows every link with an underline" },
] as const;

export type A11yKey = (typeof A11Y_OPTIONS)[number]["key"];
export type A11yPrefs = Record<A11yKey, boolean>;

const STORE = "a11y";
const EVENT = "a11ychange";
const OFF: A11yPrefs = { calm: false, mute: false, big: false, contrast: false, links: false };

export function readPrefs(): A11yPrefs {
  try {
    return { ...OFF, ...JSON.parse(localStorage.getItem(STORE) ?? "{}") };
  } catch {
    return { ...OFF };
  }
}

export function applyPrefs(prefs: A11yPrefs, save = true) {
  const html = document.documentElement;
  for (const key of Object.keys(OFF) as A11yKey[]) html.classList.toggle(`a11y-${key}`, prefs[key]);
  if (save) {
    try {
      localStorage.setItem(STORE, JSON.stringify(prefs));
    } catch {
      // Private browsing: the setting still works for this visit
    }
  }
  window.dispatchEvent(new Event(EVENT));
}

/** The visitor wants less movement: their device setting, or the corner button */
export function isCalm() {
  return (
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    document.documentElement.classList.contains("a11y-calm")
  );
}

export function isMuted() {
  return document.documentElement.classList.contains("a11y-mute");
}

function subscribe(onChange: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  window.addEventListener(EVENT, onChange);
  mq.addEventListener("change", onChange);
  return () => {
    window.removeEventListener(EVENT, onChange);
    mq.removeEventListener("change", onChange);
  };
}

/** isCalm() as a React value, so animations switch off or on straight away */
export function useCalm() {
  return useSyncExternalStore(subscribe, isCalm, () => false);
}
