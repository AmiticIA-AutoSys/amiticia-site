import { useEffect, useState, type CSSProperties } from "react";
import { useReducedMotion } from "motion/react";
import { ClipboardList, MessageSquareText, PenLine, Scale, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { LiveChat } from "@/components/kit/originkit/live-chat";
import { briefing } from "../briefing";

/**
 * Hero illustration (DESIGN.md "Briefing card"): a WhatsApp chat with the office's AI assistant
 * that turns into an organized case for the lawyer, who decides to send or edit the ready reply.
 * Decorative and aria-hidden: the h1 and lead carry the meaning.
 *
 * Phases: "ssr" (server HTML and first client render: the final frame, so no-JS shows it whole),
 * "chat" (the chat is playing, the case fields wait as skeletons), "done" (fields fill in one by
 * one). Reduced motion goes straight to "done".
 */
type Phase = "ssr" | "chat" | "done";

/* WhatsApp dark skin, used only inside this illustration (not site tokens). */
const wa = {
  bg: "bg-[hsl(204_41%_7%)]",
  bar: "bg-[hsl(203_22%_16%)]",
  received: "bg-[hsl(203_22%_16%)] text-[hsl(200_14%_92%)]",
  sent: "bg-[hsl(169_100%_18%)] text-[hsl(200_14%_95%)]",
  time: "text-[hsl(200_12%_72%)]",
};

const styles = `
[data-briefing] [data-fill]{transition:opacity 520ms var(--ease),transform 520ms var(--ease);transition-delay:calc(var(--i,0) * 260ms + 200ms)}
[data-briefing] [data-skeleton]{opacity:0;transition:opacity 300ms var(--ease);transition-delay:calc(var(--i,0) * 260ms + 200ms)}
[data-briefing] [data-when="pending"]{display:none}
[data-briefing][data-phase="chat"] [data-fill],html.js [data-briefing][data-phase="ssr"] [data-fill]{opacity:0;transform:translateY(4px);transition:none}
[data-briefing][data-phase="chat"] [data-skeleton],html.js [data-briefing][data-phase="ssr"] [data-skeleton]{opacity:1;transition:none}
[data-briefing][data-phase="chat"] [data-when="pending"]{display:inline-flex}
[data-briefing][data-phase="chat"] [data-when="done"]{display:none}
html.js [data-briefing][data-phase="ssr"] [data-fill]{animation:patricia-fill-fallback 0s linear 2.5s forwards}
@keyframes patricia-fill-fallback{to{opacity:1;transform:none}}
@media (prefers-reduced-motion: reduce){
  [data-briefing] [data-fill]{opacity:1!important;transform:none!important;animation:none!important}
  [data-briefing] [data-skeleton]{opacity:0!important}
}`;

const order = (i: number) => ({ "--i": i }) as CSSProperties;

export const BriefingCard = ({ className }: { className?: string }) => {
  const reduceMotion = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("ssr");

  useEffect(() => {
    setPhase((p) => (reduceMotion ? "done" : p === "ssr" ? "chat" : p));
  }, [reduceMotion]);

  const fieldsEnd = briefing.fields.length;

  return (
    <div data-briefing="" data-phase={phase} aria-hidden="true" className={cn("relative", className)}>
      <style dangerouslySetInnerHTML={{ __html: styles }} />

      {/* Chat: the client's phone, the office's AI assistant answering. */}
      <div className="relative w-[92%] overflow-hidden rounded-[20px] border border-white/[0.07] shadow-[0_24px_60px_-24px_rgba(0,0,0,0.75)] sm:w-[330px]">
        <div className={cn("flex items-center gap-3 px-4 py-3", wa.bar)}>
          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-patricia/15 text-patricia">
            <Scale className="h-[18px] w-[18px]" />
          </span>
          <span className="min-w-0 leading-tight">
            <span className="block truncate text-[14px] font-semibold text-[hsl(200_14%_95%)]">{briefing.contact.name}</span>
            <span className={cn("block truncate text-[12px]", wa.time)}>{briefing.contact.status}</span>
          </span>
        </div>
        <LiveChat
          messages={briefing.chat}
          play={!reduceMotion}
          staggerSeconds={1.25}
          onComplete={() => setPhase("done")}
          className={cn("min-h-[300px] gap-2 px-3 pb-0 pt-4 font-[inherit]", wa.bg)}
          footer={
            <div className="-mx-3 mt-3 flex items-center gap-2 px-3 pb-3">
              <span className={cn("h-9 flex-1 rounded-full px-4 text-[13px] leading-9", wa.bar, wa.time)}>Mensagem</span>
            </div>
          }
          receivedBubbleClassName={cn("max-w-[86%] text-[13.5px] leading-snug", wa.received)}
          sentBubbleClassName={cn("max-w-[86%] text-[13.5px] leading-snug", wa.sent)}
          timeClassName={cn("opacity-100", wa.time)}
        />
      </div>

      {/* The lawyer's side: the organized case and the decision. */}
      <div className="relative -mt-8 ml-auto w-[92%] rounded-[20px] border border-border bg-surface-raised p-4 shadow-[var(--hairline),0_30px_70px_-24px_rgba(0,0,0,0.8)] sm:-mt-16 sm:w-[340px] md:-mt-[300px] lg:-mt-16 sm:p-5">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-patricia/15 text-patricia">
            <ClipboardList className="h-[18px] w-[18px]" />
          </span>
          <span className="whitespace-nowrap text-[15px] font-semibold text-foreground">{briefing.caseTitle}</span>
          <span className="ml-auto">
            <span
              data-when="pending"
              className="items-center gap-1.5 whitespace-nowrap rounded-full border border-border px-2.5 py-1 text-[11px] font-semibold text-muted-foreground"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-patricia/70 motion-safe:animate-pulse" />
              {briefing.caseStatus.pending}
            </span>
            <span
              data-when="done"
              className="inline-flex items-center whitespace-nowrap rounded-full border border-patricia/30 bg-patricia/10 px-2.5 py-1 text-[11px] font-semibold text-patricia"
            >
              {briefing.caseStatus.done}
            </span>
          </span>
        </div>

        <dl className="mt-4 grid gap-2.5 border-t border-border/70 pt-4">
          {briefing.fields.map((field, i) => (
            <div key={field.label} className="grid grid-cols-[100px_minmax(0,1fr)] items-baseline gap-3">
              <dt className="text-[11px] font-semibold uppercase tracking-[0.06em] text-subtle-foreground">{field.label}</dt>
              <dd className="relative text-[13.5px] leading-snug text-foreground">
                <span
                  data-skeleton=""
                  style={order(i)}
                  className="absolute left-0 top-1/2 h-2.5 w-3/4 -translate-y-1/2 rounded-full bg-white/[0.07]"
                />
                <span data-fill="" style={order(i)} className="relative block">
                  {field.value}
                </span>
              </dd>
            </div>
          ))}
        </dl>

        <div
          data-fill=""
          style={order(fieldsEnd)}
          className="mt-4 rounded-xl border border-patricia/25 bg-patricia/[0.07] p-3"
        >
          <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-patricia">
            <MessageSquareText className="h-3.5 w-3.5" />
            {briefing.replyLabel}
          </span>
          <span className="mt-1.5 block text-[13.5px] leading-snug text-muted-foreground">{briefing.reply}</span>
        </div>

        <div data-fill="" style={order(fieldsEnd + 1)} className="mt-3 flex gap-2">
          <span className="inline-flex h-9 items-center gap-1.5 rounded-full bg-patricia px-4 text-[13px] font-semibold text-[hsl(22_60%_10%)]">
            <Send className="h-3.5 w-3.5" />
            {briefing.actions.send}
          </span>
          <span className="inline-flex h-9 items-center gap-1.5 rounded-full border border-border px-4 text-[13px] font-semibold text-foreground">
            <PenLine className="h-3.5 w-3.5" />
            {briefing.actions.edit}
          </span>
        </div>
      </div>
    </div>
  );
};
