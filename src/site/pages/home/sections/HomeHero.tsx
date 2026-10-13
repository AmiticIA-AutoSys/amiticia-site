import type { CSSProperties } from "react";
import { ArrowDown } from "lucide-react";
import { TextureOverlay } from "@/components/kit/cult/texture-overlay";
import type { HomeCopy } from "../../../copy/types";
import { Container } from "../../../layout/primitives";
import { WhatsAppButton } from "../../../layout/WhatsAppButton";
import { secondaryButtonClass } from "../../../layout/blocks";
import { HeroIllustration } from "./HeroIllustration";

/*
 * Gradient on the last words of the h1 without splitting its text (the prerendered h1 stays one
 * plain string): a brand-gradient layer one line tall (1lh) sits at the bottom of the text box,
 * over a solid foreground layer, both clipped to the glyphs. Whatever wraps onto the last line
 * ("Escala", or "que Escala") takes the gradient; browsers without `lh` show a full gradient.
 */
const titleStyle: CSSProperties = {
  backgroundImage:
    "linear-gradient(90deg, hsl(var(--brand-cyan)) 0, hsl(var(--brand-violet)) 5.5em), linear-gradient(hsl(var(--foreground)), hsl(var(--foreground)))",
  backgroundSize: "100% 1lh, 100% 100%",
  backgroundPosition: "left bottom, 0 0",
  backgroundRepeat: "no-repeat",
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
};

// Above the fold: never animated from opacity 0 (DESIGN.md rule 3).
export const HomeHero = ({ copy }: { copy: HomeCopy["hero"] }) => (
  <section className="relative -mt-16 overflow-hidden pb-16 pt-[96px] md:-mt-[72px] md:pb-28 md:pt-[148px] lg:pt-[136px]">
    <div
      aria-hidden="true"
      className="pointer-events-none absolute left-[30%] top-[-20%] h-[620px] w-[1000px] max-w-[170vw] -translate-x-1/2 rounded-full opacity-70 blur-3xl"
      style={{
        background:
          "radial-gradient(closest-side, hsl(var(--brand-cyan) / 0.16), hsl(var(--brand-violet) / 0.08) 55%, transparent)",
      }}
    />
    <div
      aria-hidden="true"
      className="pointer-events-none absolute right-[-10%] top-[20%] hidden h-[520px] w-[620px] rounded-full opacity-60 blur-3xl lg:block"
      style={{
        background:
          "radial-gradient(closest-side, hsl(var(--wahub) / 0.16), hsl(var(--patricia) / 0.06) 60%, transparent)",
      }}
    />
    <TextureOverlay
      texture="noise"
      opacity={0.04}
      className="bg-[radial-gradient(circle_at_2px_2px,rgba(255,255,255,0.9)_1px,transparent_0)] [mask-image:linear-gradient(to_bottom,black_60%,transparent)]"
    />
    <Container className="relative">
      <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)] lg:gap-12">
        <div className="flex max-w-3xl flex-col items-start">
          <h1 className="v2-h1" style={titleStyle}>
            {copy.title}
          </h1>
          <p className="v2-lead mt-6">
            <span className="font-semibold text-foreground">{copy.leadHighlight}</span>
            {copy.leadRest}
          </p>
          <p className="mt-5 text-[17px] font-semibold text-brand-cyan">{copy.tagline}</p>
          <div className="mt-8 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center">
            <WhatsAppButton placement="hero" size="lg">
              {copy.primaryCta}
            </WhatsAppButton>
            <a href="#produtos" className={secondaryButtonClass}>
              {copy.secondaryCta}
              <ArrowDown className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>
        <HeroIllustration />
      </div>
    </Container>
  </section>
);
