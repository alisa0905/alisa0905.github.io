import { ART, type ArtName } from "@/lib/art";

type Props = {
  name: ArtName;
  className?: string;
  /** Leave out the big curved title (used when the title is shown another way). */
  hideTitle?: boolean;
  /** Leave out the small curved subtitle (dates, taglines). */
  hideSub?: boolean;
};

/**
 * The hand-drawn vector art from the Figma slides: wavy blobs, spinning
 * flowers, dots and the big curved Londrina titles. Animates in via globals.css.
 */
export function Art({ name, className = "", hideTitle = false, hideSub = false }: Props) {
  const art = ART[name];
  let flowerIndex = 0;

  return (
    <svg
      viewBox="0 0 1920 1080"
      preserveAspectRatio="xMidYMid slice"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      aria-hidden
    >
      {art.layers.map((layer, i) => {
        switch (layer.role) {
          case "blob":
            return (
              <path
                key={i}
                d={layer.d}
                stroke={layer.stroke}
                strokeWidth={layer.sw}
                fill="none"
                pathLength={1}
                className="art-blob"
              />
            );
          case "dot":
            return (
              <path
                key={i}
                d={layer.d}
                stroke={layer.stroke}
                strokeWidth={layer.sw}
                strokeLinejoin="round"
                fill="none"
                className="art-pop"
                style={{ "--d": 900 + i * 120 } as React.CSSProperties}
              />
            );
          case "flower": {
            const n = flowerIndex++;
            return (
              <g key={i} className="art-flower" style={{ "--d": 500 + n * 250 } as React.CSSProperties}>
                <g className={`art-spin ${n % 2 ? "reverse" : ""}`}>
                  {layer.petals.map((d, j) => (
                    <path
                      key={j}
                      d={d}
                      stroke={layer.stroke}
                      strokeWidth={layer.sw}
                      strokeLinejoin="round"
                      fill="none"
                    />
                  ))}
                </g>
              </g>
            );
          }
          case "shape":
            return <path key={i} d={layer.d} fill={layer.fill} className="art-shape" />;
          case "title":
            if (hideTitle) return null;
            return (
              <path key={i} d={layer.d} fill={layer.fill} className="art-title">
                <title>{layer.label}</title>
              </path>
            );
          case "sub":
            if (hideSub) return null;
            return <path key={i} d={layer.d} fill={layer.fill} className="art-sub" />;
        }
      })}
    </svg>
  );
}
