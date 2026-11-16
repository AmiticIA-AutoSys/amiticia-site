import { Check, X, type LucideIcon } from "lucide-react";
import type { ConsultingHomeCopy } from "../../../copy/types";
import { Reveal, Section } from "../../../layout/primitives";
import { IconTile } from "./IconTile";
import { brandBorder, cardClass } from "./recipes";

const FitList = ({
  title,
  items,
  icon: Icon,
  positive,
  className,
  delay,
}: {
  title: string;
  items: string[];
  icon: LucideIcon;
  positive: boolean;
  className: string;
  delay?: number;
}) => (
  <Reveal delay={delay} className={`p-6 md:p-8 ${className}`}>
    <h3 className="flex items-center gap-4 text-lg font-bold md:text-xl">
      <IconTile icon={Icon} tone={positive ? "cyan" : "violet"} />
      {title}
    </h3>
    <ul className="mt-6 space-y-4">
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <Icon
            aria-hidden="true"
            className={`mt-1 h-5 w-5 shrink-0 ${positive ? "text-brand-cyan" : "text-subtle-foreground"}`}
          />
          <span className={`text-[17px] leading-relaxed ${positive ? "text-foreground/90" : "text-muted-foreground"}`}>
            {item}
          </span>
        </li>
      ))}
    </ul>
  </Reveal>
);

/** "Para quem é / para quem não é": two cards side by side from md, the "é" card in the brand border. */
export const FitSection = ({ copy }: { copy: ConsultingHomeCopy["fit"] }) => (
  <Section id="para-quem-e" className="border-t border-border/60">
    <Reveal>
      <h2 className="v2-h2">{copy.title}</h2>
    </Reveal>
    <div className="mt-10 grid gap-4 md:mt-14 md:grid-cols-2 md:gap-5">
      <FitList
        title={copy.forTitle}
        items={copy.forItems}
        icon={Check}
        positive
        className={`rounded-[20px] shadow-[var(--hairline)] ${brandBorder}`}
      />
      <FitList title={copy.notForTitle} items={copy.notForItems} icon={X} positive={false} className={cardClass} delay={80} />
    </div>
  </Section>
);
