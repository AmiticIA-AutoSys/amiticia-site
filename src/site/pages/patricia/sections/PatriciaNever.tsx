import { X } from "lucide-react";
import type { PatriciaCopy } from "../../../copy/types";
import { Reveal, Section } from "../../../layout/primitives";

/**
 * The approved sentence split at its clauses, keeping every word and punctuation mark:
 * "A, b, c e d." → ["A,", "b,", "c", "e d."]. Joined with spaces it is the sentence again.
 */
// eslint-disable-next-line react-refresh/only-export-components -- pure helper, tested with the section
export const neverClauses = (sentence: string): string[] => {
  const parts = sentence.split(/(?<=,) /);
  const last = parts.pop() ?? "";
  const cut = last.lastIndexOf(" e ");
  return cut > 0 ? [...parts, last.slice(0, cut), last.slice(cut + 1)] : [...parts, last];
};

export const PatriciaNever = ({ copy }: { copy: PatriciaCopy["never"] }) => (
  <Section className="border-t border-border/60">
    <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-start lg:gap-16">
      <Reveal>
        <h2 className="v2-h2">{copy.title}</h2>
      </Reveal>
      <Reveal className="rounded-[20px] border border-border bg-surface px-6 py-2 shadow-[var(--hairline)] md:px-8 md:py-3">
        <ul className="divide-y divide-border/70">
          {neverClauses(copy.body).map((clause) => (
            <li key={clause} className="flex items-center gap-4 py-4 md:py-5">
              <span
                aria-hidden="true"
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-surface-raised text-subtle-foreground"
              >
                <X className="h-4 w-4" />
              </span>
              <span data-testid="never-item" className="text-[17px] text-foreground/90 md:text-lg">
                {clause}
              </span>
            </li>
          ))}
        </ul>
      </Reveal>
    </div>
  </Section>
);
