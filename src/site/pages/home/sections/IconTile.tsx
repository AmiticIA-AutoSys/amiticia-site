import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const toneClass = {
  cyan: "text-brand-cyan bg-brand-cyan/10 border-brand-cyan/20",
  violet: "text-brand-violet bg-brand-violet/10 border-brand-violet/20",
} as const;

/** Tinted icon tile used across the home sections (decorative). */
export const IconTile = ({
  icon: Icon,
  tone = "cyan",
  size = "md",
}: {
  icon: LucideIcon;
  tone?: keyof typeof toneClass;
  size?: "md" | "lg";
}) => (
  <span
    aria-hidden="true"
    className={cn(
      "inline-flex shrink-0 items-center justify-center rounded-[12px] border shadow-[var(--hairline)]",
      size === "lg" ? "h-14 w-14" : "h-12 w-12",
      toneClass[tone],
    )}
  >
    <Icon className={size === "lg" ? "h-6 w-6" : "h-5 w-5"} />
  </span>
);
