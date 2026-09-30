import Image from "next/image";
import { ASSETS } from "@/lib/assets";
import type { Block, Project } from "@/lib/projects";
import { Reveal } from "./Reveal";
import { ScrollMotion } from "./ScrollMotion";
import { Shot } from "./Shot";
import { SiteVideo } from "./SiteVideo";

type MediaBlock = Extract<Block, { type: "image" | "video" }>;
type Span = NonNullable<MediaBlock["span"]>;

const SPAN: Record<Span, string> = {
  full: "sm:col-span-6",
  twoThirds: "sm:col-span-4",
  half: "sm:col-span-3",
  third: "sm:col-span-2",
};

const SHARE: Record<Span, number> = { full: 1, twoThirds: 0.66, half: 0.5, third: 0.33 };

function Media({ block, i, span }: { block: MediaBlock; i: number; span: Span }) {
  if (block.type === "video") {
    return (
      <ScrollMotion as="figure" index={i} className={`col-span-6 ${SPAN[span]}`}>
        <div className="flex h-full items-center justify-center rounded-[22px] p-[8%]" style={{ backgroundColor: block.bg }}>
          <SiteVideo name={block.name} frame={block.frame} label={block.alt} />
        </div>
      </ScrollMotion>
    );
  }

  const a = ASSETS[block.asset];
  return (
    <ScrollMotion as="figure" index={i} zoom={!block.pad} className={`col-span-6 rounded-[22px] ${SPAN[span]}`}>
      <div
        className={`h-full overflow-hidden rounded-[22px] ${block.pad ? "flex items-center justify-center p-[6%]" : ""}`}
        style={{ backgroundColor: block.bg }}
      >
        <div className="relative w-full" style={{ aspectRatio: `${a.w} / ${a.h}` }}>
          <Shot name={block.asset} alt={block.alt} share={SHARE[span]} fit="contain" className="rounded-[inherit]" />
        </div>
      </div>
      <figcaption className="sr-only">{block.alt}</figcaption>
    </ScrollMotion>
  );
}

/** Lays out a case study: text, image/video grids, before/after comparisons and brand elements. */
export function CaseBlocks({ project }: { project: Project }) {
  // The cover already sits at the top of the page, so don't show it again below.
  const blocks = project.blocks.filter((b) => !(b.type === "image" && b.asset === project.cover.asset));

  // Group consecutive images/videos into one grid.
  const groups: (Block | MediaBlock[])[] = [];
  for (const b of blocks) {
    const last = groups[groups.length - 1];
    if (b.type === "image" || b.type === "video") {
      if (Array.isArray(last)) last.push(b);
      else groups.push([b]);
    } else groups.push(b);
  }

  return (
    <div className="mx-auto max-w-7xl space-y-16 px-5 sm:px-8 lg:space-y-24">
      {groups.map((g, gi) => {
        if (Array.isArray(g)) {
          return (
            <div key={gi} className="grid grid-cols-6 items-start gap-4 sm:gap-6">
              {g.map((b, i) => {
                // A lone small image looks lost on its own row, so give it more room.
                const span: Span = g.length === 1 && b.span === "third" ? "half" : (b.span ?? "full");
                return <Media key={i} block={b} i={i} span={span} />;
              })}
            </div>
          );
        }

        switch (g.type) {
          case "text":
            return (
              <Reveal key={gi} as="div" className="grid lg:grid-cols-12" threshold={0.15}>
                <div className="space-y-5 font-author text-lg leading-relaxed text-ink/85 sm:text-xl lg:col-span-8 lg:col-start-5">
                  {g.body.map((p, i) => (
                    <p key={i} className="rv-text" style={{ "--d": 100 + i * 90 } as React.CSSProperties}>
                      {p}
                    </p>
                  ))}
                </div>
              </Reveal>
            );

          case "compare":
            return (
              <div key={gi} className="grid gap-10 lg:grid-cols-2 lg:gap-8">
                {(["before", "after"] as const).map((side, i) => {
                  const s = g[side];
                  const a = ASSETS[s.asset];
                  return (
                    <ScrollMotion key={side} index={i}>
                      <span
                        className="inline-block rounded-full px-4 py-1.5 text-sm font-bold uppercase tracking-wider"
                        style={side === "after" ? { backgroundColor: project.color, color: project.ink } : { backgroundColor: "rgb(30 30 30 / 0.08)" }}
                      >
                        {side === "before" ? "Before" : "After"}
                      </span>
                      <div className="relative mt-4 overflow-hidden rounded-[22px]" style={{ aspectRatio: `${a.w} / ${a.h}` }}>
                        <Shot name={s.asset} alt={s.alt} share={0.5} />
                      </div>
                      {s.text && <p className="mt-5 font-author text-lg leading-relaxed text-ink/85">{s.text}</p>}
                    </ScrollMotion>
                  );
                })}
              </div>
            );

          case "elements":
            return (
              <div key={gi} className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
                {g.items.map((item, i) => {
                  const a = ASSETS[item.asset];
                  return (
                    <ScrollMotion key={item.asset} index={i}>
                      <div className="group flex aspect-square flex-col items-center justify-center gap-3 rounded-[22px] p-6" style={{ background: g.bg }}>
                        <div className="relative h-[70%] w-full transition-transform duration-500 group-hover:-translate-y-1 group-hover:scale-105">
                          <Image src={a.src} alt={item.label} fill unoptimized className="object-contain drop-shadow-[0_6px_14px_rgb(40_10_110/0.25)]" />
                        </div>
                        <span className="text-sm font-semibold text-white">{item.label}</span>
                      </div>
                    </ScrollMotion>
                  );
                })}
              </div>
            );
        }
      })}
    </div>
  );
}

/** Cover image used by cards and the next-project teaser. */
export function CoverImage({ project, sizes }: { project: Project; sizes: string }) {
  const a = ASSETS[project.cover.asset];
  return (
    <Image
      src={a.src}
      alt=""
      fill
      sizes={sizes}
      unoptimized={a.src.endsWith(".svg")}
      className={project.cover.fit === "contain" ? "object-contain p-[10%]" : "object-cover"}
    />
  );
}
