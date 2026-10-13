import type { ReactNode } from "react";
import type { ClosingCopy } from "../../../copy/types";
import { GlowBorder } from "@/components/kit/originkit/glow-border";
import { Reveal, Section } from "../../../layout/primitives";
import { WhatsAppButton } from "../../../layout/WhatsAppButton";
import { useMounted } from "../use-mounted";

const RADIUS = 28;
const BORDER = 1;
const inner = "relative overflow-hidden bg-surface px-6 py-14 text-center md:px-12 md:py-20";

/**
 * The kit GlowBorder mounts on the client only (its inline <style> does not hydrate, see
 * BriefingCard). Server HTML and hydration get this static frame of the same size and colour.
 */
const StaticFrame = ({ children }: { children: ReactNode }) => (
  <div className="relative" style={{ borderRadius: RADIUS, padding: BORDER, background: "hsl(var(--patricia) / 0.35)" }}>
    <div className={inner} style={{ borderRadius: RADIUS - BORDER }}>
      {children}
    </div>
  </div>
);

/** Closing CTA band in peach tones: a slow, soft light around the frame. */
export const PatriciaClosing = ({ copy }: { copy: ClosingCopy }) => {
  const mounted = useMounted();
  const content = (
    <>
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
    </>
  );
  return (
    <Section>
      <Reveal>
        {mounted ? (
          <GlowBorder
            radius={RADIUS}
            borderWidth={BORDER}
            speed={14}
            glow={0.22}
            colors={["hsl(var(--patricia) / 0.9)", "hsl(var(--patricia) / 0.08)"]}
            innerClassName={inner}
          >
            {content}
          </GlowBorder>
        ) : (
          <StaticFrame>{content}</StaticFrame>
        )}
      </Reveal>
    </Section>
  );
};
