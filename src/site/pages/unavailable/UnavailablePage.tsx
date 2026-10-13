import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { products, type ProductId } from "../../products";
import { fillProduct } from "../../copy";
import { useSitePage } from "../../layout/page-context";
import { Container, Eyebrow } from "../../layout/primitives";
import { secondaryButtonClass } from "../../layout/blocks";
import { WhatsAppButton } from "../../layout/WhatsAppButton";

/**
 * A product's path in a market that does not sell it (e.g. /it/patricia): says so plainly and
 * sends the visitor to this market's home, or to the market's WhatsApp. Never a 404, so a link
 * shared across markets keeps working.
 */
export const UnavailablePage = ({ productId }: { productId: ProductId }) => {
  const { market, copy } = useSitePage();
  const name = products[productId].name;
  const fill = (s: string) => fillProduct(s, name);
  const c = copy.unavailable;
  return (
    <section className="relative -mt-16 overflow-hidden pb-24 pt-[120px] md:-mt-[72px] md:pb-32 md:pt-[168px]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[-30%] h-[560px] w-[900px] max-w-[170vw] -translate-x-1/2 rounded-full opacity-50 blur-3xl"
        style={{ background: "radial-gradient(closest-side, hsl(var(--brand-cyan) / 0.18), transparent)" }}
      />
      <Container className="relative">
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <Eyebrow>{fill(c.eyebrow)}</Eyebrow>
          <h1 className="v2-h1 mt-5">{fill(c.title)}</h1>
          <p className="v2-lead mt-6">{fill(c.body)}</p>
          <div className="mt-9 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center">
            <WhatsAppButton placement="hero" size="lg">
              {c.stickyCta}
            </WhatsAppButton>
            <Link to={`/${market}`} className={secondaryButtonClass}>
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              {c.homeCta}
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
};
