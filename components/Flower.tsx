import { FLOWER } from "@/lib/flower";

type Props = {
  color: string;
  className?: string;
  style?: React.CSSProperties;
  /** Spin continuously */
  spin?: boolean;
  reverse?: boolean;
  filled?: boolean;
  /** Pop in when the parent <Reveal> scrolls into view */
  pop?: boolean;
};

/** The five-petal flower from the portfolio, as a reusable decoration. */
export function Flower({ color, className = "", style, spin = true, reverse, filled, pop }: Props) {
  return (
    <svg viewBox={FLOWER.viewBox} className={`${pop ? "art-pop" : ""} ${className}`} style={style} aria-hidden>
      <g className={spin ? `art-spin ${reverse ? "reverse" : ""}` : ""}>
        {FLOWER.petals.map((d, i) => (
          <path
            key={i}
            d={d}
            fill={filled ? color : "none"}
            stroke={color}
            strokeWidth={FLOWER.strokeWidth}
            strokeLinejoin="round"
          />
        ))}
      </g>
    </svg>
  );
}
