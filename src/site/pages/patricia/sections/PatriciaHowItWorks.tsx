import { PenLine, Send, ShieldAlert } from "lucide-react";
import type { PatriciaCopy } from "../../../copy/types";
import { Reveal, Section } from "../../../layout/primitives";
import { LeadIn } from "../../../layout/blocks";
import { briefing } from "../briefing";

/* Peach → amber: serious, not alarming. Amber is not a site token; it lives only in this callout. */
const amber = "36 90% 62%";

/** Step 3 echoes the hero card: the lawyer chooses between sending and editing. */
const Decision = () => (
  <span aria-hidden="true" className="mt-4 flex gap-2">
    <span className="inline-flex h-8 items-center gap-1.5 rounded-full bg-patricia px-3.5 text-[13px] font-semibold text-[hsl(22_60%_10%)]">
      <Send className="h-3.5 w-3.5" />
      {briefing.actions.send}
    </span>
    <span className="inline-flex h-8 items-center gap-1.5 rounded-full border border-border px-3.5 text-[13px] font-semibold text-foreground">
      <PenLine className="h-3.5 w-3.5" />
      {briefing.actions.edit}
    </span>
  </span>
);

export const PatriciaHowItWorks = ({ copy }: { copy: PatriciaCopy["howItWorks"] }) => (
  <Section className="border-t border-border/60">
    <Reveal>
      <h2 className="v2-h2">{copy.title}</h2>
    </Reveal>

    <ol className="relative mt-10 grid gap-8 md:mt-14 md:grid-cols-3 md:gap-8">
      <span
        aria-hidden="true"
        className="absolute bottom-8 left-[21px] top-6 w-px bg-gradient-to-b from-patricia/60 via-patricia/30 to-patricia/5 md:bottom-auto md:left-6 md:right-[12%] md:top-[21px] md:h-px md:w-auto md:bg-gradient-to-r"
      />
      {copy.steps.map((step, i) => (
        <Reveal as="li" key={step.title} delay={i * 80} className="relative flex gap-4 md:flex-col md:gap-5">
          <span className="relative z-10 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-patricia/70 bg-background text-[15px] font-bold tabular-nums text-patricia shadow-[0_0_0_6px_hsl(var(--background)),0_0_24px_-4px_hsl(var(--patricia)/0.45)]">
            {i + 1}
          </span>
          <div className="pt-2 md:pt-0">
            <p className="text-[17px] leading-relaxed text-muted-foreground">
              <LeadIn {...step} />
            </p>
            {i === copy.steps.length - 1 && <Decision />}
          </div>
        </Reveal>
      ))}
    </ol>

    <Reveal className="mt-14 md:mt-20">
      <div
        className="rounded-[20px] p-px"
        style={{ background: `linear-gradient(120deg, hsl(var(--patricia) / 0.75), hsl(${amber} / 0.45) 60%, hsl(var(--border)))` }}
      >
        <div
          className="flex flex-col gap-5 rounded-[19px] p-6 sm:flex-row sm:items-start md:p-8"
          style={{
            background: `radial-gradient(120% 140% at 0% 0%, hsl(var(--patricia) / 0.10), transparent 55%), hsl(var(--surface))`,
          }}
        >
          <span
            aria-hidden="true"
            className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border"
            style={{ color: `hsl(${amber})`, borderColor: `hsl(${amber} / 0.3)`, background: `hsl(${amber} / 0.1)` }}
          >
            <ShieldAlert className="h-6 w-6" />
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <h3 className="v2-h3">{copy.risk.title}</h3>
              <span
                aria-hidden="true"
                className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[12px] font-semibold uppercase tracking-[0.08em]"
                style={{ color: `hsl(${amber})`, borderColor: `hsl(${amber} / 0.35)`, background: `hsl(${amber} / 0.08)` }}
              >
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: `hsl(${amber})` }} />
                Prioridade
              </span>
            </div>
            <p className="mt-2 max-w-3xl text-[17px] text-muted-foreground">{copy.risk.body}</p>
          </div>
        </div>
      </div>
    </Reveal>
  </Section>
);
