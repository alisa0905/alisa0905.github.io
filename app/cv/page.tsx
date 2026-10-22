import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import { Fragment } from "react";
import { Flower } from "@/components/Flower";
import { CV, type CvEntry } from "@/lib/cv";

const grotesk = Space_Grotesk({ subsets: ["latin"], weight: ["300", "400", "500", "700"], display: "swap" });

export const metadata: Metadata = {
  title: "CV",
  description: "Alisa Bakhareva, Brand Designer in Dubai. Experience, projects, skills and education.",
};

const PDF_PATH = "/cv/Alisa-Bakhareva-CV.pdf";

/*
 * Screen sizes are the Figma A4 sizes x1.5 so they're readable.
 * print: sizes use pt, which matches the Figma A4 frame 1:1.
 * Reading order in the markup is always title -> role -> dates -> bullets,
 * so hiring software (ATS) reads each job in the right order.
 */

/** Turns **bold** into <strong> and [label](url) into a bold underlined link. */
function Rich({ text }: { text: string }) {
  return text.split(/(\*\*.+?\*\*|\[.+?\]\(.+?\))/g).map((part, i) => {
    const link = part.match(/^\[(.+?)\]\((.+?)\)$/);
    if (link)
      return (
        <a key={i} href={link[2]} target="_blank" rel="noreferrer" className="font-bold text-black underline underline-offset-2 hover:text-pink">
          {link[1]}
        </a>
      );
    if (part.startsWith("**")) return <strong key={i} className="font-bold">{part.slice(2, -2)}</strong>;
    return <Fragment key={i}>{part}</Fragment>;
  });
}

/** Brand colours from app/globals.css. Each section gets its own; bullets pick it up too. */
type Accent = "sky" | "pink" | "sun" | "tangerine" | "mustard";
const PILL: Record<Accent, string> = {
  sky: "bg-sky",
  pink: "bg-pink",
  sun: "bg-sun",
  tangerine: "bg-tangerine",
  mustard: "bg-mustard",
};

function Section({ label, accent, children }: { label: string; accent: Accent; children: React.ReactNode }) {
  return (
    <section
      className="flex flex-col gap-3 sm:flex-row sm:gap-[18px] print:flex-row print:gap-[12pt]"
      style={{ "--accent": `var(--${accent})` } as React.CSSProperties}
    >
      <div className="shrink-0 sm:w-[150px] print:w-[88pt]">
        <h2
          className={`${PILL[accent]} inline-block whitespace-nowrap rounded-full px-3 py-0.5 text-[15px] font-bold text-ink print:px-[6pt] print:py-[1pt] print:text-[9.5pt]`}
        >
          {label}
        </h2>
      </div>
      <div className="min-w-0 flex-1">{children}</div>
    </section>
  );
}

function EntryMeta({ entry }: { entry: Omit<CvEntry, "bullets"> }) {
  return (
    <a href={entry.href} target="_blank" rel="noreferrer" className="group block text-black">
      <h3 className="flex items-center gap-[7px] whitespace-nowrap text-[13.5px] font-bold leading-[22.5px] print:gap-[5pt] print:text-[9pt] print:leading-[14pt]">
        <span className="group-hover:underline">{entry.title}</span>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/cv/external.svg" alt="" width={9} height={9} className="size-[13.5px] shrink-0 print:size-[9pt]" />
      </h3>
      <p className="text-[13.5px] leading-[22.5px] print:text-[9pt] print:leading-[14pt]">{entry.subtitle}</p>
      <p className="text-[10.5px] leading-[16.5px] print:text-[7pt] print:leading-[11pt]">
        {entry.location ? `${entry.location} · ${entry.dates}` : entry.dates}
      </p>
    </a>
  );
}

