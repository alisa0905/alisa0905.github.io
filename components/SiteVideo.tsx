"use client";

import { useEffect, useRef } from "react";
import { VIDEOS, type VideoName } from "@/lib/videos";

type Props = {
  name: VideoName;
  /** Wrap the video in a browser window or a phone, or show it bare */
  frame?: "browser" | "phone" | "none";
  url?: string;
  label: string;
  className?: string;
};

/**
 * A screen recording of a live website. It only plays while it's on screen
 * (and never for people who prefer reduced motion), so the page stays light.
 */
export function SiteVideo({ name, frame = "browser", url, label, className = "" }: Props) {
  const v = VIDEOS[name];
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.play().catch(() => {});
        else el.pause();
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const video = (
    <video
      ref={ref}
      src={v.src}
      poster={v.poster}
      muted
      loop
      playsInline
      preload="metadata"
      aria-label={label}
      className="block h-full w-full object-cover object-top"
    />
  );

  if (frame === "none") {
    return (
      <div className={`relative h-full w-full ${className}`} style={{ aspectRatio: `${v.w} / ${v.h}` }}>
        {video}
      </div>
    );
  }

  if (frame === "phone") {
    return (
      <div className={`mx-auto w-full max-w-[300px] rounded-[44px] bg-[#16121f] p-[10px] shadow-[0_30px_60px_-25px_rgb(20_10_50/0.6)] ${className}`}>
        <div className="relative overflow-hidden rounded-[34px]" style={{ aspectRatio: `${v.w} / ${v.h}` }}>
          {video}
          <span className="absolute left-1/2 top-2 h-5 w-20 -translate-x-1/2 rounded-full bg-[#16121f]" aria-hidden />
        </div>
      </div>
    );
  }

  return (
    <div className={`overflow-hidden rounded-[22px] bg-[#221d33] shadow-[0_40px_80px_-40px_rgb(20_10_60/0.6)] ${className}`}>
      <div className="flex items-center gap-2 px-4 py-3" aria-hidden>
        <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
        <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
        <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        {url && <span className="ml-3 flex-1 truncate rounded-full bg-white/10 px-4 py-1 text-center text-xs text-white/70">{url}</span>}
      </div>
      <div className="relative" style={{ aspectRatio: `${v.w} / ${v.h}` }}>
        {video}
      </div>
    </div>
  );
}
