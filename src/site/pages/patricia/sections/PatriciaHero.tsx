import type { PatriciaCopy } from "../../../copy/types";
import { Container, Eyebrow } from "../../../layout/primitives";
import { WhatsAppButton } from "../../../layout/WhatsAppButton";

export const PatriciaHero = ({ copy }: { copy: PatriciaCopy["hero"] }) => (
  <section className="relative overflow-hidden pb-16 pt-10 md:pb-28 md:pt-20">
    <div
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 top-[-25%] h-[560px] w-[900px] max-w-[160vw] -translate-x-1/2 rounded-full opacity-50 blur-3xl"
      style={{ background: "radial-gradient(closest-side, hsl(var(--patricia) / 0.22), transparent)" }}
    />
    <Container className="relative">
      <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
        <Eyebrow dot="hsl(var(--patricia))">{copy.eyebrow}</Eyebrow>
        <h1 className="v2-h1 mt-5">{copy.title}</h1>
        <p className="v2-lead mt-6 max-w-3xl">{copy.lead}</p>
        <div className="mt-9 flex w-full flex-col items-stretch sm:w-auto sm:items-center">
          <WhatsAppButton placement="hero" size="lg">
            {copy.primaryCta}
          </WhatsAppButton>
        </div>
      </div>
      {/* VISUAL: briefing card illustration — chat → organized case for the lawyer, "Enviar / Editar". */}
    </Container>
  </section>
);
