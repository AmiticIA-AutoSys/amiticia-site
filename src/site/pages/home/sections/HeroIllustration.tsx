import { useEffect, useState, type ReactNode } from "react";
import { useReducedMotion } from "motion/react";
import { ArrowRight, BadgeCheck, CheckCheck, FileText, UserCheck } from "lucide-react";
import { LiveChat } from "@/components/kit/originkit/live-chat";
import { SquigglyArrow } from "@/components/kit/cult/squiggle-arrow";
import { cn } from "@/lib/utils";
import { patriciaDemo, productTint, wahubDemo } from "../demo";

/*
 * Staging: items marked data-at="1|2|3" appear when the root carries the class s1/s2/s3.
 * They are hidden only under html.js; before the app mounts a CSS fallback (site.css
 * v2-reveal-fallback) shows them after 2.5 s, and reduced motion shows them at once.
 */
const stageCss = `
html.js [data-hero-illustration] [data-at]{opacity:0;transform:translateY(10px);transition:opacity 600ms var(--ease),transform 600ms var(--ease)}
html.js:not(.v2-ready) [data-hero-illustration] [data-at]{animation:v2-reveal-fallback 1ms linear 2.5s forwards}
html [data-hero-illustration].s1 [data-at="1"],html [data-hero-illustration].s2 [data-at="2"],html [data-hero-illustration].s3 [data-at="3"]{opacity:1;transform:none;animation:none}
@media (prefers-reduced-motion: reduce){html.js [data-hero-illustration] [data-at]{opacity:1;transform:none;animation:none;transition:none}}
`;

const STEP_MS = 650;

const Tag = ({ product, children }: { product: keyof typeof productTint; children: ReactNode }) => (
  <span
    className={cn(
      "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-bold",
      productTint[product].text,
    )}
    style={{ borderColor: `color-mix(in srgb, ${productTint[product].color} 40%, transparent)` }}
  >
    <span className="h-1.5 w-1.5 rounded-full" style={{ background: productTint[product].gradient }} />
    {children}
  </span>
);

const Field = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-baseline justify-between gap-3 text-[12px] leading-snug">
    <span className="shrink-0 text-subtle-foreground">{label}</span>
    <span className="text-right font-medium text-foreground/90">{value}</span>
  </div>
);

const ChatHeader = ({ initial, name, sub, tint }: { initial: string; name: string; sub: string; tint: string }) => (
  <div className="flex items-center gap-2.5 border-b border-border/80 px-4 py-2.5">
    <span
      className="inline-flex h-7 w-7 items-center justify-center rounded-full text-[12px] font-bold text-background"
      style={{ background: tint }}
    >
      {initial}
    </span>
    <span className="leading-tight">
      <span className="block text-[13px] font-semibold">{name}</span>
      <span className="block text-[11px] text-subtle-foreground">{sub}</span>
    </span>
  </div>
);

const cardClass =
  "relative rounded-[20px] border border-border bg-surface-raised/95 shadow-[var(--hairline),0_24px_60px_-28px_rgba(0,0,0,0.8)] backdrop-blur";

/**
 * "A conversa que vira negócio" in miniature: two flows, each message → result.
 * WaHub: a WhatsApp exchange with Ricardo becomes a qualified lead; Patrícia: one client
 * message becomes an organized case. Decorative: aria-hidden, built in code (DESIGN.md rule 8).
 */
