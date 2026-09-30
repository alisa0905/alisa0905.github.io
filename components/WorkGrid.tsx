"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CATEGORIES, PROJECTS, type Category } from "@/lib/projects";
import { ProjectCard } from "./ProjectCard";

/** Filter chips + animated project grid for the Work page. */
export function WorkGrid() {
  const [filter, setFilter] = useState<Category | "All">("All");
  const shown = filter === "All" ? PROJECTS : PROJECTS.filter((p) => p.category === filter);
  const current = CATEGORIES.find((c) => c.name === filter);

  const chips: { name: Category | "All"; color: string; count: number }[] = [
    { name: "All", color: "#1e1e1e", count: PROJECTS.length },
    ...CATEGORIES.map((c) => ({ name: c.name, color: c.color, count: PROJECTS.filter((p) => p.category === c.name).length })),
  ];

  return (
    <div>
      <div className="sticky top-[76px] z-30 -mx-5 bg-paper/85 px-5 py-4 backdrop-blur-xl sm:-mx-8 sm:px-8">
        <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]" role="tablist" aria-label="Filter projects">
          {chips.map((c) => {
            const active = filter === c.name;
            return (
              <button
                key={c.name}
                role="tab"
                aria-selected={active}
                type="button"
                onClick={() => setFilter(c.name)}
                className="relative shrink-0 rounded-full border-2 border-ink/10 px-4 py-2 text-sm font-bold transition-colors hover:border-ink/40"
              >
                {active && (
                  <motion.span
                    layoutId="work-chip"
                    className="absolute inset-[-2px] rounded-full"
                    style={{ backgroundColor: c.color }}
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <span className={`relative ${active && c.name === "All" ? "text-cream" : "text-ink"}`}>
                  {c.name} <span className="opacity-50">{c.count}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {current && (
          <motion.p
            key={current.name}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="mt-6 text-lg font-medium text-ink/60"
          >
            {current.dates}
          </motion.p>
        )}
      </AnimatePresence>

      <motion.div layout className="mt-10 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {shown.map((p, i) => (
            <motion.div
              key={p.slug}
              layout
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1, transition: { delay: Math.min(i, 8) * 0.05, type: "spring", stiffness: 200, damping: 24 } }}
              exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.2 } }}
            >
              <ProjectCard project={p} priority={i < 3} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
