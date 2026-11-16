import type { MarketCopy } from "../../copy/types";
import { useSitePage } from "../../layout/page-context";
import { HomeHero } from "./sections/HomeHero";
import { ProductsSection } from "./sections/ProductsSection";
import { BenefitsSection } from "./sections/BenefitsSection";
import { CustomSection } from "./sections/CustomSection";
import { AboutSection } from "./sections/AboutSection";
import { AudienceSection } from "./sections/AudienceSection";
import { ClosingSection } from "./sections/ClosingSection";
import { HowItWorksSection } from "./sections/HowItWorksSection";
import { FitSection } from "./sections/FitSection";

/**
 * The market's home. Its copy picks the layout: consulting first (Brazil, since 14/11: method,
 * what is already installed, proof, who it is for) or product first (Italy).
 */
export const HomePage = ({ copy: injected }: { copy?: MarketCopy["home"] }) => {
  const { market, copy: marketCopy } = useSitePage();
  const copy = injected ?? marketCopy.home;
  if (copy.layout === "consulting") {
    return (
      <>
        <HomeHero market={market} copy={copy.hero} />
        <HowItWorksSection copy={copy.howItWorks} />
        <ProductsSection copy={copy.products} market={market} className="border-t border-border/60" />
        <AboutSection copy={copy.about} />
        <FitSection copy={copy.fit} />
        <ClosingSection copy={copy.closing} />
      </>
    );
  }
  return (
    <>
      <HomeHero market={market} copy={copy.hero} />
      <ProductsSection copy={copy.products} market={market} />
      <BenefitsSection copy={copy.benefits} />
      <CustomSection copy={copy.custom} />
      <AboutSection copy={copy.about} />
      <AudienceSection copy={copy.audience} />
      <ClosingSection copy={copy.closing} />
    </>
  );
};
