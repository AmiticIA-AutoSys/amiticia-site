import { Target, TrendingDown, TrendingUp, Zap } from "lucide-react";
import type { HomeCopy } from "../../../copy/types";
import { Reveal, Section } from "../../../layout/primitives";

const icons = [TrendingUp, TrendingDown, Target, Zap];

export const BenefitsSection = ({ copy }: { copy: HomeCopy["benefits"] }) => (
  <Section className="border-t border-border/60">
    <Reveal>
      <h2 className="v2-h2">{copy.title}</h2>
    </Reveal>
    <ul className="mt-10 grid gap-4 sm:grid-cols-2 md:mt-14 md:gap-5">
      {copy.items.map((item, i) => {
        const Icon = icons[i % icons.length];
        return (
          <Reveal
            as="li"
            key={item}
            delay={i * 60}
            className="flex items-start gap-4 rounded-[20px] border border-border bg-surface p-5 shadow-[var(--hairline)] md:p-6"
          >
            <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-cyan/10 text-brand-cyan">
              <Icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <p className="pt-2 text-[17px] text-foreground/90">{item}</p>
          </Reveal>
        );
      })}
    </ul>
  </Section>
);
