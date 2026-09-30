import Image from "next/image";
import { ASSETS, type AssetName } from "@/lib/assets";

export type Tool =
  | "figma"
  | "illustrator"
  | "photoshop"
  | "premiere"
  | "lightroom"
  | "indesign"
  | "gemini"
  | "canva"
  | "capcut"
  | "notion"
  | "zoho"
  | "motion"
  | "automation";

/** Software icons used in the "Created Using" bars. `plate` = sits on a white rounded tile like in Figma. */
export const TOOLS: Record<Tool, { label: string; asset: AssetName; plate?: boolean; round?: boolean }> = {
  figma: { label: "Figma", asset: "tool-figma", round: true },
  illustrator: { label: "Adobe Illustrator", asset: "tool-ai" },
  photoshop: { label: "Adobe Photoshop", asset: "tool-ps" },
  premiere: { label: "Adobe Premiere Pro", asset: "tool-pr" },
  lightroom: { label: "Adobe Lightroom", asset: "tool-lr" },
  indesign: { label: "Adobe InDesign", asset: "tool-id" },
  gemini: { label: "Gemini", asset: "tool-gemini", plate: true },
  canva: { label: "Canva", asset: "tool-canva", round: true },
  capcut: { label: "CapCut", asset: "tool-capcut" },
  notion: { label: "Notion", asset: "tool-notion", plate: true },
  zoho: { label: "Zoho", asset: "tool-i25", plate: true },
  motion: { label: "Motion design", asset: "tool-i42", plate: true },
  automation: { label: "Automation", asset: "tool-i26", round: true },
};

export function ToolIcon({ tool, className = "" }: { tool: Tool; className?: string }) {
  const t = TOOLS[tool];
  const a = ASSETS[t.asset];
  return (
    <span
      title={t.label}
      className={`tool-icon relative inline-block shrink-0 overflow-hidden ${
        t.plate ? "rounded-[30%] bg-white p-[12%]" : t.round ? "rounded-[24%]" : ""
      } ${className}`}
    >
      <span className="relative block h-full w-full">
        <Image src={a.src} alt={t.label} fill sizes="96px" className="object-contain" />
      </span>
    </span>
  );
}
