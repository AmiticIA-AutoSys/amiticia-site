import type { WahubCopy } from "../../copy/types";
import { useSitePage } from "../../layout/page-context";
import { CtaBand } from "../../layout/blocks";
import { WahubHero } from "./sections/WahubHero";
import { WahubHowItWorks } from "./sections/WahubHowItWorks";
import { WahubFeatures } from "./sections/WahubFeatures";
import { WahubPricing } from "./sections/WahubPricing";

export const WahubPage = ({ copy: injected }: { copy?: WahubCopy }) => {
  const { copy: marketCopy } = useSitePage();
  const copy = injected ?? marketCopy.wahub;
  return (
    <>
      <WahubHero copy={copy} />
      <WahubHowItWorks copy={copy.howItWorks} />
      <WahubFeatures copy={copy.features} alts={copy.screenshots} />
      <WahubPricing copy={copy} />
      <CtaBand copy={copy.closing} glow="hsl(var(--wahub) / 0.22)" />
    </>
  );
};
