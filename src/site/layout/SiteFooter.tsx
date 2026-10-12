import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { products } from "../products";
import { useSitePage } from "./page-context";
import { Logo } from "./Logo";

export const SiteFooter = () => {
  const { market, copy } = useSitePage();
  const { footer, homeLinkLabel, opensInNewTab } = copy.common;
  const linkClass =
    "inline-flex min-h-11 items-center gap-1 text-[15px] text-muted-foreground transition-colors duration-[160ms] hover:text-foreground";

  return (
    <footer className="border-t border-border">
      <div className="v2-container flex flex-col gap-8 py-12 md:flex-row md:items-center md:justify-between md:py-14">
        <div className="flex flex-col gap-2">
          <Link to={`/${market}`} aria-label={homeLinkLabel} className="inline-flex min-h-11 w-fit items-center">
            <Logo />
          </Link>
          <p className="text-sm text-muted-foreground">{footer.tagline}</p>
        </div>
        <nav aria-label={footer.brand} className="flex flex-wrap items-center gap-x-6 gap-y-1">
          {footer.links.map((item) => (
            <Link key={item.to} to={item.to} className={linkClass}>
              {item.label}
            </Link>
          ))}
          <a href={products.wahub.loginUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>
            {footer.loginLabel}
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            <span className="sr-only">{opensInNewTab}</span>
          </a>
        </nav>
      </div>
      <div className="v2-container pb-10">
        <p className="text-sm text-muted-foreground">{footer.copyright}</p>
      </div>
    </footer>
  );
};