function Entries({ items }: { items: CvEntry[] }) {
  return (
    <div className="flex flex-col gap-6 print:gap-[8pt]">
      {items.map((e) => (
        <article key={e.title} className="flex flex-col gap-2 sm:flex-row sm:gap-[30px] print:flex-col print:gap-[3pt]">
          <div className="shrink-0 sm:w-[182px] print:w-auto">
            <EntryMeta entry={e} />
          </div>
          <ul className="flex-1 list-disc pl-[20px] marker:text-[var(--accent)] text-[13.5px] leading-[18px] tracking-[-0.01em] text-[#454545] print:pl-[13.5pt] print:text-[9pt] print:leading-[11.5pt]">
            {e.bullets.map((b) => (
              <li key={b}>
                <Rich text={b} />
              </li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  );
}

/** A short list that sits on one line (Languages, Additional Info). */
function InlineList({ items }: { items: string[] }) {
  return (
    <>
      <ul className="text-[13.5px] leading-[22.5px] text-black sm:flex sm:flex-wrap sm:gap-x-[18px] print:hidden">
        {items.map((a) => (
          <li key={a}>{a}</li>
        ))}
      </ul>
      {/* Commas in the PDF so hiring software reads separate items. */}
      <p className="hidden text-[9pt] leading-[15pt] text-black print:block">{items.join(", ")}</p>
    </>
  );
}

function List({ heading, items, className = "" }: { heading: string; items: string[]; className?: string }) {
  return (
    <div className={`flex flex-col gap-[7px] print:gap-[5pt] ${className}`}>
      <h3 className="text-[13.5px] font-bold leading-[22.5px] text-black print:text-[9pt] print:leading-[14pt]">{heading}</h3>
      <ul className="list-disc pl-[20px] marker:text-[var(--accent)] sm:whitespace-nowrap print:whitespace-nowrap text-[13.5px] leading-[18px] text-[#454545] print:pl-[13.5pt] print:text-[9pt] print:leading-[11.5pt]">
        {items.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>
    </div>
  );
}

const bare = (url: string) => url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

export default function CvPage() {
  return (
    <div className="bg-paper px-3 pb-24 pt-28 sm:px-5 lg:pt-36 print:bg-white print:p-0" data-hero-ink="dark">
      <div className="mx-auto mb-6 flex max-w-[893px] items-center justify-between gap-4 print:hidden">
        <h1 className="font-display text-5xl leading-none">CV</h1>
        <a
          href={PDF_PATH}
          download
          className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-cream transition-colors hover:bg-pink"
        >
          Download PDF
        </a>
      </div>

      <article
        className={`${grotesk.className} relative mx-auto max-w-[893px] overflow-hidden rounded-2xl bg-[#fbfbfb] [print-color-adjust:exact] px-5 py-12 text-black shadow-[0_20px_60px_-30px_rgb(0_0_0/0.35)] sm:px-[75px] sm:py-[90px] print:max-w-none print:rounded-none print:bg-white print:px-[50pt] print:pb-0 print:pt-[24pt] print:shadow-none`}
      >
        {/* Brand colour stripe across the top */}
        <div className="absolute inset-x-0 top-0 flex h-[10px] print:h-[6pt]" aria-hidden>
          <span className="flex-1 bg-sky" />
          <span className="flex-1 bg-pink" />
          <span className="flex-1 bg-sun" />
          <span className="flex-1 bg-tangerine" />
          <span className="flex-1 bg-green" />
        </div>
        <Flower color="#7cb9e4" className="pointer-events-none absolute -bottom-20 -right-20 w-64 opacity-60 print:hidden" />

        {/* ---------------------------- Header ---------------------------- */}
        <header className="flex flex-col gap-6 sm:flex-row sm:justify-between print:flex-row print:justify-between">
          <div>
            <p className="flex items-center gap-[9px] text-[30px] font-bold leading-tight print:gap-[6pt] print:text-[20pt]">
              {CV.name}
              <Flower color="#e173ae" spin={false} className="size-[30px] shrink-0 translate-y-[1px] print:size-[19.5pt] print:translate-y-[0.75pt]" />
            </p>
            <p className="text-[21px] leading-tight print:text-[14pt]">{CV.role}</p>
            {/* In the PDF the buttons become written-out links, so hiring software can read them. */}
            <p className="mt-[6pt] hidden gap-[10pt] text-[9pt] font-medium print:flex">
              <a href={CV.linkedin}>{bare(CV.linkedin)}</a>
              <a href={CV.portfolio}>{bare(CV.portfolio)}</a>
            </p>
            <div className="mt-[10px] flex items-center gap-[7.5px] print:hidden">
              <a
                href={CV.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="flex h-[28px] w-[29px] items-center justify-center rounded-[5.4px] border border-black"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/cv/linkedin.png" alt="" width={15} height={15} className="rounded-[1.3px]" />
              </a>
              <a
                href={CV.portfolio}
                target="_blank"
                rel="noreferrer"
                className="flex h-[28px] w-[79px] items-center justify-center rounded-[5.9px] bg-pink text-[15px] font-medium text-ink transition-colors hover:bg-ink hover:text-cream"
              >
                Portfolio
              </a>
            </div>
          </div>

          <address className="flex flex-col gap-[4.5px] text-[15px] font-medium not-italic leading-normal sm:items-end sm:text-right print:items-end print:gap-[3pt] print:text-right print:text-[10pt]">
            <span>{CV.location}</span>
            <a href={`mailto:${CV.email}`} className="hover:underline">{CV.email}</a>
            <a href={`tel:${CV.phone.replace(/\s/g, "")}`} className="hover:underline">{CV.phone}</a>
          </address>
        </header>

        {/* ----------------------------- Body ----------------------------- */}
        <div className="mt-14 flex flex-col gap-10 sm:mt-[80px] sm:gap-[36px] print:mt-[12pt] print:gap-[11pt]">
          <Section label="Experience" accent="sky">
            <Entries items={CV.experience} />
          </Section>

          <Section label="Education" accent="tangerine">
            <EntryMeta entry={CV.education} />
          </Section>

          <Section label="Projects" accent="pink">
            <Entries items={CV.projects} />
          </Section>

          <Section label="Skills & Tools" accent="sun">
            <div className="flex flex-col gap-6 sm:flex-row sm:gap-[70px] print:hidden">
              <List heading="Skills" items={CV.skills} className="shrink-0 sm:w-[180px]" />
              <List heading="Tools" items={CV.tools} className="flex-1" />
            </div>
            {/* In the PDF: one plain line each, the easiest format for hiring software to read. */}
            <div className="hidden text-[9pt] leading-[15pt] text-[#454545] print:block">
              <p><strong className="font-bold text-black">Skills:</strong> {CV.skills.join(", ")}</p>
              <p><strong className="font-bold text-black">Tools:</strong> {CV.tools.join(", ")}</p>
            </div>
          </Section>

          <Section label="Languages" accent="sky">
            <InlineList items={CV.languages} />
          </Section>

          <Section label="Additional Info" accent="mustard">
            <InlineList items={CV.additional} />
          </Section>
        </div>

        <p className="mt-16 flex items-center justify-center gap-[7.5px] text-[13.5px] font-light leading-[22.5px] text-[#454545] print:hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/cv/pointer.svg" alt="" width={9} height={9} className="size-[13.5px]" />
          Click on my experience to find out more
        </p>
      </article>
    </div>
  );
}
