import { Building2, Users } from "lucide-react";
import type { HomeCopy } from "../../../copy/types";
import { Reveal, Section } from "../../../layout/primitives";
import { IconTile } from "./IconTile";

const icons = [Building2, Users];
const tones = ["cyan", "violet"] as const;

/** Subtle brand border: a faint cyan→violet gradient on the border box under a solid surface. */
const brandBorder =
  "border border-transparent [background:linear-gradient(hsl(var(--surface)),hsl(var(--surface)))_padding-box,linear-gradient(120deg,hsl(var(--brand-cyan)/0.45),hsl(var(--border))_45%,hsl(var(--brand-violet)/0.45))_border-box]";

export const AudienceSection = ({ copy }: { copy: HomeCopy["audience"] }) => (
  <Section className="border-t border-border/60">
    <Reveal>
      <h2 className="v2-h2">{copy.title}</h2>
    </Reveal>
    <ul className="mt-10 grid gap-4 md:mt-14 md:grid-cols-2 md:gap-5">
      {copy.items.map((item, i) => (
        <Reveal
          as="li"
          key={item}
          delay={i * 80}
          className={`flex flex-col gap-5 rounded-[20px] p-6 shadow-[var(--hairline)] md:p-8 ${brandBorder}`}
        >
          <IconTile icon={icons[i % icons.length]} tone={tones[i % tones.length]} />
          <p className="text-[17px] leading-relaxed text-foreground/90 md:text-lg">{item}</p>
        </Reveal>
      ))}
    </ul>
  </Section>
);
