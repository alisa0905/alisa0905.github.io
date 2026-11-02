import Link from "next/link";
import { Flower } from "./Flower";
import { Reveal } from "./Reveal";
import { BOOKING_URL, CONTACT_EMAIL, LINKEDIN_URL } from "@/lib/projects";

/**
 * Outline flowers on the grass. `x` is % across the footer, `depth` is how far
 * below the hill's edge (in % of the hill's height), so every flower lands on
 * the green. Computers and phones get their own layouts.
 */
type Bloom = { color: string; x: number; depth: number; size: number; turn: number };

const FIELD_WIDE: Bloom[] = [
  { color: "#e173ae", x: 6, depth: 10, size: 88, turn: -12 },
  { color: "#3883de", x: 13, depth: 4, size: 56, turn: 20 },
  { color: "#f3c11b", x: 15, depth: 18, size: 66, turn: 20 },
  { color: "#ecedd8", x: 5, depth: 26, size: 60, turn: 8 },
  { color: "#b83244", x: 17, depth: 35, size: 50, turn: 35 },
  { color: "#ecedd8", x: 29, depth: 3, size: 54, turn: -30 },
  { color: "#e173ae", x: 71, depth: 3, size: 60, turn: 10 },
  { color: "#f3c11b", x: 94, depth: 10, size: 84, turn: -18 },
  { color: "#3883de", x: 87, depth: 4, size: 58, turn: 24 },
  { color: "#e173ae", x: 86, depth: 18, size: 64, turn: 40 },
  { color: "#b83244", x: 95, depth: 27, size: 62, turn: -25 },
  { color: "#ecedd8", x: 84, depth: 36, size: 52, turn: 15 },
];
const FIELD_SMALL: Bloom[] = [
  { color: "#e173ae", x: 9, depth: 2.5, size: 46, turn: -12 },
  { color: "#f3c11b", x: 30, depth: 1.5, size: 36, turn: 20 },
  { color: "#ecedd8", x: 70, depth: 1.5, size: 40, turn: -30 },
  { color: "#b83244", x: 91, depth: 2.5, size: 44, turn: 10 },
  { color: "#3883de", x: 10, depth: 41, size: 46, turn: 24 },
  { color: "#f3c11b", x: 50, depth: 42, size: 36, turn: -18 },
  { color: "#e173ae", x: 90, depth: 41, size: 50, turn: 40 },
];

// Hill width as % of the footer (must match the hill's classes below)
const HILL_WIDE = 140;
const HILL_SMALL = 260;

/** Turn a footer position into a spot inside the hill oval, just under its edge. */
function onHill(f: Bloom, hillWidth: number) {
  const left = ((f.x + (hillWidth - 100) / 2) / hillWidth) * 100;
  const dx = (left - 50) / 50;
  const edge = 50 - 50 * Math.sqrt(Math.max(0, 1 - dx * dx));
  return { left, top: edge + f.depth };
}

/** "Let's talk" footer on every page: a green hill with a field of flowers. */
export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <Reveal as="div" className="relative overflow-hidden text-cream print:hidden" threshold={0.15}>
      <footer className="relative bg-sky pt-16 sm:pt-24">
        {/* The hill: a huge oval whose top edge makes the curve. Flowers live inside it. */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-16 h-[200%] w-[260%] -translate-x-1/2 rounded-[50%] bg-green sm:top-24 lg:w-[140%]"
        >
          {[
            { list: FIELD_WIDE, hill: HILL_WIDE, show: "hidden lg:block" },
            { list: FIELD_SMALL, hill: HILL_SMALL, show: "lg:hidden" },
          ].map(({ list, hill, show }) =>
            list.map((f, i) => {
              const at = onHill(f, hill);
              return (
                <div
                  key={`${show}-${i}`}
                  className={`absolute ${show}`}
                  style={{ left: `${at.left}%`, top: `${at.top}%`, width: f.size, rotate: `${f.turn}deg`, translate: "-50% -50%" }}
                >
                  <Flower
                    color={f.color}
                    spin={false}
                    pop
                    className="block w-full"
                    style={{ "--d": 200 + i * 90 } as React.CSSProperties}
                  />
                </div>
              );
            }),
          )}
        </div>

        <div className="relative mx-auto max-w-6xl px-5 pb-24 pt-20 text-center sm:px-8 sm:pt-28 lg:pb-10 lg:pt-28">
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="Let's talk"
            className="rv-text group mx-auto block max-w-5xl transition-transform duration-700 ease-out hover:-translate-y-1"
            style={{ "--d": 150 } as React.CSSProperties}
          >
            {/* Text bent along an arc that follows the hill */}
            <svg viewBox="0 0 1000 215" className="w-full overflow-visible font-display font-black" aria-hidden>
              <path id="hill-arc" d="M 30 200 Q 500 100 970 200" fill="none" />
              <text fill="currentColor" fontSize="168" textAnchor="middle">
                <textPath href="#hill-arc" startOffset="50%">
                  Let&apos;s talk →
                </textPath>
              </text>
            </svg>
          </a>

          <div className="mx-auto mt-10 grid max-w-4xl gap-8 border-t border-cream/20 pt-10 lg:grid-cols-[1.4fr_1fr_1.4fr] lg:text-left">
            <div className="rv-text" style={{ "--d": 250 } as React.CSSProperties}>
              <p className="text-sm text-cream/60">Email</p>
              <a href={`mailto:${CONTACT_EMAIL}`} className="mt-1 block break-all text-lg font-semibold hover:text-sun">
                {CONTACT_EMAIL}
              </a>
            </div>
            <div className="rv-text" style={{ "--d": 350 } as React.CSSProperties}>
              <p className="text-sm text-cream/60">Based in</p>
              <p className="mt-1 text-lg font-semibold">Dubai, UAE</p>
            </div>
            <nav
              className="rv-text flex flex-wrap justify-center gap-x-6 gap-y-2 text-lg font-semibold lg:justify-end"
              aria-label="Footer"
              style={{ "--d": 450 } as React.CSSProperties}
            >
              <Link href="/work" className="hover:text-sun">Work</Link>
              <Link href="/#about" className="hover:text-sun">About</Link>
              <Link href="/contact" className="hover:text-sun">Contact</Link>
              <a href={LINKEDIN_URL} target="_blank" rel="noreferrer" className="hover:text-sun">
                LinkedIn ↗
              </a>
            </nav>
          </div>

          <p className="mt-14 text-sm text-cream/60">© {year} Alisa Bakhareva · alisabakhareva.me</p>
        </div>
      </footer>
    </Reveal>
  );
}
