import type { WahubCopy } from "../../copy/types";
import { useSitePage } from "../../layout/page-context";
import { WahubHero } from "./sections/WahubHero";
import { WahubHowItWorks } from "./sections/WahubHowItWorks";
import { WahubFeatures } from "./sections/WahubFeatures";
import { WahubPricing } from "./sections/WahubPricing";
import { WahubClosing } from "./sections/WahubClosing";

export const WahubPage = ({ copy: injected }: { copy?: WahubCopy }) => {
  const { market, copy: marketCopy } = useSitePage();
  const copy = injected ?? marketCopy.wahub;
  return (
    <>
      <WahubHero copy={copy} />
      <WahubHowItWorks copy={copy.howItWorks} />
      <WahubFeatures market={market} copy={copy.features} alts={copy.screenshots} />
      <WahubPricing copy={copy} />
      <WahubClosing copy={copy.closing} />
    </>
  );
};
