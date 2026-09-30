import { FLOWER } from "@/lib/flower";

function Flower({ color }: { color: string }) {
  return (
    <svg viewBox={FLOWER.viewBox} className="art-spin mx-[0.35em] inline-block h-[0.7em] w-[0.7em] align-middle" aria-hidden>
      {FLOWER.petals.map((d, i) => (
        <path key={i} d={d} fill="none" stroke={color} strokeWidth={FLOWER.strokeWidth * 1.3} strokeLinejoin="round" />
      ))}
    </svg>
  );
}

const COLORS = ["#b83244", "#3883de", "#de7315", "#518c2d", "#e173ae", "#deba38"];

/** Endless ribbon of skills in Londrina Solid, separated by little spinning flowers. */
export function Marquee({ items, bg = "#ecedd8", ink = "#111110" }: { items: string[]; bg?: string; ink?: string }) {
  const row = (
    <div className="flex shrink-0 items-center">
      {items.map((item, i) => (
        <span key={item} className="flex items-center whitespace-nowrap">
          {item}
          <Flower color={COLORS[i % COLORS.length]} />
        </span>
      ))}
    </div>
  );

  return (
    <div
      className="relative z-10 overflow-hidden py-4 font-display text-[clamp(2.2rem,6vw,6rem)] font-black uppercase leading-none lg:py-6"
      style={{ backgroundColor: bg, color: ink }}
      aria-label={items.join(", ")}
    >
      <div className="flex w-max animate-[marquee_28s_linear_infinite] motion-reduce:animate-none" aria-hidden>
        {row}
        {row}
      </div>
    </div>
  );
}
