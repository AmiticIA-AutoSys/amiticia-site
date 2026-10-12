import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { ClosingCopy, Step } from "../copy/types";
import { Reveal, Section } from "./primitives";
import { WhatsAppButton } from "./WhatsAppButton";

/** Neutral secondary action (never green). Use on <a> or <Link>. */
export const secondaryButtonClass =
  "inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full border border-border bg-surface/70 px-6 text-base font-semibold text-foreground shadow-[var(--hairline)] transition-colors duration-[160ms] hover:border-[hsl(222_25%_26%)] hover:bg-surface-raised";

/** Wraps the bold lead-in of a step or feature ("**Título.** texto"). */
export const LeadIn = ({ title, body }: Step) => (
  <>
    <strong className="font-semibold text-foreground">{title}</strong>
    {body.startsWith(",") || body.startsWith(".") ? "" : " "}
    {body}
  </>
);

interface StepsProps {
  steps: Step[];
  /** CSS colour of the step number badges. */
  accent?: string;
  className?: string;
}

/** "Como funciona": numbered steps joined by a line (vertical on mobile, horizontal from md). */
export const Steps = ({ steps, accent = "hsl(var(--brand-cyan))", className }: StepsProps) => (
  <ol className={cn("relative grid gap-8 md:grid-cols-3 md:gap-6", className)}>
    <span
      aria-hidden="true"
      className="absolute bottom-6 left-[21px] top-6 w-px bg-gradient-to-b from-border via-border to-transparent md:bottom-auto md:left-6 md:right-6 md:top-[21px] md:h-px md:w-auto md:bg-gradient-to-r"
    />
    {steps.map((step, i) => (
      <Reveal as="li" key={step.title} delay={i * 80} className="relative flex gap-4 md:flex-col md:gap-5">
        <span
          className="relative z-10 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border bg-background text-[15px] font-bold tabular-nums"
          style={{ borderColor: accent, color: accent }}
        >
          {i + 1}
        </span>
        <p className="pt-2 text-[17px] leading-relaxed text-muted-foreground md:pt-0">
          <LeadIn {...step} />
        </p>
      </Reveal>
    ))}
  </ol>
);

interface CtaBandProps {
  copy: ClosingCopy;
  /** Glow colour behind the band, e.g. a product tint. */
  glow?: string;
  children?: ReactNode;
}

// VISUAL: OriginKit glow-border (kit) frames this band.
export const CtaBand = ({ copy, glow = "hsl(var(--brand-cyan) / 0.18)" }: CtaBandProps) => (
  <Section>
    <Reveal className="relative overflow-hidden rounded-[28px] border border-border bg-surface px-6 py-14 text-center shadow-[var(--hairline)] md:px-12 md:py-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-1/2 mx-auto h-[120%] max-w-3xl rounded-full blur-3xl"
        style={{ background: `radial-gradient(closest-side, ${glow}, transparent)` }}
      />
      <div className="relative mx-auto flex max-w-2xl flex-col items-center gap-5">
        <h2 className="v2-h2">{copy.title}</h2>
        <p className="v2-lead">{copy.body}</p>
        <WhatsAppButton placement="cta" size="lg" className="mt-3">
          {copy.cta}
        </WhatsAppButton>
      </div>
    </Reveal>
  </Section>
);
