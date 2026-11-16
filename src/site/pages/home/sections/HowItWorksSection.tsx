import { Clock, Repeat } from "lucide-react";
import type { ConsultingHomeCopy } from "../../../copy/types";
import { fillClaim } from "../../../copy";
import { Eyebrow, Reveal, Section } from "../../../layout/primitives";
import { IconTile } from "./IconTile";
import { brandLine, cardClass, labelClass, stepDiscClass, stepRingClass } from "./recipes";

/**
 * "Como funciona" of the consulting home: numbered steps joined by the brand line (the same ring
 * and line as the product home's "Como trabalhamos"), each with its duration and what the client
 * receives; then the optional monthly follow-up and the price line. Takes the anchor the header's
 * "Como trabalhamos" link already points at.
 */
export const HowItWorksSection = ({ copy }: { copy: ConsultingHomeCopy["howItWorks"] }) => {
  const last = copy.steps.length - 1;
  // ⏸ No number until the product owner decides: the fallback line works without one.
  const price = fillClaim(copy.price.claim) ?? copy.price.fallback;
  return (
    <Section id="como-trabalhamos" className="border-t border-border/60">
      <Reveal className="max-w-3xl">
        <Eyebrow>{copy.eyebrow}</Eyebrow>
        <h2 className="v2-h2 mt-4">{copy.title}</h2>
        <p className="v2-lead mt-5">{copy.lead}</p>
      </Reveal>

      {/*
        A vertical timeline up to lg (the steps carry more text than the product home's, so three
        columns only fit from 1024 px). From lg, each step is a 5-row subgrid, so durations, titles,
        texts and "você recebe" boxes line up across the columns whatever their length.
      */}
      <ol className="relative mt-12 grid gap-10 [--line-dir:to_bottom] md:mt-16 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-0 lg:[--line-dir:to_right]">
        {/* The gradient line joining the steps: vertical per step below lg, one horizontal line from lg. */}
        <span
          aria-hidden="true"
          className="absolute hidden h-px opacity-60 lg:block lg:left-7 lg:right-[calc((100%-4rem)/3-1.75rem)] lg:top-[27px]"
          style={{ background: brandLine }}
        />
        {copy.steps.map((step, i) => (
          <Reveal
            as="li"
            key={step.title}
            delay={i * 80}
            className="relative flex gap-5 lg:row-span-5 lg:grid lg:grid-rows-subgrid lg:gap-0"
          >
            {i < last && (
              <span
                aria-hidden="true"
                className="absolute bottom-[-2.5rem] left-[27px] top-14 w-px opacity-60 lg:hidden"
                style={{ background: brandLine }}
              />
            )}
            <span className={stepRingClass}>
              <span className={stepDiscClass}>{String(i + 1).padStart(2, "0")}</span>
            </span>
            <div className="flex min-w-0 flex-1 flex-col pt-1 lg:contents">
              <p className={`flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-muted-foreground lg:mt-6 ${labelClass}`}>
                <span className="inline-flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  {step.when}
                </span>
                {step.badge && (
                  <span className="rounded-full border border-brand-cyan/30 bg-brand-cyan/10 px-2 py-0.5 text-brand-cyan">
                    {step.badge}
                  </span>
                )}
              </p>
              <h3 className="mt-3 text-lg font-bold md:text-xl">{step.title}</h3>
              <p className="mt-2 text-muted-foreground">{step.body}</p>
              <div className={`mt-5 p-5 ${cardClass}`}>
                <p className={`text-brand-cyan ${labelClass}`}>{copy.receivesLabel}</p>
                <p className="mt-2 text-foreground/90">{step.receives}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </ol>

      <Reveal className={`mt-10 flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:gap-6 md:mt-14 md:p-8 ${cardClass}`}>
        <IconTile icon={Repeat} tone="violet" size="lg" />
        <div>
          <p className={`text-muted-foreground ${labelClass}`}>{copy.followUp.when}</p>
          <h3 className="mt-1.5 text-lg font-bold md:text-xl">{copy.followUp.title}</h3>
          <p className="mt-2 text-muted-foreground">{copy.followUp.body}</p>
        </div>
      </Reveal>

      <Reveal>
        <p className="mt-6 text-muted-foreground md:mt-8">{price}</p>
      </Reveal>
    </Section>
  );
};
