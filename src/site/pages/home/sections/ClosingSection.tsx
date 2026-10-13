import { GlowBorder } from "@/components/kit/originkit/glow-border";
import type { ClosingCopy } from "../../../copy/types";
import { Reveal, Section } from "../../../layout/primitives";
import { WhatsAppButton } from "../../../layout/WhatsAppButton";

/**
 * Closing CTA band inside the kit GlowBorder. Page-local because the shared CtaBand
 * (layout/blocks.tsx) has no glow frame yet; see the report's shared-file requests.
 */
export const ClosingSection = ({ copy }: { copy: ClosingCopy }) => (
  <Section>
    <Reveal>
      <GlowBorder
        className="isolate"
        radius={28}
        borderWidth={1.5}
        glow={0.3}
        speed={10}
        innerClassName="relative overflow-hidden bg-surface px-6 py-14 text-center md:px-12 md:py-20"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -top-1/2 mx-auto h-[120%] max-w-3xl rounded-full blur-3xl"
          style={{ background: "radial-gradient(closest-side, hsl(var(--brand-cyan) / 0.16), transparent)" }}
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
