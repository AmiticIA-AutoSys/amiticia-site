import { BrainCircuit, Database, Server } from "lucide-react";
import type { HomeCopy } from "../../../copy/types";
import { Eyebrow, Reveal, Section } from "../../../layout/primitives";
import { IconTile } from "./IconTile";

const stackIcons = [Server, Database, BrainCircuit];
const stackTones = ["cyan", "violet", "cyan"] as const;

const brandLine = "linear-gradient(var(--line-dir), hsl(var(--brand-cyan)), hsl(var(--brand-violet)))";

export const CustomSection = ({ copy }: { copy: HomeCopy["custom"] }) => {
  const last = copy.stack.categories.length - 1;
  return (
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
        {/* Bento: two narrow cards and one wide card (the last category, with the stack text). */}
        <ul className="mt-6 grid gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-4">
          {copy.stack.categories.map((label, i) => {
            const wide = i === last;
            return (
              <Reveal
                as="li"
                key={label}
                delay={i * 60}
                className={
                  wide
                    ? "relative overflow-hidden rounded-[20px] border border-border bg-surface p-6 shadow-[var(--hairline)] md:col-span-2 md:p-8"
                    : "relative flex items-center gap-4 overflow-hidden rounded-[20px] border border-border bg-surface p-6 shadow-[var(--hairline)] md:flex-col md:items-start md:justify-between md:gap-8 md:p-8"
                }
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-30 blur-3xl"
                  style={{
                    background: `radial-gradient(closest-side, hsl(var(--brand-${stackTones[i % 3]})), transparent)`,
                  }}
                />
                <IconTile icon={stackIcons[i % stackIcons.length]} tone={stackTones[i % 3]} size="lg" />
                <div className={wide ? "relative mt-8" : "relative"}>
                  <span className="block text-lg font-bold md:text-xl">{label}</span>
                  {wide && <p className="mt-3 text-[17px] text-muted-foreground">{copy.stack.description}</p>}
                </div>
              </Reveal>
            );
          })}
        </ul>
      </div>

      <div id="como-trabalhamos" className="v2-anchor mt-16 md:mt-24">
        <Reveal>
          <h3 className="v2-h3">{copy.process.title}</h3>
        </Reveal>
        <ol
          className="relative mt-8 grid gap-10 [--line-dir:to_bottom] md:mt-10 md:grid-cols-3 md:gap-8 md:[--line-dir:to_right]"
        >
          {/* The gradient line joining the steps: vertical on mobile, horizontal from md. */}
          <span
            aria-hidden="true"
            className="absolute hidden h-px opacity-60 md:block md:left-7 md:right-[calc((100%-4rem)/3-1.75rem)] md:top-[27px]"
            style={{ background: brandLine }}
          />
          {copy.process.steps.map((step, i) => (
            <Reveal as="li" key={step.number} delay={i * 80} className="relative flex gap-5 md:flex-col md:gap-6">
              {i < copy.process.steps.length - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute bottom-[-2.5rem] left-[27px] top-14 w-px opacity-60 md:hidden"
                  style={{ background: brandLine }}
                />
              )}
              <span className="relative z-10 inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[conic-gradient(from_120deg,hsl(var(--brand-cyan)),hsl(var(--brand-violet)),hsl(var(--brand-cyan)))] p-px">
                <span className="inline-flex h-full w-full items-center justify-center rounded-full bg-background text-base font-extrabold tabular-nums text-foreground">
                  {step.number}
                </span>
              </span>
              <div className="pt-1 md:pt-0">
                <h4 className="text-lg font-bold md:text-xl">{step.title}</h4>
                <p className="mt-2 text-muted-foreground">{step.description}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </Section>
  );
};
