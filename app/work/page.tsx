import type { Metadata } from "next";
import { Art } from "@/components/Art";
import { Reveal } from "@/components/Reveal";
import { WorkGrid } from "@/components/WorkGrid";

export const metadata: Metadata = {
  title: "Work",
  description: "Brand identities, social media systems, UI/UX and print projects by Alisa Bakhareva.",
};

export default function WorkPage() {
  return (
    <>
      <Reveal className="relative isolate flex min-h-[52svh] items-end overflow-hidden bg-sky text-cream" data-hero-ink="light" threshold={0}>
        <Art name="cover" hideTitle hideSub className="-z-10" />
        <div className="mx-auto w-full max-w-7xl px-5 pb-14 pt-36 sm:px-8">
          <h1 className="rv-text font-display text-[clamp(6rem,20vw,16rem)] font-black leading-[0.8] tracking-tight [text-shadow:0_8px_0_rgb(0_0_0/0.08)]">
            Work
          </h1>
        </div>
      </Reveal>

      <section className="mx-auto max-w-7xl px-5 pb-28 pt-6 sm:px-8">
        <WorkGrid />
      </section>
    </>
  );
}
