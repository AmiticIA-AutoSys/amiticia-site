import { GlowBorder } from "@/components/kit/originkit/glow-border";
import type { ClosingCopy } from "../../../copy/types";
import { Reveal, Section } from "../../../layout/primitives";
import { WhatsAppButton } from "../../../layout/WhatsAppButton";
import { useMounted } from "../use-mounted";

/**
 * Closing CTA band inside the kit GlowBorder. Page-local because the shared CtaBand
 * (layout/blocks.tsx) has no glow frame yet. The GlowBorder mounts after hydration: its inline
 * <style> is escaped by SSR and would fail hydration; the server frame is a plain border, swapped as a background layer only.
 */
export const ClosingSection = ({ copy }: { copy: ClosingCopy }) => {
  const mounted = useMounted();
  return (
    <Section>
      <Reveal className="relative isolate rounded-[28px]">
        {/* Only this frame layer swaps after mount; the content (and its WhatsApp button) never remounts. */}
        {mounted ? (
          <GlowBorder className="absolute inset-0" radius={28} borderWidth={1.5} glow={0.3} speed={10} innerClassName="bg-surface">
            <span />
          </GlowBorder>
        ) : (
          <div aria-hidden="true" className="absolute inset-0 rounded-[28px] border-[1.5px] border-brand-cyan/40 bg-surface" />
        )}
        <div className="relative z-10 overflow-hidden rounded-[28px] px-6 py-14 text-center md:px-12 md:py-20">
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
        </div>
      </Reveal>
    </Section>
  );
};
