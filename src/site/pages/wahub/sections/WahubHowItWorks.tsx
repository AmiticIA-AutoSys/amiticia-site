import { Bot, MessageCircle, SquareKanban, type LucideIcon } from "lucide-react";
import type { WahubCopy } from "../../../copy/types";
import { Reveal, Section } from "../../../layout/primitives";
import { LeadIn } from "../../../layout/blocks";

/** message → assistant → funnel, in the order of the copy's three steps. */
const icons: LucideIcon[] = [MessageCircle, Bot, SquareKanban];

/** "Como funciona": icon tiles joined by a gradient line; vertical timeline on phones. */
export const WahubHowItWorks = ({ copy }: { copy: WahubCopy["howItWorks"] }) => (
  <Section className="border-t border-border/60">
    <Reveal>
      <h2 className="v2-h2">{copy.title}</h2>
    </Reveal>
    <ol className="relative mt-10 grid gap-10 md:mt-14 md:grid-cols-3 md:gap-8">
      <span
        aria-hidden="true"
        className="absolute bottom-10 left-[27px] top-7 w-px bg-gradient-to-b from-wahub via-wahub-2 to-wahub/0 md:bottom-auto md:left-14 md:right-[calc(33%-28px)] md:top-[27px] md:h-px md:w-auto md:bg-gradient-to-r md:to-wahub-2/30"
      />
      {copy.steps.map((step, i) => {
        const Icon = icons[i] ?? MessageCircle;
        return (
          <Reveal as="li" key={step.title} delay={i * 90} className="relative flex gap-5 md:flex-col md:gap-6">
            <span className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-[16px] border border-wahub/40 bg-[hsl(240_45%_12%)] shadow-[var(--hairline),0_0_32px_-6px_hsl(var(--wahub)/0.55)]">
              <Icon className="h-6 w-6 text-[hsl(243_100%_82%)]" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <span
                aria-hidden="true"
                className="block bg-gradient-to-r from-wahub to-wahub-2 bg-clip-text text-[44px] font-extrabold leading-none tracking-[-0.04em] text-transparent tabular-nums md:text-[56px]"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="mt-3 text-[17px] leading-relaxed text-muted-foreground md:mt-4">
                <LeadIn {...step} />
              </p>
            </div>
          </Reveal>
        );
      })}
    </ol>
  </Section>
);
