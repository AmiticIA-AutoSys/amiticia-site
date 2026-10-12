import type { WahubCopy } from "../../../copy/types";
import { Reveal, Section } from "../../../layout/primitives";
import { Steps } from "../../../layout/blocks";

export const WahubHowItWorks = ({ copy }: { copy: WahubCopy["howItWorks"] }) => (
  <Section className="border-t border-border/60">
    <Reveal>
      <h2 className="v2-h2">{copy.title}</h2>
    </Reveal>
    <Steps steps={copy.steps} accent="hsl(var(--wahub))" className="mt-10 md:mt-14" />
  </Section>
);
