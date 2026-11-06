import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { HomeCopy } from "../../../copy/types";
import type { MarketId } from "../../../markets";
import { productPath } from "../../../products";
import { useSitePage } from "../../../layout/page-context";
import { Reveal, Section } from "../../../layout/primitives";
import { shotsFor } from "../../wahub/screenshots";
import { productTint } from "../demo";

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

const previews: Record<
  ProductId,
  (props: { market: MarketId }) => JSX.Element
> = {
  wahub: WahubPreview,
};

/** A product we mention without pushing it: one row of plain text, the whole row is the link. */
const SecondaryProductRow = ({
  item,
}: {
  item: NonNullable<HomeCopy["products"]["secondary"]>;
}) => {
  const { opensInNewTab } = useSitePage().copy.common;
  return (
    <Reveal className="mt-5 md:mt-6">
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex min-h-11 flex-wrap items-center gap-x-3 gap-y-1 rounded-[20px] border border-border px-5 py-3 text-[15px] leading-snug transition-colors duration-[160ms] hover:border-foreground/25 md:flex-nowrap md:px-7"
      >
        <span className="font-semibold text-foreground">{item.name}</span>{" "}
        <span className="text-muted-foreground">{item.text}</span>{" "}
        <span className="inline-flex items-center gap-1 text-muted-foreground md:ml-auto">
          {item.linkLabel}
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          <span className="sr-only"> {opensInNewTab}</span>
        </span>
      </a>
    </Reveal>
  );
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
    {copy.secondary && <SecondaryProductRow item={copy.secondary} />}
  </Section>
);
