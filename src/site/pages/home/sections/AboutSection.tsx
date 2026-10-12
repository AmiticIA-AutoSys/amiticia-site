import { Brain, Code2, Cpu } from "lucide-react";
import type { HomeCopy } from "../../../copy/types";
import { Eyebrow, Reveal, Section } from "../../../layout/primitives";

const icons = [Code2, Brain, Cpu];

export const AboutSection = ({ copy }: { copy: HomeCopy["about"] }) => (
  <Section id="quem-somos" className="border-t border-border/60">
    <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
      <Reveal>
        <Eyebrow>{copy.eyebrow}</Eyebrow>
        <h2 className="v2-h2 mt-4">{copy.title}</h2>
        <p className="v2-lead mt-5">{copy.lead}</p>
        <p className="mt-5 text-muted-foreground">{copy.body}</p>
      </Reveal>
      <ul className="flex flex-col gap-3 self-center">
        {copy.highlights.map((h, i) => {
          const Icon = icons[i % icons.length];
          return (
            <Reveal
              as="li"
              key={h.value}
              delay={i * 80}
              className="flex items-center gap-4 rounded-[20px] border border-border bg-surface p-5 shadow-[var(--hairline)]"
            >
              <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-cyan/10 text-brand-cyan">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <span>
                <span className="block text-lg font-bold">{h.value}</span>
                <span className="block text-sm text-muted-foreground">{h.label}</span>
              </span>
            </Reveal>
          );
        })}
      </ul>
    </div>
  </Section>
);
