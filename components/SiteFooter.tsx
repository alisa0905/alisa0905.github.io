import Link from "next/link";
import { Flower } from "./Flower";
import { Reveal } from "./Reveal";
import { StickyReveal } from "./StickyReveal";
import { TalkArc } from "./TalkArc";
import { CONTACT_EMAIL, LINKEDIN_URL } from "@/lib/projects";

/**
 * Big filled flowers on the hill, from Alisa's Figma footer (Things, node 989:1229).
 * Desktop positions are in vw so the layout scales like the design; two of them
 * hang off the edges on purpose.
 */
const BLOOMS = [
  {
    color: "#e173ae",
    left: "calc(50% - var(--u) * 49)",
    top: "calc(var(--u) * 12)",
    size: "calc(var(--u) * 17)",
    turn: -14,
  },
  {
    color: "#3883de",
    left: "calc(50% + var(--u) * 21)",
    top: "calc(var(--u) * 39)",
    size: "calc(var(--u) * 17)",
    turn: 18,
  },
  {
    color: "#f3c11b",
    left: "calc(var(--u) * -9)",
    top: "calc(var(--u) * 40)",
    size: "calc(var(--u) * 33)",
    turn: 0,
  },
  {
    color: "#e77f23",
    left: "calc(100% - var(--u) * 14)",
    top: "calc(var(--u) * 30)",
    size: "calc(var(--u) * 25)",
    turn: -20,
  },
];
const BLOOMS_SMALL = [
  { color: "#e173ae", left: "5%", top: "6rem", size: "max(4.75rem, 11vw)", turn: -14 },
  { color: "#3883de", left: "78%", top: "8rem", size: "max(4.75rem, 11vw)", turn: 18 },
  { color: "#f3c11b", left: "-14%", top: "calc(100% - max(8.5rem, 21vw))", size: "max(10rem, 28vw)", turn: 0 },
  { color: "#e77f23", left: "84%", top: "calc(100% - max(9.5rem, 24vw))", size: "max(7.5rem, 19vw)", turn: -20 },
];

function Bloom({ b }: { b: (typeof BLOOMS)[number] }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute"
      style={{
        left: b.left,
        top: b.top,
        width: b.size,
        rotate: `${b.turn}deg`,
      }}
    >
      <Flower
        color={b.color}
        spin={false}
        filled
        className="block w-full"
      />
    </div>
  );
}

const NAV = [
  { label: "Work", href: "/work" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/contact" },
];

/** "Let's talk" footer on every page: blue sky, a green hill and big flowers. */
export function SiteFooter() {
  const year = new Date().getFullYear();
  const links = (
    <>
      {NAV.map((l) => (
        <Link
          key={l.label}
          href={l.href}
          className="transition-colors hover:text-sun"
        >
          {l.label}
        </Link>
      ))}
      <a
        href={LINKEDIN_URL}
        target="_blank"
        rel="noreferrer"
        className="transition-colors hover:text-sun"
      >
        LinkedIn→
      </a>
    </>
  );

  return (
    <Reveal as="div" className="print:hidden" threshold={0.1}>
      {/* Sky behind the pinned footer, so any gap while scrolling matches its sky */}
      <StickyReveal className="bg-sky">
        <footer className="relative overflow-hidden bg-sky text-cream">
          {/*
          ---------- Computers: the Figma layout ----------
          --u is 1% of the design's width: the screen width, but capped by the
          screen height so the whole footer always fits on screen.
        */}
          <div className="relative hidden h-[calc(var(--u)*71)] [--u:min(1vw,1.25svh)] lg:block">
            <div
              aria-hidden
              className="absolute left-1/2 top-[calc(var(--u)*8)] h-[calc(var(--u)*105)] w-[max(calc(var(--u)*142.8),118vw)] -translate-x-1/2 rounded-[50%] bg-green"
            />
            {BLOOMS.map((b, i) => (
              <Bloom key={i} b={b} />
            ))}

            <TalkArc
              id="talk-arc-wide"
              className="absolute left-1/2 top-[calc(var(--u)*21)] w-[min(64rem,calc(var(--u)*85))] -translate-x-1/2"
            />

            <div className="absolute inset-x-0 top-[calc(var(--u)*44.3)] text-center text-[max(1.1rem,calc(var(--u)*2.1))] leading-tight">
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="inline-block transition-colors hover:text-sun"
              >
                {CONTACT_EMAIL}
              </a>
              <p
                className="mt-[calc(var(--u)*1.2)]"
              >
                Based in Dubai, UAE
              </p>
            </div>

            <nav
              aria-label="Footer"
              className="absolute left-1/2 top-[calc(var(--u)*60.3)] flex w-[calc(var(--u)*67.3)] -translate-x-1/2 justify-between text-[max(1.1rem,calc(var(--u)*2.1))]"
            >
              {links}
            </nav>

            <p className="absolute inset-x-0 top-[calc(var(--u)*66.5)] text-center text-[max(0.8rem,calc(var(--u)*1.2))] text-cream/60">
              © {year} Alisa Bakhareva • alisabakhareva.me
            </p>
          </div>

          {/* ---------- Phones and tablets: same picture, stacked ---------- */}
          <div className="relative pt-16 lg:hidden">
            <div
              aria-hidden
              className="absolute left-1/2 top-16 h-[200%] w-[260%] -translate-x-1/2 rounded-[50%] bg-green"
            />
            {BLOOMS_SMALL.map((b, i) => (
              <Bloom key={i} b={b} />
            ))}

            <div className="relative px-5 pb-32 pt-24 text-center sm:px-8">
              <TalkArc id="talk-arc-small" className="mx-auto max-w-xl" />
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="mt-12 inline-block break-all text-lg transition-colors hover:text-sun sm:text-xl"
              >
                {CONTACT_EMAIL}
              </a>
              <p
                className="mt-2 text-lg sm:text-xl"
              >
                Based in Dubai, UAE
              </p>
              <nav
                aria-label="Footer"
                className="mx-auto mt-12 flex max-w-md flex-wrap justify-center gap-x-7 gap-y-2 text-lg"
              >
                {links}
              </nav>
              <p className="mt-8 text-sm text-cream/60">
                © {year} Alisa Bakhareva • alisabakhareva.me
              </p>
            </div>
          </div>
        </footer>
      </StickyReveal>
    </Reveal>
  );
}
