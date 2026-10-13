import { Clock, MessagesSquare, PhoneMissed, type LucideIcon } from "lucide-react";
import type { PatriciaCopy } from "../../../copy/types";
import { Reveal, Section } from "../../../layout/primitives";

/** One icon per problem, in copy order: the lawyer's time, the untold story, the missed contact. */
const icons: LucideIcon[] = [Clock, MessagesSquare, PhoneMissed];

export const PatriciaProblem = ({ copy }: { copy: PatriciaCopy["problem"] }) => (
  <Section className="border-t border-border/60">
    <Reveal>
      <h2 className="v2-h2">{copy.title}</h2>
    </Reveal>
    <ul className="mt-10 grid gap-4 md:mt-14 md:grid-cols-3 md:gap-5">
      {copy.items.map((item, i) => {
        const Icon = icons[i % icons.length];
        return (
          <Reveal
            as="li"
            key={item}
            delay={i * 80}
            className="flex flex-col gap-5 rounded-[20px] border border-border bg-surface p-6 shadow-[var(--hairline)] md:p-7"
          >
            <span
              aria-hidden="true"
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-patricia/20 bg-patricia/10 text-patricia"
            >
              <Icon className="h-5 w-5" />
            </span>
            <p className="text-[17px] text-muted-foreground">{item}</p>
          </Reveal>
        );
      })}
    </ul>
  </Section>
);
