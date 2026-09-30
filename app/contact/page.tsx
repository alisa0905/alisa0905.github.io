import type { Metadata } from "next";
import { Art } from "@/components/Art";
import { ContactForm } from "@/components/ContactForm";
import { Reveal } from "@/components/Reveal";
import { CONTACT_EMAIL } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Alisa Bakhareva about a project.",
};


export default function ContactPage() {
  return (
    <>
      <Reveal className="relative isolate overflow-hidden bg-pink pb-24 pt-36 text-cream lg:pb-32 lg:pt-44" data-hero-ink="light" threshold={0}>
        <Art name="misc" hideTitle hideSub className="-z-10" />
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <h1 className="rv-text max-w-4xl font-display text-[clamp(4rem,12vw,10.5rem)] font-black leading-[0.85] tracking-tight [text-shadow:0_8px_0_rgb(0_0_0/0.08)]">
            Let&apos;s talk
          </h1>
        </div>
      </Reveal>

      <section className="mx-auto grid max-w-7xl gap-14 px-5 py-20 sm:px-8 lg:grid-cols-12 lg:py-28">
        <div className="lg:col-span-7">
          <ContactForm />
        </div>

        <Reveal as="div" className="lg:col-span-4 lg:col-start-9" threshold={0.1}>
          <div className="rv rounded-[24px] bg-ink p-6 text-cream" style={{ "--d": 500 } as React.CSSProperties}>
            <p className="text-sm text-cream/60">Email</p>
            <a href={`mailto:${CONTACT_EMAIL}`} className="mt-1 block break-all text-lg font-semibold hover:text-pink">
              {CONTACT_EMAIL}
            </a>
            <p className="mt-4 text-sm text-cream/60">Dubai, UAE</p>
          </div>
        </Reveal>
      </section>
    </>
  );
}
