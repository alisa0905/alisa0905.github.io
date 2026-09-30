"use client";

import Image from "next/image";
import { useRef } from "react";
import { ASSETS, type AssetName } from "@/lib/assets";
import { useLightbox } from "./Lightbox";

type Props = {
  name: AssetName;
  alt: string;
  /** Rough share of the screen width this image takes on desktop (0–1), for responsive loading. */
  share?: number;
  className?: string;
  zoom?: boolean;
  fit?: "cover" | "contain" | "fill";
};

/** A project image. Click (or tap) to open it full screen. */
export function Shot({ name, alt, share = 0.5, className = "", zoom = true, fit = "cover" }: Props) {
  const asset = ASSETS[name];
  const ref = useRef<HTMLButtonElement>(null);
  const open = useLightbox();
  const isSvg = asset.src.endsWith(".svg");

  const img = (
    <Image
      src={asset.src}
      alt={alt}
      fill
      unoptimized={isSvg}
      sizes={`(min-width: 1024px) ${Math.max(10, Math.round(share * 100))}vw, ${Math.min(100, Math.round(share * 200))}vw`}
      className={`pointer-events-none select-none ${fit === "contain" ? "object-contain" : fit === "fill" ? "object-fill" : "object-cover"}`}
      draggable={false}
    />
  );

  if (!zoom) return <div className={`relative h-full w-full ${className}`}>{img}</div>;

  return (
    <button
      ref={ref}
      type="button"
      data-cursor="zoom"
      aria-label={`Open image: ${alt}`}
      onClick={() => {
        const rect = ref.current?.getBoundingClientRect();
        if (rect) open({ src: asset.src, alt, w: asset.w, h: asset.h, from: rect });
      }}
      className={`group relative block h-full w-full cursor-zoom-in overflow-hidden transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-1 hover:scale-[1.015] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cream ${className}`}
    >
      {img}
    </button>
  );
}
