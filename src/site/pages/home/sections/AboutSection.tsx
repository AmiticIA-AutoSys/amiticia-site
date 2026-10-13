import type { HomeCopy } from "../../../copy/types";
import { Eyebrow, Reveal, Section } from "../../../layout/primitives";

/** "IA desde 2006" → small "IA desde" over a big "2006"; other values stay whole. */
const splitYear = (value: string) => {
  const m = value.match(/^(.*\S)\s+(\d{4})$/);
  return m ? { prefix: m[1], big: m[2] } : { prefix: null, big: value };
};

const gradientText = "bg-[image:var(--gradient-brand)] bg-clip-text text-transparent";

export const AboutSection = ({ copy }: { copy: HomeCopy["about"] }) => (
  <Section id="quem-somos" className="border-t border-border/60">
    <div className="grid gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
      <Reveal>
        <Eyebrow>{copy.eyebrow}</Eyebrow>
        <h2 className="v2-h2 mt-4">{copy.title}</h2>
        <p className="v2-lead mt-5">{copy.lead}</p>
        <p className="mt-5 text-muted-foreground">{copy.body}</p>
      </Reveal>
      <ul className="grid gap-4 self-center sm:grid-cols-2 md:gap-5">
        {copy.highlights.map((h, i) => {
          const { prefix, big } = splitYear(h.value);
          return (
            <Reveal
              as="li"
              key={h.value}
              delay={i * 80}
              className={
                "relative overflow-hidden rounded-[20px] border border-border bg-surface p-6 shadow-[var(--hairline)] md:p-7" +
                (i === 0 ? " sm:col-span-2" : "")
              }
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full opacity-25 blur-3xl"
                style={{ background: "radial-gradient(closest-side, hsl(var(--brand-cyan)), hsl(var(--brand-violet)) 70%, transparent)" }}
              />
              <p className="relative pb-0.5">
                {prefix && <span className="mb-1.5 block text-[13px] font-[650] uppercase tracking-[0.08em] text-muted-foreground">{prefix}</span>}
                <span className={`inline-block text-[36px] font-extrabold leading-[1.05] tracking-[-0.03em] md:text-[44px] ${gradientText}`}>
                  {big}
                </span>
              </p>
              <p className="relative mt-3 text-muted-foreground">{h.label}</p>
            </Reveal>
          );
        })}
      </ul>
    </div>
  </Section>
);
