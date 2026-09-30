import Link from "next/link";
import { Flower } from "./Flower";
import { Reveal } from "./Reveal";
import { CONTACT_EMAIL } from "@/lib/projects";

/** Big "let's work together" footer shown on every page. */
export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <Reveal as="div" className="relative overflow-hidden bg-ink text-cream" threshold={0.2}>
      <footer>
        <Flower color="#e173ae" className="absolute -right-10 -top-10 w-56 sm:w-72" pop />
        <Flower color="#3883de" className="absolute bottom-24 left-[46%] hidden w-24 md:block" reverse pop style={{ "--d": 800 } as React.CSSProperties} />

        <div className="relative mx-auto max-w-7xl px-5 pb-10 pt-24 sm:px-8 lg:pt-32">
          <Link
            href="/contact"
            className="rv-text group inline-block font-display text-[clamp(3.5rem,11vw,10rem)] font-black leading-[0.9]"
            style={{ "--d": 150 } as React.CSSProperties}
          >
            Let&apos;s talk
            <span className="ml-4 inline-block text-pink transition-transform duration-500 group-hover:translate-x-3 group-hover:-rotate-12">
              →
            </span>
          </Link>

          <div className="mt-16 grid gap-10 border-t border-white/10 pt-10 sm:grid-cols-3">
            <div className="rv-text" style={{ "--d": 250 } as React.CSSProperties}>
              <p className="text-sm text-cream/50">Email</p>
              <a href={`mailto:${CONTACT_EMAIL}`} className="mt-1 block break-all text-lg font-semibold hover:text-pink">
                {CONTACT_EMAIL}
              </a>
            </div>
            <div className="rv-text" style={{ "--d": 350 } as React.CSSProperties}>
              <p className="text-sm text-cream/50">Based in</p>
              <p className="mt-1 text-lg font-semibold">Dubai, UAE</p>
            </div>
            <nav className="rv-text flex gap-6 text-lg font-semibold sm:justify-end" aria-label="Footer" style={{ "--d": 450 } as React.CSSProperties}>
              <Link href="/work" className="hover:text-sun">Work</Link>
              <Link href="/#about" className="hover:text-sun">About</Link>
              <Link href="/contact" className="hover:text-sun">Contact</Link>
            </nav>
          </div>

          <p className="mt-14 text-sm text-cream/40">© {year} Alisa Bakhareva · alisabakhareva.me</p>
        </div>
      </footer>
    </Reveal>
  );
}
