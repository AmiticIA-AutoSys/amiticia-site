import type { HomeCopy } from "../../copy/types";
import { useSitePage } from "../../layout/page-context";
import { HomeHero } from "./sections/HomeHero";
import { ProductsSection } from "./sections/ProductsSection";
import { BenefitsSection } from "./sections/BenefitsSection";
import { CustomSection } from "./sections/CustomSection";
import { AboutSection } from "./sections/AboutSection";
import { AudienceSection } from "./sections/AudienceSection";
import { ClosingSection } from "./sections/ClosingSection";

export const HomePage = ({ copy: injected }: { copy?: HomeCopy }) => {
  const { market, copy: marketCopy } = useSitePage();
  const copy = injected ?? marketCopy.home;
  return (
    <>
      <HomeHero copy={copy.hero} />
      <ProductsSection copy={copy.products} market={market} />
      <BenefitsSection copy={copy.benefits} />
      <CustomSection copy={copy.custom} />
      <AboutSection copy={copy.about} />
      <AudienceSection copy={copy.audience} />
      <ClosingSection copy={copy.closing} />
    </>
  );
};
