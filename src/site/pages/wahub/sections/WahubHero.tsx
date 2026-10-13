import { ArrowUpRight } from "lucide-react";
import type { WahubCopy } from "../../../copy/types";
import { fillClaim } from "../../../copy";
import { products } from "../../../products";
import { Container, Eyebrow } from "../../../layout/primitives";
import { WhatsAppButton } from "../../../layout/WhatsAppButton";
import { secondaryButtonClass } from "../../../layout/blocks";
import { useSitePage } from "../../../layout/page-context";
import { HeroDemo } from "./HeroDemo";

/** Text left, phone right from lg; stacked and centred below. Text is never animated (rule 3). */
export const WahubHero = ({ copy }: { copy: WahubCopy }) => {
  const { copy: marketCopy } = useSitePage();
  const proof = fillClaim(copy.liveSince);
  return (
    <section className="relative -mt-16 overflow-hidden pb-20 pt-[104px] md:-mt-[72px] md:pb-28 md:pt-[144px] lg:pb-24 lg:pt-[128px]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[-25%] h-[560px] w-[900px] max-w-[160vw] -translate-x-1/2 rounded-full opacity-50 blur-3xl lg:left-[30%]"
        style={{
          background: "radial-gradient(closest-side, hsl(var(--wahub) / 0.22), hsl(var(--wahub-2) / 0.1) 55%, transparent)",
        }}
      />
      <Container className="relative grid items-center gap-14 md:gap-16 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,1fr)] lg:gap-8">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center lg:mx-0 lg:items-start lg:text-left">
          <Eyebrow dot="linear-gradient(120deg, hsl(var(--wahub)), hsl(var(--wahub-2)))">{copy.hero.eyebrow}</Eyebrow>
          <h1 className="v2-h1 mt-5">{copy.hero.title}</h1>
          <p className="v2-lead mt-6 max-w-2xl">{copy.hero.lead}</p>
          <div className="mt-9 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center">
            <WhatsAppButton placement="hero" size="lg">
              {copy.hero.primaryCta}
            </WhatsAppButton>
            <a href={products.wahub.loginUrl} target="_blank" rel="noopener noreferrer" className={secondaryButtonClass}>
              {copy.hero.loginCta}
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              <span className="sr-only">{marketCopy.common.opensInNewTab}</span>
            </a>
          </div>
          {proof && <p className="mt-6 max-w-2xl text-[15px] text-muted-foreground">{proof}</p>}
        </div>
        <HeroDemo />
      </Container>
    </section>
  );
};
