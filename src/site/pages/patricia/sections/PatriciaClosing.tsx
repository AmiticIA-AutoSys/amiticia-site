import type { ClosingCopy } from "../../../copy/types";
import { GlowBorder } from "@/components/kit/originkit/glow-border";
import { Reveal, Section } from "../../../layout/primitives";
import { WhatsAppButton } from "../../../layout/WhatsAppButton";

/** Closing CTA band in peach tones: a slow, soft light around the frame. */
export const PatriciaClosing = ({ copy }: { copy: ClosingCopy }) => (
  <Section>
    <Reveal>
      <GlowBorder
        radius={28}
        borderWidth={1}
        speed={14}
        glow={0.22}
        colors={["hsl(var(--patricia) / 0.9)", "hsl(var(--patricia) / 0.08)"]}
        innerClassName="relative overflow-hidden bg-surface px-6 py-14 text-center md:px-12 md:py-20"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -top-1/2 mx-auto h-[120%] max-w-3xl rounded-full blur-3xl"
          style={{ background: "radial-gradient(closest-side, hsl(var(--patricia) / 0.16), transparent)" }}
        />
        <div className="relative mx-auto flex max-w-2xl flex-col items-center gap-5">
          <h2 className="v2-h2">{copy.title}</h2>
          <p className="v2-lead">{copy.body}</p>
          <WhatsAppButton placement="cta" size="lg" className="mt-3">
            {copy.cta}
          </WhatsAppButton>
        </div>
      </GlowBorder>
    </Reveal>
  </Section>
);
