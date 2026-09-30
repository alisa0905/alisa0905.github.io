import Image from "next/image";
import Link from "next/link";
import { Art } from "@/components/Art";
import { Flower } from "@/components/Flower";
import { Marquee } from "@/components/Marquee";
import { ProjectCard } from "@/components/ProjectCard";
import { Reveal } from "@/components/Reveal";
import { ToolIcon, type Tool } from "@/components/ToolIcon";
import { ASSETS } from "@/lib/assets";
import { getProject } from "@/lib/projects";

const FEATURED_ORDER = [
  { slug: "cloud-castle", span: "lg:col-span-12", size: "xl" },
  { slug: "jabrni-brand-identity", span: "lg:col-span-7", size: "lg" },
  { slug: "b1-properties-social-system", span: "lg:col-span-5", size: "md" },
  { slug: "theorem-partners", span: "lg:col-span-5", size: "md" },
  { slug: "quotify", span: "lg:col-span-7", size: "lg" },
  { slug: "amana-homes-campaigns", span: "lg:col-span-6", size: "md" },
  { slug: "cemex", span: "lg:col-span-6", size: "md" },
] as const;

const ROLES = [
  { role: "Freelance Graphic Designer", org: "Self-employed", when: "Aug 2026 – Present", color: "#e173ae" },
  { role: "Product Designer", org: "Jabrni", when: "Mar 2026 – Aug 2026", color: "#f3c11b" },
  { role: "Creative Marketing & Media Intern", org: "Amana Homes Real Estate", when: "Jul 2025 – Mar 2026", color: "#b83244" },
  { role: "President, Women in STEM Society", org: "UOWD", when: "Apr 2025 – Oct 2025", color: "#3883de" },
  { role: "Designer", org: "UOWD Esports Club", when: "Jan 2024 – Jan 2025", color: "#518c2d" },
];

const NUMBERS = [
  { value: "15+", label: "client projects" },
  { value: "5", label: "repeat projects for Cemex" },
  { value: "600+", label: "LinkedIn followers grown from 0 for Amana Homes" },
  { value: "20+", label: "university events branded" },
];

const PUBLICATIONS = [
  { name: "Quotify", note: "IEEE · co-author", href: "https://doi.org/10.1109/SRC70627.2026.11550518" },
  { name: "Mobile Spiralometry Application for Parkinson's Symptom Tracking", note: "ISDIA 2026", href: undefined },
];

const TOOLS: Tool[] = ["figma", "illustrator", "photoshop", "premiere", "lightroom", "indesign", "gemini", "canva", "capcut", "notion"];

const SKILLS = ["Social Media", "Ad Campaigns", "UI/UX Design", "Graphic Design", "Print Design", "Video Editing"];

const HELLO = "Hi! I'm Alisa.";

