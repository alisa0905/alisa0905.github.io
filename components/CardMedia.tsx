"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ASSETS } from "@/lib/assets";
import { VIDEOS } from "@/lib/videos";
import type { Project } from "@/lib/projects";

/**
 * The picture inside a project card. Websites play their screen recording
 * while on screen; everything else drifts gently as you scroll past.
 */
export function CardMedia({ project, sizes, priority }: { project: Project; sizes: string; priority?: boolean }) {
  const box = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: box, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  useEffect(() => {
    const el = video.current;
    if (!el || reduce) return;
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? el.play().catch(() => {}) : el.pause()), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, [reduce]);

  const a = ASSETS[project.cover.asset];
  const contain = project.cover.fit === "contain";

  if (project.cover.video) {
    const v = VIDEOS[project.cover.video];
    return (
      <div ref={box} className="absolute inset-0">
        <video
          ref={video}
          src={v.src}
          poster={v.poster}
          muted
          loop
          playsInline
          preload="metadata"
          aria-label={`${project.title} website`}
          className="h-full w-full object-cover object-top transition-transform duration-[900ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.04]"
        />
      </div>
    );
  }

  return (
    <div ref={box} className="absolute inset-0">
      <motion.div className="absolute inset-[-7%_0]" style={reduce || contain ? undefined : { y }}>
        <Image
          src={a.src}
          alt={`${project.title} preview`}
          fill
          sizes={sizes}
          priority={priority}
          unoptimized={a.src.endsWith(".svg")}
          className={`transition-transform duration-[900ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.06] ${
            contain ? "object-contain p-[16%]" : "object-cover"
          }`}
        />
      </motion.div>
    </div>
  );
}
