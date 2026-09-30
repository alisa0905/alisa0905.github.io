"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ASSETS } from "@/lib/assets";
import type { Project } from "@/lib/projects";

/**
 * The picture inside a project card. Drifts gently as you scroll past.
 */
export function CardMedia({ project, sizes, priority }: { project: Project; sizes: string; priority?: boolean }) {
  const box = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: box, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  const a = ASSETS[project.cover.asset];
  const contain = project.cover.fit === "contain";

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
