"use client";

import dynamic from "next/dynamic";

// Loaded only while editing, so the live site never downloads it
const Agentation = dynamic(() => import("agentation").then((m) => m.Agentation), { ssr: false });

export function AgentationProvider() {
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return <Agentation />;
}
