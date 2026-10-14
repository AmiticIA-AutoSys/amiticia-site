import { Globe } from "lucide-react";
import { alternateMarkets, homePath, markets, type Market, type MarketId } from "../markets";

interface LanguageSwitcherProps {
  market: MarketId;
  /** The current page's path: each link opens the same page in the other market. */
  path?: string;
  /** Defaults to the other live markets. */
  alternates?: Market[];
  label?: string;
}

/**
 * Absolute URL of the same page in market `to`: it lives on that market's own domain, so the link is
 * a plain <a>, not a router link. /wahub (br) → https://amiticia.cc/it/wahub. Every product path
 * exists in every live market.
 */
const urlIn = (to: MarketId, from: MarketId, path?: string): string => {
  const within = path?.startsWith(markets[from].basePath) ? path.slice(markets[from].basePath.length) : "";
  const rest = within === "/" ? "" : within;
  return `${markets[to].origin}${rest ? `${markets[to].basePath}${rest}` : homePath(to)}`;
};

/** Links to the same page in the other live markets. Renders nothing while there are none. */
export const LanguageSwitcher = ({ market, path, alternates = alternateMarkets(market), label }: LanguageSwitcherProps) => {
  if (alternates.length === 0) return null;
  return (
    <nav aria-label={label} className="flex items-center gap-1">
      <Globe className="hidden h-4 w-4 text-muted-foreground sm:block" aria-hidden="true" />
      {alternates.map((m) => (
        <a
          key={m.id}
          href={urlIn(m.id, market, path)}
          hrefLang={m.lang}
          lang={m.lang}
          className="inline-flex min-h-11 items-center rounded-full px-3 text-sm text-muted-foreground hover:text-foreground"
        >
          {m.label}
        </a>
      ))}
    </nav>
  );
};
