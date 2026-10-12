import { ShieldAlert } from "lucide-react";
import type { PatriciaCopy } from "../../../copy/types";
import { Reveal, Section } from "../../../layout/primitives";
import { LeadIn, Steps } from "../../../layout/blocks";

export const PatriciaHowItWorks = ({ copy }: { copy: PatriciaCopy["howItWorks"] }) => (
  <Section className="border-t border-border/60">
    <Reveal>
      <h2 className="v2-h2">{copy.title}</h2>
    </Reveal>
    <Steps steps={copy.steps} accent="hsl(var(--patricia))" className="mt-10 md:mt-14" />
    <Reveal className="mt-12 flex items-start gap-4 rounded-[20px] border border-patricia/40 bg-patricia/[0.06] p-5 md:mt-16 md:p-6">
      <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-patricia/15 text-patricia">
        <ShieldAlert className="h-5 w-5" aria-hidden="true" />
      </span>
      <p className="pt-2 text-[17px] text-muted-foreground">
        <LeadIn {...copy.risk} />
      </p>
    </Reveal>
  </Section>
);
