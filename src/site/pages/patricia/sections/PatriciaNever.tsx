import type { PatriciaCopy } from "../../../copy/types";
import { Reveal, Section } from "../../../layout/primitives";

export const PatriciaNever = ({ copy }: { copy: PatriciaCopy["never"] }) => (
  <Section className="border-t border-border/60">
    <Reveal className="max-w-3xl">
      <h2 className="v2-h2">{copy.title}</h2>
      <p className="v2-lead mt-5">{copy.body}</p>
    </Reveal>
  </Section>
);
