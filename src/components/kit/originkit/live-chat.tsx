// Adapted from OriginKit — https://originkit.dev (component "live-chat")

import React, { useEffect, useMemo, useRef, useState } from "react"
import { motion, MotionConfig, useReducedMotion } from "motion/react"
import { cn } from "@/lib/utils"

// Without JS the final frame stays visible; with JS, a 2.5 s fallback reveals it if the chat never starts.
const FALLBACK_CSS = `html.js [data-live-chat][data-phase="ssr"] [data-chat-item]{opacity:0;animation:kit-live-chat-fallback 0s linear 2.5s forwards}
@keyframes kit-live-chat-fallback{to{opacity:1}}
@media (prefers-reduced-motion: reduce){html.js [data-live-chat][data-phase="ssr"] [data-chat-item]{opacity:1;animation:none}}`

export type ChatMessage = {
  text: string
  sender: "me" | "them"
  time?: string
}

export interface LiveChatProps {
  messages: ChatMessage[]
  play?: boolean
  showTyping?: boolean
  staggerSeconds?: number
  loop?: boolean
  onComplete?: () => void
  className?: string
  sentBubbleClassName?: string
  receivedBubbleClassName?: string
  timeClassName?: string
  header?: React.ReactNode
  footer?: React.ReactNode
}

export function LiveChat({
  messages = [],
  play = true,
  showTyping = true,
  staggerSeconds = 0.9,
  loop = false,
  onComplete,
  className,
  sentBubbleClassName,
  receivedBubbleClassName,
  timeClassName,
  header,
  footer,
}: LiveChatProps): JSX.Element {
  const reduceMotion = useReducedMotion()
  const containerRef = useRef<HTMLDivElement>(null)

  // Keep onComplete in a ref so changes in function identity never restart playback
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  const messagesKey = useMemo(() => JSON.stringify(messages), [messages])
  const parsedMessages: ChatMessage[] = useMemo(() => {
    try {
      return JSON.parse(messagesKey) as ChatMessage[]
    } catch {
      return []
    }
  }, [messagesKey])
  const completedKeyRef = useRef<string | null>(null)

  // Hydration safety: "ssr" on server and initial client render
  const [phase, setPhase] = useState<"ssr" | "live" | "final">("ssr")
  const [visibleCount, setVisibleCount] = useState<number>(messages.length)
  const [isTyping, setIsTyping] = useState<boolean>(false)

  useEffect(() => {
    if (!play || reduceMotion) {
      setPhase("final")
      setVisibleCount(parsedMessages.length)
      setIsTyping(false)
      return
    }

    // If playback for these exact messages already completed, do not restart unless loop is active
    if (completedKeyRef.current === messagesKey && !loop) {
      setPhase("final")
      setVisibleCount(parsedMessages.length)
      setIsTyping(false)
      return
    }

    let active = true
    const timers: ReturnType<typeof setTimeout>[] = []

    const startPlayback = () => {
      setPhase("live")
      setVisibleCount(0)
      setIsTyping(false)

      let currentIndex = 0

      const step = () => {
        if (!active) return

        if (currentIndex >= parsedMessages.length) {
          setIsTyping(false)
          setPhase("final")
          completedKeyRef.current = messagesKey
          if (onCompleteRef.current) {
            onCompleteRef.current()
          }
          if (loop) {
            const loopTimer = setTimeout(() => {
              if (active) startPlayback()
            }, staggerSeconds * 1000)
            timers.push(loopTimer)
          }
          return
        }

        const msg = parsedMessages[currentIndex]
        const isThem = msg?.sender === "them"

        if (showTyping && isThem) {
          setIsTyping(true)
          const typingDuration = Math.min(staggerSeconds * 0.45, 0.5) * 1000
          const revealTimer = setTimeout(() => {
            if (!active) return
            setIsTyping(false)
            setVisibleCount(currentIndex + 1)
            currentIndex += 1

            const nextTimer = setTimeout(
              step,
              Math.max(0.1, staggerSeconds - typingDuration / 1000) * 1000
            )
            timers.push(nextTimer)
          }, typingDuration)
          timers.push(revealTimer)
        } else {
          setIsTyping(false)
          setVisibleCount(currentIndex + 1)
          currentIndex += 1
          const nextTimer = setTimeout(step, staggerSeconds * 1000)
          timers.push(nextTimer)
        }
      }

      step()
    }

    if (typeof IntersectionObserver === "undefined") {
      startPlayback()
      return () => {
        active = false
        timers.forEach(clearTimeout)
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry?.isIntersecting) {
          observer.disconnect()
          startPlayback()
        }
      },
      { threshold: 0.1 }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    } else {
      startPlayback()
    }

    return () => {
      active = false
      observer.disconnect()
      timers.forEach(clearTimeout)
    }
  }, [messagesKey, parsedMessages, play, reduceMotion, showTyping, staggerSeconds, loop])

  const displayedMessages = messages.slice(0, visibleCount)

  return (
    <MotionConfig reducedMotion="user">
      <div
        ref={containerRef}
        data-live-chat=""
        data-phase={phase}
        className={cn("flex flex-col gap-2 p-4", className)}
      >
        {/* dangerouslySetInnerHTML: React escapes text children, and a <style> is raw text in HTML */}
        <style dangerouslySetInnerHTML={{ __html: FALLBACK_CSS }} />

        {header && <div className="shrink-0">{header}</div>}

        <div className="flex flex-col gap-2 flex-1">
          {displayedMessages.map((msg, index) => {
            const isMe = msg.sender === "me"

            return (
              <motion.div
                key={index}
                data-chat-item=""
                initial={
                  phase === "live"
                    ? { opacity: 0, y: 8, scale: 0.96 }
                    : false
                }
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 450,
                  damping: 32,
                }}
                className={cn(
                  "flex w-full flex-col",
                  isMe ? "items-end" : "items-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[75%] rounded-2xl px-3.5 py-2 text-sm break-words",
                    isMe
                      ? "rounded-tr-sm bg-primary text-primary-foreground"
                      : "rounded-tl-sm bg-muted text-foreground",
                    isMe ? sentBubbleClassName : receivedBubbleClassName
                  )}
                >
                  <div>{msg.text}</div>
                  {msg.time && (
                    <div
                      className={cn(
                        "text-[10px] opacity-70 text-right mt-0.5",
                        timeClassName
                      )}
                    >
                      {msg.time}
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })}

          {isTyping && (
            <div
              aria-hidden="true"
              className="flex w-full items-start"
            >
              <div
                className={cn(
                  "flex items-center gap-1.5 rounded-2xl rounded-tl-sm px-4 py-2.5 bg-muted text-foreground",
                  receivedBubbleClassName
                )}
              >
                <span className="size-1.5 rounded-full bg-current opacity-60 motion-safe:animate-bounce" />
                <span className="size-1.5 rounded-full bg-current opacity-60 motion-safe:animate-bounce [animation-delay:0.18s]" />
                <span className="size-1.5 rounded-full bg-current opacity-60 motion-safe:animate-bounce [animation-delay:0.36s]" />
              </div>
            </div>
          )}
        </div>

        {footer && <div className="shrink-0">{footer}</div>}
      </div>
    </MotionConfig>
  )
}

export default LiveChat
