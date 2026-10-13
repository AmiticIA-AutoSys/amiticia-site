import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import type { HomeCopy } from "../../../copy/types";
import type { MarketId } from "../../../markets";
import { productPath } from "../../../products";
import { Reveal, Section } from "../../../layout/primitives";

const tint = {
  wahub: { from: "hsl(var(--wahub))", to: "hsl(var(--wahub-2))", text: "text-[hsl(243_90%_80%)]" },
  patricia: { from: "hsl(var(--patricia))", to: "hsl(22 85% 60%)", text: "text-patricia" },
} as const;

// VISUAL: OriginKit glow-border around each card + a mini product preview (kit).
export const ProductsSection = ({ copy, market }: { copy: HomeCopy["products"]; market: MarketId }) => (
  <Section id="produtos" aria-labelledby="produtos-titulo">
    <Reveal>
      <h2 id="produtos-titulo" className="v2-h2">
        {copy.title}
      </h2>
    </Reveal>
    <div className="mt-10 grid gap-5 md:mt-14 md:grid-cols-2 md:gap-6">
      {copy.cards.map((card, i) => {
        const t = tint[card.productId];
        return (
          <Reveal key={card.productId} delay={i * 80}>
            <Link
              to={productPath(market, card.productId)}
              className="group relative flex h-full flex-col overflow-hidden rounded-[28px] border border-border bg-surface p-7 shadow-[var(--hairline)] transition-[border-color,transform] duration-[280ms] ease-[cubic-bezier(.22,1,.36,1)] hover:-translate-y-0.5 hover:border-[hsl(222_25%_26%)] md:p-9"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-40 blur-3xl transition-opacity duration-[280ms] group-hover:opacity-60"
                style={{ background: `radial-gradient(closest-side, ${t.from}, ${t.to} 60%, transparent)` }}
              />
              <span className={`relative inline-flex items-center gap-2 text-[15px] font-bold ${t.text}`}>
                <span
                  aria-hidden="true"
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ background: `linear-gradient(120deg, ${t.from}, ${t.to})` }}
                />
                {card.name}
              </span>
              <h3 className="v2-h3 relative mt-4">{card.title}</h3>
              <p className="relative mt-3 text-muted-foreground">{card.body}</p>
              <span className="relative mt-8 inline-flex items-center gap-2 pt-2 font-semibold text-foreground">
                {card.cta}
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-[160ms] group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </span>
            </Link>
          </Reveal>
        );
      })}
    </div>
  </Section>
);
