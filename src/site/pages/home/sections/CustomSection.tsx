import { Cloud, Code, Cpu } from "lucide-react";
import type { HomeCopy } from "../../../copy/types";
import { Eyebrow, Reveal, Section } from "../../../layout/primitives";

const stackIcons = [Cloud, Code, Cpu];

export const CustomSection = ({ copy }: { copy: HomeCopy["custom"] }) => (
  <Section id="sob-medida" className="border-t border-border/60">
    <Reveal className="max-w-3xl">
      <Eyebrow>{copy.eyebrow}</Eyebrow>
      <h2 className="v2-h2 mt-4">{copy.title}</h2>
      <p className="v2-lead mt-5">{copy.lead}</p>
    </Reveal>

    <div className="mt-14 md:mt-20">
      <Reveal>
        <h3 className="v2-h3">{copy.stack.title}</h3>
      </Reveal>
      <ul className="mt-6 grid gap-3 sm:grid-cols-3 md:gap-4">
        {copy.stack.categories.map((label, i) => {
          const Icon = stackIcons[i % stackIcons.length];
          return (
            <Reveal
              as="li"
              key={label}
              delay={i * 60}
              className="flex items-center gap-3 rounded-[20px] border border-border bg-surface p-4 shadow-[var(--hairline)] md:p-5"
            >
              <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-violet/10 text-brand-violet">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="font-semibold">{label}</span>
            </Reveal>
          );
        })}
      </ul>
      <Reveal>
        <p className="mt-5 max-w-3xl text-[17px] text-muted-foreground">{copy.stack.description}</p>
      </Reveal>
    </div>

    <div id="como-trabalhamos" className="v2-anchor mt-14 md:mt-20">
      <Reveal>
        <h3 className="v2-h3">{copy.process.title}</h3>
      </Reveal>
      <ol className="mt-6 grid gap-4 md:grid-cols-3 md:gap-5">
        {copy.process.steps.map((step, i) => (
          <Reveal
            as="li"
            key={step.number}
            delay={i * 80}
            className="relative overflow-hidden rounded-[20px] border border-border bg-surface p-6 shadow-[var(--hairline)] md:p-7"
          >
            {/* Decorative watermark number, drawn as CSS content so it is not read or contrast-checked as text. */}
            <span
              aria-hidden="true"
              data-n={step.number}
              className="absolute right-5 top-3 text-6xl font-extrabold tabular-nums text-foreground/[0.06] before:content-[attr(data-n)]"
            />
            <span className="text-sm font-bold tabular-nums text-brand-cyan">{step.number}</span>
            <h4 className="mt-2 text-lg font-bold">{step.title}</h4>
            <p className="mt-2 text-muted-foreground">{step.description}</p>
          </Reveal>
        ))}
      </ol>
    </div>
  </Section>
);
