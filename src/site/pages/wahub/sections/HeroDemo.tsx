import { useCallback, useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";
import { ArrowRight, ChevronLeft, Mic, Plus, Sparkles, UserCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { IPhone17ProMax } from "@/components/kit/cult/iphone-frame";
import { LiveChat } from "@/components/kit/originkit/live-chat";
import { SquigglyArrow } from "@/components/kit/cult/squiggle-arrow";
import { TextureOverlay } from "@/components/kit/cult/texture-overlay";
import { heroChat, heroLead } from "../demo";

/* WhatsApp dark palette: the phone screen imitates the app, so these colours are the app's,
 * not site tokens. Outgoing teal is WhatsApp's own bubble, never an action colour. */
const wa = {
  wallpaper: "#0B141A",
  bar: "#202C33",
  incoming: "#202C33",
  outgoing: "#005C4B",
  meta: "#8696A0",
  text: "#E9EDEF",
};

/*
 * Lead card visibility. Server HTML: visible (no JS → the final frame, DESIGN.md rule 3).
 * With JS it waits hidden for the chat to finish; a 2.5 s fallback shows it if the bundle never
 * mounts, and reduced motion always shows it.
 */
const leadCardCss = `html.js [data-lead-card][data-state="hidden"]{opacity:0;transform:translateY(14px) scale(.96)}
html.js:not(.v2-ready) [data-lead-card][data-state="hidden"]{animation:wahub-lead-fallback 1ms linear 2.5s forwards}
[data-lead-card]{transition:opacity 600ms cubic-bezier(.22,1,.36,1),transform 600ms cubic-bezier(.22,1,.36,1)}
@keyframes wahub-lead-fallback{to{opacity:1;transform:none}}
@media (prefers-reduced-motion: reduce){html.js [data-lead-card][data-state="hidden"]{opacity:1;transform:none;animation:none}}`;

const ChatHeader = () => (
  <div className="flex items-center gap-2.5 px-3 pb-2.5 pt-1" style={{ background: wa.bar, color: wa.text }}>
    <ChevronLeft className="h-5 w-5 shrink-0 opacity-80" aria-hidden="true" />
    <span
      aria-hidden="true"
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-wahub to-wahub-2 text-[13px] font-bold text-white"
    >
      ÓL
    </span>
    <span className="min-w-0 leading-tight">
      <span className="block truncate text-[14px] font-semibold">{heroChat.business}</span>
      <span className="block text-[11px]" style={{ color: wa.meta }}>
        {heroChat.status}
      </span>
    </span>
  </div>
);

const ChatComposer = () => (
  <div className="flex items-center gap-2 px-2.5 pb-7 pt-2" style={{ background: wa.wallpaper }}>
    <span className="flex h-9 min-w-0 flex-1 items-center gap-2 rounded-full px-3" style={{ background: wa.bar }}>
      <Plus className="h-4 w-4 shrink-0" style={{ color: wa.meta }} aria-hidden="true" />
      <span className="truncate text-[13px]" style={{ color: wa.meta }}>
        {heroChat.composer}
      </span>
    </span>
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full" style={{ background: wa.bar }}>
      <Mic className="h-4 w-4" style={{ color: wa.meta }} aria-hidden="true" />
    </span>
  </div>
);

export const LeadCard = ({ shown, className }: { shown: boolean; className?: string }) => (
  <div
    data-lead-card=""
    data-testid="wahub-lead-card"
    data-state={shown ? "shown" : "hidden"}
    className={cn(
      "w-[248px] rounded-[20px] border border-wahub/40 bg-surface-raised/95 p-4 shadow-[var(--hairline),0_24px_60px_-20px_hsl(var(--wahub)/0.6)] backdrop-blur-md",
      className,
    )}
  >
    <span className="inline-flex items-center gap-1.5 rounded-full bg-wahub/15 px-2.5 py-1 text-[12px] font-semibold text-[hsl(243_100%_84%)]">
      <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
      {heroLead.badge}
    </span>
    <p className="mt-3 text-[16px] font-bold leading-tight text-foreground">{heroLead.name}</p>
    <dl className="mt-3 grid gap-1.5 text-[13px] leading-snug">
      {heroLead.fields.map((f) => (
        <div key={f.label} className="flex justify-between gap-3">
          <dt className="text-subtle-foreground">{f.label}</dt>
          <dd className="text-right font-medium text-foreground">{f.value}</dd>
        </div>
      ))}
      <div className="flex items-center justify-between gap-3">
        <dt className="text-subtle-foreground">{heroLead.stageLabel}</dt>
        <dd className="inline-flex items-center gap-1 font-medium">
          <span className="text-muted-foreground">{heroLead.stageFrom}</span>
          <ArrowRight className="h-3 w-3 text-muted-foreground" aria-hidden="true" />
          <span className="text-[hsl(243_100%_84%)]">{heroLead.stageTo}</span>
        </dd>
      </div>
    </dl>
    <p className="mt-3 flex items-center gap-2 border-t border-border pt-3 text-[13px] font-semibold text-foreground">
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-wahub/20">
        <UserCheck className="h-3.5 w-3.5 text-[hsl(243_100%_84%)]" aria-hidden="true" />
      </span>
      {heroLead.handoff}
    </p>
  </div>
);

/**
 * The hero visual: a WhatsApp chat on the customer's phone that plays once when it scrolls in;
 * when it ends, the qualified lead pops out beside the phone. Decorative (aria-hidden): the
 * copy beside it says the same in words.
 */
export const HeroDemo = ({ className }: { className?: string }) => {
  const reduceMotion = useReducedMotion();
  const [shown, setShown] = useState(false);
  const onComplete = useCallback(() => setShown(true), []);

  useEffect(() => {
    if (reduceMotion) setShown(true);
  }, [reduceMotion]);

  return (
    <div
      aria-hidden="true"
      data-wahub-hero-visual=""
      className={cn(
        "relative mx-auto w-full max-w-[360px] pb-[88px] [--phone-h:520px] lg:pb-0 sm:max-w-[520px] md:[--phone-h:540px] lg:max-w-none lg:[--phone-h:560px]",
        className,
      )}
    >
      <style>{leadCardCss}</style>
      {/* Indigo → violet glow and grain behind the phone. */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[120%] w-[150%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl"
        style={{
          background:
            "radial-gradient(closest-side, hsl(var(--wahub) / 0.45), hsl(var(--wahub-2) / 0.18) 55%, transparent)",
        }}
      />
      <TextureOverlay
        texture="noise"
        opacity={0.05}
        className="bg-[radial-gradient(circle_at_2px_2px,rgba(255,255,255,0.9)_1px,transparent_0)] [mask-image:radial-gradient(closest-side,black,transparent)]"
      />

      <div className="relative flex justify-center lg:justify-start lg:pl-[4%] xl:pl-[8%]">
        <IPhone17ProMax
          height="var(--phone-h)"
          screenTheme="dark"
          time="9:41"
          signalStrength={3}
          className="p-0"
          screenClassName="!bg-[#0B141A]"
        >
          <ChatHeader />
          <LiveChat
            messages={heroChat.messages}
            staggerSeconds={1.05}
            onComplete={onComplete}
            className="min-h-0 flex-1 gap-1.5 overflow-hidden px-2.5 py-2 [&>div]:min-h-0 [&>div]:justify-end"
            sentBubbleClassName="!max-w-[82%] !rounded-[10px] !rounded-tr-[3px] !px-2.5 !py-1.5 !text-[12.5px] !leading-snug !text-[#E9EDEF] !bg-[#005C4B] shadow-sm"
            receivedBubbleClassName="!max-w-[82%] !rounded-[10px] !rounded-tl-[3px] !px-2.5 !py-1.5 !text-[12.5px] !leading-snug !text-[#E9EDEF] !bg-[#202C33] shadow-sm"
            timeClassName="!text-[10px] !opacity-100 text-[#8696A0]"
          />
          <ChatComposer />
        </IPhone17ProMax>
      </div>

      {/* Desktop: hand-drawn arrow from the chat to the lead. */}
      <SquigglyArrow
        width={150}
        height={75}
        strokeWidth={3}
        variant="bouncy"
        className={cn(
          "absolute right-[22%] top-[34%] hidden rotate-[24deg] text-[hsl(243_100%_80%)] transition-opacity duration-[600ms] lg:block xl:right-[25%]",
          shown ? "opacity-100" : "opacity-0",
        )}
      />
      <LeadCard
        shown={shown}
        className="absolute bottom-0 right-0 z-10 sm:right-[6%] lg:bottom-[14%] lg:right-0"
      />
    </div>
  );
};
