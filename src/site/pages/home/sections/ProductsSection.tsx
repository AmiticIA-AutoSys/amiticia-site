import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Search } from "lucide-react";
import type { HomeCopy } from "../../../copy/types";
import { productPath, type MarketId } from "../../../markets";
import { useSitePage } from "../../../layout/page-context";
import { Reveal, Section } from "../../../layout/primitives";
import { shotsFor } from "../../wahub/screenshots";
import { productTint, saiuNoDouDemo } from "../demo";

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

/** Saiu no DOU: a search drawn in code (invented data), its last result cut off by the frame. */
const SaiuNoDouPreview = () => {
  const { term, button, results } = saiuNoDouDemo;
  return (
    <div className="relative mx-auto h-full w-[min(250px,72%)] overflow-hidden rounded-t-[16px] border border-b-0 border-border bg-surface-raised p-1 shadow-[0_30px_60px_-30px_hsl(var(--brand-cyan)/0.7)]">
      <div className="flex flex-col gap-1.5 rounded-t-[12px] bg-background p-2">
        <div className="flex h-9 shrink-0 items-center gap-1.5 rounded-[10px] border border-brand-cyan/40 bg-surface pl-2.5 pr-1.5">
          <Search className="h-3.5 w-3.5 shrink-0 text-brand-cyan" />
          <span className="min-w-0 flex-1 truncate text-[12.5px] font-medium text-foreground">{term}</span>
          <span className="shrink-0 rounded-md bg-brand-cyan/15 px-1.5 py-1 text-[11px] font-semibold leading-none text-brand-cyan">
            {button}
          </span>
        </div>
        {results.map((result) => (
          <div key={result.title} className="rounded-[10px] border border-border bg-surface-raised px-2.5 py-1.5">
            <div className="flex items-center justify-between gap-2 text-[10.5px] leading-none">
              <span className="rounded-full border border-brand-cyan/30 bg-brand-cyan/10 px-1.5 py-[3px] font-semibold text-brand-cyan">
                {result.section}
              </span>
              <span className="tabular-nums text-muted-foreground">{result.date}</span>
            </div>
            <p className="mt-1 truncate text-[12.5px] font-semibold leading-tight text-foreground">{result.title}</p>
            <p className="mt-0.5 truncate text-[11px] leading-tight text-muted-foreground">{result.org}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const previews: Record<
  ProductId,
  (props: { market: MarketId }) => JSX.Element
> = {
  wahub: WahubPreview,
  saiunodou: SaiuNoDouPreview,
};

const cardClass =
  "group relative flex h-full flex-col overflow-hidden rounded-[28px] border border-border bg-surface shadow-[var(--hairline)] transition-[border-color,box-shadow] duration-[280ms] ease-[cubic-bezier(.22,1,.36,1)] hover:border-[color-mix(in_srgb,var(--tint)_55%,transparent)] hover:shadow-[var(--hairline),0_0_0_1px_color-mix(in_srgb,var(--tint)_30%,transparent),0_30px_80px_-40px_var(--tint)] focus-visible:border-[color-mix(in_srgb,var(--tint)_55%,transparent)]";

export const ProductsSection = ({
  copy,
  market,
}: {
  copy: HomeCopy["products"];
  market: MarketId;
}) => {
  const { opensInNewTab } = useSitePage().copy.common;
  return (
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
          const Arrow = card.href ? ArrowUpRight : ArrowRight;
          const id = `produto-${card.productId}`;
          // The whole card is one link, named by its call to action and described by its text.
          const linkProps = {
            "aria-labelledby": `${id}-cta`,
            "aria-describedby": `${id}-titulo ${id}-texto`,
            style: { "--tint": t.color } as CSSProperties,
            className: cardClass,
          };
          const inner = (
            <>
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
                  <Arrow
                    className="h-4 w-4 transition-transform duration-[160ms] group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                  {card.href && (
                    <>
                      {" "}
                      <span className="sr-only">{opensInNewTab}</span>
                    </>
                  )}
                </span>
              </div>
            </>
          );
          return (
            <Reveal
              key={card.productId}
              delay={i * 80}
              className={copy.cards.length === 1 ? "md:col-span-2" : undefined}
            >
              {card.href ? (
                <a href={card.href} target="_blank" rel="noopener noreferrer" {...linkProps}>
                  {inner}
                </a>
              ) : (
                <Link to={productPath(market, card.productId)} {...linkProps}>
                  {inner}
                </Link>
              )}
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
};
