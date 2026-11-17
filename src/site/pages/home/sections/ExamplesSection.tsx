import { CalendarCheck, FileCheck2, FileSpreadsheet, Keyboard, MessagesSquare, Receipt, type LucideIcon } from "lucide-react";
import type { ConsultingHomeCopy } from "../../../copy/types";
import { Eyebrow, Reveal, Section } from "../../../layout/primitives";
import { IconTile } from "./IconTile";
import { cardClass } from "./recipes";

/** One icon per example, in the order of the copy: type in, check, chase, answer, close the month, confirm. */
const icons: LucideIcon[] = [Keyboard, FileCheck2, Receipt, MessagesSquare, FileSpreadsheet, CalendarCheck];
const tones = ["cyan", "violet"] as const;

/**
 * "Onde a IA ajuda": everyday manual jobs a small-business owner recognises, before the method.
 * Many readers do not know what can be automated; the list lets them point at one. The note under
 * it says the work starts with one of them and continues one at a time.
 */
export const ExamplesSection = ({ copy }: { copy: ConsultingHomeCopy["examples"] }) => (
  <Section id="onde-ajuda" className="border-t border-border/60">
    <Reveal className="max-w-3xl">
      <Eyebrow>{copy.eyebrow}</Eyebrow>
      <h2 className="v2-h2 mt-4">{copy.title}</h2>
      <p className="v2-lead mt-5">{copy.lead}</p>
    </Reveal>
    <ul className="mt-10 grid gap-4 sm:grid-cols-2 md:mt-14 md:gap-5 lg:grid-cols-3">
      {copy.items.map((item, i) => (
        <Reveal as="li" key={item} delay={i * 60} className={`flex items-start gap-4 p-5 md:p-6 ${cardClass}`}>
          <IconTile icon={icons[i % icons.length]} tone={tones[i % tones.length]} />
          <p className="pt-1 text-[17px] leading-relaxed text-foreground/90">{item}</p>
        </Reveal>
      ))}
    </ul>
    <Reveal>
      <p className="mt-6 max-w-3xl text-muted-foreground md:mt-8">{copy.note}</p>
    </Reveal>
  </Section>
);
