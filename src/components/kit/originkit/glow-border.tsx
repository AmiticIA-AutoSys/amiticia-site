// Adapted from OriginKit — https://originkit.dev (component "glow-border")

import React from "react"
import { cn } from "@/lib/utils"

const GLOW_CSS = `@property --kit-glow-angle {
  syntax: '<angle>';
  inherits: false;
  initial-value: 0deg;
}
@keyframes kit-glow-spin {
  to {
    --kit-glow-angle: 360deg;
  }
}
@media (prefers-reduced-motion: reduce) {
  [data-glow-border] .kit-glow-layer {
    animation: none !important;
  }
}`

export interface GlowBorderProps {
  children: React.ReactNode
  className?: string
  innerClassName?: string
  radius?: number
  borderWidth?: number
  colors?: string[]
  speed?: number
  mode?: "standard" | "multi"
  glow?: number
}

export function GlowBorder({
  children,
  className,
  innerClassName,
  radius = 28,
  borderWidth = 1.5,
  colors = ["hsl(195 100% 60%)", "hsl(265 70% 70%)"],
  speed = 8,
  mode = "standard",
  glow = 0.35,
}: GlowBorderProps): JSX.Element {
  const gradient =
    mode === "multi"
      ? `conic-gradient(from var(--kit-glow-angle), ${colors.join(", ")}, ${colors[0]})`
      : `conic-gradient(from var(--kit-glow-angle), ${colors[0]}, ${colors[1] ?? colors[0]}, ${colors[0]})`

  const innerRadius = Math.max(0, radius - borderWidth)

  return (
    <div
      data-glow-border=""
      className={cn("relative", className)}
      style={{
        borderRadius: `${radius}px`,
        padding: `${borderWidth}px`,
      }}
    >
      {/* dangerouslySetInnerHTML: React escapes text children, and a <style> is raw text in HTML */}
      <style dangerouslySetInnerHTML={{ __html: GLOW_CSS }} />

      {glow > 0 && (
        <div
          aria-hidden="true"
          data-glow-blur="true"
          className="kit-glow-layer pointer-events-none absolute -inset-[2px] -z-10"
          style={{
            borderRadius: `${radius + 2}px`,
            background: gradient,
            filter: "blur(18px)",
            opacity: glow,
            animation: `kit-glow-spin ${speed}s linear infinite`,
          }}
        />
      )}

      <div
        aria-hidden="true"
        className="kit-glow-layer pointer-events-none absolute inset-0 overflow-hidden"
        style={{
          borderRadius: `${radius}px`,
          background: gradient,
          animation: `kit-glow-spin ${speed}s linear infinite`,
        }}
      />

      <div
        className={cn(
          "relative z-10 h-full w-full bg-card text-card-foreground",
          innerClassName
        )}
        style={{
          borderRadius: `${innerRadius}px`,
        }}
      >
        {children}
      </div>
    </div>
  )
}

export default GlowBorder
