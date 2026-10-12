import { ArrowUpRight } from "lucide-react";
import type { WahubCopy } from "../../../copy/types";
import { fillClaim } from "../../../copy";
import { products } from "../../../products";
import { Container, Eyebrow } from "../../../layout/primitives";
import { WhatsAppButton } from "../../../layout/WhatsAppButton";
import { secondaryButtonClass } from "../../../layout/blocks";
import { useSitePage } from "../../../layout/page-context";
import { shots } from "../screenshots";
import { Screenshot } from "./Screenshot";

export const WahubHero = ({ copy }: { copy: WahubCopy }) => {
  const { copy: marketCopy } = useSitePage();
  const proof = fillClaim(copy.liveSince);
  return (
    <section className="relative overflow-hidden pb-16 pt-10 md:pb-24 md:pt-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[-25%] h-[560px] w-[900px] max-w-[160vw] -translate-x-1/2 rounded-full opacity-60 blur-3xl"
        style={{
          background: "radial-gradient(closest-side, hsl(var(--wahub) / 0.28), hsl(var(--wahub-2) / 0.12) 55%, transparent)",
        }}
      />
      <Container className="relative">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <Eyebrow dot="linear-gradient(120deg, hsl(var(--wahub)), hsl(var(--wahub-2)))">{copy.hero.eyebrow}</Eyebrow>
          <h1 className="v2-h1 mt-5">{copy.hero.title}</h1>
          <p className="v2-lead mt-6 max-w-3xl">{copy.hero.lead}</p>
          <div className="mt-9 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center sm:justify-center">
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
        {/* VISUAL: Cult apple-iphone-17-pro + OriginKit live-chat (WhatsApp chat turning into a lead) + squiggle-arrow. */}
        <Screenshot
          shot={shots.inbox}
          alt={copy.screenshots.inbox}
          sizes="(min-width: 1264px) 1200px, calc(100vw - 40px)"
          eager
          className="mx-auto mt-14 max-w-5xl md:mt-20"
        />
      </Container>
    </section>
  );
};
