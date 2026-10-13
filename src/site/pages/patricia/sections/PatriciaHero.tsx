import type { PatriciaCopy } from "../../../copy/types";
import { TextureOverlay } from "@/components/kit/cult/texture-overlay";
import { Container, Eyebrow } from "../../../layout/primitives";
import { WhatsAppButton } from "../../../layout/WhatsAppButton";
import { BriefingCard } from "./BriefingCard";

export const PatriciaHero = ({ copy }: { copy: PatriciaCopy["hero"] }) => (
  <section className="relative -mt-16 overflow-hidden pb-16 pt-[96px] md:-mt-[72px] md:pb-28 md:pt-[144px] lg:pt-[128px]">
    <div
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 top-[-20%] h-[620px] w-[1000px] max-w-[170vw] -translate-x-1/2 rounded-full opacity-60 blur-3xl lg:left-[72%]"
      style={{ background: "radial-gradient(closest-side, hsl(var(--patricia) / 0.24), hsl(var(--patricia) / 0.08) 55%, transparent)" }}
    />
    {/* Grain: the kit's dark dot texture, inverted to read on the dark page, faded at the edges. */}
    <TextureOverlay
      texture="noise"
      opacity={0.05}
      className="invert [mask-image:radial-gradient(ellipse_at_60%_30%,black,transparent_75%)]"
    />
    <Container className="relative">
      <div className="grid items-center gap-12 lg:items-start lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:gap-14">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center lg:mx-0 lg:items-start lg:text-left">
          <Eyebrow dot="hsl(var(--patricia))">{copy.eyebrow}</Eyebrow>
          <h1 className="v2-h1 mt-5">{copy.title}</h1>
          <p className="v2-lead mt-6 max-w-2xl">{copy.lead}</p>
          <div className="mt-9 flex w-full flex-col items-stretch sm:w-auto sm:items-center">
            <WhatsAppButton placement="hero" size="lg">
              {copy.primaryCta}
            </WhatsAppButton>
          </div>
        </div>
        <BriefingCard className="mx-auto w-full max-w-[360px] sm:max-w-[560px] md:max-w-[680px] lg:max-w-[520px]" />
      </div>
    </Container>
  </section>
);
