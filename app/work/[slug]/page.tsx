import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CaseBlocks, CoverImage } from "@/components/CaseBlocks";
import { Flower } from "@/components/Flower";
import { Reveal } from "@/components/Reveal";
import { SiteVideo } from "@/components/SiteVideo";
import { ToolIcon, TOOLS } from "@/components/ToolIcon";
import { ASSETS } from "@/lib/assets";
import { categoryColor, getProject, PROJECTS } from "@/lib/projects";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  return {
    title: p.title,
    description: `${p.title}: ${p.role.join(", ")}. ${p.client}, ${p.year}.`,
    openGraph: { title: `${p.title} · Alisa Bakhareva`, images: [ASSETS[p.cover.asset].src] },
  };
}

/** Rough check: is this colour dark? (decides light or dark header text) */
function isDark(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  return 0.299 * r + 0.587 * g + 0.114 * b < 150;
}

export default async function CaseStudy({ params }: Params) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const index = PROJECTS.findIndex((p) => p.slug === slug);
  const next = PROJECTS[(index + 1) % PROJECTS.length];
  const accent = categoryColor(project.category);
  const cover = ASSETS[project.cover.asset];
  // If the cover image is part of a before/after comparison, the comparison already shows it.
  const showCover = !project.blocks.some(
    (b) => b.type === "compare" && (b.before.asset === project.cover.asset || b.after.asset === project.cover.asset),
  );

  const meta = [
    { label: "Client", value: project.client },
    { label: "Year", value: project.year },
    { label: "What I did", value: project.role.join(", ") },
  ];

  return (
    <article>
      {/* Header */}
      <Reveal
        className={`relative isolate overflow-hidden pt-32 lg:pt-40 ${showCover ? "pb-40 sm:pb-52" : "pb-16 sm:pb-20"}`}
        style={{ backgroundColor: project.color, color: project.ink }}
        data-hero-ink={isDark(project.color) ? "light" : "dark"}
        threshold={0}
      >
        <Flower color={accent} className="absolute -right-12 top-20 -z-10 w-48 sm:w-72 lg:w-96" pop />
        <Flower color={accent} className={`absolute bottom-16 left-[55%] -z-10 hidden w-24 ${showCover ? "sm:block" : ""}`} reverse pop style={{ "--d": 800 } as React.CSSProperties} />

        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="rv-text flex flex-wrap items-center gap-3 text-sm font-bold">
            <Link href="/work" className="rounded-full border-2 border-current px-4 py-1.5 opacity-80 transition-opacity hover:opacity-100">
              ← All work
            </Link>
            <span className="rounded-full px-4 py-2 uppercase tracking-wider text-ink" style={{ backgroundColor: accent }}>
              {project.category}
            </span>
          </div>

          <h1 className="rv-text mt-8 font-display text-[clamp(3.8rem,11vw,10rem)] font-black leading-[0.85] tracking-tight" style={{ "--d": 100 } as React.CSSProperties}>
            {project.title}
          </h1>

          <dl className="mt-12 grid gap-6 border-t border-current/20 pt-8 sm:grid-cols-2 lg:grid-cols-4">
            {meta.map((m, i) => (
              <div key={m.label} className="rv-text" style={{ "--d": 300 + i * 80 } as React.CSSProperties}>
                <dt className="text-xs font-bold uppercase tracking-[0.18em] opacity-60">{m.label}</dt>
                <dd className="mt-2 text-lg font-semibold leading-snug">{m.value}</dd>
              </div>
            ))}
            <div className="rv-text" style={{ "--d": 540 } as React.CSSProperties}>
              <dt className="text-xs font-bold uppercase tracking-[0.18em] opacity-60">Tools</dt>
              <dd className="mt-2 flex flex-wrap gap-2">
                {project.tools.map((t) => (
                  <span key={t} className="flex items-center gap-2 rounded-full bg-white/90 py-1 pl-1 pr-3 text-sm font-semibold text-ink">
                    <ToolIcon tool={t} className="h-7 w-7" />
                    {TOOLS[t].label}
                  </span>
                ))}
              </dd>
            </div>
          </dl>

          {project.links && (
            <div className="rv-text mt-8 flex flex-wrap gap-3" style={{ "--d": 600 } as React.CSSProperties}>
              {project.links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border-2 border-current px-5 py-2 font-semibold transition-transform hover:-rotate-2 hover:scale-105"
                >
                  {l.label} ↗
                </a>
              ))}
            </div>
          )}
        </div>
      </Reveal>

      {/* Cover, overlapping the header. Websites show a screen recording instead. */}
      {showCover ? (
        <Reveal as="div" className="relative z-10 mx-auto -mt-28 max-w-7xl px-5 sm:-mt-40 sm:px-8" threshold={0}>
          <div className="rv" style={{ "--d": 300 } as React.CSSProperties}>
            {project.cover.video ? (
              <SiteVideo name={project.cover.video} url={project.siteUrl} label={`${project.title} website, scrolling through the homepage`} />
            ) : (
              <div
                className="relative overflow-hidden rounded-[28px] shadow-[0_40px_80px_-40px_rgb(0_0_0/0.5)]"
                style={{ aspectRatio: project.cover.fit === "contain" ? "16 / 8" : `${cover.w} / ${cover.h}`, maxHeight: "80svh", backgroundColor: project.cover.bg ?? project.color }}
              >
                <CoverImage project={project} sizes="(min-width: 1280px) 1216px, 100vw" />
              </div>
            )}
          </div>
        </Reveal>
      ) : null}

      <div className="py-20 lg:py-28">
        <CaseBlocks project={project} />
      </div>

      {/* Next project */}
      <Link
        href={`/work/${next.slug}`}
        className="group relative block overflow-hidden"
        style={{ backgroundColor: next.color, color: next.ink }}
        data-cursor="zoom"
      >
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-5 py-16 sm:px-8 md:grid-cols-2 lg:py-24">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] opacity-60">Next project</p>
            <p className="mt-3 font-display text-[clamp(3rem,8vw,7rem)] font-black leading-[0.85]">
              {next.title}
              <span className="ml-3 inline-block transition-transform duration-500 group-hover:translate-x-3">→</span>
            </p>
            <p className="mt-4 text-lg opacity-70">{next.type}</p>
          </div>
          <div
            className="relative aspect-[4/3] overflow-hidden rounded-[24px] transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:-rotate-2 group-hover:scale-[1.03]"
            style={{ backgroundColor: next.cover.bg ?? "rgb(0 0 0 / 0.1)" }}
          >
            <CoverImage project={next} sizes="(min-width: 768px) 45vw, 100vw" />
          </div>
        </div>
      </Link>
    </article>
  );
}
