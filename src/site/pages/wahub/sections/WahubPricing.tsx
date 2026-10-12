import type { WahubCopy } from "../../../copy/types";
import { fillClaim } from "../../../copy";
import { Reveal, Section } from "../../../layout/primitives";

/** ⏸ Renders nothing until costComparison is confirmed (no R$ value ever appears). */
export const WahubPricing = ({ copy }: { copy: WahubCopy }) => {
  const line = fillClaim(copy.costComparison);
  if (!line) return null;
  return (
    <Section className="border-t border-border/60">
      <Reveal className="max-w-3xl">
        <h2 className="v2-h2">{copy.pricing.title}</h2>
        <p className="v2-lead mt-5">{line}</p>
      </Reveal>
    </Section>
  );
};
