import Link from "next/link";
import { Flower } from "./Flower";
import { Reveal } from "./Reveal";
import { BOOKING_URL, CONTACT_EMAIL, LINKEDIN_URL } from "@/lib/projects";

/**
 * Outline flowers dotted over the hill, kept clear of the text. Positions are
 * % of the footer, sizes in px. Computers and phones get their own layouts.
 */
const FIELD_WIDE = [
  { color: "#e173ae", left: 6, top: 56, size: 88, turn: -12 },
  { color: "#3883de", left: 13, top: 44, size: 56, turn: 20 },
  { color: "#f3c11b", left: 14, top: 72, size: 66, turn: 20 },
  { color: "#ecedd8", left: 5, top: 88, size: 60, turn: 8 },
  { color: "#b83244", left: 18, top: 92, size: 50, turn: 35 },
  { color: "#ecedd8", left: 31, top: 26, size: 54, turn: -30 },
  { color: "#e173ae", left: 69, top: 25, size: 60, turn: 10 },
  { color: "#f3c11b", left: 94, top: 52, size: 84, turn: -18 },
  { color: "#3883de", left: 87, top: 42, size: 58, turn: 24 },
  { color: "#e173ae", left: 87, top: 68, size: 64, turn: 40 },
  { color: "#b83244", left: 95, top: 85, size: 62, turn: -25 },
  { color: "#ecedd8", left: 83, top: 92, size: 52, turn: 15 },
];
const FIELD_SMALL = [
  { color: "#e173ae", left: 10, top: 20, size: 50, turn: -12 },
  { color: "#f3c11b", left: 30, top: 14, size: 38, turn: 20 },
  { color: "#ecedd8", left: 70, top: 13, size: 42, turn: -30 },
  { color: "#b83244", left: 90, top: 19, size: 48, turn: 10 },
  { color: "#3883de", left: 12, top: 95, size: 46, turn: 24 },
  { color: "#f3c11b", left: 50, top: 97, size: 36, turn: -18 },
  { color: "#e173ae", left: 88, top: 95, size: 50, turn: 40 },
];

/** "Let's talk" footer on every page: a green hill with a field of flowers. */
export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <Reveal as="div" className="relative overflow-hidden text-cream print:hidden" threshold={0.15}>
      <footer className="relative bg-sky pt-16 sm:pt-24">
        {/* The hill: a huge oval whose top edge makes the curve */}
        <div
          aria-hidden
          className="absolute left-1/2 top-16 h-[200%] w-[260%] -translate-x-1/2 rounded-[50%] bg-green sm:top-24 sm:w-[170%] lg:w-[140%]"
        />

        {[
          { list: FIELD_WIDE, show: "hidden lg:block" },
          { list: FIELD_SMALL, show: "lg:hidden" },
        ].map(({ list, show }) =>
          list.map((f, i) => (
            <div
              key={`${show}-${i}`}
              aria-hidden
              className={`pointer-events-none absolute ${show}`}
              style={{ left: `${f.left}%`, top: `${f.top}%`, width: f.size, rotate: `${f.turn}deg`, translate: "-50% -50%" }}
            >
              <Flower
                color={f.color}
                spin={false}
                pop
                className="block w-full"
                style={{ "--d": 200 + i * 90 } as React.CSSProperties}
              />
            </div>
          )),
        )}

        <div className="relative mx-auto max-w-5xl px-5 pb-24 pt-24 lg:pb-10 text-center sm:px-8 sm:pt-32 lg:pt-36">
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noreferrer"
            className="rv-text group inline-block -rotate-3 font-display text-[clamp(3.5rem,11vw,9rem)] font-black leading-[0.9]"
            style={{ "--d": 150 } as React.CSSProperties}
          >
            Let&apos;s talk
            <span className="ml-3 inline-block transition-transform duration-700 ease-out group-hover:translate-x-2">→</span>
          </a>

          <div className="mx-auto mt-14 grid max-w-4xl gap-8 border-t border-cream/20 pt-10 sm:grid-cols-[1.4fr_1fr_1.4fr] sm:text-left">
            <div className="rv-text" style={{ "--d": 250 } as React.CSSProperties}>
              <p className="text-sm text-cream/60">Email</p>
              <a href={`mailto:${CONTACT_EMAIL}`} className="mt-1 block break-all text-lg font-semibold hover:text-sun">
                {CONTACT_EMAIL}
              </a>
            </div>
            <div className="rv-text sm:text-center" style={{ "--d": 350 } as React.CSSProperties}>
              <p className="text-sm text-cream/60">Based in</p>
              <p className="mt-1 text-lg font-semibold">Dubai, UAE</p>
            </div>
            <nav
              className="rv-text flex flex-wrap justify-center gap-x-6 gap-y-2 text-lg font-semibold sm:justify-end"
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
