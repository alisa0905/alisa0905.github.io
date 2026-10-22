"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ASSETS } from "@/lib/assets";
import { categoryColor, type Project } from "@/lib/projects";

/** First year in "2025–2026" style strings. */
const firstYear = (p: Project) => p.start?.slice(0, 4) ?? p.year.slice(0, 4);

/** Newest first. Projects with a known month sort above ones without, inside the same year. */
const sortKey = (p: Project) => p.start ?? `${firstYear(p)}-00`;

/** Projects on a vertical line, grouped by year, newest first. */
export function WorkTimeline({ projects }: { projects: Project[] }) {
  const sorted = [...projects].sort((a, b) => sortKey(b).localeCompare(sortKey(a)));
  const years = [...new Set(sorted.map(firstYear))];

  return (
    <div className="mt-10">
      {years.map((year) => (
        <section key={year} className="relative grid gap-6 pb-14 sm:grid-cols-[120px_1fr] sm:gap-10">
          <h2 className="font-display text-5xl leading-none text-ink sm:sticky sm:top-[150px] sm:self-start sm:text-6xl">{year}</h2>

          <ol className="relative border-l-2 border-ink/15 pl-6 sm:pl-10">
            {sorted
              .filter((p) => firstYear(p) === year)
              .map((p, i) => {
                const cover = ASSETS[p.cover.asset];
                return (
                  <motion.li
                    key={p.slug}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ delay: Math.min(i, 6) * 0.05, type: "spring", stiffness: 220, damping: 26 }}
                    className="relative pb-8 last:pb-0"
                  >
                    <span
                      className="absolute -left-[33px] top-6 h-4 w-4 rounded-full ring-4 ring-paper sm:-left-[49px]"
                      style={{ backgroundColor: categoryColor(p.category) }}
                      aria-hidden
                    />
                    <Link
                      href={`/work/${p.slug}`}
                      className="group flex items-center gap-4 rounded-3xl p-2 transition-colors hover:bg-ink/5 sm:gap-6"
                      data-cursor="zoom"
                    >
                      <div
                        className="relative aspect-[4/3] w-24 shrink-0 overflow-hidden rounded-2xl sm:w-36"
                        style={{ backgroundColor: p.cover.bg ?? p.color }}
                      >
                        <Image
                          src={cover.src}
                          alt=""
                          fill
                          sizes="144px"
                          unoptimized={cover.src.endsWith(".svg")}
                          className={p.cover.fit === "contain" ? "object-contain p-2" : "object-cover"}
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold uppercase tracking-wider text-ink/50">{p.when ?? p.year}</p>
                        <h3 className="mt-1 font-display text-2xl leading-none text-ink sm:text-3xl">
                          <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_3px] bg-left-bottom bg-no-repeat pb-0.5 transition-[background-size] duration-500 group-hover:bg-[length:100%_3px]">
                            {p.title}
                          </span>
                        </h3>
                        <p className="mt-1.5 flex flex-wrap items-center gap-x-2 text-[15px] font-medium text-ink/60">
                          {p.type}
                          <span
                            className="rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-ink"
                            style={{ backgroundColor: categoryColor(p.category) }}
                          >
                            {p.category}
                          </span>
                        </p>
                      </div>
                    </Link>
                  </motion.li>
                );
              })}
          </ol>
        </section>
      ))}
    </div>
  );
}
