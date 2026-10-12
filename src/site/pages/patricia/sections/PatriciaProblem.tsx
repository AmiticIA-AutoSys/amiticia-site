import type { PatriciaCopy } from "../../../copy/types";
import { Reveal, Section } from "../../../layout/primitives";

export const PatriciaProblem = ({ copy }: { copy: PatriciaCopy["problem"] }) => (
  <Section className="border-t border-border/60">
    <Reveal>
      <h2 className="v2-h2">{copy.title}</h2>
    </Reveal>
    <ul className="mt-10 grid gap-4 md:mt-14 md:grid-cols-3 md:gap-5">
      {copy.items.map((item, i) => (
        <Reveal
          as="li"
          key={item}
          delay={i * 80}
          className="rounded-[20px] border border-border bg-surface p-6 text-[17px] text-muted-foreground shadow-[var(--hairline)]"
        >
          <span aria-hidden="true" className="mb-4 block h-1 w-8 rounded-full bg-patricia/80" />
          {item}
        </Reveal>
      ))}
    </ul>
  </Section>
);