export default function Home() {
  const photo = ASSETS["whoami-cutout"];

  return (
    <>
      {/* ------------------------------ Hero ------------------------------ */}
      <Reveal
        className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-orange text-cream"
        data-hero-ink="light"
        threshold={0}
      >
        <Art name="whoami" hideTitle className="-z-10" />

        <div className="mx-auto w-full max-w-7xl px-5 pt-32 sm:px-8 lg:pt-44">
          <p className="rv-text inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur-sm">
            <span className="h-2 w-2 animate-pulse rounded-full bg-sun" />
            Brand & marketing designer · Dubai, UAE
          </p>

          <h1 className="mt-6 font-display text-[clamp(4.2rem,12.5vw,11.5rem)] font-black leading-[0.82] tracking-tight" aria-label={HELLO}>
            {HELLO.split(" ").map((word, w, words) => {
              const offset = words.slice(0, w).join(" ").length + (w ? 1 : 0);
              return (
                <span key={w} className="inline-block whitespace-nowrap">
                  {word.split("").map((ch, c) => {
                    const i = offset + c;
                    return (
                      <span
                        key={c}
                        aria-hidden
                        className="rv inline-block"
                        style={{ "--d": 150 + i * 45, rotate: `${((i % 3) - 1) * 2}deg` } as React.CSSProperties}
                      >
                        {ch}
                      </span>
                    );
                  })}
                  {w < words.length - 1 && "\u00a0"}
                </span>
              );
            })}
          </h1>

          <p className="rv-text mt-8 max-w-xl text-lg font-medium leading-snug sm:text-2xl" style={{ "--d": 700 } as React.CSSProperties}>
            A brand designer who likes to go deep before I design, researching the brand, the market, and the
            audience before I open Figma, not after.
          </p>

          <div className="rv-text mt-10 flex flex-wrap gap-3" style={{ "--d": 850 } as React.CSSProperties}>
            <Link
              href="/work"
              className="group rounded-full bg-cream px-7 py-4 text-lg font-bold text-ink shadow-[0_6px_0_#1e1e1e] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_0_#1e1e1e] active:translate-y-1 active:shadow-[0_2px_0_#1e1e1e]"
            >
              See my work <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
            </Link>
            <Link
              href="/contact"
              className="rounded-full border-2 border-cream px-7 py-4 text-lg font-bold transition-colors hover:bg-cream hover:text-ink"
            >
              Let&apos;s talk
            </Link>
          </div>
        </div>

        <div
          className="rv relative mt-10 w-full self-end lg:absolute lg:bottom-0 lg:right-0 lg:mt-0 lg:w-[min(52vw,900px)]"
          style={{ aspectRatio: `${photo.w} / ${photo.h}`, "--d": 400 } as React.CSSProperties}
        >
          <Image src={photo.src} alt="Alisa Bakhareva" fill priority sizes="(min-width: 1024px) 52vw, 100vw" className="object-contain object-bottom" />
        </div>
      </Reveal>

      <Marquee items={SKILLS} bg="#1e1e1e" ink="#ecedd8" />

      {/* ----------------------------- Numbers ----------------------------- */}
      <Reveal as="section" className="mx-auto max-w-7xl px-5 pt-20 sm:px-8 lg:pt-28" threshold={0.2}>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
          {NUMBERS.map((n, i) => (
            <div key={n.label} className="rv-text border-t-2 border-ink pt-4" style={{ "--d": i * 120 } as React.CSSProperties}>
              <dt className="sr-only">{n.label}</dt>
              <dd className="font-display text-[clamp(2.8rem,6vw,5rem)] font-black leading-none">{n.value}</dd>
              <dd className="mt-2 text-[15px] font-medium text-ink/60">{n.label}</dd>
            </div>
          ))}
        </dl>
      </Reveal>

      {/* -------------------------- Selected work -------------------------- */}
      <Reveal className="mx-auto max-w-7xl px-5 pb-24 pt-20 sm:px-8 lg:pb-32 lg:pt-28" threshold={0.05}>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 className="rv-text font-display text-[clamp(3rem,7vw,6rem)] font-black leading-[0.9]">Selected work</h2>
          <Link
            href="/work"
            className="rv-text group rounded-full border-2 border-ink px-6 py-3 font-bold transition-colors hover:bg-ink hover:text-cream"
            style={{ "--d": 200 } as React.CSSProperties}
          >
            All work <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>

        <div className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-12">
          {FEATURED_ORDER.map(({ slug, span, size }, i) => {
            const p = getProject(slug);
            if (!p) return null;
            return (
              <div key={slug} className={`rv ${span} ${i === 0 ? "sm:col-span-2" : ""}`} style={{ "--d": (i % 3) * 120 } as React.CSSProperties}>
                <ProjectCard
                  project={p}
                  size={size}
                  priority={i === 0}
                  sizes={size === "xl" ? "(min-width: 1280px) 1216px, 100vw" : size === "lg" ? "(min-width: 1024px) 58vw, 100vw" : undefined}
                />
              </div>
            );
          })}
        </div>
      </Reveal>

      {/* ------------------------------ About ------------------------------ */}
      <Reveal as="section" id="about" className="relative overflow-hidden bg-pink text-cream" threshold={0.1}>
        <Flower color="#3883de" className="absolute -right-16 top-10 w-64 opacity-90 lg:w-96" pop />
        <Flower color="#f3c11b" className="absolute -bottom-10 left-[40%] w-40" reverse pop style={{ "--d": 900 } as React.CSSProperties} />

        <div className="relative mx-auto grid max-w-7xl gap-16 px-5 py-24 sm:px-8 lg:grid-cols-12 lg:py-32">
          <div className="lg:col-span-5">
            <h2 className="rv-text font-display text-[clamp(3.5rem,8vw,7rem)] font-black leading-[0.85]">Who am I?</h2>
            <div className="mt-8 space-y-5 font-author text-lg leading-relaxed sm:text-xl">
              <p className="rv-text" style={{ "--d": 150 } as React.CSSProperties}>
                Hi! I&apos;m Alisa, a brand designer who likes to go deep before I design, researching the brand,
                the market, and the audience before I open Figma, not after.
              </p>
              <p className="rv-text" style={{ "--d": 250 } as React.CSSProperties}>
                I work independently by default: when something doesn&apos;t add up mid-project, or I hit a roadblock,
                I dig into it and work through it myself rather than waiting on direction.
              </p>
              <p className="rv-text" style={{ "--d": 350 } as React.CSSProperties}>
                That approach has taken me from posters for university organizations to mobile app interfaces and
                social media campaigns in fast-paced real estate environments.
              </p>
            </div>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <p className="rv-text text-sm font-bold uppercase tracking-[0.2em] text-cream/70">Experience</p>
            <ul className="mt-4 divide-y divide-white/25 border-y border-white/25">
              {ROLES.map((r, i) => (
                <li key={r.role} className="rv-text flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-5" style={{ "--d": 200 + i * 100 } as React.CSSProperties}>
                  <div className="flex items-center gap-3">
                    <span className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: r.color }} />
                    <p className="text-xl font-semibold sm:text-2xl">
                      {r.role} <span className="font-normal opacity-80">· {r.org}</span>
                    </p>
                  </div>
                  <p className="pl-6 text-sm font-semibold opacity-80 sm:pl-0">{r.when}</p>
                </li>
              ))}
            </ul>

            <p className="rv-text mt-10 text-sm font-bold uppercase tracking-[0.2em] text-cream/70">Publications</p>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {PUBLICATIONS.map((p, i) => (
                <li key={p.name} className="rv" style={{ "--d": 300 + i * 100 } as React.CSSProperties}>
                  {p.href ? (
                    <a href={p.href} target="_blank" rel="noreferrer" className="group block h-full rounded-2xl bg-white/15 p-5 transition-colors hover:bg-white/25">
                      <p className="text-lg font-semibold leading-tight">
                        {p.name} <span className="inline-block transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5">↗</span>
                      </p>
                      <p className="mt-1 text-sm opacity-80">{p.note}</p>
                    </a>
                  ) : (
                    <div className="h-full rounded-2xl bg-white/15 p-5">
                      <p className="text-lg font-semibold leading-tight">{p.name}</p>
                      <p className="mt-1 text-sm opacity-80">{p.note}</p>
                    </div>
                  )}
                </li>
              ))}
            </ul>

            <p className="rv-text mt-10 text-sm font-bold uppercase tracking-[0.2em] text-cream/70">Education</p>
            <div className="rv-text mt-4 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-y border-white/25 py-5" style={{ "--d": 350 } as React.CSSProperties}>
              <p className="text-xl font-semibold sm:text-2xl">
                BCS with Distinction <span className="font-normal opacity-80">· University of Wollongong in Dubai</span>
              </p>
              <p className="text-sm font-semibold opacity-80">Sep 2023 – May 2026</p>
            </div>

            <p className="rv-text mt-10 text-sm font-bold uppercase tracking-[0.2em] text-cream/70">Toolbox</p>
            <div className="mt-4 flex flex-wrap gap-3">
              {TOOLS.map((t, i) => (
                <div key={t} className="rv h-12 w-12 sm:h-14 sm:w-14" style={{ "--d": 400 + i * 50 } as React.CSSProperties}>
                  <ToolIcon tool={t} className="h-full w-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Reveal>

      <Marquee
        items={["Cemex", "B1 Properties", "Amana Homes", "Binghatti", "wasl", "Theorem Partners", "Marco Oro", "Cloud Castle", "Quotify"]}
        bg="#f3c11b"
        ink="#1e1e1e"
      />
    </>
  );
}
