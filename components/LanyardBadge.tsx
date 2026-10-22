"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useState } from "react";

const LanyardScene = dynamic(() => import("./Lanyard"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full min-h-[420px] items-center justify-center">
      <Image
        src="/lanyard/card-front.png"
        alt="Alisa Bakhareva badge"
        width={220}
        height={308}
        className="rotate-3 rounded-xl shadow-2xl"
      />
    </div>
  ),
});

/**
 * Interactive 3D conference badge (React Bits Lanyard).
 * Skips the WebGL scene when the visitor prefers reduced motion.
 */
export function LanyardBadge({ className = "" }: { className?: string }) {
  const [ready, setReady] = useState(false);
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    setReady(true);
  }, []);

  if (!ready) {
    return <div className={`min-h-[420px] ${className}`} aria-hidden />;
  }

  if (reduce) {
    return (
      <div className={`flex min-h-[420px] items-center justify-center ${className}`}>
        <Image
          src="/lanyard/card-front.png"
          alt="Alisa Bakhareva badge"
          width={240}
          height={336}
          className="rounded-xl shadow-2xl"
        />
      </div>
    );
  }

  return (
    <div className={className} aria-label="Interactive badge — drag to swing">
      <LanyardScene />
    </div>
  );
}
