import { Building2, Users } from "lucide-react";
import type { HomeCopy } from "../../../copy/types";
import { Reveal, Section } from "../../../layout/primitives";

const icons = [Building2, Users];

export const AudienceSection = ({ copy }: { copy: HomeCopy["audience"] }) => (
  <Section className="border-t border-border/60">
    <Reveal>
      <h2 className="v2-h2">{copy.title}</h2>
    </Reveal>
    <ul className="mt-10 grid gap-4 md:mt-14 md:grid-cols-2 md:gap-5">
      {copy.items.map((item, i) => {
        const Icon = icons[i % icons.length];
        return (
          <Reveal
            as="li"
            key={item}
            delay={i * 80}
            className="flex items-start gap-4 rounded-[20px] border border-border bg-surface p-5 shadow-[var(--hairline)] md:p-6"
          >
            <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-violet/10 text-brand-violet">
              <Icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <p className="pt-2 text-[17px] text-foreground/90">{item}</p>
          </Reveal>
        );
      })}
    </ul>
  </Section>
);
