import Link from "next/link";
import { Flower } from "./Flower";
import { Reveal } from "./Reveal";
import { StickyReveal } from "./StickyReveal";
import { BOOKING_URL, CONTACT_EMAIL, LINKEDIN_URL } from "@/lib/projects";

/**
 * Big filled flowers on the hill, from Alisa's Figma footer (Things, node 989:1229).
 * Desktop positions are in vw so the layout scales like the design; two of them
 * hang off the edges on purpose.
 */
const BLOOMS = [
  {
    color: "#e173ae",
    left: "calc(50% - var(--u) * 46)",
    top: "calc(var(--u) * 15)",
    size: "calc(var(--u) * 12.6)",
    turn: -14,
  },
  {
    color: "#3883de",
    left: "calc(50% + var(--u) * 22)",
    top: "calc(var(--u) * 41)",
    size: "calc(var(--u) * 12.6)",
    turn: 18,
  },
  {
    color: "#f3c11b",
    left: "calc(var(--u) * -5.9)",
    top: "calc(var(--u) * 43.5)",
    size: "calc(var(--u) * 25)",
    turn: 0,
  },
  {
    color: "#e77f23",
    left: "calc(100% - var(--u) * 11.7)",
    top: "calc(var(--u) * 33)",
    size: "calc(var(--u) * 19)",
    turn: -20,
  },
];
const BLOOMS_SMALL = [
  { color: "#e173ae", left: "8%", top: "7rem", size: "3.5rem", turn: -14 },
  { color: "#3883de", left: "80%", top: "8.5rem", size: "3.5rem", turn: 18 },
  {
    color: "#f3c11b",
    left: "-10%",
    top: "calc(100% - 7rem)",
    size: "7.5rem",
    turn: 0,
  },
  {
    color: "#e77f23",
    left: "88%",
    top: "calc(100% - 8.5rem)",
    size: "5.5rem",
    turn: -20,
  },
];

function Bloom({ b, i }: { b: (typeof BLOOMS)[number]; i: number }) {
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
        pop
        className="block w-full"
        style={{ "--d": 250 + i * 150 } as React.CSSProperties}
      />
    </div>
  );
}

/** "Let's Talk" bent into a gentle rising curve, like the Figma text-on-path. */
function TalkArc({ id, className }: { id: string; className?: string }) {
  return (
    <a
      href={BOOKING_URL}
      target="_blank"
      rel="noreferrer"
      aria-label="Let's talk"
      className={`rv-text block transition-transform duration-700 ease-out hover:-translate-y-1 ${className ?? ""}`}
      style={{ "--d": 150 } as React.CSSProperties}
    >
      <svg
        viewBox="0 0 1000 215"
        className="w-full overflow-visible font-display font-black"
        aria-hidden
      >
        <path id={id} d="M 30 200 Q 500 100 970 200" fill="none" />
        <text fill="currentColor" fontSize="168" textAnchor="middle">
          <textPath href={`#${id}`} startOffset="50%">
            Let&apos;s Talk →
          </textPath>
        </text>
      </svg>
    </a>
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
      <StickyReveal>
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
              <Bloom key={i} b={b} i={i} />
            ))}

            <TalkArc
              id="talk-arc-wide"
              className="absolute left-1/2 top-[calc(var(--u)*21)] w-[min(64rem,calc(var(--u)*85))] -translate-x-1/2"
            />

            <div className="absolute inset-x-0 top-[calc(var(--u)*44.3)] text-center text-[max(1.1rem,calc(var(--u)*2.1))] leading-tight">
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="rv-text inline-block transition-colors hover:text-sun"
                style={{ "--d": 300 } as React.CSSProperties}
              >
                {CONTACT_EMAIL}
              </a>
              <p
                className="rv-text mt-[calc(var(--u)*1.2)]"
                style={{ "--d": 380 } as React.CSSProperties}
              >
                Based in Dubai, UAE
              </p>
            </div>

            <nav
              aria-label="Footer"
              className="rv-text absolute left-1/2 top-[calc(var(--u)*60.3)] flex w-[calc(var(--u)*67.3)] -translate-x-1/2 justify-between text-[max(1.1rem,calc(var(--u)*2.1))]"
              style={{ "--d": 460 } as React.CSSProperties}
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
              <Bloom key={i} b={b} i={i} />
            ))}

            <div className="relative px-5 pb-32 pt-24 text-center sm:px-8">
              <TalkArc id="talk-arc-small" className="mx-auto max-w-xl" />
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="rv-text mt-12 inline-block break-all text-lg transition-colors hover:text-sun sm:text-xl"
                style={{ "--d": 300 } as React.CSSProperties}
              >
                {CONTACT_EMAIL}
              </a>
              <p
                className="rv-text mt-2 text-lg sm:text-xl"
                style={{ "--d": 380 } as React.CSSProperties}
              >
                Based in Dubai, UAE
              </p>
              <nav
                aria-label="Footer"
                className="rv-text mx-auto mt-12 flex max-w-md flex-wrap justify-center gap-x-7 gap-y-2 text-lg"
                style={{ "--d": 460 } as React.CSSProperties}
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
