import { Gauge, Rocket, TrendingDown, TrendingUp } from "lucide-react";
import type { HomeCopy } from "../../../copy/types";
import { Reveal, Section } from "../../../layout/primitives";
import { IconTile } from "./IconTile";

const icons = [TrendingUp, TrendingDown, Gauge, Rocket];
const tones = ["cyan", "violet", "violet", "cyan"] as const;

export const BenefitsSection = ({ copy }: { copy: HomeCopy["benefits"] }) => (
  <Section className="border-t border-border/60">
    <Reveal>
      <h2 className="v2-h2">{copy.title}</h2>
    </Reveal>
    <ul className="mt-10 grid gap-4 md:mt-14 md:grid-cols-2 md:gap-5">
      {copy.items.map((item, i) => (
        <Reveal
          as="li"
          key={item}
          delay={i * 60}
          className="flex items-start gap-5 rounded-[20px] border border-border bg-surface p-6 shadow-[var(--hairline)] md:p-8"
        >
          <IconTile icon={icons[i % icons.length]} tone={tones[i % tones.length]} />
          <p className="pt-1.5 text-[17px] leading-relaxed text-foreground/90 md:text-lg">{item}</p>
        </Reveal>
      ))}
    </ul>
  </Section>
);
