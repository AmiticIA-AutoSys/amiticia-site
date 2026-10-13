// Adapted from OriginKit — https://originkit.dev (component "type-sequence")

import React, { useEffect, useMemo, useState } from "react"
import { useReducedMotion } from "motion/react"
import { cn } from "@/lib/utils"

export interface TypeSequenceProps {
  words: string[]
  className?: string
  cursorClassName?: string
  typeSpeedMs?: number
  deleteSpeedMs?: number
  holdMs?: number
}

type Phase = "holding" | "deleting" | "typing"

export function TypeSequence({
  words = [],
  className,
  cursorClassName,
  typeSpeedMs = 55,
  deleteSpeedMs = 35,
  holdMs = 1800,
}: TypeSequenceProps): JSX.Element {
  const reduceMotion = useReducedMotion() ?? false

  const safeWords = useMemo(() => {
    return words.length > 0 ? words : [""]
  }, [words])

  const initialWord = safeWords[0] ?? ""

  const longestWord = useMemo(() => {
    return safeWords.reduce((a, b) => (b.length > a.length ? b : a), "")
  }, [safeWords])

  const [wordIndex, setWordIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(initialWord.length)
  const [phase, setPhase] = useState<Phase>("holding")
  const [cursorVisible, setCursorVisible] = useState(true)

  useEffect(() => {
    if (reduceMotion) {
      setWordIndex(0)
      setCharIndex(initialWord.length)
      setPhase("holding")
      setCursorVisible(true)
      return
    }

    const cursorInterval = setInterval(() => {
      setCursorVisible((v) => !v)
    }, 530)

    return () => clearInterval(cursorInterval)
  }, [reduceMotion, initialWord.length])

  useEffect(() => {
    if (reduceMotion || safeWords.length <= 1) return

    let timer: ReturnType<typeof setTimeout>
    const currentWord = safeWords[wordIndex] ?? ""

    if (phase === "holding") {
      timer = setTimeout(() => {
        setPhase("deleting")
      }, holdMs)
    } else if (phase === "deleting") {
      if (charIndex > 0) {
        timer = setTimeout(() => {
          setCharIndex((c) => c - 1)
        }, deleteSpeedMs)
      } else {
        setWordIndex((w) => (w + 1) % safeWords.length)
        setPhase("typing")
      }
    } else if (phase === "typing") {
      if (charIndex < currentWord.length) {
        timer = setTimeout(() => {
          setCharIndex((c) => c + 1)
        }, typeSpeedMs)
      } else {
        setPhase("holding")
      }
    }

    return () => clearTimeout(timer)
  }, [
    charIndex,
    phase,
    wordIndex,
    safeWords,
    reduceMotion,
    holdMs,
    deleteSpeedMs,
    typeSpeedMs,
  ])

  const currentWord = safeWords[wordIndex] ?? ""
  const displayedText = currentWord.slice(0, charIndex)

  return (
    <span className={cn("inline-grid items-baseline", className)}>
      {/* Screen reader text: stable words[0] */}
      <span className="sr-only">{initialWord}</span>

      {/* Invisible sizer reserving space for the longest word with cursor */}
      <span
        aria-hidden="true"
        className="invisible col-start-1 row-start-1 select-none pointer-events-none"
      >
        {longestWord}
        <span
          className={cn(
            "ml-0.5 inline-block w-[2px] h-[1em] align-middle opacity-0",
            cursorClassName
          )}
        >
          |
        </span>
      </span>

      {/* Visible animated text */}
      <span aria-hidden="true" className="col-start-1 row-start-1" data-slot="visible-text">
        {displayedText}
        <span
          className={cn(
            "ml-0.5 inline-block w-[2px] h-[1em] align-middle bg-current transition-opacity duration-100",
            cursorVisible ? "opacity-100" : "opacity-0",
            cursorClassName
          )}
        />
      </span>
    </span>
  )
}

export default TypeSequence
