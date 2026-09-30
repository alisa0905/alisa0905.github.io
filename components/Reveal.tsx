"use client";

import { useEffect, useRef, useState } from "react";

type Props = React.HTMLAttributes<HTMLElement> & {
  as?: "section" | "div";
  threshold?: number;
};

/**
 * Marks its content as "in view" the first time it scrolls onto the screen.
 * The CSS in globals.css (.rv, .rv-text, .art-*) does the actual animating.
 */
export function Reveal({ as = "section", threshold = 0.2, children, ...rest }: Props) {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  const Tag = as;
  return (
    <Tag ref={ref as React.Ref<HTMLDivElement>} data-inview={inView} {...rest}>
      {children}
    </Tag>
  );
}
