import { Link } from "react-router-dom";
import { Globe } from "lucide-react";
import { alternateMarkets, type Market, type MarketId } from "../markets";

interface LanguageSwitcherProps {
  market: MarketId;
  /** The current page's path: each link opens the same page in the other market. */
  path?: string;
  /** Defaults to the other live markets. */
  alternates?: Market[];
  label?: string;
}

/** Same page in market `to`: /br/wahub → /it/wahub. Every product path exists in every live market. */
const pathIn = (to: MarketId, from: MarketId, path?: string): string =>
  path?.startsWith(`/${from}`) ? `/${to}${path.slice(from.length + 1)}` : `/${to}`;

/** Links to the same page in the other live markets. Renders nothing while there are none. */
export const LanguageSwitcher = ({ market, path, alternates = alternateMarkets(market), label }: LanguageSwitcherProps) => {
  if (alternates.length === 0) return null;
  return (
    <nav aria-label={label} className="flex items-center gap-1">
      <Globe className="hidden h-4 w-4 text-muted-foreground sm:block" aria-hidden="true" />
      {alternates.map((m) => (
        <Link
          key={m.id}
          to={pathIn(m.id, market, path)}
          hrefLang={m.lang}
          lang={m.lang}
          className="inline-flex min-h-11 items-center rounded-full px-3 text-sm text-muted-foreground hover:text-foreground"
        >
          {m.label}
        </Link>
      ))}
    </nav>
  );
};
