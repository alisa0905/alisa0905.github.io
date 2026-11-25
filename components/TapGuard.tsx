"use client";

import { useEffect, useState } from "react";

/**
 * Ignores taps for a moment after a page appears. Visitors who tap "CV"
 * twice while it loads would otherwise land their second tap on whatever
 * sits under their finger on the new page (the LinkedIn button).
 */
export function TapGuard({ children, ms = 900 }: { children: React.ReactNode; ms?: number }) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setReady(true), ms);
    return () => clearTimeout(t);
  }, [ms]);
  return <div className={ready ? undefined : "pointer-events-none"}>{children}</div>;
}
