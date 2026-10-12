import { Link } from "react-router-dom";
import { Globe } from "lucide-react";
import { alternateMarkets, type Market, type MarketId } from "../markets";

interface LanguageSwitcherProps {
  market: MarketId;
  /** Defaults to the other live markets. */
  alternates?: Market[];
  label?: string;
}

/** Links to the same site in the other live markets. Renders nothing while there are none. */
export const LanguageSwitcher = ({ market, alternates = alternateMarkets(market), label }: LanguageSwitcherProps) => {
  if (alternates.length === 0) return null;
  return (
    <nav aria-label={label} className="flex items-center gap-1">
      <Globe className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
      {alternates.map((m) => (
        <Link
          key={m.id}
          to={`/${m.id}`}
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
