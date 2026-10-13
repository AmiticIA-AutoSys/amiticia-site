import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, FileText, Pencil, Send } from "lucide-react";
import type { HomeCopy } from "../../../copy/types";
import type { MarketId } from "../../../markets";
import { productPath } from "../../../products";
import { Reveal, Section } from "../../../layout/primitives";
import { shotsFor } from "../../wahub/screenshots";
import { patriciaDemo, productTint } from "../demo";

type ProductId = HomeCopy["products"]["cards"][number]["productId"];

/** WaHub: the top of the real lead panel (the market's demo tenant, fictitious data), cropped. */
const WahubPreview = ({ market }: { market: MarketId }) => {
  const panel = shotsFor(market).panel;
  return (
    <div className="relative mx-auto h-full w-[min(250px,72%)] overflow-hidden rounded-t-[16px] border border-b-0 border-border bg-surface-raised p-1 shadow-[0_30px_60px_-30px_hsl(var(--wahub)/0.7)]">
      <img
        src={panel.src}
        srcSet={panel.srcSet}
        sizes="250px"
        width={284}
        height={712}
        alt=""
        loading="lazy"
        decoding="async"
        className="block h-auto w-full rounded-t-[12px]"
      />
    </div>
  );
};

/** Patrícia: a tiny coded briefing card with the ready reply (illustration). */
const PatriciaPreview = () => (
  <div className="relative mx-auto h-full w-[min(300px,84%)] overflow-hidden rounded-t-[16px] border border-b-0 border-border bg-surface-raised px-4 pt-4 shadow-[0_30px_60px_-30px_hsl(var(--patricia)/0.6)]">
    <span className="inline-flex items-center gap-1.5 text-[13px] font-bold">
      <FileText className="h-4 w-4 text-patricia" />
      {patriciaDemo.case.title}
    </span>
    <dl className="mt-3 space-y-1.5 text-[12px] leading-snug">
      {patriciaDemo.case.fields.slice(0, 1).map(([label, value]) => (
        <div key={label} className="flex justify-between gap-3">
          <dt className="text-subtle-foreground">{label}</dt>
          <dd className="text-right font-medium text-foreground/90">{value}</dd>
        </div>
      ))}
    </dl>
    <div className="mt-3 rounded-[12px] border border-[hsl(var(--patricia)/0.3)] bg-[hsl(var(--patricia)/0.07)] p-3">
      <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-patricia">
        {patriciaDemo.case.replyLabel}
      </span>
      <p className="mt-1 text-[12px] leading-snug text-foreground/90">
        {patriciaDemo.case.reply}
      </p>
      <div className="mt-2.5 flex gap-2 text-[11px] font-semibold">
        <span className="inline-flex items-center gap-1 rounded-full bg-patricia px-2.5 py-1 text-background">
          <Send className="h-3 w-3" />
          {patriciaDemo.case.send}
        </span>
        <span className="inline-flex items-center gap-1 rounded-full border border-border px-2.5 py-1 text-muted-foreground">
          <Pencil className="h-3 w-3" />
          {patriciaDemo.case.edit}
        </span>
      </div>
    </div>
  </div>
);

const previews: Record<
  ProductId,
  (props: { market: MarketId }) => JSX.Element
> = {
  wahub: WahubPreview,
  patricia: PatriciaPreview,
};

export const ProductsSection = ({
  copy,
  market,
}: {
  copy: HomeCopy["products"];
  market: MarketId;
}) => (
  <Section id="produtos" aria-labelledby="produtos-titulo">
    <Reveal>
      <h2 id="produtos-titulo" className="v2-h2">
        {copy.title}
      </h2>
    </Reveal>
    <div className="mt-10 grid gap-5 md:mt-14 md:grid-cols-2 md:gap-6">
      {copy.cards.map((card, i) => {
        const t = productTint[card.productId];
        const Preview = previews[card.productId];
        const id = `produto-${card.productId}`;
        return (
          <Reveal
            key={card.productId}
            delay={i * 80}
            className={copy.cards.length === 1 ? "md:col-span-2" : undefined}
          >
            {/* The whole card is one link, named by its call to action and described by its text. */}
            <Link
              to={productPath(market, card.productId)}
              aria-labelledby={`${id}-cta`}
              aria-describedby={`${id}-titulo ${id}-texto`}
              style={{ "--tint": t.color } as CSSProperties}
              className="group relative flex h-full flex-col overflow-hidden rounded-[28px] border border-border bg-surface shadow-[var(--hairline)] transition-[border-color,box-shadow] duration-[280ms] ease-[cubic-bezier(.22,1,.36,1)] hover:border-[color-mix(in_srgb,var(--tint)_55%,transparent)] hover:shadow-[var(--hairline),0_0_0_1px_color-mix(in_srgb,var(--tint)_30%,transparent),0_30px_80px_-40px_var(--tint)] focus-visible:border-[color-mix(in_srgb,var(--tint)_55%,transparent)]"
            >
              <div
                aria-hidden="true"
                className="relative h-[220px] overflow-hidden border-b border-border/70 pt-8 md:h-[260px] md:pt-10"
              >
                <span
                  className="pointer-events-none absolute inset-x-0 -top-1/2 mx-auto h-[150%] w-[90%] rounded-full opacity-40 blur-3xl transition-opacity duration-[280ms] group-hover:opacity-60"
                  style={{
                    background: `radial-gradient(closest-side, ${t.color}, transparent)`,
                  }}
                />
                <span className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:linear-gradient(hsl(var(--border))_1px,transparent_1px),linear-gradient(90deg,hsl(var(--border))_1px,transparent_1px)] [background-size:28px_28px] [mask-image:radial-gradient(closest-side,black,transparent)]" />
                <Preview market={market} />
              </div>
              <div className="relative flex flex-1 flex-col p-7 md:p-9">
                <span
                  className={`inline-flex items-center gap-2 text-[15px] font-bold ${t.text}`}
                >
                  <span
                    aria-hidden="true"
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ background: t.gradient }}
                  />
                  {card.name}
                </span>
                <h3 id={`${id}-titulo`} className="v2-h3 mt-3">
                  {card.title}
                </h3>
                <p id={`${id}-texto`} className="mt-3 text-muted-foreground">
                  {card.body}
                </p>
                <span
                  id={`${id}-cta`}
                  className="mt-auto inline-flex items-center gap-2 pt-8 font-semibold text-foreground"
                >
                  {card.cta}
                  <ArrowRight
                    className="h-4 w-4 transition-transform duration-[160ms] group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </span>
              </div>
            </Link>
          </Reveal>
        );
      })}
    </div>
  </Section>
);
