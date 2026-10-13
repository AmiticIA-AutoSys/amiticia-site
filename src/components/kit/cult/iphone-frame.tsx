// Adapted from Cult UI — https://www.cult-ui.com/r/apple-iphone-17-pro.json (MIT)

import React, {
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from "react"
import { Wifi } from "lucide-react"
import { AnimatePresence, motion, MotionConfig } from "motion/react"

import { cn } from "@/lib/utils"

export type DynamicIslandSize =
  | "default"
  | "compact"
  | "expanded"
  | "large"
  | "ultra"

export interface IPhoneProps {
  /** Content to display on the screen */
  children?: ReactNode
  /** Dynamic Island size preset */
  dynamicIslandSize?: DynamicIslandSize
  /** Content to display inside the Dynamic Island when expanded */
  dynamicIslandContent?: ReactNode
  /** Frame color variant */
  frameColor?: "graphite" | "silver" | "gold" | "blue"
  /** Show status bar */
  showStatusBar?: boolean
  /** Show home indicator */
  showHomeIndicator?: boolean
  /** Custom time to display */
  time?: string
  /** Battery level (0-100) */
  batteryLevel?: number
  /** Signal strength (0-4) */
  signalStrength?: number
  /** Callback when Dynamic Island is tapped */
  onDynamicIslandTap?: () => void
  /** Callback when screen is tapped */
  onScreenTap?: () => void
  /** Height of the phone container, default min(700px, 85vh) */
  height?: string
  /** Screen theme variant */
  screenTheme?: "light" | "dark"
  /** Custom className for the screen element */
  screenClassName?: string
  /** Custom style for the container */
  style?: React.CSSProperties
  /** Custom className for the container */
  className?: string
}

const FRAME_COLORS = {
  graphite: {
    gradient:
      "linear-gradient(145deg, #454549 0%, #3d3d41 15%, #363839 30%, #3a3a3e 50%, #424246 70%, #3b3b3f 85%, #343438 100%)",
    button:
      "linear-gradient(180deg, #424246 0%, #3a3a3e 30%, #363839 50%, #3a3a3e 70%, #424246 100%)",
  },
  silver: {
    gradient:
      "linear-gradient(145deg, #e8e8e8 0%, #d4d4d4 15%, #c0c0c0 30%, #d0d0d0 50%, #e0e0e0 70%, #cccccc 85%, #b8b8b8 100%)",
    button:
      "linear-gradient(180deg, #e0e0e0 0%, #c8c8c8 30%, #b0b0b0 50%, #c8c8c8 70%, #e0e0e0 100%)",
  },
  gold: {
    gradient:
      "linear-gradient(145deg, #ff9544 0%, #f88535 15%, #F77E2D 30%, #f88535 50%, #ff9040 70%, #f88030 85%, #F77E2D 100%)",
    button:
      "linear-gradient(180deg, #ff9040 0%, #f88535 30%, #F77E2D 50%, #f88535 70%, #ff9040 100%)",
  },
  blue: {
    gradient:
      "linear-gradient(145deg, #3f4459 0%, #383c50 15%, #32374B 30%, #383c50 50%, #3d4256 70%, #363a4e 85%, #32374B 100%)",
    button:
      "linear-gradient(180deg, #3d4256 0%, #383c50 30%, #32374B 50%, #383c50 70%, #3d4256 100%)",
  },
}

type FrameColor = keyof typeof FRAME_COLORS

const LEFT_BUTTON_LIGHTING: Record<
  "graphite" | "gold",
  {
    beforeShadow: string
    afterClasses: string
    boxShadow: string
  }
> = {
  graphite: {
    beforeShadow:
      "before:shadow-[inset_0_1px_0_rgba(255,255,255,0.22),inset_1px_0_0_rgba(255,255,255,0.15),inset_0_-1px_0_rgba(0,0,0,0.28)]",
    afterClasses:
      "after:bg-gradient-to-b after:from-black/50 after:via-black/20 after:to-transparent",
    boxShadow: `
      -1px 0 0 0 rgba(255, 255, 255, 0.16),
      -2px 3px 5px -1px rgba(0, 0, 0, 0.34),
      -4px 5px 12px -2px rgba(0, 0, 0, 0.2),
      inset 1px 0 1px rgba(255, 255, 255, 0.12)
    `,
  },
  gold: {
    beforeShadow:
      "before:shadow-[inset_0_1px_0_rgba(255,228,195,0.5),inset_1px_0_0_rgba(255,240,215,0.3),inset_0_-1px_0_rgba(115,52,18,0.38)]",
    afterClasses:
      "after:bg-gradient-to-b after:from-[rgba(72,36,14,0.58)] after:via-[rgba(72,36,14,0.22)] after:to-transparent",
    boxShadow: `
      -1px 0 0 0 rgba(255, 246, 225, 0.24),
      -2px 3px 5px -1px rgba(48, 24, 8, 0.34),
      -4px 5px 12px -2px rgba(80, 40, 14, 0.2),
      inset 1px 0 1px rgba(255, 232, 205, 0.22)
    `,
  },
}

function leftRailLighting(frameColor: FrameColor) {
  return frameColor === "gold"
    ? LEFT_BUTTON_LIGHTING.gold
    : LEFT_BUTTON_LIGHTING.graphite
}

function LeftRailButton({
  frameColor,
  frameColorScheme,
  className,
}: {
  frameColor: FrameColor
  frameColorScheme: (typeof FRAME_COLORS)[FrameColor]
  className?: string
}) {
  const L = leftRailLighting(frameColor)
  return (
    <div
      aria-hidden="true"
      className={cn(
        "-left-[3px] absolute w-[3px] overflow-visible rounded-l-sm transition-shadow duration-200",
        "isolate",
        "before:pointer-events-none before:absolute before:inset-0 before:z-10 before:rounded-l-sm before:content-['']",
        L.beforeShadow,
        "after:-right-px after:-left-px after:pointer-events-none after:absolute after:top-[calc(100%-2px)] after:z-0 after:h-2.5 after:opacity-[0.72] after:blur-sm after:content-['']",
        L.afterClasses,
        className
      )}
      style={{
        background: frameColorScheme.button,
        boxShadow: L.boxShadow,
      }}
    />
  )
}

const DYNAMIC_ISLAND_SIZES = {
  default: { width: 110, height: 32, borderRadius: 16 },
  compact: { width: 90, height: 28, borderRadius: 14 },
  expanded: { width: 280, height: 56, borderRadius: 32 },
  large: { width: 290, height: 120, borderRadius: 32 },
  ultra: { width: 300, height: 180, borderRadius: 36 },
}

function getIslandMotionAnimate(size: DynamicIslandSize) {
  const c = DYNAMIC_ISLAND_SIZES[size]
  return {
    width: c.width,
    borderRadius: c.borderRadius,
    height: c.height,
  }
}

export function IPhone17ProMax({
  children,
  dynamicIslandSize = "default",
  dynamicIslandContent,
  frameColor = "graphite",
  showStatusBar = true,
  showHomeIndicator = true,
  time = "9:41",
  batteryLevel = 94,
  signalStrength = 2,
  onDynamicIslandTap,
  onScreenTap,
  height = "min(700px, 85vh)",
  screenTheme = "light",
  screenClassName,
  style,
  className = "",
}: IPhoneProps) {
  const isInteractive = Boolean(onScreenTap || onDynamicIslandTap)
  const isDark = screenTheme === "dark"
  const frameColorScheme = FRAME_COLORS[frameColor]

  return (
    <MotionConfig reducedMotion="user">
      <div className={cn("flex items-center justify-center p-4", className)}>
        {/* Phone Container - iPhone 17 Pro Max aspect ratio */}
        <div
          className="relative transition-transform duration-150 ease-out"
          style={{
            height,
            aspectRatio: "71.5 / 149.6",
            ...style,
          }}
        >
          {/* Outer Shadow */}
          <div
            aria-hidden="true"
            className="absolute inset-0 rounded-[55px]"
            style={{
              boxShadow:
                "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 12px 24px -8px rgba(0, 0, 0, 0.15)",
            }}
          />

          {/* Titanium Frame */}
          <div
            className="absolute inset-0 rounded-[55px]"
            style={{
              background: frameColorScheme.gradient,
              padding: "3px",
            }}
          >
            {/* Inner Black Bezel */}
            <div
              className="relative h-full w-full overflow-hidden rounded-[52px]"
              style={{
                background: "#0a0a0a",
                padding: "3px",
              }}
            >
              {/* Screen */}
              <div
                className={cn(
                  "relative h-full w-full overflow-hidden rounded-[49px] outline-none",
                  isDark ? "bg-neutral-950" : "bg-white",
                  isInteractive &&
                    "cursor-pointer focus-visible:ring-2 ring-ring ring-offset-2 ring-offset-background",
                  screenClassName
                )}
                {...(onScreenTap
                  ? {
                      role: "button" as const,
                      tabIndex: 0,
                      "aria-label": "Phone screen",
                      onKeyDown: (e: ReactKeyboardEvent<HTMLDivElement>) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault()
                          onScreenTap()
                        }
                      },
                    }
                  : {})}
                {...(isInteractive
                  ? {
                      onClick: (e) => {
                        e.stopPropagation()
                        if (onScreenTap) {
                          onScreenTap()
                          return
                        }
                        if (onDynamicIslandTap) {
                          onDynamicIslandTap()
                        }
                      },
                    }
                  : {})}
              >
                {/* Status Bar */}
                {showStatusBar && (
                  <div
                    aria-hidden="true"
                    className={cn(
                      "absolute top-0 right-0 left-0 z-10 flex items-center justify-between px-6 pt-4 font-medium text-xs select-none",
                      isDark ? "text-white" : "text-black"
                    )}
                  >
                    {/* Left side - Time */}
                    <div className="mt-1 ml-1 flex w-14 items-center gap-1">
                      <span className="font-semibold text-[14px] tracking-tight">
                        {time}
                      </span>
                    </div>

                    {/* Right side - Signal, WiFi, Battery */}
                    <div className="flex w-17 items-center justify-end gap-[5px]">
                      {/* Signal Bars */}
                      <div className="flex items-end gap-px">
                        {[1, 2, 3, 4].map((i) => (
                          <div
                            className={cn(
                              "w-[3px] rounded-[1px]",
                              isDark ? "bg-white" : "bg-black",
                              i <= signalStrength ? "opacity-100" : "opacity-30"
                            )}
                            key={i}
                            style={{
                              height: `${3 + i * 2}px`,
                              opacity: i <= signalStrength ? 1 : 0.3,
                            }}
                          />
                        ))}
                      </div>
                      <Wifi
                        className={cn(
                          "size-3.5",
                          isDark ? "text-white" : "text-black"
                        )}
                        size={13}
                        strokeWidth={2}
                      />
                      {/* Battery */}
                      <div className="relative flex items-center">
                        <div
                          className={cn(
                            "relative h-[12px] w-[24px] rounded-[4px] border ring-1",
                            isDark
                              ? "border-white/30 ring-white/10"
                              : "border-gray-900/20 ring-white/5"
                          )}
                        >
                          <div
                            className={cn(
                              "absolute top-[1.2px] bottom-px left-[1.2px] rounded-[2.5px] transition-all",
                              isDark ? "bg-white" : "bg-gray-950/90"
                            )}
                            style={{
                              width: `${Math.max(0, Math.min(100, batteryLevel)) * 0.19}px`,
                            }}
                          />
                        </div>
                        <div
                          className={cn(
                            "ml-[0.5px] h-[5px] w-[1.5px] rounded-r-sm",
                            isDark ? "bg-white/40" : "bg-black/40"
                          )}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Dynamic Island */}
                <motion.div
                  animate={getIslandMotionAnimate(dynamicIslandSize)}
                  className={cn(
                    "absolute top-3 z-20 flex items-center justify-center overflow-hidden bg-black",
                    onDynamicIslandTap && "cursor-pointer",
                    dynamicIslandSize === "expanded"
                      ? "-translate-x-1/2 left-1/2 max-w-[calc(100%-18px)]"
                      : "-translate-x-1/2 left-1/2"
                  )}
                  {...(onDynamicIslandTap
                    ? {
                        onClick: (e) => {
                          e.stopPropagation()
                          onDynamicIslandTap()
                        },
                      }
                    : {})}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 30,
                  }}
                >
                  <AnimatePresence mode="wait">
                    {dynamicIslandSize === "default" ||
                    dynamicIslandSize === "compact" ? (
                      <motion.div
                        animate={{ opacity: 1 }}
                        className="absolute right-3"
                        exit={{ opacity: 0 }}
                        initial={{ opacity: 0 }}
                        key="camera"
                      >
                        <div
                          className="h-[10px] w-[10px] rounded-full"
                          style={{
                            background:
                              "radial-gradient(circle at 30% 30%, #2a3a5a 0%, #0f1520 60%, #000 100%)",
                            boxShadow: "inset 0 0 2px rgba(100, 150, 255, 0.3)",
                          }}
                        />
                      </motion.div>
                    ) : (
                      <motion.div
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex h-full w-full items-center justify-center p-3 text-white"
                        exit={{ opacity: 0, scale: 0.8 }}
                        initial={{ opacity: 0, scale: 0.8 }}
                        key="content"
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 30,
                        }}
                      >
                        {dynamicIslandContent || null}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Screen Content Area */}
                <div className="absolute inset-0 flex flex-col pt-14 overflow-hidden rounded-[49px]">
                  {children}
                </div>

                {/* Home Indicator */}
                {showHomeIndicator && (
                  <div
                    aria-hidden="true"
                    className="-translate-x-1/2 absolute bottom-2 left-1/2"
                  >
                    <div
                      className={cn(
                        "h-1 w-32 rounded-full",
                        isDark ? "bg-white/80" : "bg-black/80"
                      )}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Side Buttons - Right Side (Power Button) */}
          <div
            aria-hidden="true"
            className="-right-[3px] absolute top-[28%] h-[65px] w-[3px] rounded-r-sm transition-shadow duration-200"
            style={{
              background: frameColorScheme.button,
              boxShadow: `
                1px 0 0 0 rgba(255, 255, 255, 0.15),
                2px 1px 3px -1px rgba(0, 0, 0, 0.25),
                3px 2px 6px 0 rgba(0, 0, 0, 0.15),
                inset -1px 0 1px rgba(255, 255, 255, 0.1)
              `,
            }}
          />

          {/* Side Buttons - Left Side */}
          <LeftRailButton
            className="top-[20%] h-[22px]"
            frameColor={frameColor}
            frameColorScheme={frameColorScheme}
          />
          <LeftRailButton
            className="top-[27%] h-[40px]"
            frameColor={frameColor}
            frameColorScheme={frameColorScheme}
          />
          <LeftRailButton
            className="top-[36%] h-[40px]"
            frameColor={frameColor}
            frameColorScheme={frameColorScheme}
          />

          {/* Frame Highlights */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-[55px]"
            style={{
              background: `linear-gradient(
                135deg,
                rgba(255, 255, 255, 0.15) 0%,
                transparent 25%,
                transparent 75%,
                rgba(0, 0, 0, 0.1) 100%
              )`,
            }}
          />
        </div>
      </div>
    </MotionConfig>
  )
}

export default IPhone17ProMax
