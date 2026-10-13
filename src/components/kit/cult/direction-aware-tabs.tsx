// Adapted from Cult UI — https://www.cult-ui.com/r/direction-aware-tabs.json (MIT)

import React, { ReactNode, useEffect, useId, useMemo, useRef, useState } from "react"
import { AnimatePresence, motion, MotionConfig } from "motion/react"
import { cn } from "@/lib/utils"

export type Tab = {
  id: number
  label: string
  content: ReactNode
}

export interface DirectionAwareTabsProps {
  tabs: Tab[]
  className?: string
  /** Outer container radius (e.g. `rounded-lg`) */
  rounded?: string
  /** Inner tab/bubble radius — should be outer radius minus container padding (~3px) */
  roundedInner?: string
  onChange?: (id: number) => void
  ariaLabel?: string
}

function useSafeMeasure() {
  const ref = useRef<HTMLDivElement>(null)
  const [bounds, setBounds] = useState({ height: 0, width: 0 })

  useEffect(() => {
    if (!ref.current || typeof ResizeObserver === "undefined") return
    const ro = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (entry) {
        setBounds({
          height: entry.contentRect.height,
          width: entry.contentRect.width,
        })
      }
    })
    ro.observe(ref.current)
    return () => ro.disconnect()
  }, [])

  return [ref, bounds] as const
}

export function DirectionAwareTabs({
  tabs,
  className,
  rounded,
  roundedInner,
  onChange,
  ariaLabel = "Abas",
}: DirectionAwareTabsProps) {
  const baseId = useId()
  const [activeTab, setActiveTab] = useState(0)
  const [direction, setDirection] = useState(0)
  const [ref, bounds] = useSafeMeasure()

  const content = useMemo(() => {
    const activeTabContent = tabs.find((tab) => tab.id === activeTab)?.content
    return activeTabContent || null
  }, [activeTab, tabs])

  const handleTabClick = (newTabId: number) => {
    if (newTabId !== activeTab) {
      const newDirection = newTabId > activeTab ? 1 : -1
      setDirection(newDirection)
      setActiveTab(newTabId)
      if (onChange) onChange(newTabId)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    let nextIndex = -1
    if (e.key === "ArrowRight") {
      nextIndex = (index + 1) % tabs.length
    } else if (e.key === "ArrowLeft") {
      nextIndex = (index - 1 + tabs.length) % tabs.length
    } else if (e.key === "Home") {
      nextIndex = 0
    } else if (e.key === "End") {
      nextIndex = tabs.length - 1
    }

    if (nextIndex >= 0) {
      e.preventDefault()
      const nextTab = tabs[nextIndex]
      if (nextTab) {
        handleTabClick(nextTab.id)
        const nextButton = document.getElementById(`${baseId}-tab-${nextTab.id}`)
        nextButton?.focus()
      }
    }
  }

  const variants = {
    initial: (dir: number) => ({
      x: 300 * dir,
      opacity: 0,
      filter: "blur(4px)",
    }),
    active: {
      x: 0,
      opacity: 1,
      filter: "none",
    },
    exit: (dir: number) => ({
      x: -300 * dir,
      opacity: 0,
      filter: "blur(4px)",
    }),
  }

  return (
    <MotionConfig reducedMotion="user" transition={{ duration: 0.4, type: "spring", bounce: 0.2 }}>
      <div className="flex w-full flex-col items-center">
        <div
          role="tablist"
          aria-label={ariaLabel}
          className={cn(
            "flex cursor-pointer space-x-1 rounded-full border border-border bg-muted/60 p-1 backdrop-blur-sm",
            className,
            rounded
          )}
        >
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              role="tab"
              id={`${baseId}-tab-${tab.id}`}
              aria-selected={activeTab === tab.id}
              aria-controls={`${baseId}-tabpanel-${tab.id}`}
              tabIndex={activeTab === tab.id ? 0 : -1}
              onClick={() => handleTabClick(tab.id)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className={cn(
                "relative flex min-h-[44px] items-center justify-center gap-2 rounded-full px-4 py-2 text-xs font-medium text-muted-foreground transition focus-visible:ring-2 ring-ring ring-offset-2 ring-offset-background outline-none sm:text-sm",
                activeTab === tab.id
                  ? "text-foreground font-semibold"
                  : "hover:text-foreground",
                rounded ? roundedInner : undefined
              )}
              style={{ WebkitTapHighlightColor: "transparent" }}
            >
              {activeTab === tab.id && (
                <motion.span
                  layoutId={`${baseId}-bubble`}
                  className={cn(
                    "absolute inset-0 z-10 border border-border bg-background shadow-sm",
                    rounded ? roundedInner : "rounded-full"
                  )}
                  transition={{ type: "spring", bounce: 0.19, duration: 0.4 }}
                />
              )}

              <span className="relative z-20">{tab.label}</span>
            </button>
          ))}
        </div>

        <motion.div
          className="relative mx-auto h-full w-full overflow-hidden"
          initial={false}
          animate={{ height: bounds.height > 0 ? bounds.height : "auto" }}
        >
          <div className="p-1" ref={ref}>
            <AnimatePresence
              initial={false}
              custom={direction}
              mode="popLayout"
            >
              <motion.div
                key={activeTab}
                role="tabpanel"
                id={`${baseId}-tabpanel-${activeTab}`}
                aria-labelledby={`${baseId}-tab-${activeTab}`}
                tabIndex={0}
                variants={variants}
                initial="initial"
                animate="active"
                exit="exit"
                custom={direction}
                className="outline-none focus-visible:ring-2 ring-ring ring-offset-2 ring-offset-background rounded-lg"
              >
                {content}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </MotionConfig>
  )
}

export default DirectionAwareTabs
