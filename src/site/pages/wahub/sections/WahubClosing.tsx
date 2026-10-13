import type { ClosingCopy } from "../../../copy/types";
import { Reveal, Section } from "../../../layout/primitives";
import { WhatsAppButton } from "../../../layout/WhatsAppButton";
import { GlowBorder } from "@/components/kit/originkit/glow-border";

/** Closing CTA band inside an indigo → violet glowing frame (OriginKit glow-border). */
export const WahubClosing = ({ copy }: { copy: ClosingCopy }) => (
  // The features section above already ends with a full section gap.
  <Section className="!pt-0">
    <Reveal>
      <GlowBorder
        radius={28}
        borderWidth={1.5}
        colors={["hsl(var(--wahub))", "hsl(var(--wahub-2))"]}
        glow={0.3}
        speed={10}
        innerClassName="overflow-hidden bg-surface"
      >
        <div className="relative px-6 py-14 text-center md:px-12 md:py-20">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 -top-1/2 mx-auto h-[120%] max-w-3xl rounded-full blur-3xl"
            style={{ background: "radial-gradient(closest-side, hsl(var(--wahub) / 0.24), transparent)" }}
          />
          <div className="relative mx-auto flex max-w-2xl flex-col items-center gap-5">
            <h2 className="v2-h2">{copy.title}</h2>
            <p className="v2-lead">{copy.body}</p>
            <WhatsAppButton placement="cta" size="lg" className="mt-3">
              {copy.cta}
            </WhatsAppButton>
          </div>
        </div>
      </GlowBorder>
    </Reveal>
  </Section>
);
