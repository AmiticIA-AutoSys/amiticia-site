import { ArrowDown } from "lucide-react";
import type { HomeCopy } from "../../../copy/types";
import { Container } from "../../../layout/primitives";
import { WhatsAppButton } from "../../../layout/WhatsAppButton";
import { secondaryButtonClass } from "../../../layout/blocks";

// Above the fold: never animated from opacity 0 (DESIGN.md rule 3).
export const HomeHero = ({ copy }: { copy: HomeCopy["hero"] }) => (
  <section className="relative -mt-16 overflow-hidden pb-16 pt-[104px] md:-mt-[72px] md:pb-28 md:pt-[168px]">
    <div
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 top-[-30%] h-[560px] w-[900px] max-w-[160vw] -translate-x-1/2 rounded-full opacity-60 blur-3xl"
      style={{
        background:
          "radial-gradient(closest-side, hsl(var(--brand-cyan) / 0.20), hsl(var(--brand-violet) / 0.10) 55%, transparent)",
      }}
    />
    {/* VISUAL: Cult texture-overlay grain (~4 %) over the hero. */}
    <Container className="relative">
      <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
        {/* VISUAL: OriginKit type-sequence rotates the accent word; SSR keeps this static text. */}
        <h1 className="v2-h1">{copy.title}</h1>
        <p className="v2-lead mt-6 max-w-3xl">
          <span className="font-semibold text-foreground">{copy.leadHighlight}</span>
          {copy.leadRest}
        </p>
        <p className="mt-5 text-[17px] font-semibold text-brand-cyan">{copy.tagline}</p>
        <div className="mt-9 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center sm:justify-center">
          <WhatsAppButton placement="hero" size="lg">
            {copy.primaryCta}
          </WhatsAppButton>
          <a href="#produtos" className={secondaryButtonClass}>
            {copy.secondaryCta}
            <ArrowDown className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </Container>
  </section>
);
