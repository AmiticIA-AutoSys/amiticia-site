import type { WahubCopy } from "../../../copy/types";
import { Reveal, Section } from "../../../layout/primitives";
import { LeadIn } from "../../../layout/blocks";
import { shots } from "../screenshots";
import { Screenshot } from "./Screenshot";

// VISUAL: bento grid with screenshot crops + Cult direction-aware-tabs (Conversas / Funil / Leads).
export const WahubFeatures = ({ copy, alts }: { copy: WahubCopy["features"]; alts: WahubCopy["screenshots"] }) => (
  <Section className="border-t border-border/60">
    <Reveal>
      <h2 className="v2-h2">{copy.title}</h2>
    </Reveal>
    <ul className="mt-10 grid gap-4 sm:grid-cols-2 md:mt-14 lg:grid-cols-3 lg:gap-5">
      {copy.items.map((item, i) => (
        <Reveal
          as="li"
          key={item.title}
          delay={(i % 3) * 60}
          className="rounded-[20px] border border-border bg-surface p-6 shadow-[var(--hairline)]"
        >
          <span aria-hidden="true" className="mb-4 block h-1 w-8 rounded-full bg-gradient-to-r from-wahub to-wahub-2" />
          <p className="text-muted-foreground">
            <LeadIn {...item} />
          </p>
        </Reveal>
      ))}
    </ul>
    <div className="mt-12 grid gap-5 md:mt-16">
      <Reveal>
        <Screenshot shot={shots.pipeline} alt={alts.pipeline} sizes="(min-width: 1264px) 1200px, calc(100vw - 40px)" />
      </Reveal>
      <Reveal>
        <Screenshot shot={shots.leads} alt={alts.leads} sizes="(min-width: 1264px) 1200px, calc(100vw - 40px)" />
      </Reveal>
    </div>
  </Section>
);
