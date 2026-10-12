import type { PatriciaCopy } from "../../copy/types";
import { useSitePage } from "../../layout/page-context";
import { CtaBand } from "../../layout/blocks";
import { PatriciaHero } from "./sections/PatriciaHero";
import { PatriciaProblem } from "./sections/PatriciaProblem";
import { PatriciaHowItWorks } from "./sections/PatriciaHowItWorks";
import { PatriciaNever } from "./sections/PatriciaNever";

export const PatriciaPage = ({ copy: injected }: { copy?: PatriciaCopy }) => {
  const { copy: marketCopy } = useSitePage();
  const copy = injected ?? marketCopy.patricia;
  return (
    <>
      <PatriciaHero copy={copy.hero} />
      <PatriciaProblem copy={copy.problem} />
      <PatriciaHowItWorks copy={copy.howItWorks} />
      <PatriciaNever copy={copy.never} />
      <CtaBand copy={copy.closing} glow="hsl(var(--patricia) / 0.18)" />
    </>
  );
};