export const HeroIllustration = ({ className }: { className?: string }) => {
  const reduce = useReducedMotion();
  const [chatDone, setChatDone] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (reduce) {
      setStep(3);
      return;
    }
    if (!chatDone) return;
    setStep(1);
    const t2 = setTimeout(() => setStep(2), STEP_MS);
    const t3 = setTimeout(() => setStep(3), STEP_MS * 2);
    return () => {
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [chatDone, reduce]);

  return (
    <div
      aria-hidden="true"
      data-hero-illustration=""
      className={cn("relative mx-auto w-full max-w-[480px]", step >= 1 && "s1", step >= 2 && "s2", step >= 3 && "s3", className)}
    >
      <style>{stageCss}</style>

      {/* Flow 1 — WaHub: WhatsApp chat → qualified lead */}
      <div className={cn(cardClass, "w-[88%] overflow-hidden sm:w-[80%]")}>
        <ChatHeader initial="R" name={wahubDemo.contact} sub={wahubDemo.status} tint={productTint.wahub.gradient} />
        <LiveChat
          messages={wahubDemo.chat}
          staggerSeconds={1}
          onComplete={() => setChatDone(true)}
          className="gap-1.5 p-3 font-[inherit] text-[13px]"
          receivedBubbleClassName="bg-surface text-foreground/95 text-[13px] leading-snug"
          sentBubbleClassName="bg-[hsl(243_45%_26%)] text-foreground text-[13px] leading-snug"
          timeClassName="text-[10px] opacity-100 text-[hsl(225_30%_80%)]"
        />
      </div>

      <SquigglyArrow
        width={96}
        height={48}
        strokeWidth={2}
        direction="right"
        variant="smooth"
        className="absolute left-[4%] top-[248px] hidden rotate-[18deg] text-[hsl(243_90%_80%)] opacity-80 lg:block"
      />
      <SquigglyArrow
        width={96}
        height={48}
        strokeWidth={2}
        direction="right"
        variant="smooth"
        className="absolute bottom-[64px] left-[2%] hidden rotate-[18deg] text-patricia opacity-80 lg:block"
      />

      <div data-at="1" className="relative z-10 -mt-3 ml-auto w-[78%] sm:w-[64%]">
        <div className={cn(cardClass, "p-4")}>
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 text-[13px] font-bold">
              <BadgeCheck className="h-4 w-4 text-[hsl(243_90%_80%)]" />
              {wahubDemo.lead.title}
            </span>
            <Tag product="wahub">WaHub</Tag>
          </div>
          <p className="mt-2.5 text-[14px] font-semibold">{wahubDemo.lead.name}</p>
          <div className="mt-1.5 space-y-1">
            {wahubDemo.lead.fields.map(([label, value]) => (
              <Field key={label} label={label} value={value} />
            ))}
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-x-1.5 gap-y-2 text-[11px] font-semibold">
            <span className="rounded-full bg-foreground/[0.06] px-2 py-0.5 text-muted-foreground">{wahubDemo.lead.from}</span>
            <ArrowRight className="h-3 w-3 text-subtle-foreground" />
            <span className="rounded-full px-2 py-0.5 text-foreground" style={{ background: "hsl(var(--wahub) / 0.28)" }}>
              {wahubDemo.lead.to}
            </span>
            <span className="ml-auto inline-flex items-center gap-1 whitespace-nowrap text-muted-foreground">
              <UserCheck className="h-3.5 w-3.5" />
              {wahubDemo.lead.handoff}
            </span>
          </div>
        </div>
      </div>

      {/* Flow 2 — Patrícia: one client message → organized case */}
      <div data-at="2" className="relative mt-5 w-[84%] sm:w-[72%]">
        <div className={cn(cardClass, "px-3 py-3")}>
          <div className="flex items-start gap-2.5">
            <span
              className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[12px] font-bold text-background"
              style={{ background: productTint.patricia.gradient }}
            >
              C
            </span>
            <div className="max-w-full rounded-2xl rounded-tl-sm bg-surface px-3.5 py-2 text-[13px] leading-snug text-foreground/95">
              {patriciaDemo.message}
              <span className="mt-0.5 flex items-center justify-end gap-1 text-[10px] text-[hsl(225_30%_80%)]">
                {patriciaDemo.time}
                <CheckCheck className="h-3 w-3" />
              </span>
            </div>
          </div>
        </div>
      </div>

      <div data-at="3" className="relative z-10 -mt-2 ml-auto w-[86%] sm:w-[70%]">
        <div className={cn(cardClass, "p-4")}>
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 text-[13px] font-bold">
              <FileText className="h-4 w-4 text-patricia" />
              {patriciaDemo.case.title}
            </span>
            <Tag product="patricia">Patrícia</Tag>
          </div>
          <div className="mt-2.5 space-y-1">
            {patriciaDemo.case.fields.slice(0, 3).map(([label, value]) => (
              <Field key={label} label={label} value={value} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
